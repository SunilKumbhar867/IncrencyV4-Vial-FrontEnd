import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JsonDataService } from '../../../services/commonData/json-data.service';
import { ValidationService } from '../../../services/validations/validation.service';
import { HttpService } from '../../../services/http/http.service';
import { SessionStorageService } from 'ngx-webstorage';
import { ErrorHandlingService } from '../../../services/error-handling/error-handling.service';
import { DatePipe } from "@angular/common";
import { MatDialog } from '@angular/material';
import { RemarkComponent } from '../../../shared/remark/remark/remark.component';
import { UserService } from '../../../services/user/user.service';
declare var swal: any;
@Component({
  selector: 'app-add-box',
  templateUrl: './add-box.component.html',
  styleUrls: ['./add-box.component.css']
})
export class AddBoxComponent implements OnInit {
/**********************Variable Declaration**********************/

sarr_CalibBoxType: Array<string> = [];

sarr_getAPIID: Array<string> = [];
sarr_getAPIIdentification: Array<string> = [];
sarr_stdVal = [];
sarr_stdIdenfication = [];
sarr_units = [];

str_IDLabel: string = '';
str_StdLabel: string = '';
minDate = new Date();

bln_isRemarkPopupOpened: boolean;
bln_Loading: boolean;
bln_showHideField: boolean = true;
bln_IDexist: boolean = true;
bln_IdentificationExist: boolean = false;
bln_IdentificationExistTable: boolean = false;

int_IdentificationNo: number;
int_length: any;
int_cntWeight: number = 0;

obj_submitData:any;
objarr_apiSubmitData:any;

frm_addCalibBox: FormGroup;

/**********************End Variable Declaration**********************/
  get str_BoxType()
  {
    return this.frm_addCalibBox.get('str_BoxType');
  }
  get str_BoxID()
    {
      return this.frm_addCalibBox.get('str_BoxID');
    }
  get str_certificate()
  {
    return this.frm_addCalibBox.get('str_certificate');
  }
  get dt_validUpto()
  {
    return this.frm_addCalibBox.get('dt_validUpto');
  }
  get dt_calibDate()
  {
    return this.frm_addCalibBox.get('dt_calibDate');
  }
  get str_unit()
  {
    return this.frm_addCalibBox.get('str_unit');
  }
  get str_stdValue()
  {
    return this.frm_addCalibBox.get('str_stdValue');
  }
  get str_Identification()
  {
    return this.frm_addCalibBox.get('str_Identification');
  }

  constructor(private fb: FormBuilder,private validation: ValidationService,
    private jsonData ?: JsonDataService,private http ?: HttpService,
    private sessionStorage?: SessionStorageService,private errorHandling?: ErrorHandlingService,
    public datePipe?: DatePipe,private dialog?: MatDialog,
    private userService?: UserService,) {
     }

  ngOnInit() {
     // This service will check whether the user has right to view that page or not, If not it will redirect user to Home Page
     this.userService.checkRights("Add Calibration Box");
    this.initializeField("");
    this.int_cntWeight = 0;
    this.bln_IDexist = false;

    this.jsonData.getValueFromJSON().then((res: any) => {
      const str_calibTypes = res.CalibrationBox.filter(x => x.Value == 1);
      str_calibTypes.forEach((element)=>{
        this.sarr_CalibBoxType.push(element.Name);
      })
      this.int_IdentificationNo = res.Balance[7].Value;
    }).catch(err => {
      console.log(err)
    });

     /*****This code is used to get  id from database and check that id is exist or not *****/
     this.http.getMethod('calibrationbox/getCalibration').subscribe((res:any)=>{
      for (let i = 0; i < Object.keys(res).length; i++)
      {
        this.sarr_getAPIIdentification.push(res[i].CB_identificationNo);
        this.sarr_getAPIID.push(res[i].CB_ID);
      }
      })
  }

  initializeField(str_type: string)
  {
    this.int_cntWeight = 0;
    if(this.int_IdentificationNo == 0)
    {
      var str_idNo = "NA";
    }
    else
    {
      var str_idNo = "";
    }
    this.frm_addCalibBox = this.fb.group({
      str_BoxType: [str_type],
      str_BoxID: ['',Validators.compose([this.validation.requiredField,this.validation.validateOnlyWhiteSpaceEnter])],
      str_certificate: ['',Validators.compose([this.validation.requiredField,this.validation.validateOnlyWhiteSpaceEnter])],
      dt_validUpto: ['',this.validation.requiredField],
      dt_calibDate: ['',this.validation.requiredField],
      str_stdValue: ['',Validators.compose([this.validation.requiredField,this.validation.validateZeroEntry])],
      str_unit: ['',this.validation.requiredField],
      str_Identification: [str_idNo,this.validation.requiredField]
    })
  }

  onlyNumberDecimal(event:any)
  {
      this.validation.onlyNumbersWithDecimal(event);
  }
  getBoxType(event:any)
  {
    this.bln_IDexist == false;
    this.initializeField(event);
    this.sarr_stdVal = [];
    this.int_cntWeight = 0;
    this.str_IDLabel = event;
    if(event == "Weight Box")
    {
      this.str_StdLabel = 'Weight';
     this.sarr_units=['kg','g','mg'];
     this.frm_addCalibBox.patchValue(
      {
        str_unit: 'g'
      });
    }
    else
    {
      this.str_StdLabel = 'Block';
      this.sarr_units=['mm'];
      this.frm_addCalibBox.patchValue(
        {
          str_unit: 'mm'
        });
    }
    this.bln_showHideField = false;
  }

  /** check box id exist or not */
  onkey_checkDataExistForID(str_id: any)
  {
    var str_id = str_id.target.value;
    str_id = str_id.toLowerCase();
    this.int_length = this.sarr_getAPIID.filter(x => x.toLowerCase() === str_id);
    if (this.int_length.length > 0) {
      this.bln_IDexist = true;
    }
    else
    {
      this.bln_IDexist = false;
    }
  }

  checkDataExistForIdentification(str_idenificationNo: any)
  {
    var str_idenificationNo = str_idenificationNo.target.value;

    str_idenificationNo = str_idenificationNo.toLowerCase();

    if(str_idenificationNo == "na")
    {
      this.bln_IdentificationExistTable = false;
    }
    else
    {
      this.int_length = this.sarr_getAPIIdentification.filter(x => x.toLowerCase() === str_idenificationNo);
      if (this.int_length.length > 0) //check id exist in db
      {
        this.bln_IdentificationExist = true;
      }
      else
      {
        this.bln_IdentificationExist = false;
        //check exist in data table
        this.int_length = this.sarr_stdIdenfication.filter(x => x.toLowerCase() === str_idenificationNo);
        if (this.int_length.length > 0) {
          this.bln_IdentificationExistTable = true;
        }
        else
        {
          this.bln_IdentificationExistTable = false;
        }
      }
    }
  }

  onAdd(weight,unit,identification)
  {
      this.int_cntWeight = this.int_cntWeight + 1;
      var str_objWeight,str_objUnit,str_newObjData,int_objDP,str_objIdentification;
      let int_dp = this.validation.getDPValue(weight);

      str_objWeight = {'weight': weight};
      str_objUnit = {'unit': unit};
      str_objIdentification = {'identification': identification};
      int_objDP = {'Dp': int_dp};
      str_newObjData = {};
      Object.assign(str_newObjData,str_objWeight,str_objUnit,int_objDP,str_objIdentification);

      this.sarr_stdVal.push(str_newObjData);
      this.sarr_stdIdenfication.push(identification); //To avoid identification number

      if(this.int_IdentificationNo == 0)
      {
        this.frm_addCalibBox.patchValue(
          {
            str_Identification: 'NA'
          });
      }
      else
      {
        this.str_Identification.reset();
      }
      this.str_stdValue.reset();
  }

  onRemoveValues(index:number)
  {
    swal({
      title: 'Are you sure ?',
      text: "Do you want to remove " + this.str_StdLabel.toLowerCase() +"?",
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
      this.sarr_stdIdenfication.splice(index,1);
      this.int_cntWeight = this.int_cntWeight - 1;
      this.sarr_stdVal.splice(index,1);
     }
    }, function (dismiss) { });
  }

  getDataToSendOnSubmit(str_remark:any)
{
  const str_BoxType = this.frm_addCalibBox.value.str_BoxType;
  const str_BoxID = this.frm_addCalibBox.value.str_BoxID;
  const str_certificate = this.frm_addCalibBox.value.str_certificate;
  const dt_validUpto =  this.datePipe.transform(this.frm_addCalibBox.value.dt_validUpto,"yyyy/MM/dd");
  const dt_calibDate = this.datePipe.transform(this.frm_addCalibBox.value.dt_calibDate,"yyyy/MM/dd");
  var str_newData;

   str_newData = "ID:" + str_BoxID + " Certificate:"+ str_certificate
   + " Valid Upto:" + dt_validUpto + " Calibration Date:" + dt_calibDate;


   /**Audit Trail Data */
   const str_action = "Add";
   const str_userID = this.sessionStorage.retrieve("userId");
   const str_userName = this.sessionStorage.retrieve("userName");
   /**End Audit Trail Data */

    /**Activity Log */
    const str_activity = this.str_StdLabel +" Box Added";
    /**End Activity Log */

   this.obj_submitData =
   {
     "CB_Type": str_BoxType,
     "CB_ID": str_BoxID ,
     "CB_CertNo": str_certificate,
     "CB_validDt": dt_validUpto,
     "CB_CalibDt": dt_calibDate,
     "Action": str_action,
     "Remark": str_remark,
     "NewData": str_newData,
     "username": str_userName,
     "userid": str_userID,
     "activity": str_activity,
     "CB_Wt": this.sarr_stdVal
   };
   const data:Object={};
   Object.assign(data,this.obj_submitData);
   return data;
}
onSubmit()
{
  swal({
    title: 'Are you sure ?',
    text: "Do you want to add " + this.frm_addCalibBox.value.str_BoxID + "?",
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
      const message = { message : 'Add Calibration Box'  };
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
          this.http.postMethod('calibrationbox/storeCalibration', obj_sendData).subscribe(res=>{
          this.bln_Loading = false;
          this.objarr_apiSubmitData = res;

          if (this.objarr_apiSubmitData.result === 'Calibration ID Already Exist')
          {
            this.bln_Loading = false;
            swal({
              title: this.str_StdLabel + " Box ID already exist!",
              text: "",
              type: "warning",
              allowOutsideClick: false,
              },);
            this.frm_addCalibBox.value.str_equipmentID = '';
          }
          else if (this.objarr_apiSubmitData.result === 'Calibration Added Successfully') {
            swal({
              title: this.str_StdLabel + " Box Added Successfully!",
              text: "",
              type: "success",
              allowOutsideClick: false,
              },);
            this.onReset();
          }
          else
          {
            swal({
              title: "Can not Add "+ this.str_StdLabel +" Box, Try again!",
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
onReset()
{
  this.frm_addCalibBox.reset();
  this.sarr_stdVal=[];
  this.int_cntWeight = 0;
  this.bln_showHideField = true;
  this.sarr_stdIdenfication = [];
}
}
