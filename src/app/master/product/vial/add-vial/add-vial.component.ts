import { Component, OnInit, Output } from '@angular/core';
import { DataService } from '../../../../services/commonData/data.service';
import { JsonDataService } from '../../../../services/commonData/json-data.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, FormControl } from '@angular/forms';
import { ValidationService } from '../../../../services/validations/validation.service';
import { MatDialog } from '@angular/material';
import { RemarkComponent } from '../../../../shared/remark/remark/remark.component';
import { SessionStorageService } from 'ngx-webstorage';
import { HttpService } from '../../../../services/http/http.service';
import { NgbPanelChangeEvent, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ErrorHandlingService } from "../../../../services/error-handling/error-handling.service";
import { UserService } from '../../../../services/user/user.service';

@Component({
  selector: 'app-add-vial',
  templateUrl: './add-vial.component.html',
  styleUrls: ['./add-vial.component.css']
})
export class AddVialComponent implements OnInit {

  addVialForm     : FormGroup;
  obj_submitData  : any;
  str_LblBFGCode  : string = '';
  bln_Loading     : boolean;
  bln_isRemarkPopupOpened: boolean;
  constructor(private fb: FormBuilder,private http ?: HttpService,
    private validation?: ValidationService,
    private sessionStorage?: SessionStorageService,
    private errorHandling?: ErrorHandlingService,private dialog?: MatDialog,
    private userService?: UserService) { }

  ngOnInit() {
    this.addVialForm = new FormGroup({
      'str_ProductCode' : new FormControl(null, Validators.required),
      'str_ProductName' : new FormControl(null,Validators.required),
      'str_Version' : new FormControl(null, Validators.required)
    });
  }
  /*onSubmit(){
    //alert(this.addVialForm.value.str_ProductCode);
    swal({
      title: 'Are you sure ?',
      text: "Do you want to add this product ?",
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
        const message = { message : 'Stage'  };
        const dialogRef = this.dialog.open(RemarkComponent, {
          data: message,
          width: '570px',
          disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result !== undefined) //remark data
          {
            const remark = result.reason;
            const obj_sendData = this.getDataToSendOnSubmit(remark);
            this.bln_Loading = true;
            this.http.postMethod('stage/storeStages', obj_sendData).subscribe(res=>{
            this.bln_Loading = false;
            this.objarr_apiSubmitData = res;

            if (this.objarr_apiSubmitData.result === 'Stage already exist')
            {
              this.bln_Loading = false;
              swal({
                title: "Stage already exist!",
                text: "",
                type: "warning",
                allowOutsideClick: false,
                },);
              this.frm_stage.value.str_stage = '';
            }
            else if (this.objarr_apiSubmitData.result === 'Stage Added Successfully') {
              swal({
                title: "Stage Added Successfully!",
                text: "",
                type: "success",
                allowOutsideClick: false,
                },);

              this.onReset();
              this.getStageData();
              this.dataTableReset();
            }
            else
            {
              swal({
                title: "Can not Add Stage, Try again!",
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
  }*/
  getDataToSendOnSubmit(str_remark:any)
  {
    const str_ProductCode = this.addVialForm.value.str_ProductCode;
    const str_ProductName = this.addVialForm.value.str_ProductName;
    const str_Version = this.addVialForm.value.str_Version;

     /**Audit Trail Data */
     const str_action = "Add";
     const str_userID = this.sessionStorage.retrieve("userId");
     const str_userName = this.sessionStorage.retrieve("userName");
     /**End Audit Trail Data */

      /**Activity Log */
      const str_activity = "Vial Added";
      /**End Activity Log */

     this.obj_submitData =
     {
       "str_ProductCode": str_ProductCode,
       "str_ProductName": str_ProductName,
       "str_Version": str_Version,
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

}
