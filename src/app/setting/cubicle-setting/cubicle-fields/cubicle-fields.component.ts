import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatDialog } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ValidationService } from '../../../services/validations/validation.service';
import { DataService } from '../../../services/commonData/data.service';
import { JsonDataService } from '../../../services/commonData/json-data.service';
import { SettingService } from '../../../services/setting/setting.service';
import { HttpService } from '../../../services/http/http.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { SessionStorageService } from 'ngx-webstorage';
import { ErrorHandlingService } from '../../../services/error-handling/error-handling.service';
import { RemarkComponent } from '../../../shared/remark/remark/remark.component';
import { ProductParametersComponent } from './product-parameters/product-parameters.component';
declare var swal: any;

@Component({
  selector: 'app-cubicle-fields',
  templateUrl: './cubicle-fields.component.html',
  styleUrls: ['./cubicle-fields.component.css']
})
export class CubicleFieldsComponent implements OnInit {

  /**Form Validations
   * Weighment is in process, batch is running in another cubicle except IPQC/IPQA area
   * IPQC/IPQA area batch can use in another cubicle when weighment is not in process
   * IPQC/IPQA area batch can not use in same area
   * Pause batch can use in another cubicle
   * batch is pause in compression and assign to ipqc area
  */
  str_areaName: string = '';
  lbl_machineCode: string = '';
  lbl_productCode: string = '';
  int_cubicleNo: number;
  str_machineCode: string = '';
  str_rotaryType: string = '';
  str_cubicleName: string = '';
  str_cubicleType: string = '';
  str_BFGID: string = '';
  sarr_reportType = ['Regular','Initial'];
  sarr_batchSizeUnit = ['Unit','Lakh','Thousand','Million'];
  sarr_departemnt = [];
  sarr_mediaData:Array<string> = [];
  sarr_stageData: Array<string> = [];
  sarr_productData: Array<string> = [];
  sarr_IPQCType = ['NA',"Compression","Coating"];

  /**JSON */
  int_department:any;
  int_indSample:any;
  int_grpSample:any;
  int_batchSize:any;
  int_DTMedia:any;
  int_stage:any;
  int_Lodstage:any;
  int_Validation:any;

  btnText:string = '';
  lblProductMsg:string = '';
  int_Length: any;
  bln_disableButtonIfStartBatch:boolean=false;
  bln_disableButtonIfIPQC:boolean=false;
  bln_disableDivLock:boolean=false;
  bln_disableDivWeighment:boolean=false;
  bln_formDisableInvalid:boolean =false;
  bln_disableSpanIfNoneProduct:boolean = false;
  bln_btnResetNotShowLockedMsg:boolean =false;
  bln_isRemarkPopupOpened: boolean;
  bln_Loading: boolean;
  bln_disableIPQCType: boolean = false;
  bln_validationValue: boolean = false;
  str_prd:any;
  str_prdID: string ='';
  str_oldReportType: string ='';
  str_oldDept: string = '';
  str_oldPrdCode: string = '';
  str_oldPrdName: string = '';
  str_oldPrdVersion: string = '';
  str_oldVersion: string = '';
  str_oldBatch: string = '';
  str_oldBatchSize: any;
  str_oldBatchSizeUnit: string = '';
  int_oldIndSample: number;
  int_oldGrpSample: number;
  str_oldStage: string = '';
  str_oldLodStage: string = '';
  str_oldDTMedia: string = '';
  str_oldIPQCType: string = '';
  str_oldLocked: number;
  int_CubicNoFromCubicleForIPQC: number = 0;
  str_CubicTypeFromCubicleForIPQC: string = 'NoData';
  str_CubicAreaFromCubicleForIPQC: string = '';
  bln_oldvalidationTest:any;
  int_showHideParamDetail:any;

  obj_submitData: any;
  objarr_apiSubmitData: any;

  intNumber:any;
  int_checkValidation:number = 0;

  frm_cubicleSetting: FormGroup;

  get int_indSample1()
  {
    return this.frm_cubicleSetting.get('int_indSample');
  }
  get int_grpSample1()
  {
    return this.frm_cubicleSetting.get('int_grpSample');
  }
  get str_batchNo1()
  {
    return this.frm_cubicleSetting.get('str_batchNo');
  }
  get str_batchSize1()
  {
    return this.frm_cubicleSetting.get('str_batchSize');
  }
  get str_lodStage1()
  {
    return this.frm_cubicleSetting.get('str_lodStage');
  }
  get str_batchUnit1()
  {
    return this.frm_cubicleSetting.get('str_batchUnit');
  }
  get str_prdDetail1()
  {
    return this.frm_cubicleSetting.get('str_prdDetail');
  }
  get int_validation()
  {
    return this.frm_cubicleSetting.get('int_validation');
  }

  constructor(private dialogRef: MatDialogRef<CubicleFieldsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private validationservice ?: ValidationService,
    private fb ?: FormBuilder, private dataservice ?: DataService,
    private jsonData ?: JsonDataService, private settingservice ?: SettingService,
    private http ?: HttpService, private notifyService ?: NotificationService,
    private sessionStorage?: SessionStorageService,private snackBar?: MatSnackBar,
     private dialog?: MatDialog, private errorHandling?: ErrorHandlingService)
    {
      this.frm_cubicleSetting = this.fb.group({
        str_reportType : [''],
        str_dept:['NA'],
        str_prdDetail:['',Validators.required],
        int_indSample:['0',Validators.compose([Validators.required,this.validationservice.validateZeroEntry])],
        int_grpSample: ['0',Validators.compose([Validators.required,this.validationservice.validateZeroEntry])],
        str_batchNo:['NULL',Validators.compose([Validators.required,this.validationservice.validateOnlyWhiteSpaceEnter])],
        str_batchSize:['0',Validators.compose([Validators.required,this.validationservice.validateZeroEntry])],
        str_batchUnit:['Unit'],
        str_stage:['NA',Validators.required],
        str_lodStage:['NA',Validators.compose([Validators.required,this.validationservice.validateOnlyWhiteSpaceEnter])],
        str_DTMedia:['NA'],
        str_IPQCType: ['NA'],
        int_validation:['0']
      });
    }

  ngOnInit()
  {
    this.sarr_departemnt = [];
    this.bln_disableButtonIfStartBatch = false;
    this.bln_disableButtonIfIPQC = false;
    this.bln_disableDivWeighment = false;
    this.bln_disableDivLock = false;
    this.bln_disableSpanIfNoneProduct = false;
    this.bln_formDisableInvalid = false;
    this.bln_disableSpanIfNoneProduct = false;

    this.commonFunctions();
  }

  chkValidation(event)
  {
    (event.target.checked == true) ? this.int_checkValidation = 1 : this.int_checkValidation = 0;
  }

  async getCubiclesData()
  {
    const res = await this.settingservice.getCubicle();
    return res;
  }
  getCubicleDataToFillInputField()
  {
    var str_reportsType = '';
    var str_prdDetails = '';

    this.getCubiclesData().then((res : any)=> {
      const dataOnCubicleNo= res.filter((y:any) => y.Sys_CubicNo == this.int_cubicleNo);
      dataOnCubicleNo.forEach(element => {

        //OldData
        this.str_oldDept= element.Sys_dept;
        this.str_oldPrdCode= element.Sys_BFGCode;
        this.str_oldPrdName= element.Sys_ProductName;
        this.str_oldPrdVersion= element.Sys_PVersion;
        this.str_oldVersion= element.Sys_Version;
        this.str_oldBatch= element.Sys_Batch;
        this.str_oldBatchSize= element.Sys_BatchSize;
        this.str_oldBatchSizeUnit= element.Sys_BatchSizeUnit;
        this.str_oldStage= element.Sys_Stage;
        this.str_oldLodStage= element.Sys_MAStage;
        this.str_oldDTMedia= element.Sys_media;
        this.str_oldIPQCType= element.Sys_IPQCType;
        this.bln_oldvalidationTest = element.Sys_Validation;

        if(this.bln_btnResetNotShowLockedMsg == false)
        {
          this.str_oldLocked = element.locked;
        }
        if(element.locked == 1 && this.bln_btnResetNotShowLockedMsg == false)
        {
          this.bln_disableDivLock = true;
          this.notifyService.showWarningWithTimeout('Cubicle is locked from another terminal!', "Alert!");
        }
        else
        {
          this.bln_disableDivLock = false;
          this.dataservice.setLocked(this.sessionStorage.retrieve("userId"),"tbl_cubical","Sys_CubicNo",
          this.int_cubicleNo,"locked","1").then(res => {
            if(this.bln_btnResetNotShowLockedMsg == false)
            {
              this.sessionStorage.store('EditMode', true);
              this.snackBar.openFromComponent(SnackBarComponent, {
               duration: 2000,
             });
            }
          }).catch(err => {
            console.log(err)
         });
        }
        if(element.Sys_RptType == 0)
        {
          this.str_oldReportType = "Regular";
          str_reportsType = "Regular";
        }
        else
        {
          this.str_oldReportType = "Initial";
          str_reportsType = "Initial";
        }

        if(element.Sys_ProductName == "NULL")
        {
          str_prdDetails = "";
          this.lblProductMsg = "Product Not Set";
          this.int_showHideParamDetail = 1;
        }
        else
        {
          (element.Sys_ProductName == "None") ? this.int_showHideParamDetail = 1 : this.int_showHideParamDetail = 0;
          str_prdDetails = element.Sys_ProductName.trim() + " | " + element.Sys_BFGCode.trim()
          + " | "+ element.Sys_PVersion.trim() + " | "+ element.Sys_Version.trim();
        }

       this.str_prdID = element.Sys_BFGCode;
       if(this.str_prdID === "None")
       {
        this.bln_disableSpanIfNoneProduct = true;
       }
       else
       {
        this.bln_disableSpanIfNoneProduct = false;
       }

       (this.bln_oldvalidationTest == 0) ? this.bln_validationValue = false : this.bln_validationValue = true;

        this.frm_cubicleSetting.patchValue({
          str_reportType: str_reportsType,
          str_dept: element.Sys_dept,
          str_prdDetail: str_prdDetails,
          str_batchNo: element.Sys_Batch,
          str_batchSize: element.Sys_BatchSize,
          str_batchUnit: element.Sys_BatchSizeUnit,
          str_stage: element.Sys_Stage,
          str_lodStage: element.Sys_MAStage,
          str_DTMedia:element.Sys_media,
          str_IPQCType: element.Sys_IPQCType,
          int_validation: element.Sys_Validation
           });
        });
    });
  }
  getSampleFromSampleTable()
  {
    this.settingservice.getProductSample(this.int_cubicleNo).then((res:any)=>{
      //Old Data
      this.int_oldIndSample= res.Individual;
      this.int_oldGrpSample= res.Group;

      this.frm_cubicleSetting.patchValue({
          int_indSample:res.Individual,
          int_grpSample: res.Group,
         });
    });
  }
  getProductDetail()
  {
    this.lblProductMsg = '';
    var strPrdData = '';
    this.sarr_productData = [];
    this.settingservice.getProductDetails(this.str_cubicleType,this.str_areaName).then((res:any)=>{
      if(res.length > 0)
      {
        res.forEach(element => {
        strPrdData = element.ProductName.trim() + " | "+ element.ProductId.trim()
        + " | "+ element.ProductVersion.trim() + " | "+ element.Version.trim();
        this.sarr_productData.push(strPrdData);
        });
        this.int_showHideParamDetail = 0;
      }
      else
      {
        this.lblProductMsg = "Product Not Found";
        this.int_showHideParamDetail = 1;
      }
    });
    this.sarr_productData.unshift("None | None | None | None");
  }
  getDepartment()
  {
    this.sarr_departemnt = [];
    this.http.getMethod('department/getDepartments').subscribe((res:any)=>{
      res.result.forEach(element => {
        this.sarr_departemnt.push(element.department_name);
      });
      this.sarr_departemnt.unshift("NA");
    });
  }
  getDTMedia()
  {
    this.sarr_mediaData = [];
    this.http.getMethod('media/getMedia').subscribe((res:any)=>{
      res.forEach(element => {
        this.sarr_mediaData.push(element.Media);
      });
      this.sarr_mediaData.unshift("NA");
    });
  }
  getStage()
  {
    this.sarr_stageData = [];
    this.http.getMethod('stage/getStages').subscribe((res:any)=>{
      res.forEach(element => {
        this.sarr_stageData.push(element.Stage);
      });
      this.sarr_stageData.unshift("NA");
    });
  }
  getWeighingStatus()
  {
    this.settingservice.getWeighingStatus().subscribe(
      (datas: any[]) =>
      {
        this.int_Length = datas.filter((x:any) => (x.CubicleNo == this.int_cubicleNo) && (x.Status == "1"));
        if(this.int_Length.length > 0)
        {
          this.notifyService.showErrorWithTimeout("Weighment is in process!","Oops!");
          this.bln_disableDivWeighment = true;
        }
        else
        {
          this.bln_disableDivWeighment = false;
        }
      },
      (error) => console.log("cubicle Setting : Weighing status not found")
      );
  }

  getDataFromSystemComponent()
  {
    this.str_areaName = this.data.str1;
    this.lbl_machineCode = this.data.str2;
    this.int_cubicleNo = this.data.str3;
    this.str_machineCode = this.data.str4;
    this.str_rotaryType = this.data.str5;
    this.str_cubicleName = this.data.str6;
    this.lbl_productCode = this.data.str7;
    this.str_cubicleType = this.data.str8;
    this.str_BFGID = this.data.str9;
  }

  getDataFromJson()
  {
    this.jsonData.getValueFromJSON().then((res: any) => {
      const str_cubicleJsonData = res.CubicleSetting;
      this.int_indSample = str_cubicleJsonData[0].Value;
      this.int_grpSample = str_cubicleJsonData[1].Value;
      this.int_batchSize = str_cubicleJsonData[2].Value;
      this.int_Lodstage = str_cubicleJsonData[3].Value;
      this.int_department = str_cubicleJsonData[4].Value;
      this.int_DTMedia = str_cubicleJsonData[5].Value;
      this.int_stage = str_cubicleJsonData[6].Value;
      this.int_Validation = str_cubicleJsonData[7].Value;
    }).catch(err => {
      console.log(err)
    });
  }
  getBatchStatus()
  {
    this.settingservice.getMaxBatchStatus(this.int_cubicleNo).then((res:any)=>{
      if((res.Status == "S") || (res.Status == "R")) // start or resume
      {
        this.btnText = "Pause";
        this.bln_disableButtonIfStartBatch = true;
      }
      else if(res.Status == "N") //Not set
      {
        this.btnText = "Start";
        this.bln_disableButtonIfStartBatch = false;
      }
      else if(res.Status == "P") //pause
      {
        this.btnText = "Resume";
        this.bln_disableButtonIfStartBatch = true;
      }
      else if(res.Status == "E") //end
      {
        this.btnText = "Start";
        this.bln_disableButtonIfStartBatch = false;
      }
      else if(res.Status == null)
      {
        this.btnText = "Start";
        this.bln_disableButtonIfStartBatch = false;
      }
    });
  }

  txtbatchNo_enterchr(event:any)
  {
    this.validationservice.allowCharactersInInputFields(event);
  }
  txtlodStage_enterchr(event:any)
  {
    this.validationservice.allowCharactersInInputFields(event);
  }
  txtgrpSample_enterOnlyNum(event: any)
  {
    this.validationservice.onlyNumbers(event);
  }
  txtindSample_enterOnlyNum(event: any)
  {
    this.validationservice.onlyNumbers(event);
  }
  txtsize_onlyNumberDecimal(event:any)
  {
    this.validationservice.onlyNumbersWithDecimal(event);
  }
  cboProduct_getProductID(event: any)
  {
    this.lblProductMsg = "";
    const sarr_prd = event.split("|");
    this.str_prdID = sarr_prd[1].trim();
    if(this.str_prdID === "None")
    {
     this.bln_disableSpanIfNoneProduct = true;
     this.int_showHideParamDetail = 1;
    }
    else
    {
     this.bln_disableSpanIfNoneProduct = false;
     this.int_showHideParamDetail = 0;
    }
    this.bln_validationValue = false; //validation test unchecked

    this.frm_cubicleSetting.patchValue({
      str_batchNo: "NULL",
      str_batchSize: "0",
      str_batchUnit: "Unit",
      str_stage: "NA",
      str_lodStage: "NA",
      str_DTMedia: "NA",
      int_indSample:"0",
      int_grpSample: "0",
      str_IPQCType: "NA",
      int_Validation: "0"
     });
  }

  commonFunctions()
  {
    this.getDataFromSystemComponent();
    this.getBatchStatus();
    this.getDataFromJson();
    this.getDTMedia();
    this.getStage();
    this.getDepartment();
    this.getSampleFromSampleTable();
    this.getProductDetail();
    this.getWeighingStatus();
    this.getCubicleDataToFillInputField();

    if((this.str_cubicleType == "IPQC" || this.str_cubicleType == "IPQA"))
    {
      this.bln_disableButtonIfIPQC = true;
      this.bln_disableButtonIfStartBatch = false;
      this.bln_disableIPQCType = true;
    }
    else
    {
      this.bln_disableButtonIfIPQC = false;
      this.bln_disableIPQCType = false;
    }
  }

/******************************Button click functions*************************** */
  getDataToSendOnSubmit(str_remark:any, flg_IsUpdate1:number, int_cubicleNoForIPQC:number, str_value:string)
{
    var formName= this.frm_cubicleSetting.value;
    const prdDetail = formName.str_prdDetail;
    this.str_prd = prdDetail.split("|");

  var str_newData="",str_oldData="",str_prdOld="",str_prdNew="",int_reportType;

  /***************check old data with new data ***********/
  if(formName.str_reportType != this.str_oldReportType)
  {
    str_newData ="Report Type:"+ formName.str_reportType;
    str_oldData ="Report Type:"+ this.str_oldReportType;
  }
  if((this.int_department == 1) && (formName.str_dept != this.str_oldDept))
  {
    str_newData +=" Department:"+ formName.str_dept;
    str_oldData +=" Department:"+ this.str_oldDept;
  }
  if(this.str_prd[0].trim() != this.str_oldPrdName.trim())
  {
    str_prdNew = this.str_prd[0] +","+ this.str_prd[1]+","+ this.str_prd[2]+","+ this.str_prd[3];
    str_prdOld = this.str_oldPrdName +","+ this.str_oldPrdCode+","+ this.str_oldPrdVersion+","+ this.str_oldVersion;
    str_newData +=" Product:"+ str_prdNew;
    str_oldData +=" Product:"+ str_prdOld;
  }
  if((this.int_indSample == 1) && (formName.int_indSample != this.int_oldIndSample))
  {
    str_newData +=" Ind.Qty:"+ formName.int_indSample;
    str_oldData +=" Ind.Qty:"+ this.int_oldIndSample;
  }
  if((this.int_grpSample == 1) && (formName.int_grpSample != this.int_oldGrpSample))
  {
    str_newData +=" Grp.Qty:"+ formName.int_grpSample;
    str_oldData +=" Grp.Qty:"+ this.int_oldGrpSample;
  }
  if(formName.str_batchNo != this.str_oldBatch)
  {
    str_newData +=" Batch:"+ formName.str_batchNo;
    str_oldData +=" Batch:"+ this.str_oldBatch;
  }
  if((this.int_batchSize == 1) &&(formName.str_batchSize != this.str_oldBatchSize))
  {
    str_newData +=" Batch Size:"+ formName.str_batchSize;
    str_oldData +=" Batch Size:"+ this.str_oldBatchSize;
  }
  if((this.int_batchSize == 1) && (formName.str_batchUnit != this.str_oldBatchSizeUnit))
  {
    str_newData +=" Unit:"+ formName.str_batchUnit;
    str_oldData +=" Unit:"+ this.str_oldBatchSizeUnit;
  }
  if((this.int_Lodstage == 1) && (formName.str_lodStage != this.str_oldLodStage))
  {
    str_newData +=" LOD Stage:"+ formName.str_lodStage;
    str_oldData +=" LOD Stage:"+ this.str_oldLodStage;
  }
  if((this.int_stage == 1) && (formName.str_stage != this.str_oldStage))
  {
    str_newData +=" Stage:"+ formName.str_stage;
    str_oldData +=" Stage:"+ this.str_oldStage;
  }
  if((this.int_DTMedia == 1) && (formName.str_DTMedia != this.str_oldDTMedia))
  {
    str_newData +=" DT Media:"+ formName.str_DTMedia;
    str_oldData +=" DT Media:"+ this.str_oldDTMedia;
  }
  // if((this.bln_disableButtonIfIPQC == true) && (formName.str_IPQCType.trim() != this.str_oldIPQCType.trim()))
  // {
  //   str_newData +=" Product Type:"+ formName.str_IPQCType.trim();
  //   str_oldData +=" Product Type:"+ this.str_oldIPQCType.trim();
  // }
  if(str_newData == "")
  {
    str_newData = "NA";
  }
  if(str_oldData == "")
  {
    str_oldData = "NA";
  }

/***************End check old data with new data ***********/

  /**Audit Trail Data */
  if(flg_IsUpdate1 == 0)
  {
    var str_status ="S";
    var str_action = "Start";
    /**Activity Log */
    var str_activity = "Cubicle Setting - Batch Started";
    /**End Activity Log */
  }
  else if(flg_IsUpdate1 == 2)
  {
    var str_status ="R";
    var str_action = "Resume";
    /**Activity Log */
    var str_activity = "Cubicle Setting - Batch Resumed";
    /**End Activity Log */
  }
  else
  {
    if(this.str_cubicleType == "IPQA")
    {
      var str_status ="I";
    }
    else if(this.str_cubicleType == "IPQC")
    {
      var str_status ="I";
    }
    else
    {
      if(int_cubicleNoForIPQC > 0)
      {
        var str_status ="S";
      }
      else
      {
        var str_status ="N";
      }
    }

    var str_action = "Update";
    /**Activity Log */
    var str_activity = "Cubicle Setting - Updated";
    /**End Activity Log */
  }

  const str_userID = this.sessionStorage.retrieve("userId");
  const str_userName = this.sessionStorage.retrieve("userName");
  /**End Audit Trail Data */

  if(formName.str_reportType == "Regular")
  {
    int_reportType = "0";
  }
  else
  {
    int_reportType = "1";
  }

  this.obj_submitData =
  {
    "Sys_RptType": int_reportType,
    "Sys_Batch": formName.str_batchNo.trim(),
    "Sys_BFGCode": this.str_prd[1].trim(),
    "Sys_ProductName": this.str_prd[0].trim(),
    "Sys_Version": this.str_prd[3].trim(),
    "Sys_PVersion": this.str_prd[2].trim(),
    "Sys_BatchSize": formName.str_batchSize,
    "Sys_BatchSizeUnit": formName.str_batchUnit.trim(),
    "Sys_Stage": formName.str_stage.trim(),
    "Sys_MAStage": formName.str_lodStage.trim(),
    "Sys_dept": formName.str_dept.trim(),
    "Sys_LotNo": "NA",
    "Sys_media": formName.str_DTMedia.trim(),
    "Individual": formName.int_indSample,
    "Group": formName.int_grpSample,
    "Sys_CubicNo": this.int_cubicleNo,
    "Sys_CubicName": this.str_cubicleName.trim(),
    "Sys_Area": this.str_areaName.trim(),
    "Sys_IPQCType": "NA",//formName.str_IPQCType,
    "Sys_CubicType": this.str_cubicleType.trim(),
    "int_cubicleNoForIPQC": int_cubicleNoForIPQC,
    "Sys_Validation": this.int_checkValidation,
    "str_value":str_value,
    "Status": str_status,
    "Action": str_action,
    "Remark": str_remark,
    "NewData": str_newData,
    "OldData": str_oldData,
    "username": str_userName,
    "userid": str_userID,
    "activity": str_activity
  };
  const data:Object={};
  Object.assign(data,this.obj_submitData);
  return data;

}

btnUpdate(flg_IsUpdate: number)
  {

    var int_statusIPQC, str_cubType;
    var str_BatchStatus, str_cubicNo;

    if(flg_IsUpdate == 1)//update
    {
      var strMsg = "Do you want to update " + this.str_cubicleName + " data?";
    }
    else if(flg_IsUpdate == 0)//start
    {
      var strMsg = "Do you want to Start Batch?"
    }
    else if(flg_IsUpdate == 2)//Resume
    {
      var strMsg = "Do you want to Resume Batch?"
    }

    var formName= this.frm_cubicleSetting.value;
    const prdDetail = formName.str_prdDetail;
    this.str_prd = prdDetail.split("|");

    this.settingservice.getCubicle().then((res:any)=>{
        const str_batchAlreadyAssignToCubicle = res.filter((x:any)=> (x.Sys_CubicNo != this.int_cubicleNo) && (x.Sys_Batch == formName.str_batchNo.trim()) && (x.Sys_Batch != "NULL"));

        if (str_batchAlreadyAssignToCubicle.length > 0)
        {
          this.int_CubicNoFromCubicleForIPQC = str_batchAlreadyAssignToCubicle[0]['Sys_CubicNo'];
          this.str_CubicTypeFromCubicleForIPQC = str_batchAlreadyAssignToCubicle[0]['Sys_CubType'];
          this.str_CubicAreaFromCubicleForIPQC = str_batchAlreadyAssignToCubicle[0]['Sys_Area'];
        }
        else
        {
          this.int_CubicNoFromCubicleForIPQC = 0;
          this.str_CubicTypeFromCubicleForIPQC = "NoData";
        }

        if(this.str_CubicTypeFromCubicleForIPQC == "IPQC")
        {
          str_cubType = "IPQC";
        }
        else if(this.str_CubicTypeFromCubicleForIPQC == "IPQA")
        {
          str_cubType = "IPQC";
        }
        else
        {
          str_cubType = this.str_CubicTypeFromCubicleForIPQC;
        }

        this.settingservice.getWeighingStatus().subscribe((datas:any[]) =>{

        const int_status = datas.filter((x:any) => (x.CubicleNo == this.int_CubicNoFromCubicleForIPQC));
        if(int_status.length > 0)
        {
          int_statusIPQC = int_status[0]['Status'];//Weighment status tbl_system_weighingstatus
        }

         this.settingservice.getMaxBatchStatusOfSendBatch(formName.str_batchNo.trim()).then((res:any)=>{
          str_BatchStatus = res.Status;
          str_cubicNo = res.CubicNo;

          /** Conditions :- 1. IPQC batch can set to another cubicle if weighment is not in process
           *  2. IPQC batch can not set in same area of ipqc cubicle
           *  3. if batch is pause then that batch can shift in another cubicle
          */
        if((str_cubType == "IPQC") && (int_statusIPQC == 0)
         && (this.str_CubicAreaFromCubicleForIPQC == this.str_areaName)
         && (this.str_CubicTypeFromCubicleForIPQC == this.str_cubicleType))
         {
           swal({
             title: this.str_CubicTypeFromCubicleForIPQC + " Area",
             text: "You cannot set batch in same area!",
             type: "error",
             allowOutsideClick: false,
           });
         }
        else if((str_cubType == "IPQC") && (int_statusIPQC == 0) && (flg_IsUpdate != 2))
        {
          swal({
            title: this.str_CubicTypeFromCubicleForIPQC + " Area",
            text: "Batch is already assigned, Do you want to proceed with same batch?",
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
              //this.int_CubicNoFromCubicleForIPQC not selected cubicle number
              this.saveDataInCubicleTable(flg_IsUpdate, this.int_CubicNoFromCubicleForIPQC,"IPQC");
            }
          }, function (dismiss) { });
        }
        else if((str_cubType == "IPQC") && (int_statusIPQC == 1))
        {
          swal({
            title: "Batch is running in " + this.str_CubicTypeFromCubicleForIPQC + " area!",
            text: "",
            type: "error",
            allowOutsideClick: false,
          });
        }
        else if((str_cubType != "IPQC") && (str_BatchStatus == "P") && (str_cubicNo != this.int_cubicleNo) && (flg_IsUpdate != 2))
        {
            swal({
            title: "",
            text: "Batch is already paused, Do you want to proceed with same batch?",
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
              this.saveDataInCubicleTable(flg_IsUpdate, str_cubicNo,"Other");
            }
          }, function (dismiss) { });
        }
        else if((str_cubType != "IPQC") && (str_batchAlreadyAssignToCubicle.length > 0))
        {
          swal({
            title: "Batch already assigned to another Cubicle!",
            text: "",
            type: "error",
            allowOutsideClick: false,
          });
        }
        else if((formName.str_reportType == this.str_oldReportType) && (formName.str_dept  == this.str_oldDept )
        && (this.str_prd[1]  == this.str_oldPrdCode ) && (this.str_prd[0]  == this.str_oldPrdName )
        && (this.str_prd[2]  == this.str_oldPrdVersion ) && (this.str_prd[3]  == this.str_oldVersion )
        && (formName.str_batchNo == this.str_oldBatch ) && (formName.str_batchSize  == this.str_oldBatchSize)
        && (formName.str_batchUnit  == this.str_oldBatchSizeUnit ) && (formName.int_grpSample == this.int_oldGrpSample)
        && (formName.int_indSample == this.int_oldIndSample) && (this.bln_oldvalidationTest == this.int_checkValidation)
        && (formName.str_lodStage  == this.str_oldLodStage ) && (formName.str_DTMedia  == this.str_oldDTMedia )
        && (formName.str_stage  == this.str_oldStage) && (formName.str_IPQCType  == this.str_oldIPQCType)
        && (flg_IsUpdate == 1))
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
            title: 'Are you sure ?',
            text: strMsg,
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
              this.saveDataInCubicleTable(flg_IsUpdate, this.int_CubicNoFromCubicleForIPQC,"NO");
            }
          }, function (dismiss) { });
        }
         });
      });//Weighment Staus For IPQC API
    });//Cubicle Data API
  }


saveDataInCubicleTable(flg_IsUpdate, int_cubicleNoForIPQC, str_value)
{
  this.bln_Loading = false;
  this.bln_isRemarkPopupOpened = true;
  if(flg_IsUpdate == 1)
  {
    var message = { message : 'Cubicle Setting - Update'  };
  }
  else if(flg_IsUpdate == 0)
  {
    var message = { message : 'Cubicle Setting - Start'  };
  }
  else if(flg_IsUpdate == 2)//Resume
  {
    var message = { message : 'Cubicle Setting - Resume'  };
  }

  const dialogRef = this.dialog.open(RemarkComponent, {
    data: message,
    width: '570px',
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result !== undefined) //remark data
    {
      const remark = result.reason;
      const obj_sendData = this.getDataToSendOnSubmit(remark, flg_IsUpdate, int_cubicleNoForIPQC, str_value);
      //console.log(JSON.stringify(obj_sendData));
      this.bln_Loading = true;
      this.http.postMethod('cubicle/updateCubicle', obj_sendData).subscribe(res=>{
      this.bln_Loading = false;
      this.objarr_apiSubmitData = res;

       if (this.objarr_apiSubmitData.result === 'Cubicle Updated Successfully')
       {
        swal({
          title: this.str_cubicleName + " " + this.btnText + " Updated Successfully!",
          text: "",
          type: "success",
          allowOutsideClick: false,
          },);
        this.onReset();
      }
      else
      {
        swal({
          title: "Can not update "+ this.str_cubicleName +" data, Try again!",
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

  btnSPR() //Start,Resume,Pause
  {
    if(this.btnText == "Start")
    {
      this.btnUpdate(0);
    }
    else if(this.btnText == "Resume")
    {
      this.btnUpdate(2);
    }
    else if(this.btnText == "Pause")
    {
      this.settingservice.getWeighingStatus().subscribe(
        (datas: any[]) =>
        {
          this.int_Length = datas.filter((x:any) => (x.BatchNo == this.frm_cubicleSetting.value.str_batchNo));

          if(this.int_Length.length == "1")
          {
           swal({
             title: "This " + this.frm_cubicleSetting.value.str_batchNo + " weighment is in process!",
             text: "",
             type: "error",
             allowOutsideClick: false,
           });
          }
          else
          {
            this.btnEnd(0);
          }
        },
        (error) => console.log("cubicle Setting : chkWeighmentInProcessInIPQC")
        );
    }
  }

  getDataToSendOnBatchEndPause(str_remark:any,flg_IsEnd1: number)
  {
    var formName = this.frm_cubicleSetting.value;

    /**Audit Trail Data */
    if(flg_IsEnd1 == 1)
    {
      var str_status = "E";
      var str_action = "End";
      /**Activity Log */
      var str_activity = "Cubicle Setting - Batch End";
      /**End Activity Log */
    }
    else
    {
      var str_status = "P";
      var str_action = "Pause";
      /**Activity Log */
      var str_activity = "Cubicle Setting - Batch Paused";
      /**End Activity Log */
    }

    const str_userID = this.sessionStorage.retrieve("userId");
    const str_userName = this.sessionStorage.retrieve("userName");
    /**End Audit Trail Data */

    this.obj_submitData =
    {
      "Batch": formName.str_batchNo.trim(),
      "Status": str_status,
      "Sys_CubicNo": this.int_cubicleNo,
      "Sys_CubicName": this.str_cubicleName.trim(),
      "Sys_Area": this.str_areaName.trim(),
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

  btnEnd(flg_IsEnd:number)
  {
    this.settingservice.getWeighingStatus().subscribe(
      (datas: any[]) =>
      {
        this.int_Length = datas.filter((x:any) => (x.BatchNo == this.frm_cubicleSetting.value.str_batchNo.trim()));

        if(this.int_Length.length == "1")
        {
         swal({
           title: "This " + this.frm_cubicleSetting.value.str_batchNo + " weighment is in process!",
           text: "",
           type: "error",
           allowOutsideClick: false,
         });
        }
        else
        {
          if(flg_IsEnd == 0)
          {

            var str_MSG = "Do you want to pause batch?";
          }
          else
          {
            var str_MSG = "Do you want to end batch?";
          }

        swal({
          title: 'Are you sure ?',
          text: str_MSG,
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
            if(flg_IsEnd == 0)
            {
              var message = { message : 'Cubicle Setting - Batch Pause'  };
            }
            else
            {
              var message = { message : 'Cubicle Setting - Batch End'  };
            }

            const dialogRef = this.dialog.open(RemarkComponent, {
              data: message,
              width: '570px',
              disableClose: true
            });

            dialogRef.afterClosed().subscribe(result => {
              if (result !== undefined) //remark data
              {
                const remark = result.reason;
                const obj_sendData = this.getDataToSendOnBatchEndPause(remark,flg_IsEnd);
                //console.log(JSON.stringify(obj_sendData));
                this.bln_Loading = true;

                if(flg_IsEnd == 0)
                {
                  var str_apiText = "cubicle/updateCubicleStatus";
                }
                else
                {
                  var str_apiText = "cubicle/EndCubicleBatch";
                }

                this.http.postMethod(str_apiText, obj_sendData).subscribe(res=>{
                this.bln_Loading = false;
                this.objarr_apiSubmitData = res;

                 if (this.objarr_apiSubmitData.result === 'Batch End Successfully')
                 {
                  swal({
                    title: "Batch End Successfully!",
                    text: "",
                    type: "success",
                    allowOutsideClick: false,
                    },);
                  this.onClose();
                }
                else  if (this.objarr_apiSubmitData.result === 'Batch Paused Successfully')
                {
                  swal({
                    title: "Batch Paused Successfully!",
                    text: "",
                    type: "success",
                    allowOutsideClick: false,
                    },);
                  this.onReset();
                }
                else
                {
                  swal({
                    title: "Failed!",
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
        }//else
      },
      (error) => console.log("cubicle Setting : chkWeighmentInProcessInIPQC")
      );
  }
  onReset()
  {
    this.bln_btnResetNotShowLockedMsg = true;
    this.commonFunctions();
  }
  onClose()
  {
    this.sessionStorage.store('EditMode', false);
    this.notifyService.hideWarningToast();
    this.notifyService.hideErrorToast();
    if(this.str_oldLocked == 0)
    {
      this.dataservice.setLocked(this.sessionStorage.retrieve("userId"),"tbl_cubical","Sys_CubicNo",
      this.int_cubicleNo,"locked","0");//release lock
    }

    this.dialogRef.close();
  }

  btnShow_displayParameter()
  {
    var formName= this.frm_cubicleSetting.value;
    const prdDetail = formName.str_prdDetail;
    this.str_prd = prdDetail.split("|");

     const dialogRef = this.dialog.open(ProductParametersComponent, {
      width: '1200px',
      height: '500px',
      disableClose: true,
      data:{
        str1:this.str_prd[1].trim(), str2:this.str_prd[0].trim(),
        str3:this.str_prd[2].trim(), str4:this.str_prd[3].trim(),
        str5:this.str_cubicleType, str6: this.str_areaName
      }
    });

  }
}
@Component({
  selector: 'app-snackbar',
  template: `<p style="text-align:center">Lock Acquired</p>`,
  styles: [`.example-pizza-party { color: hotpink; }`],
})
export class SnackBarComponent { }
