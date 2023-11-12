import { Component, HostBinding, Input } from '@angular/core';
import { UserService } from './service/user.service';
import { IUser } from './shared/model/users';
//import { Input } from 'hammerjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  //user: IUser;

  constructor(private userService: UserService) {
  //  this.userService.user.subscribe(x => this.user = x);
  }

  @HostBinding('attr.id')
  appId = 'twinbee-app';
  title = 'twinbeeNGRXver2021march';
}
