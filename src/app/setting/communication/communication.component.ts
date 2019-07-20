import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../../services/socket/socket.service'
import { HttpService} from '../../services/http/http.service';

@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.css']
})
export class CommunicationComponent implements OnInit, OnDestroy {
  $communication;
  arrCommunicationStatus = [];
  arrStatus =[]
  constructor(public socketService?: SocketService, public http?: HttpService) { }

  ngOnInit() {
    this.$communication = this.socketService.getCommunicationStatus().subscribe(result => {
      var resultdata = result.data;
      var arrStatus = [];
      for (let i = 0; i < resultdata.length; i++) { 
        var obj = {};
      //  console.log('sdsd',resultdata[i].QCount)
        if (resultdata[i].QCount <= 6) {
          Object.assign(obj, { cubicleNo: resultdata[i].cubicleNo },
            { IdsNo: resultdata[i].IdsNo }, { QCount: resultdata[i].QCount }, { class: 'Online' })
          arrStatus.push(obj);
        } else if (resultdata[i].QCount > 6 && resultdata[i].QCount < 17) {
          Object.assign(obj, { cubicleNo: resultdata[i].cubicleNo },
            { IdsNo: resultdata[i].IdsNo }, { QCount: resultdata[i].QCount }, { class: 'Reconfiguring' })
          arrStatus.push(obj);
        } else{ 
          Object.assign(obj, { cubicleNo: resultdata[i].cubicleNo },
            { IdsNo: resultdata[i].IdsNo }, { QCount: resultdata[i].QCount }, { class: 'Offline' })
          arrStatus.push(obj);
        }
      } 
      this.arrCommunicationStatus = arrStatus;
    })
    this.http.getMethod('cubicle/all').subscribe((result:any) => { 
      var arrCubicle = result.result;
     // console.log(arrCubicle)
      for (let i = 0; i < arrCubicle.length; i++) { 
        var obj = {};
        Object.assign(obj, { cubicleNo: arrCubicle[i].Sys_CubicNo },
          { IdsNo: arrCubicle[i].Sys_IDSNo }, { QCount: 25 }, { class: 'Offline' });
          this.arrCommunicationStatus.push(obj)
      }
    })
    this.arrCommunicationStatus = this.arrCommunicationStatus
   // console.log(this.arrCommunicationStatus)
  }
  ngOnDestroy() { 
    this.$communication.unsubscribe();
  }
}
