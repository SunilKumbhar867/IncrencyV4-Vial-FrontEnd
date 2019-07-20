import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { NotificationService } from '../notification/notification.service';
@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(public socket: Socket, public notifyService?: NotificationService) {
    this.getSocketEvent().subscribe(data => {
     // console.log(data)
      if (data == 'disconnected') { 
        this.notifyService.hideInfoToast();
        this.notifyService.hideSuccessToast();
        this.notifyService.showErrorWithTimeout('Connection Lost, Please wait', "");
      }
    });
   }
  getMessage() {
    return this.socket
      .fromEvent<any>('msg')
      .map(data => data.msg);
  }
  sendMessage(msg: string) {
    this.socket.emit('msg', msg);
  }
  disconnects() { 
    alert('Socket is connected.');
  }
  connects() {
    alert('Socket is connected.');
  }
  
  getSocketEvent() {
    let observable = new Observable(observer => {
      this.socket.on('connect', () => {
        observer.next('connected');
      });
      this.socket.on('disconnect', () => {
        observer.next('disconnected');
      });
      return () => {
        // this.socket.disconnect();
      };
    });
    return observable;
  }
  getCommunicationStatus() {
    return this.socket
      .fromEvent<any>('communication')
      .map(data => data.msg);
}
}
