import { Component } from '@angular/core';
import { SocketService } from './services/socket/socket.service';
import {NotificationService } from './services/notification/notification.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  check = false;
  blnDBDisConnection = false;
  blnDBConnection = true;
  constructor(public socketService: SocketService, public notifyService: NotificationService) {
    this.socketService.sendMessage('pradip');

    this.notifyService.showInfoWithTimeout('Connecting.....', "");

    this.socketService.getMessage().subscribe(result => {
      //console.log(result)
      if (result.status == 'success') {
        if (result.data == 'Connected') {
          this.notifyService.hideInfoToast();
          this.check = true;
          this.notifyService.showSuccessWithTimeout('Connected To Server', "");
          this.notifyService.hideErrorToast();
          setTimeout(() => {
            this.notifyService.hideSuccessToast();
          }, 3000)
        } else if (result.data == 'Setting database connection' && this.blnDBConnection) {
          this.blnDBDisConnection = true;
          this.blnDBConnection = false;
          this.notifyService.hideErrorToast();
          this.notifyService.hideSuccessToast();
          this.notifyService.showInfoWithTimeout('Reconnecting Database Connection Please Wait..', "")
        } else if (result.data == 'database connected' && this.blnDBDisConnection) {
          this.blnDBDisConnection = false;
          this.blnDBConnection = true;
          this.notifyService.hideErrorToast();
          this.notifyService.hideInfoToast();
          this.notifyService.showSuccessWithTimeout('Database Connection Restored', "");
          setTimeout(() => {
            this.notifyService.hideSuccessToast();
          }, 3000)
        }
      }
    }, err => { console.log('error', err) });
    
    setTimeout(() => { 
      if (!this.check) {
           this.notifyService.hideInfoToast();
           this.notifyService.hideSuccessToast();
        this.notifyService.showErrorWithTimeout('Error while connecting', "");
      }
    },3000)
   }
}
