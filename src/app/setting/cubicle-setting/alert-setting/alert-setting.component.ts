import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { NotificationService } from '../../../services/notification/notification.service';
import { ValidationService } from '../../../services/validations/validation.service';
import { JsonDataService } from '../../../services/commonData/json-data.service';
import { SettingService } from '../../../services/setting/setting.service';
import { HttpService } from '../../../services/http/http.service';
import { SessionStorageService } from 'ngx-webstorage';
import { RemarkComponent } from '../../../shared/remark/remark/remark.component';
import { ErrorHandlingService } from '../../../services/error-handling/error-handling.service';

declare var swal: any;

@Component({
  selector: 'app-alert-setting',
  templateUrl: './alert-setting.component.html',
  styleUrls: ['./alert-setting.component.css']
})
export class AlertSettingComponent implements OnInit
{
  bln_Loading: boolean;
  bln_locked: boolean;
  bln_isRemarkPopupOpened: boolean;

  obj_submitData: any;
  objarr_apiSubmitData: any;

  frm_alertSetting: FormGroup;

  str_areaName: string = '';
  str_cubicleName: string = '';
  lbl_productCode: string = '';
  str_productCode: string = '';
  str_batch: string = '';
  str_prdName: string = '';
  str_prdVersion: string = '';
  str_version: string = '';

  int_cubicleNo: number;
  int_Length: any;
  int_grp: any;
  int_oldGrp: any;


  get int_grp1()
  {
    return this.frm_alertSetting.get('int_grp');
  }

  constructor(private dialogRef: MatDialogRef<AlertSettingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb ?: FormBuilder,
    private settingservice ?: SettingService, private notifyService ?: NotificationService,
    private validationservice ?: ValidationService,private jsonService?: JsonDataService,
    private http?: HttpService, private sessionStorage?: SessionStorageService,
    private dialog?: MatDialog, private errorHandling?: ErrorHandlingService) { }

  ngOnInit()
  {
    this.frm_alertSetting = this.fb.group({
      int_grp : ['0',Validators.compose([Validators.required])],
    });

    this.getDataFromSystemComponent();

    this.jsonService.getValueFromJSON().then((res:any) =>{
      this.int_grp =  res.AlertMenus[1].Value;
    });
  }

  txtgrpDur_enterOnlyNum(event:any)
  {
    this.validationservice.onlyNumbers(event);
  }

  getDataFromSystemComponent()
  {
    this.str_areaName = this.data.str1;
    this.str_cubicleName = this.data.str2;
    this.lbl_productCode = this.data.str3;
    this.int_cubicleNo = this.data.str4;
    this.str_productCode = this.data.str5;
    this.str_batch = this.data.str6;

    this.getProductDetailFromCubicle(this.int_cubicleNo);
    this.getWeighmentDetail(this.int_cubicleNo);
    this.settingservice.getAlertDurations(this.int_cubicleNo).then((res:any) => {
      this.int_oldGrp = res.Group;
      this.frm_alertSetting.patchValue({
        int_grp: res.Group
      });
    });
  }

  async getCubiclesData()
  {
    const res = await this.settingservice.getCubicle();
    return res;
  }

  getProductDetailFromCubicle(intcubicNo:number)
  {
    this.getCubiclesData().then((res : any)=> {
      const dataOnCubicleNo= res.filter((y:any) => y.Sys_CubicNo == intcubicNo);
      dataOnCubicleNo.forEach(element => {

        this.str_prdName = element.Sys_ProductName;
        this.str_prdVersion = element.Sys_PVersion;
        this.str_version = element.Sys_Version;

        if(element.locked == 1)
        {
          this.notifyService.showWarningWithTimeout('This cubicle is locked!', "Alert!");
          this.bln_locked = true;
        }
        else
        {
          this.bln_locked = false;
        }
        });
    });
  }

  getWeighmentDetail(intcubicNo:number)
  {
    this.settingservice.getWeighingStatus().subscribe(
      (datas: any[]) =>
      {
        this.int_Length = datas.filter((x:any) => (x.CubicleNo == intcubicNo) && (x.Status == "1"));
        if(this.int_Length.length > 0)
        {
          this.notifyService.showErrorWithTimeout("Weighment is in process!","Oops!");
        }
      },
      (error) => console.log("Alert Setting : Weighing status not found")
      );
  }

  getDataToSendOnSubmit(str_remark: any) {
    const int_grp = this.frm_alertSetting.value.int_grp;
    var str_newData,str_oldData;

    str_oldData = "Group:" + this.int_oldGrp;
    str_newData = "Group:" + int_grp;

    /**Audit Trail Data */
    const str_action = "Update";
    const str_userID = this.sessionStorage.retrieve("userId");
    const str_userName = this.sessionStorage.retrieve("userName");
    /**End Audit Trail Data */

    /**Activity Log */
    const str_activity = "Alert Setting";
    /**End Activity Log */

    this.obj_submitData = {
      "ProductId" : this.str_productCode,
      "ProductName" : this.str_prdName,
      "ProductVersion": this.str_prdVersion,
      "Version":this.str_version,
      "Batch":this.str_batch,
      "Group": int_grp,
      "Sys_Area":this.str_areaName,
      "Sys_CubicName":this.str_cubicleName,
      "CubicNo":this.int_cubicleNo,
      "OldData":str_oldData,
      "NewData": str_newData,
      "UserID":str_userID,
      "UserName":str_userName,
      "activity":str_activity,
      "Remark":str_remark,
      "Action":str_action
    };
    const data: Object = {};
    Object.assign(data, this.obj_submitData);
    return data;
  }

  btnSave()
  {
    const int_grp = this.frm_alertSetting.value.int_grp;
    if(int_grp == this.int_oldGrp)
    {
      swal({
        title: "No Change!",
        text: "",
        type: "error",
        allowOutsideClick: false,
      });
    }
    else
    {
      swal({
        title: "Are you sure ?",
        text:"Do you want to edit duration ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No"
      }).then(
        result => {
          if (result) {
            this.bln_Loading = false;
            this.bln_isRemarkPopupOpened = true;
            const message = { message: "Update Alert Setting" };
            const dialogRef = this.dialog.open(RemarkComponent, {
              data: message,
              width: "570px",
              disableClose: true
            });

            dialogRef.afterClosed().subscribe(result => {
              if (result !== undefined) {
                //remark data
                const remark = result.reason;
                const obj_sendData = this.getDataToSendOnSubmit(remark);
                //console.log(JSON.stringify(obj_sendData));
                this.bln_Loading = true;
                this.http.postMethod("alert/update", obj_sendData)
                  .subscribe((res:any) =>
                  {
                      this.bln_Loading = false;
                      this.objarr_apiSubmitData = res;

                      if (this.objarr_apiSubmitData.result === "Alert Setting Updated Successfully.")
                      {
                        swal({
                          title: "Alert Setting Updated Successfully!",
                          text: "",
                          type: "success",
                          allowOutsideClick: false
                        });
                      }
                      else
                      {
                        swal({
                          title: "Can not set duration, Try again!",
                          text: "",
                          type: "error",
                          allowOutsideClick: false
                        });
                      }
                    },
                    err => {
                      this.errorHandling.checkError(err.status);
                      this.bln_Loading = false;
                    }
                  );
              }
            });
          }
        },
        function(dismiss) {}
      );
    }
  }

  onClose()
  {
    this.notifyService.hideWarningToast();
    this.notifyService.hideErrorToast();
    this.dialogRef.close();
  }
}
