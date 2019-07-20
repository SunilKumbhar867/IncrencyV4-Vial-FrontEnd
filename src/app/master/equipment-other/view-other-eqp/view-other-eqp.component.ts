import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from "rxjs";
import { JsonDataService } from '../../../services/commonData/json-data.service';
import { DataService } from '../../../services/commonData/data.service';
import { RemarkComponent } from '../../../shared/remark/remark/remark.component';
import { MatDialog } from '@angular/material';
import { HttpService } from '../../../services/http/http.service';
import { SessionStorageService } from 'ngx-webstorage';
import { ErrorHandlingService } from '../../../services/error-handling/error-handling.service';
import { EquipmentService } from '../../../services/equipment/equipment.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

declare var swal: any;

@Component({
  selector: 'app-view-other-eqp',
  templateUrl: './view-other-eqp.component.html',
  styleUrls: ['./view-other-eqp.component.css']
})
export class ViewOtherEqpComponent implements OnInit {

/**********************Variable Declaration**********************/
 // View child for datatables
 @ViewChild(DataTableDirective)
 dtElement: DataTableDirective;
 dtOptions: DataTables.Settings = {};
 dtTrigger: Subject<any> = new Subject();

  int_length: any;
  closeResult: string;
  int_countWeight:number = 0;

  bln_showTable: boolean;
  bln_Loading: boolean;
  bln_isRemarkPopupOpened: boolean;
  bln_showCalibrationForHD: any;
  bln_showCalibrationForMA: any;
  bln_isCalibration: boolean = false;

  obj_submitData: any;
  objarr_apiSubmitData: any;

  sarr_getEquipmentType: Array<string> = [];
  sarr_eqpData: Array<string> = [];
  sarr_eqpDataCubicle: Array<string> = [];
  sarr_stdWeightTableData = [];

  public str_eqpID: string = '';
  public str_eType: string = '';
  bln_showActivate: boolean;

/**********************End Variable Declaration**********************/

  constructor(private jsonData:JsonDataService,private dataService:DataService,
    private dialog?: MatDialog,private http?: HttpService,
    private sessionStorage?: SessionStorageService,
    private errorHandling?: ErrorHandlingService,
    private equipmentservice ?: EquipmentService,
    private modalService ?: NgbModal){
      let userRigths = this.sessionStorage.retrieve("rightsarray");
      if (userRigths.includes("Activate / Deactivate"))
      {
        this.bln_showActivate = true;
      } else
      {
        this.bln_showActivate = false;
      }
    }

  ngOnInit()
  {
    this.bln_showTable = false;
    this.bln_isCalibration = false;

    this.jsonData.getValueFromJSON().then((res: any) => {
      const sarr_getJsonObjectEqpType = res.Equipment;
      for (let i = 0; i < Object.keys(sarr_getJsonObjectEqpType).length; i++) {
        if (sarr_getJsonObjectEqpType[i].Value === 1) {
          this.sarr_getEquipmentType.push(sarr_getJsonObjectEqpType[i].Name);
        }
      }

      this.bln_showCalibrationForHD = res.EquipmentCalibration[3].Value;
      this.bln_showCalibrationForMA = res.EquipmentCalibration[2].Value;

    }).catch(err => {
      console.log(err)
    });


    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10
    };
  }

  getEquipmentData(value : any)
  {
    this.str_eType = value;
    if (this.str_eType == "Hardness" || this.str_eType == "Moisture Analyzer")
    {
      this.bln_isCalibration = true;
    }
    else
    {
      this.bln_isCalibration = false;
    }
    this.getData(value);
  }

getData(str_eqpType: any)
{
  this.bln_showTable = true;
  this.equipmentservice.getEquipmentData(str_eqpType,1).then((res: any) => {
    this.sarr_eqpData = res[0];
    for(var i=0;i<=res[1].length-1;i++)
    {
      const str_cubEqpid=res[1][i].eqpid;
      this.sarr_eqpDataCubicle.push(str_cubEqpid);
    }

    for(let i=0; i<this.sarr_eqpData.length; i++) {
      var newObj;
      if(this.sarr_eqpDataCubicle.includes(res[0][i].Eqp_ID)) {
        newObj = {'isEqpPresent': true}
      }
      else {
        newObj = {'isEqpPresent': false}
      }
      Object.assign(this.sarr_eqpData[i], newObj);
    }

     if (this.dtElement.dtInstance === undefined)
    {
      this.dtTrigger.next();
    } else
    {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) =>
      {
        // Destroy the table first
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    }
  }).catch(err => {
    console.log(err)
 });
}
   dataTableReset()
  {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) =>
    {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  getDataToSendOnSubmit(str_remark: any,str_msgactivate: any)
{
  var bln_flag: any;
  /**Audit Trail Data */
  const str_action = str_msgactivate;
  if(str_action == 'Activate')
  {
    bln_flag = "1";
  }
  else
  {
    bln_flag = "0";
  }
  const str_userID = this.sessionStorage.retrieve("userId");
  const str_userName = this.sessionStorage.retrieve("userName");
  /**End Audit Trail Data */

  /**Activity Log */
  const str_activity = "Instrument "+ str_msgactivate;
  /**End Activity Log */

  this.obj_submitData =
  {
    "Eqp_ID": this.str_eqpID,
    "Eqp_Type": this.str_eType,
    "Eqp_Active": bln_flag,
    "Action": str_action,
    "Remark": str_remark,
    "username": str_userName,
    "userid": str_userID,
    "activity": str_activity
  };
  const data:Object={};
  Object.assign(data,this.obj_submitData);
  return data;
}

dataSave(str_activate: string)
{
  swal({
   title: 'Are you sure ?',
   text: "Do you want to "+ str_activate + " " + this.str_eqpID + "?",
   type: 'warning',
   showCancelButton: true,
   confirmButtonColor: '#3085d6',
   cancelButtonColor: '#d33',
   confirmButtonText: 'Yes',
   cancelButtonText: 'No'
 }).then((result) =>
 {
   if (result)
   {
     this.bln_Loading = false;
     this.bln_isRemarkPopupOpened = true;
     const message = { message : 'View Instrument' };
     const dialogRef = this.dialog.open(RemarkComponent, {
     data: message,
     width: '570px',
     disableClose: true
     });

   dialogRef.afterClosed().subscribe(result => {
     if (result !== undefined) //remark data
     {
       const remark = result.reason;
       const obj_dataToSend = this.getDataToSendOnSubmit(remark,str_activate);
       this.bln_Loading = true;
       this.http.putMethod('otherequipment/updateActivestatus', obj_dataToSend).subscribe(res=>{
       this.bln_Loading = false;
       this.objarr_apiSubmitData = res;
        if (this.objarr_apiSubmitData.result === 'Status Activited Successfully') {
         swal({
           title: "Instrument "+ str_activate +" Successfully!",
           text: "",
           type: "success",
           allowOutsideClick: false,
           },);
           this.getData(this.str_eType);
           this.dataTableReset();
       }
       else
       {
         swal({
           title: "Can not "+ str_activate +" Instrument, Try again!",
           text: "",
           type: "error",
           allowOutsideClick: false,
           },);
       }
       },
       err => {
         this.errorHandling.checkError(err.status);
         this.bln_Loading = false;
       });
     }
   });
   }
 }, function (dismiss) { });
}

  onActivate(selectedItem: any)
  {
    this.str_eqpID = selectedItem.Eqp_ID.trim();
    this.dataSave('Activate');
  }

  onDeactivate(selectedItem: any)
  {
    this.str_eqpID = selectedItem.Eqp_ID.trim();
    this.dataSave('Deactivate');
  }

  open2(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  getWeightDetail(strid: any)
  {
    this.str_eqpID = strid.Eqp_ID.trim();
     this.int_countWeight = 0;
     this.sarr_stdWeightTableData = [];
     this.equipmentservice.getCalibrationDetails(this.str_eType,this.str_eqpID).then(
      (res:any) =>
      {
        for (let i = 0; i < Object.keys(res).length; i++)
      {
          this.int_countWeight = this.int_countWeight + 1;
          this.sarr_stdWeightTableData.push(res[i]);
      }
      });
  }

}
