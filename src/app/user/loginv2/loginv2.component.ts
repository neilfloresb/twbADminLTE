import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap, map, switchMap, filter, shareReplay, first } from 'rxjs/operators';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-loginv2',
  templateUrl: './loginv2.component.html',
  styleUrls: ['./loginv2.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class Loginv2Component implements OnInit {

  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;


  constructor(private formBuilder: FormBuilder, private userService: UserService,
    private route: ActivatedRoute, private router: Router) {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.form.valueChanges.pipe(
      filter(data => this.form.valid),
      map(data => {
        return data
      })
    ).subscribe(data => console.log(JSON.stringify(data)));
  }

  ngOnInit(): void {
    // this.form = this.formBuilder.group({
    //   username: ['', Validators.required],
    //   password: ['', Validators.required]
    // });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy parameters or default to '/'
  get f() { return this.form.controls; }

  onSubmit() {

    console.log(this.f.username.value);
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    this.userService.loginAPI2(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
  //        this.router.navigate([this.returnUrl]);
          this.router.navigateByUrl('/adminboard');

        },
        error => {

        }
      )

    // this.form.value.pipe(
    //   filter(data => this.form.valid),
    //   map(data => {
    //     return data
    //   })
    // ).subscribe (data => console.log(JSON.stringify(data)));

    // this.form.value
    //   .subscribe(data => console.log(JSON.stringify(data)));

  }

}
