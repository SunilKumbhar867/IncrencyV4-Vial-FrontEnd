import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpService } from '../../services/http/http.service';
import { DataService } from '../../services/commonData/data.service';
import { JsonDataService } from '../../services/commonData/json-data.service';
import { SettingService } from '../../services/setting/setting.service';
import { ValidationService } from '../../services/validations/validation.service';
import { MatDialog } from '@angular/material';
import { PortSettingComponent } from './port-setting/port-setting.component';
import { SessionStorageService } from 'ngx-webstorage';
import { RemarkComponent } from '../../shared/remark/remark/remark.component';
import { ErrorHandlingService } from '../../services/error-handling/error-handling.service';
declare var swal: any;

@Component({
  selector: 'app-area-setting',
  templateUrl: './area-setting.component.html',
  styleUrls: ['./area-setting.component.css']
})
export class AreaSettingComponent implements OnInit {
  sarr_areaName: Array<string> = [];
  sarr_cubicleType: Array<string> = [];
  sarr_machineData: Array<string> = [];
  sarr_machineIDs: Array<string> = [];
  sarr_rotaryType: Array<string> = [];
  sarr_areaData: Array<string> = [];
  sarr_cubicleData: Array<any> = [];
  sarr_areaWiseDataFromCubicleTable: Array<string> = [];
  sarr_cubicleDataFromDatabase: Array<string> = [];
  sarr_allCubicleNameFromCubicle: Array<string> = [];
  sarr_allMachineCodeFromCubicle: Array<string> = [];
  sarr_allIDSNOFromCubicle: Array<string> = [];

  int_cubicNo = [];
  int_IDSNo: number;
  str_machineCode:string='';
  str_rotaryType:string = '';
  intCubicleNo:number;
  strCubicleName:string ='';
  strCubicleType:string ='';
  strMachineID:string ='';
  intIdsNo:number;
  strOldCubicleName:string ='';
  strOldCubicleType:string ='';
  strOldMachineID:string ='';
  intOldIdsNo:number;
  int_cntCubicleNameExist: any;
  int_cntMachineIDExist: any;
  int_cntIDSNoExist: any;
  bln_batchRunning: boolean;
  bln_weighingStatus: boolean;
  str_batchStatus: string;
  int_Length: any;
  int_userType: any;

  bln_Loading: boolean;
  bln_isRemarkPopupOpened: boolean;

  obj_submitData: any;
  objarr_apiSubmitData: any;

  str_batchesStatus:any;
  disabledOnportButton: any;

  public str_array_CubicleData: FormArray;

  bln_showHideTable:boolean =  false;

  frm_areaSetting = new FormGroup({
    str_area: new FormControl(),
    int_cubicleNo: new FormControl(),
    str_array_CubicleData: new FormArray([]),
  });

  get str_area()
  {
    return this.frm_areaSetting.get('str_area');
  }

  constructor(private fb: FormBuilder,private http ?: HttpService,
    private dataservice ?: DataService,private jsonData ?: JsonDataService,
    private settingservice ?: SettingService, private validationservice ?: ValidationService,
    private validation ?: ValidationService,private dialog?: MatDialog,
    private sessionStorage?: SessionStorageService,
    private errorHandling?: ErrorHandlingService) { }

  ngOnInit()
  {
    this.int_userType = this.sessionStorage.retrieve("Type");
    this.sarr_areaName = [];
    this.sarr_areaData = [];
    this.sarr_cubicleType = [];

    this.clearVariableArrays();

     //getNomenclature detail from api
     this.dataservice.getNomenclatureDetails().then((res:any)=>{
      this.str_machineCode = res[0].MachineCode;
    });

    //get Cubicle Area from api
    this.settingservice.getCubicleArea().then((res:any)=>{
     res.forEach(element => {
        this.sarr_areaName.push(element.Area);
        this.sarr_areaData.push(element);
     });
    });

    //  //get Cubicle type from json
    //  this.jsonData.getValueFromJSON().then((res:any) =>{
    //   const str_cubType = res.CubicleType.filter(x=> x.Value == 1 && x.Name==str_areaName);
    //   str_cubType.forEach(element => {
    //   this.sarr_cubicleType.push(element.Name);
    //   });
    // }).catch(err => {
    // console.log(err)
    // });

   this.getMachine('','');
  }


  clearVariableArrays()
  {
    this.bln_weighingStatus = false;
    this.bln_batchRunning = false;
    this.bln_showHideTable = false;
  }

  cboarea_getDetailToCreateTable(str_areaName:any)
  {
    this.bln_showHideTable = true; //show table
    this.sarr_areaWiseDataFromCubicleTable = [];
    this.sarr_cubicleType = [];

    //get Cubicle type from json
      this.jsonData.getValueFromJSON().then((res:any) =>{
      const str_cubType = res.CubicleType.filter(x=> x.Value == 1 && x.Name==str_areaName);
      str_cubType.forEach(element => {
      this.sarr_cubicleType.push(element.Name);
      });
      this.sarr_cubicleType.push("IPQC");
    }).catch(err => {
    console.log(err)
    });

    this.int_cubicNo = this.sarr_areaData.filter((x:any) => x.Area == str_areaName);
    this.int_IDSNo = this.int_cubicNo[0].IDSNos;
    this.frm_areaSetting.patchValue({int_cubicleNo: this.int_IDSNo});

    this.settingservice.getCubicle().then((res:any)=>{
      this.sarr_areaWiseDataFromCubicleTable = res.filter(x=> x.Sys_Area == str_areaName);
      this.generateTableData(str_areaName);
     }).catch(err => {
      console.log(err)
    });
    //this.getMachine('','');
  }

  generateTableData(str:any)
  {
    this.sarr_cubicleData = this.sarr_areaWiseDataFromCubicleTable.map(newFormGroup => new FormGroup({
      int_cubicle_cubNo: new FormControl(newFormGroup['Sys_CubicNo']),
      str_cubicle_cubName: new FormControl(newFormGroup['Sys_CubicName'],Validators.compose([Validators.required,this.validation.validateOnlyWhiteSpaceEnter])),
      str_cubicle_cubType: new FormControl(newFormGroup['Sys_CubType']),
      str_cubicle_machineId: new FormControl(newFormGroup['Sys_MachineCode']),
      int_cubicle_IdsNo: new FormControl(newFormGroup['Sys_IDSNo'],Validators.required),
      int_cubicle_locked: new FormControl(newFormGroup['locked'])
    }));

    this.frm_areaSetting = this.fb.group({
      str_area: new FormControl(str),
      int_cubicleNo: new FormControl(this.int_IDSNo),
      str_array_CubicleData: new FormArray(this.sarr_cubicleData),
    });
  }

  txtCubName_enterchr(event: any)
  {
    this.validationservice.allowCharactersInInputFields(event);
  }
  txtCubName_changeValue(selectedIndex: any, index:any)
  {
    var control = <FormArray>this.frm_areaSetting.controls.str_array_CubicleData;
    const strCubicleName = control.value[index].str_cubicle_cubName;
    const strOldCubicleName = this.sarr_areaWiseDataFromCubicleTable[index]['Sys_CubicName'];
    strCubicleName == strOldCubicleName ? this.disabledOnportButton = selectedIndex+0 : this.disabledOnportButton = selectedIndex;
  }
  cboCubicleType_fillMachine(selectedIndex: any, event:any)
  {
    // var control = <FormArray>this.frm_areaSetting.controls.str_array_CubicleData;
    // const strCubicleTypes = control.value[selectedIndex].str_cubicle_cubType;
    // const strOldCubicleTypes = this.sarr_areaWiseDataFromCubicleTable[selectedIndex]['Sys_CubType'];
    // strCubicleTypes == strOldCubicleTypes ? this.disabledOnportButton = event+0 : this.disabledOnportButton = event;
    // this.getMachine(strCubicleTypes,selectedIndex);
  }
  cboMachineId_disablePortButton(event: any,selectedIndex:any)
  {
    var control = <FormArray>this.frm_areaSetting.controls.str_array_CubicleData;
    const strMachine = control.value[event].str_cubicle_machineId;
    const strOldMachine = this.sarr_areaWiseDataFromCubicleTable[event]['Sys_MachineCode'];
    strMachine == strOldMachine ? this.disabledOnportButton = selectedIndex+0 : this.disabledOnportButton = selectedIndex;
  }
  getMachine(str_cubTypes: string, selectedIndex: any)    //get Machine from api
  {
    this.sarr_machineData = [];
    this.sarr_machineIDs = [];
    // var control = <FormArray>this.frm_areaSetting.controls.str_array_CubicleData;
    // const strMachine = control;
    // strMachine.controls[selectedIndex].patchValue({
    //   str_cubicle_machineId : 'None'
    // })
    // console.log(strMachine.controls[selectedIndex])

    this.settingservice.getMachine().then((res:any)=>{
      if(str_cubTypes != '')
      {
        const machineData= res.filter((x:any) => x.Machine_CubicleType == str_cubTypes);
        machineData.forEach(element => {
          this.sarr_machineData.push(element);
          this.sarr_machineIDs.push(element.Machine_ID);
       });

      }
      else
      {

        const machineData = res.filter((x:any) => x.Machine_Active.data[0] == 1);
        machineData.forEach(element => {
          this.sarr_machineData.push(element);
          this.sarr_machineIDs.push(element.Machine_ID);
       });
      }
      this.sarr_machineIDs.unshift("None");
     });
  }

  getRotaryType(strmachineid:any)
  {
    this.sarr_rotaryType = [];
    this.str_rotaryType = '';
    this.sarr_rotaryType = this.sarr_machineData.filter((x:any) => x.Machine_ID == strmachineid);
    this.str_rotaryType = this.sarr_rotaryType[0]['Machine_Rotary'];
  }

  txtidsno_enterOnlyNum(event: any)
  {
    this.validationservice.onlyNumbers(event);
  }
  txtidsno_changeValue(selectedIndex: any, index:any)
  {
    var control = <FormArray>this.frm_areaSetting.controls.str_array_CubicleData;
    const stridsNo = control.value[index].int_cubicle_IdsNo;
    const strOldidsNo = this.sarr_areaWiseDataFromCubicleTable[index]['Sys_IDSNo'];
    stridsNo == strOldidsNo ? this.disabledOnportButton = selectedIndex+0 : this.disabledOnportButton = selectedIndex;
  }

  btnPortSetting_displayForm(selectedItem:any)
  {
    const strAreaName = this.frm_areaSetting.value.str_area.trim();
    const int_cubicleNo = selectedItem.value.int_cubicle_cubNo;
    const int_locked = selectedItem.value.int_cubicle_locked;
    const str_cubicleName = selectedItem.value.str_cubicle_cubName.trim();

    this.dialog.open(PortSettingComponent, {
      width: '1200px',
      height: '640px',
      disableClose: true,
      data: {
        str1: strAreaName, str2: str_cubicleName,
        str3: int_cubicleNo, str4: int_locked
      },
    });

  }

  async getBatchesData()
  {
    const res = await this.settingservice.getBatches();
    return res;
  }

  async getWeighingStatus()
  {
    const res = await this.settingservice.getWeighingStatus();
    return res;
  }

  btnSave_onUpdate(selectedItem:any)
  {
    var control = <FormArray>this.frm_areaSetting.controls.str_array_CubicleData;
    this.intCubicleNo = control.value[selectedItem]['int_cubicle_cubNo'];
    this.strCubicleName = control.value[selectedItem]['str_cubicle_cubName'];
    this.strCubicleType = control.value[selectedItem]['str_cubicle_cubType'];
    this.strMachineID = control.value[selectedItem]['str_cubicle_machineId'];
    this.intIdsNo = control.value[selectedItem]['int_cubicle_IdsNo'];

    //Old Value Data
    this.strOldCubicleName = this.sarr_areaWiseDataFromCubicleTable[selectedItem]['Sys_CubicName'];
    this.strOldCubicleType = this.sarr_areaWiseDataFromCubicleTable[selectedItem]['Sys_CubType'];
    this.strOldMachineID = this.sarr_areaWiseDataFromCubicleTable[selectedItem]['Sys_MachineCode'];
    this.intOldIdsNo = this.sarr_areaWiseDataFromCubicleTable[selectedItem]['Sys_IDSNo'];

    if(this.strMachineID == "None")
    {
      this.str_rotaryType = "None";
    }
    else
    {
      this.getRotaryType(this.strMachineID);//getRotaryType using machine code
      this.str_rotaryType =  this.str_rotaryType;
    }

    this.settingservice.getCubicle().then((res:any) =>{
      this.sarr_allCubicleNameFromCubicle = [];
      this.sarr_allMachineCodeFromCubicle = [];
      this.sarr_allIDSNOFromCubicle = [];

      res.forEach(element => {
        if (element['Sys_CubicName'] != "NULL") {
          if (this.strOldCubicleName != element['Sys_CubicName']) {
            this.sarr_allCubicleNameFromCubicle.push(element['Sys_CubicName'].trim().toString().toLowerCase());
          }
        }

        if (element['Sys_MachineCode'] != "None") {
          if (this.strOldMachineID != element['Sys_MachineCode']) {
          this.sarr_allMachineCodeFromCubicle.push(element['Sys_MachineCode'].trim().toString().toLowerCase());
          }
        }

        if (element['Sys_IDSNo'] != "0") {
          if (this.intOldIdsNo != element['Sys_IDSNo']) {
          this.sarr_allIDSNOFromCubicle.push(element['Sys_IDSNo']);
          }
        }

      });//End foreach

      this.settingservice.getWeighingStatus().subscribe(
        (datas: any[]) =>
        {
          this.int_Length = datas.filter((x:any) => (x.CubicleNo == this.intCubicleNo) && (x.Status == "1"));
          this.int_Length.length > 0 ? this.bln_weighingStatus = true : this.bln_weighingStatus = false;
        },
        (error) => console.log("Weighing status not found")
        );

      this.int_cntCubicleNameExist = this.sarr_allCubicleNameFromCubicle.includes(this.strCubicleName.trim().toString().toLowerCase());
      this.int_cntMachineIDExist = this.sarr_allMachineCodeFromCubicle.includes(this.strMachineID.trim().toString().toLowerCase())
      this.int_cntIDSNoExist = this.sarr_allIDSNOFromCubicle.includes(this.intIdsNo.toString());

      this.getBatchesData().then((res : any)=> {
        this.int_Length = res.filter((x:any) => ((x.CubicNo == this.intCubicleNo) && ((x.Status == "S") || (x.Status == "R"))));
        this.int_Length.length > 0 ? this.bln_batchRunning = true : this.bln_batchRunning = false;


        if(this.bln_weighingStatus == true)
        {
          swal({
            title: "Can not update data, weighment is in process, please try again!",
            text: "",
            type: "error",
            allowOutsideClick: false,
          });
        }
        else if(this.bln_batchRunning == true)
        {
          swal({
            title: "Batch is in running state, please try again!",
            text: "",
            type: "error",
            allowOutsideClick: false,
          });
        }
         else if(this.int_cntCubicleNameExist == true)
         {
           swal({
             title: "Cubicle Name already exist!",
             text: "",
             type: "error",
             allowOutsideClick: false,
           });
         }
         else if(this.int_cntMachineIDExist == true)
         {
           swal({
             title: this.str_machineCode + " already exist!",
             text: "",
             type: "error",
             allowOutsideClick: false,
           });
         }
         else if(this.int_cntIDSNoExist == true)
         {
           swal({
             title: "IDS No. already exist!",
             text: "",
             type: "error",
             allowOutsideClick: false,
           });
         }
         else if (this.strCubicleName.trim() == this.strOldCubicleName.trim() &&
           this.strCubicleType.trim() == this.strOldCubicleType.trim() &&
           this.strMachineID.trim() == this.strOldMachineID.trim() &&
           this.intIdsNo == this.intOldIdsNo) {
           swal({
             title: "No Change!",
             text: "",
             type: "error",
             allowOutsideClick: false,
           });
         }
         else {
           this.btnUpdateSavingProcess();
         }
      } );

    }).catch(err => {
      console.log(err)
    });

  }

  btnUpdateSavingProcess()
  {
    swal({
      title: 'Are you sure ?',
      text: "Do you want to save changes of " +  this.frm_areaSetting.value.str_area + "?",
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
      const message = { message : 'Area setting' };
      const dialogRef = this.dialog.open(RemarkComponent, {
      data: message,
      width: '570px',
      disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) //remark data
        {
          const remark = result.reason;
          const obj_dataToSend = this.getDataToSendOnSubmit(remark);
          //console.log(JSON.stringify(obj_dataToSend));
          this.bln_Loading = true;
          this.http.postMethod('area/update', obj_dataToSend).subscribe(res=>{
          this.bln_Loading = false;
          this.objarr_apiSubmitData = res;
           if (this.objarr_apiSubmitData.result === 'Area Setting Updated Successfully') {
            swal({
              title: "Area Setting save Successfully!",
              text: "",
              type: "success",
              allowOutsideClick: false,
              },);
               this.clearVariableArrays();
          }
          else
          {
            swal({
              title: "Can not doing area setting, Try again!",
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

  getDataToSendOnSubmit(str_remark:any)
  {
    const strAreaName = this.frm_areaSetting.value.str_area.trim();
    var str_newData,str_oldData;

    /***************check old data with new data ***********/
    if(this.strCubicleName.trim()  != this.strOldCubicleName.trim() )
    {
      str_newData ="CubicleName:"+ this.strCubicleName;
      str_oldData ="CubicleName:"+ this.strOldCubicleName;
    }
    if(this.strCubicleType.trim()  != this.strOldCubicleType.trim() )
    {
      str_newData +=" CubicleType:"+ this.strCubicleType;
      str_oldData +=" CubicleType:"+ this.strOldCubicleType;
    }
    if(this.strMachineID.trim()  != this.strOldMachineID.trim() )
    {
      str_newData +=" "+ this.str_machineCode +":"+ this.strMachineID;
      str_oldData +=" "+ this.str_machineCode +":"+ this.strOldMachineID;
    }
    if(this.intIdsNo  != this.intOldIdsNo)
    {
      str_newData +=" IDSNo:"+ this.intIdsNo;
      str_oldData +=" IDSNo"+ this.intOldIdsNo;
    }
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
     const str_action = "Update";
     const str_userID = this.sessionStorage.retrieve("userId");
     const str_userName = this.sessionStorage.retrieve("userName");
     /**End Audit Trail Data */

      /**Activity Log */
      const str_activity = "Area Setting Updated";
      /**End Activity Log */

     this.obj_submitData =
     {
       "Sys_CubicNo": this.intCubicleNo,
       "Sys_CubicName":this.strCubicleName,
       "Sys_IDSNo":this.intIdsNo,
       "Sys_MachineCode": this.strMachineID,
       "Sys_CubType": this.strCubicleType,
       "Sys_RotaryType": this.str_rotaryType,
       "Sys_Area": strAreaName,
       "Act": str_action,
       "Remark": str_remark,
       "OldData": str_oldData,
       "NewData": str_newData,
       "username": str_userName,
       "userid": str_userID,
       "activitylog": str_activity
     };
     const data:Object={};
     Object.assign(data,this.obj_submitData);
     return data;
  }


  onReset()
  {
    this.bln_showHideTable = false;
    this.frm_areaSetting.reset();
  }

}
