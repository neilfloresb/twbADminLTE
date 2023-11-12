import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Subject } from 'rxjs';
import { catchError, map, take, tap, toArray } from 'rxjs/operators';
import { UserService } from '../service/user.service';
import { IUser } from '../shared/model/users'

@Component({
  selector: 'app-adminboard',
  templateUrl: './adminboard.component.html',
  styleUrls: ['./adminboard.component.scss']
})
export class AdminboardComponent implements OnInit {
  //curUser: string;
  curUser: IUser;



  constructor(private router: Router, private userService: UserService) {
    this.curUser = this.userService.userValue;
    //this.curUser2 = this.userService.getCurrentUser;
    console.log('Test for ',this.curUser);
  }
  currentuser: string;

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  ngOnInit(): void {
    // console.log(this.users$);
    // console.log('Current User:', this.userService.currentUser);
    // this.userService.SelectedUserChanged(this.userService.currentUser);
    // const userName = JSON.parse(localStorage.getItem('userName'));
    // this.currentuser = userName;


    // this.userid$.pipe(take(1)).subscribe((data)=>{
    //   console.log('Log-IN UserName:', data);
    // })

  }

  // users$ = this.userService.twbuser$
  //   .pipe(
  //     map(values => values.filter(value => value.userid.toLocaleUpperCase() === this.userService.currentUser.toLocaleUpperCase())),
  //     //map(values => values.filter((value) => 'NEIL' ? value.userid === 'NEIL' : true)),
  //     tap(value => console.log('users datas', JSON.stringify(value))),
  //     // map(user => ({ userid: user[0].userid }) as IUser),
  //     // toArray(),
  //     // tap(data => console.log('After toArray', JSON.stringify(data))),
  //     catchError(err => {
  //       this.errorMessageSubject.next(err);
  //       return EMPTY;
  //     })
  //   );

  // userid$ = this.users$
  //   .pipe(
  //    // map((u: IUser[]) => u ? `Current User for: ${u[0].userid}` : null)
  //     map((u: IUser[]) => u ? u[0].userid : null)
  //   );

  //userid$ = this.userService.username$;

  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('BranchName');
    localStorage.removeItem('AE');
    localStorage.removeItem('entity');
    localStorage.removeItem('rights');
    localStorage.removeItem('name');

    localStorage.clear();

    //   localStorage.removeItem('AElastname');
    //this.router.navigate(['/user/login']);
    this.userService.logout();
    this
  }

  ngOnDestroy() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('BranchName');
    localStorage.removeItem('AE');
    //   localStorage.removeItem('AEname');
    //   localStorage.removeItem('AElastname');
    localStorage.removeItem('entity');
    localStorage.removeItem('rights');
    localStorage.removeItem('name');
    localStorage.removeItem('user');
    localStorage.clear();
  }

}
