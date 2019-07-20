import { Injectable } from '@angular/core';
import { UserIdleService } from 'angular-user-idle';
import { UserService } from '../../services/user/user.service';

declare var swal:any
@Injectable({
  providedIn: 'root'
})
export class TimerService {
  idle: any;
  timeout: any;
  ping: any;
  constructor(public userIdle: UserIdleService, public userService: UserService) {
    this.timeout = 1;
    this.ping = 1;
  }
  // **************************************************************************************** //
  // Below function takes argument as parameters after user logged in                       //
  // **************************************************************************************** //
  startCheck(response) {

    this.idle = response;
    // calculating timeOut in seconds because function take argument in seconds
    this.idle = this.idle * 60;
    // if there is still watching for timeout then first stop process
    this.stopWatch();
    // start for fresh watching
    this.startWatching();
    this.userIdle.onTimerStart().subscribe(count => {
    });
    // stop watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
      swal('Timeout ! Please Re-Login', '', 'success');
      this.userService.logOutonTimeout();
    });
  }
   // **************************************************************************************** //
  stopWatch() {
    this.userIdle.stopWatching();
  }
  startWatching() {
    this.userIdle.setConfigValues({ idle: this.idle, timeout: this.timeout, ping: this.ping });
    this.userIdle.startWatching();
  }
}
