import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, EMPTY, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { mapapi } from '../shared/iUrlpath';
import { BillingService } from './billing.service';
import { IUser } from '../shared/model/users'
import { Router } from '@angular/router';
const _users_data = mapapi.USERS_data;
const _Signin = mapapi.SignAccess;
@Injectable({
  providedIn: 'root'
})
export class UserService {

  public currentUser: string;
  public currentBranch: string;
  public currentEntity: string;
  public usersRight: string;

  private userCurrentSubject: BehaviorSubject<IUser>;
  public user: Observable<IUser>;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.userCurrentSubject = new BehaviorSubject<IUser>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userCurrentSubject.asObservable();

  }

  readonly baseUrl = _users_data;
  readonly baseUrl2 = _Signin;
  private usersdata = _users_data;
  //readonly baseUrl = 'http://localhost:50384/api/';

  //private userCurrentSubject = new BehaviorSubject<string>('');
  // this.userCurrentSubject = new Subject<string>();

  // userSelectedAction$ = this.userCurrentSubject.asObservable();

  formModel = this.fb.group({
    UserName: ['', Validators.required],
    Email: ['', Validators.email],
    FullName: [''],
    Passwords: this.fb.group({
      Password: ['', [Validators.required, Validators.minLength(4)]],
      ConfirmPassword: ['', Validators.required]
    }, { validator: this.comparePasswords })

  });

  comparePasswords(fb: FormGroup) {
    let confirmPswrdCtrl = fb.get('ConfirmPassword');
    //passwordMismatch
    //confirmPswrdCtrl.errors={passwordMismatch:true}
    if (confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors) {
      if (fb.get('Password').value != confirmPswrdCtrl.value)
        confirmPswrdCtrl.setErrors({ passwordMismatch: true });
      else
        confirmPswrdCtrl.setErrors(null);
    }
  }

  register() {
    var body = {
      UserName: this.formModel.value.UserName,
      Email: this.formModel.value.Email,
      FullName: this.formModel.value.FullName,
      Password: this.formModel.value.Passwords.Password
    };
    //   return this.http.post(this.BaseURI + '/ApplicationUser/Register', body);
  }

  login(formData) {
    //   return this.http.post(this.BaseURI + '/ApplicationUser/Login', formData);
  }

  // getUserProfile() {
  //   return this.http.get(this.BaseURI + '/UserProfile');
  // }

  public get userValue(): IUser {
    return this.userCurrentSubject.value;
  }

  /** This is the working function for logIN Version 2023*/
  loginAPI2(username: string, password: string): Observable<any> {
    return this.http.get(this.baseUrl2 + username + '/' + password).pipe(
      switchMap((users) => {
        let user = users[0];
        if (user) {
          localStorage.setItem('BranchName', JSON.stringify(users[0].branch));
          //localStorage.setItem('AEname', JSON.stringify(users[0].firstname));
          localStorage.setItem('name', JSON.stringify(users[0].name));
          localStorage.setItem('entity', JSON.stringify(users[0].entity));
          localStorage.setItem('rights', JSON.stringify(users[0].userights));
          localStorage.setItem('user', JSON.stringify(user));
          this.userCurrentSubject.next(user);

          return of(user);
        } else {
          return throwError('Unable to login');
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.userCurrentSubject.next(null);
    this.router.navigate(['/user/login2']);
  }
  /** end OF file*/



  /** This is the working function for logIN*/

  GetUserAPI(username: string): Observable<any> {
    return this.http.get(this.baseUrl + username).pipe(
      switchMap((users) => {
        let user = users[0];
        if (user) {
          localStorage.setItem('BranchName', JSON.stringify(users[0].branch));
          //localStorage.setItem('AEname', JSON.stringify(users[0].firstname));
          localStorage.setItem('name', JSON.stringify(users[0].name));
          localStorage.setItem('entity', JSON.stringify(users[0].entity));
          localStorage.setItem('rights', JSON.stringify(users[0].userights));
          localStorage.setItem('userid', JSON.stringify(users[0].userid));

          this.currentBranch = users[0].branch;
          this.currentUser = users[0].name;
          this.currentEntity = users[0].entity;
          this.usersRight = users[0].rights;
          this.userCurrentSubject.next(user);

          return of(user);
        } else {
          return throwError('Unable to login');
        }
      })
    );
    // this.billService.SelectedEntityChanged(this.currentBranch);
  }

  public get getCurrentUser() {
    return this.userCurrentSubject.value;
  }


  /** LOG-IN VERSION 2 */
  loginVerion2(useraccess, payload) {

  }
  /** END LOG-IN VERSION 2*/

  // *** GET USERS using RXJS
  twbuser$ = this.http.get<IUser[]>(this.usersdata)
    .pipe(
      tap(value => console.log('LIST of USERSdata', JSON.stringify(value))),
      catchError(this.handleError),
      shareReplay(1)
    );

  /** filter users based currect logIN */

  users$ = this.twbuser$
    .pipe(
      //map(values => values.filter(value => value.userid.toLocaleUpperCase() === this.currentUser.toLocaleUpperCase())),
      map(values => values.filter(value => value.userid === this.currentUser)),
      //map(values => values.filter((value) => 'NEIL' ? value.userid === 'NEIL' : true)),
      tap(value => console.log('users datas', JSON.stringify(value))),
      // map(user => ({ userid: user[0].userid }) as IUser),
      // toArray(),
      // tap(data => console.log('After toArray', JSON.stringify(data))),
      catchError(this.handleError),
      shareReplay(1)
    );

  userbranch$ = this.users$
    .pipe(
      // map((u: IUser[]) => u ? `Current User for: ${u[0].userid}` : null)
      map((u: IUser[]) => u ? u[0].branch : null)
    );

  username$ = this.users$
    .pipe(
      // map((u: IUser[]) => u ? `Current User for: ${u[0].userid}` : null)
      map((u: IUser[]) => u ? JSON.stringify(u[0].userid) : null),
      tap(usr => console.log('Current Username of', usr.replace(/(^"|"$)/g, '').toLocaleUpperCase())),
    );

  userentity$ = this.users$
    .pipe(
      // map((u: IUser[]) => u ? `Current User for: ${u[0].userid}` : null)
      map((u: IUser[]) => u ? u[0].entity : null),

    );


  // usersel$ = this.userSelectedAction$
  //   .pipe(
  //     map(curuser => this.twbuser$
  //       .pipe(
  //         map(a => a.filter(a => a.username === curuser)),
  //         tap(value => console.log(JSON.stringify(value))),
  //         catchError(this.handleError)
  //       )
  //     )
  //   )

  // usercur$ = combineLatest([
  //   this.twbuser$, this.userSelectedAction$])
  //   .pipe(
  //     map(([twbuser, selUser]) => twbuser.filter(user => user.userid === selUser)),
  //     tap(user => console.log('Current User Selected b', user)),
  //   );

  // user2Cur$ = combineLatest([this.twbuser$, this.userSelectedAction$])
  //   .pipe(
  //     map(([users, curuser]) => users.filter(u => curuser ? u : EMPTY)),
  //     tap(u => console.log('Current User Selected', u)),
  //   )


  // users$ = this.userService.twbuser$
  //   .pipe(
  //     map(values => values.filter(value => value.userid == 'NEIL')),
  //     //map(values => values.filter((value) => 'NEIL' ? value.userid === 'NEIL' : true)),
  //     tap(value => console.log('users datas', JSON.stringify(value))),
  //     catchError(err => {
  //       this.errorMessageSubject.next(err);
  //       return EMPTY;
  //     })
  //   );

  // SelectedUserChanged(username: string) {
  //   this.userCurrentSubject.next(username.toString());
  // };



  private handleError(err: any): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
