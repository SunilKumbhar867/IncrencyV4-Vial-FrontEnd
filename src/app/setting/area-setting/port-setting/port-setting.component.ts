import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { JsonDataService } from '../../../services/commonData/json-data.service';
import { SettingService } from '../../../services/setting/setting.service';
import { HttpService } from '../../../services/http/http.service';
import { SessionStorageService } from 'ngx-webstorage';
import { ErrorHandlingService } from '../../../services/error-handling/error-handling.service';
import { RemarkComponent } from '../../../shared/remark/remark/remark.component';
import { NotificationService } from '../../../services/notification/notification.service';
declare var swal: any;
@Component({
  selector: 'app-port-setting',
  templateUrl: './port-setting.component.html',
  styleUrls: ['./port-setting.component.css']
})
export class PortSettingComponent implements OnInit {
  int_idsPortNo = [101,102,103,104];

  str_AreaName: string = '';
  str_cubicleName: string = '';
  int_idsNo: number;
  int_cubicleNo: number;
  int_locked: number;
  str_balanceMenu: string;
  str_vernierMenu: string;
  str_eqpT_Port1: string;
  str_eqpT_Port2: string;
  str_eqpT_Port3: string;
  str_eqpT_Port4: string;
  str_eqp_balid: string;
  str_eqp_verid: string;
  str_eqp_hardid: string;
  str_eqp_friid: string;
  str_eqp_tdid: string;
  str_eqp_dtid: string;
  str_eqp_ssid: string;
  str_eqp_lodid: string;
  int_locked1: number;

  str_instrumentID_1:string;
  str_instrumentID_2:string;
  str_instrumentID_3:string;
  str_instrumentID_4:string;
  str_instrumentIDs_1:Array<string> =[];
  str_instrumentIDs_2:Array<string> =[];
  str_instrumentIDs_3:Array<string> =[];
  str_instrumentIDs_4:Array<string> =[];

  sarr_allEquipmentType_1:Array<string> =[];
  sarr_allEquipmentType_2:Array<string> =[];
  sarr_allEquipmentType_3:Array<string> =[];
  sarr_allEquipmentType_4:Array<string> =[];

  sarr_getEquipmentType = [];
  sarr_balanceID = [];
  sarr_balanceIDFromBalTable = [];
  sarr_balanceCubData = [];
  sarr_vernierID = [];
  sarr_vernierIDFromVerTable = [];
  sarr_vernierCubData = [];
  sarr_hardID = [];
  sarr_hardCubData = [];
  sarr_friID = [];
  sarr_friCubData = [];
  sarr_DTID = [];
  sarr_DTCubData = [];
  sarr_TDID = [];
  sarr_TDCubData = [];
  sarr_LODID = [];
  sarr_LODCubData = [];
  sarr_SSID = [];
  sarr_SSCubData = [];
  sarr_hardIDFromTable = [];
  sarr_friIDFromTable = [];
  sarr_DTIDFromTable = [];
  sarr_TDIDFromTable = [];
  sarr_LODIDFromTable = [];
  sarr_SSIDFromTable = [];
  sarr_None = [];
  sarr_allTypes = [];

  bln_disable_port1:boolean = false;
  bln_disable_port2:boolean = false;
  bln_disable_port3:boolean = false;
  bln_disable_port4:boolean = false;
  bln_weighingStatus:boolean = false;
  bln_batchRunning:boolean = false;
  bln_Loading: boolean;
  bln_isRemarkPopupOpened: boolean;

  obj_submitData: any;
  objarr_apiSubmitData: any;

  int_Length: any;

  frm_portSetting = this.fb.group({
    str_cubicle_areaName: [''],
    str_cubicle_cubicleName: [''],
    int_cubicle_idsNo: [''],
    int_eqpType_Port1: [''],
    int_eqpType_Port2: [''],
    int_eqpType_Port3: [''],
    int_eqpType_Port4: [''],
    str_eqpId_Port1: [''],
    str_eqpId_Port2: [''],
    str_eqpId_Port3: [''],
    str_eqpId_Port4: ['']
  });

  constructor(private dialogRef: MatDialogRef<PortSettingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private fb ?: FormBuilder,
    private jsonData ?: JsonDataService,private settingservice ?: SettingService,
    private http ?: HttpService,private sessionStorage?: SessionStorageService,
    private errorHandling?: ErrorHandlingService,private dialog?: MatDialog,
    private notifyService ?: NotificationService) { }

  ngOnInit()
  {
    this.commonCode();
  }

  async getCubiclesData()
  {
    const res = await this.settingservice.getCubicle();
    return res;
  }

  commonCode()
  {
    this.blankArray();

    this.str_AreaName = this.data.str1;
    this.str_cubicleName = this.data.str2;
    this.int_cubicleNo = this.data.str3;
    this.int_locked = this.data.str4;

    this.getWeighingStatus();

    //Validations
    this.settingservice.getBatches().then((res:any) =>{
      this.int_Length = res.filter((x:any) => ((x.CubicNo == this.int_cubicleNo) && ((x.Status == "S") || (x.Status == "R"))));
      this.int_Length.length > 0 ? this.bln_batchRunning = true : this.bln_batchRunning = false;

      if(this.bln_weighingStatus == true)
      {
        this.notifyService.showErrorWithTimeout("Weighment is in process!","Oops!");
      }
      else if(this.bln_batchRunning == true)
      {
        this.notifyService.showInfoWithTimeout("Batch is in running state!","");
      }

    });


    //get cubicle data from API
    this.getCubiclesData().then((res : any)=> {
      const cubicleData= res.filter((x:any) => x.Sys_CubicName != "NULL");
      const dataOnCubicleNo= res.filter((y:any) => y.Sys_CubicNo == this.int_cubicleNo);

      cubicleData.forEach(element => {
          this.sarr_balanceCubData.push(element.Sys_BalID);
          this.sarr_vernierCubData.push(element.Sys_VernierID);
          this.sarr_hardCubData.push(element.Sys_HardID);
          this.sarr_friCubData.push(element.Sys_FriabID);
          this.sarr_DTCubData.push(element.Sys_DTID);
          this.sarr_TDCubData.push(element.Sys_TapDensityID);
          this.sarr_LODCubData.push(element.Sys_MoistID);
          this.sarr_SSCubData.push(element.Sys_SieveShakerID);
      });

      dataOnCubicleNo.forEach(element => {
         this.int_idsNo = element.Sys_PortNo;
         this.str_eqpT_Port1 = element.Sys_Port1;
         this.str_eqpT_Port2 = element.Sys_Port2;
         this.str_eqpT_Port3 = element.Sys_Port3;
         this.str_eqpT_Port4 = element.Sys_Port4;
         this.str_eqp_balid =  element.Sys_BalID;
         this.str_eqp_verid = element.Sys_VernierID;
         this.str_eqp_hardid = element.Sys_HardID;
         this.str_eqp_friid = element.Sys_FriabID;
         this.str_eqp_tdid = element.Sys_TapDensityID;
         this.str_eqp_dtid = element.Sys_DTID;
         this.str_eqp_ssid = element.Sys_SieveShakerID;
         this.str_eqp_lodid = element.Sys_MoistID;
         this.int_locked1 = element.locked;
      });

      this.getEquipmentType(this.int_idsNo);

      this.getBalanceIDFromBalanceMaster(); //get Data from balance table
      this.getVernierIDFromVernierMaster(); //get Data from Vernier table
      this.getEqpIDFromOtherEquipmentTable();//get Data from Other Equipment table

      this.disablePortNo(this.int_idsNo,0);
      //fill database ids
      this.str_instrumentID_1 = this.setEquipmentID(this.str_eqpT_Port1);
      this.str_instrumentID_2 = this.setEquipmentID(this.str_eqpT_Port2);
      this.str_instrumentID_3 = this.setEquipmentID(this.str_eqpT_Port3);
      this.str_instrumentID_4 = this.setEquipmentID(this.str_eqpT_Port4);

      //fill array master table ids
      this.str_instrumentIDs_1 = this.setEquipmentIDs(this.str_eqpT_Port1);
      this.str_instrumentIDs_2 = this.setEquipmentIDs(this.str_eqpT_Port2);
      this.str_instrumentIDs_3 = this.setEquipmentIDs(this.str_eqpT_Port3);
      this.str_instrumentIDs_4 = this.setEquipmentIDs(this.str_eqpT_Port4);

      this.frm_portSetting.setValue({
        str_cubicle_areaName: this.str_AreaName,
        str_cubicle_cubicleName: this.str_cubicleName,
        int_cubicle_idsNo: this.int_idsNo,
        int_eqpType_Port1: this.str_eqpT_Port1,
        int_eqpType_Port2: this.str_eqpT_Port2,
        int_eqpType_Port3: this.str_eqpT_Port3,
        int_eqpType_Port4: this.str_eqpT_Port4,
        str_eqpId_Port1: this.str_instrumentID_1,
        str_eqpId_Port2: this.str_instrumentID_2,
        str_eqpId_Port3: this.str_instrumentID_3,
        str_eqpId_Port4: this.str_instrumentID_4
      });

       if(this.int_locked == 1 || this.int_locked1 == 1)
      {
        this.notifyService.showWarningWithTimeout('Cubicle is locked from another terminal!', "Alert!");
      }

     }).catch(err => {
      console.log(err)
    });

  }

  blankArray()
  {
    this.sarr_balanceCubData = [];
    this.sarr_vernierCubData = [];
    this.sarr_hardCubData = [];
    this.sarr_friCubData = [];
    this.sarr_DTCubData = [];
    this.sarr_TDCubData = [];
    this.sarr_LODCubData = [];
    this.sarr_SSCubData = [];
  }

  getWeighingStatus()
  {
    this.settingservice.getWeighingStatus().subscribe(
      (datas: any[]) =>
      {
        this.int_Length = datas.filter((x:any) => (x.CubicleNo == this.int_cubicleNo) && (x.Status == "1"));
        this.int_Length.length > 0 ? this.bln_weighingStatus = true : this.bln_weighingStatus = false;
      },
      (error) => console.log("Port Setting : Weighing status not found")
      );
  }

  setEquipmentID(strEqpType:string)
  {
    switch(strEqpType)
    {
      case "Balance" :
      {
        var str_instrumentID = this.str_eqp_balid;
        break;
      }
      case "Vernier" :
      {
        var str_instrumentID = this.str_eqp_verid;
        break;
      }
      case "Hardness" :
      {
        var str_instrumentID = this.str_eqp_hardid;
        break;
      }
      case "Disintegration Tester" :
      {
        var str_instrumentID = this.str_eqp_dtid;
        break;
      }
      case "Friabilator" :
      {
        var str_instrumentID = this.str_eqp_friid;
        break;
      }
      case "Moisture Analyzer" :
      {
        var str_instrumentID = this.str_eqp_lodid;
        break;
      }
      case "Tapped Density" :
      {
        var str_instrumentID = this.str_eqp_tdid;
        break;
      }
      case "Sieve Shaker" :
      {
        var str_instrumentID = this.str_eqp_ssid;
        break;
      }
      default:
      {
        var str_instrumentID = "None";
        break;
      }
    }
    return str_instrumentID;
  }

  setEquipmentIDs(strEqpType:string)
  {
    switch(strEqpType)
    {
      case "Balance" :
      {
        var str_instrumentIDs = this.sarr_balanceID;
        break;
      }
      case "Vernier" :
      {
        var str_instrumentIDs = this.sarr_vernierID;
        break;
      }
      case "Hardness" :
      {
        var str_instrumentIDs = this.sarr_hardID;
        break;
      }
      case "Disintegration Tester" :
      {
        var str_instrumentIDs = this.sarr_DTID;
        break;
      }
      case "Friabilator" :
      {
        var str_instrumentIDs = this.sarr_friID;
        break;
      }
      case "Moisture Analyzer" :
      {
        var str_instrumentIDs = this.sarr_LODID;
        break;
      }
      case "Tapped Density" :
      {
        var str_instrumentIDs = this.sarr_TDID;
        break;
      }
      case "Sieve Shaker" :
      {
        var str_instrumentIDs = this.sarr_SSID;
        break;
      }
      default:
      {
        this.sarr_None = [];
        this.sarr_None.push("None");
        var str_instrumentIDs = this.sarr_None;
        break;
      }
    }
    return str_instrumentIDs;
  }

  getEquipmentType(int_portNo: any)
  {
    this.sarr_getEquipmentType = [];
    this.sarr_allEquipmentType_1 = [];
    this.sarr_allEquipmentType_2 = [];
    this.sarr_allEquipmentType_3 = [];
    this.sarr_allEquipmentType_4 = [];

    this.jsonData.getValueFromJSON().then((res: any) => {
      const sarr_getJsonObjectBalance = res.Balance[6].Value;//get balance menu
      if(sarr_getJsonObjectBalance == 1)
      {
        this.str_balanceMenu = "Balance";
      }else
      {
        this.str_balanceMenu = "";
      }

      const sarr_getJsonObjectVernier = res.Vernier[0].Value;//get Vernier menu
      if(sarr_getJsonObjectVernier == 1)
      {
        this.str_vernierMenu = "Vernier";
      }else
      {
        this.str_vernierMenu = "";
      }

      const sarr_getJsonObjectEqpType = res.Equipment.filter((x:any) => x.Value == 1);
      sarr_getJsonObjectEqpType.forEach(element => {
        this.sarr_getEquipmentType.push(element.Name);
      });

      if(int_portNo == 104)
      {
        this.sarr_allEquipmentType_1.push("None",this.str_balanceMenu);
        this.sarr_allEquipmentType_2.push("None",this.str_vernierMenu);
        this.sarr_allEquipmentType_3.push("None",...this.sarr_getEquipmentType);
        this.sarr_allEquipmentType_4.push("None",...this.sarr_getEquipmentType);
      }
      else if(int_portNo == 103)
      {
        this.sarr_allEquipmentType_1.push("None",this.str_balanceMenu);
        this.sarr_allEquipmentType_2.push("None",this.str_vernierMenu);
        this.sarr_allEquipmentType_3.push("None",...this.sarr_getEquipmentType);
        this.sarr_allEquipmentType_4.push("None");
      }
      else if(int_portNo == 102)
      {
        this.sarr_allEquipmentType_1.push("None",this.str_balanceMenu,this.str_vernierMenu,...this.sarr_getEquipmentType);
        this.sarr_allEquipmentType_2.push("None",this.str_balanceMenu,this.str_vernierMenu,...this.sarr_getEquipmentType);
        this.sarr_allEquipmentType_3.push("None");
        this.sarr_allEquipmentType_4.push("None");
      }
      else if(int_portNo == 101)
      {
        this.sarr_allEquipmentType_1.push("None",this.str_balanceMenu,this.str_vernierMenu,...this.sarr_getEquipmentType);
        this.sarr_allEquipmentType_2.push("None");
        this.sarr_allEquipmentType_3.push("None");
        this.sarr_allEquipmentType_4.push("None");
      }
    }).catch(err => {
      console.log(err)
    });
  }

  disablePortNo(intportNo:number,isSelected:number)
  {
     if(intportNo == 101)
     {
      this.bln_disable_port1 = false;
      this.bln_disable_port2 = true;
      this.bln_disable_port3 = true;
      this.bln_disable_port4 = true;
     }
     else if(intportNo == 102)
     {
      this.bln_disable_port1 = false;
      this.bln_disable_port2 = false;
      this.bln_disable_port3 = true;
      this.bln_disable_port4 = true;
     }
     else if(intportNo == 103)
     {
      this.bln_disable_port1 = false;
      this.bln_disable_port2 = false;
      this.bln_disable_port3 = false;
      this.bln_disable_port4 = true;
     }
     else if(intportNo == 104)
     {
      this.bln_disable_port1 = false;
      this.bln_disable_port2 = false;
      this.bln_disable_port3 = false;
      this.bln_disable_port4 = false;
     }

     if(isSelected == 1)
     {
       this.setAllNone();
     }
  }
  setAllNone()
  {
    this.str_instrumentIDs_1 = this.setEquipmentIDs("None");
    this.str_instrumentIDs_2 = this.setEquipmentIDs("None");
    this.str_instrumentIDs_3 = this.setEquipmentIDs("None");
    this.str_instrumentIDs_4 = this.setEquipmentIDs("None");

    this.frm_portSetting.patchValue({
      int_eqpType_Port1: "None",
      int_eqpType_Port2: "None",
      int_eqpType_Port3: "None",
      int_eqpType_Port4: "None",
      str_eqpId_Port1: "None",
      str_eqpId_Port2: "None",
      str_eqpId_Port3: "None",
      str_eqpId_Port4: "None"
    });
  }
  cboidsNo_getData(event:any)
  {
    this.getEquipmentType(event);
    this.disablePortNo(event,1);
  }

  onClose()
  {
    this.notifyService.hideErrorToast()
    this.notifyService.hideInfoToast();
    this.notifyService.hideWarningToast();
    this.dialogRef.close();
  }

  getBalanceIDFromBalanceMaster()
  {
    this.sarr_balanceID = [];
    this.sarr_balanceIDFromBalTable = [];

    this.http.getMethod('balance/getBalanceDetails').subscribe((res:any)=>{

      /** Product is active and not locked from another terminal */
      const str_balanceData = res.result.filter((x:any) => (x.Bal_isActivate == 1) && (x.IsBinBalance == 0) && (x.locked == 0));
      str_balanceData.forEach(element => {
        this.sarr_balanceIDFromBalTable.push(element.Bal_ID);
      });

      let str_balID = this.sarr_balanceIDFromBalTable.filter((i:any) => this.sarr_balanceCubData.indexOf(i) < 0);
      (this.sarr_balanceIDFromBalTable.length > 0) ? this.sarr_balanceID.push(this.str_eqp_balid,...str_balID): this.sarr_balanceID.push(this.str_eqp_balid);
      if(this.sarr_balanceID.includes("None") == false)
      {
        this.sarr_balanceID.push("None");
      }
    });
  }

  getVernierIDFromVernierMaster()
  {
    this.sarr_vernierID = [];
    this.sarr_vernierIDFromVerTable = [];

    this.http.getMethod('vernier/getVernier').subscribe((res:any)=>{
      const str_vernierData = res.filter((x:any) => (x.Ver_IsActivate == 1) && (x.locked == 0));
      str_vernierData.forEach(element => {
        this.sarr_vernierIDFromVerTable.push(element.VernierID);
      });
      let str_verID = this.sarr_vernierIDFromVerTable.filter((i:any) => this.sarr_vernierCubData.indexOf(i) < 0);
      (this.sarr_vernierIDFromVerTable.length > 0) ? this.sarr_vernierID.push(this.str_eqp_verid,...str_verID): this.sarr_vernierID.push(this.str_eqp_verid);
      if(this.sarr_vernierID.includes("None") == false)
      {
        this.sarr_vernierID.push("None");
      }
    });
  }

  getEqpIDFromOtherEquipmentTable()
  {
    this.sarr_hardID = [];
    this.sarr_friID = [];
    this.sarr_DTID = [];
    this.sarr_TDID = [];
    this.sarr_LODID = [];
    this.sarr_SSID = [];
    this.sarr_hardIDFromTable = [];
    this.sarr_DTIDFromTable = [];
    this.sarr_friIDFromTable = [];
    this.sarr_TDIDFromTable = [];
    this.sarr_LODIDFromTable = [];
    this.sarr_SSIDFromTable = [];

    this.http.getMethod('otherequipment/getOtherEquipment').subscribe((res:any)=>{

      const str_allEqpData = res.result.filter((x:any) => (x.Eqp_Active == 1) && (x.locked == 0));

      str_allEqpData.forEach(element => {
      if(element.Eqp_Type == "Hardness")
      {
        this.sarr_hardIDFromTable.push(element.Eqp_ID);
      }
      else if(element.Eqp_Type == "Friabilator")
      {
        this.sarr_friIDFromTable.push(element.Eqp_ID);
      }
      else if(element.Eqp_Type == "Disintegration Tester")
      {
        this.sarr_DTIDFromTable.push(element.Eqp_ID);
      }
      else if(element.Eqp_Type == "Moisture Analyzer")
      {
        this.sarr_LODIDFromTable.push(element.Eqp_ID);
      }
      else if(element.Eqp_Type == "Tapped Density")
      {
        this.sarr_TDIDFromTable.push(element.Eqp_ID);
      }
      else if(element.Eqp_Type == "Sieve Shaker")
      {
        this.sarr_SSIDFromTable.push(element.Eqp_ID);
      }
      });

      let str_hardID = this.sarr_hardIDFromTable.filter((i:any) => this.sarr_hardCubData.indexOf(i) < 0);
      (this.sarr_hardIDFromTable.length > 0) ? this.sarr_hardID.push(this.str_eqp_hardid,...str_hardID): this.sarr_hardID.push(this.str_eqp_hardid);
      if(this.sarr_hardID.includes("None") == false)
      {
        this.sarr_hardID.push("None");
      }

      let str_friID = this.sarr_friIDFromTable.filter((i:any) => this.sarr_friCubData.indexOf(i) < 0);
      (this.sarr_friIDFromTable.length > 0) ? this.sarr_friID.push(this.str_eqp_friid,...str_friID): this.sarr_friID.push(this.str_eqp_friid);
      if(this.sarr_friID.includes("None") == false)
      {
        this.sarr_friID.push("None");
      }

      let str_DTID = this.sarr_DTIDFromTable.filter((i:any) => this.sarr_DTCubData.indexOf(i) < 0);
      (this.sarr_DTIDFromTable.length > 0) ? this.sarr_DTID.push(this.str_eqp_dtid,...str_DTID) : this.sarr_DTID.push(this.str_eqp_dtid);
      if(this.sarr_DTID.includes("None") == false)
      {
        this.sarr_DTID.push("None");
      }

      let str_TDID = this.sarr_TDIDFromTable.filter((i:any) => this.sarr_TDCubData.indexOf(i) < 0);
      (this.sarr_TDIDFromTable.length > 0) ? this.sarr_TDID.push(this.str_eqp_tdid,...str_TDID) : this.sarr_TDID.push(this.str_eqp_tdid);
      if(this.sarr_TDID.includes("None") == false)
      {
        this.sarr_TDID.push("None");
      }

      let str_LODID = this.sarr_LODIDFromTable.filter((i:any) => this.sarr_LODCubData.indexOf(i) < 0);
      (this.sarr_LODIDFromTable.length > 0) ? this.sarr_LODID.push(this.str_eqp_lodid,...str_LODID) : this.sarr_LODID.push(this.str_eqp_lodid);
      if(this.sarr_LODID.includes("None") == false)
      {
        this.sarr_LODID.push("None");
      }

      let str_SSID = this.sarr_SSIDFromTable.filter((i:any) => this.sarr_SSCubData.indexOf(i) < 0);
      (this.sarr_SSIDFromTable.length > 0) ? this.sarr_SSID.push(this.str_eqp_ssid,...str_SSID) : this.sarr_SSID.push(this.str_eqp_ssid);
      if(this.sarr_SSID.includes("None") == false)
      {
        this.sarr_SSID.push("None");
      }
    });
  }

  cmbEqpType_Port1_fillId(str_eqpType: any)
  {
    this.str_instrumentIDs_1 = [];
    this.frm_portSetting.patchValue({str_eqpId_Port1: "None"});
    if(str_eqpType  == "None")
    {
      this.str_instrumentIDs_1 = ["None"];
    }
    else
    {
      this.str_instrumentIDs_1 = this.setEquipmentIDs(str_eqpType);
    }
  }
  cmbEqpType_Port2_fillId(str_eqpType: any)
  {
    this.str_instrumentIDs_2 = [];
    this.frm_portSetting.patchValue({str_eqpId_Port2: "None"});
    if(str_eqpType  == "None")
    {
      this.str_instrumentIDs_2 = ["None"];
    }
    else
    {
      this.str_instrumentIDs_2 = this.setEquipmentIDs(str_eqpType);
    }
  }
  cmbEqpType_Port3_fillId(str_eqpType: any)
  {
    this.str_instrumentIDs_3 = [];
    this.frm_portSetting.patchValue({str_eqpId_Port3: "None"});
    if(str_eqpType  == "None")
    {
      this.str_instrumentIDs_3 = ["None"];
    }
    else
    {
      this.str_instrumentIDs_3 = this.setEquipmentIDs(str_eqpType);
    }
  }
  cmbEqpType_Port4_fillId(str_eqpType: any)
  {
    this.str_instrumentIDs_4 = [];
    this.frm_portSetting.patchValue({str_eqpId_Port4: "None"});
    if(str_eqpType  == "None")
    {
      this.str_instrumentIDs_4 = ["None"];
    }
    else
    {
      this.str_instrumentIDs_4 = this.setEquipmentIDs(str_eqpType);
    }
  }

  onSubmit()
  {
    var int_portNo = this.frm_portSetting.value.int_cubicle_idsNo;
    var str_Type1 = this.frm_portSetting.value.int_eqpType_Port1;
    var str_Type2 = this.frm_portSetting.value.int_eqpType_Port2;
    var str_Type3 = this.frm_portSetting.value.int_eqpType_Port3;
    var str_Type4 = this.frm_portSetting.value.int_eqpType_Port4;

    var str_ID1 = this.frm_portSetting.value.str_eqpId_Port1;
    var str_ID2 = this.frm_portSetting.value.str_eqpId_Port2;
    var str_ID3 = this.frm_portSetting.value.str_eqpId_Port3;
    var str_ID4 = this.frm_portSetting.value.str_eqpId_Port4;
    var int_cnt_same = 0;

    //check duplicate equipment type
    this.sarr_allTypes = [str_Type1,str_Type2,str_Type3,str_Type4];

    this.sarr_allTypes.filter(function(elem, index, self) {
     if((index != self.indexOf(elem))  && (elem != "None"))
     {
         int_cnt_same = int_cnt_same + 1;
     }
      });

    if((int_portNo == this.int_idsNo) && (str_Type1.trim() == this.str_eqpT_Port1.trim())
    && (str_Type2.trim() == this.str_eqpT_Port2.trim()) && (str_Type3.trim() == this.str_eqpT_Port3.trim())
    && (str_Type4.trim() == this.str_eqpT_Port4.trim()) && (str_ID1.trim() == this.str_instrumentID_1.trim())
    && (str_ID2.trim() == this.str_instrumentID_2.trim()) && (str_ID3.trim() == this.str_instrumentID_3.trim())
    && (str_ID4.trim() == this.str_instrumentID_4.trim()))
    {
      swal({
        title: "No Change!",
        text: "",
        type: "error",
        allowOutsideClick: false,
      });
    }
    else if((str_Type1.trim() == "None") && (str_Type2.trim() == "None") &&
    (str_Type3.trim() == "None") && (str_Type4.trim() == "None"))
    {
      swal({
        title: "Please select atleast one instrument!",
        text: "",
        type: "error",
        allowOutsideClick: false,
      });
    }
    else if(int_cnt_same >= 1)
    {
      swal({
        title: "Instrument Type can not be same!",
        text: "",
        type: "error",
        allowOutsideClick: false,
      });
    }
    else
    {
      swal({
        title: 'Are you sure ?',
        text: "Do you want to save changes of " +  this.frm_portSetting.value.str_cubicle_areaName + "?",
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
        const message = { message : 'Port setting' };
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
            console.log(JSON.stringify(obj_dataToSend));
            this.bln_Loading = true;
            this.http.postMethod('port/update', obj_dataToSend).subscribe(res=>{
            this.bln_Loading = false;
            this.objarr_apiSubmitData = res;
             if (this.objarr_apiSubmitData.result === 'Port Setting Updated Successfully.') {
              swal({
                title: "Port Setting save Successfully!",
                text: "",
                type: "success",
                allowOutsideClick: false,
                },);
                this.onClose();
            }
            else
            {
              swal({
                title: "Can not doing port setting, Try again!",
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
  }

  getDataToSendOnSubmit(str_remark:any)
  {
    var int_portNo = this.frm_portSetting.value.int_cubicle_idsNo;
    var str_Type1 = this.frm_portSetting.value.int_eqpType_Port1;
    var str_Type2 = this.frm_portSetting.value.int_eqpType_Port2;
    var str_Type3 = this.frm_portSetting.value.int_eqpType_Port3;
    var str_Type4 = this.frm_portSetting.value.int_eqpType_Port4;

    var str_ID1 = this.frm_portSetting.value.str_eqpId_Port1;
    var str_ID2 = this.frm_portSetting.value.str_eqpId_Port2;
    var str_ID3 = this.frm_portSetting.value.str_eqpId_Port3;
    var str_ID4 = this.frm_portSetting.value.str_eqpId_Port4;

    var str_newData = "",str_oldData = "";

    /***************check old data with new data ***********/
    if(int_portNo  != this.int_idsNo)
    {
      str_newData ="IDSPort :"+ int_portNo;
      str_oldData ="IDSPort:"+ this.int_idsNo;
    }
    if(str_Type1 != this.str_eqpT_Port1)
    {
      str_newData +=" Type-Port1:"+ str_Type1;
      str_oldData +=" Type-Port1:"+ this.str_eqpT_Port1;
    }
    if(str_Type2  != this.str_eqpT_Port2)
    {
      str_newData +=" Type-Port2:"+ str_Type2;
      str_oldData +=" Type-Port2:"+ this.str_eqpT_Port2;
    }
    if(str_Type3  != this.str_eqpT_Port3)
    {
      str_newData +=" Type-Port3:"+ str_Type3;
      str_oldData +=" Type-Port3:"+ this.str_eqpT_Port3;
    }
    if(str_Type4  != this.str_eqpT_Port4)
    {
      str_newData +=" Type-Port4:"+ str_Type4;
      str_oldData +=" Type-Port4:"+ this.str_eqpT_Port4;
    }
    if(str_ID1 != this.str_instrumentID_1)
    {
      str_newData +=" Code No.-Port1:"+ str_ID1;
      str_oldData +=" Code No.-Port1:"+ this.str_instrumentID_1;
    }
    if(str_ID2  != this.str_instrumentID_2)
    {
      str_newData +=" Code No.-Port2:"+ str_ID2;
      str_oldData +=" Code No.-Port2:"+ this.str_instrumentID_2;
    }
    if(str_ID3 != this.str_instrumentID_3)
    {
      str_newData +=" Code No.-Port3:"+ str_ID3;
      str_oldData +=" Code No.-Port3:"+ this.str_instrumentID_3;
    }
    if(str_ID4  != this.str_instrumentID_4)
    {
      str_newData +=" Code No.-Port4:"+ str_ID4;
      str_oldData +=" Code No.-Port4:"+ this.str_instrumentID_4;
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
      const str_activity = "Port Setting Updated";
      /**End Activity Log */

     this.obj_submitData =
     {
       "area": this.str_AreaName.trim(),
       "cubicleName": this.str_cubicleName.trim(),
       "Sys_CubicNo": this.int_cubicleNo,
       "Sys_PortNo":int_portNo,
       "Sys_Port1": str_Type1,
       "Sys_Port2": str_Type2,
       "Sys_Port3": str_Type3,
       "Sys_Port4": str_Type4,
       "Sys_Port1_ID": str_ID1,
       "Sys_Port2_ID": str_ID2,
       "Sys_Port3_ID": str_ID3,
       "Sys_Port4_ID": str_ID4,
       "prev_Port1": this.str_eqpT_Port1,
       "prev_Port2": this.str_eqpT_Port2,
       "prev_Port3": this.str_eqpT_Port3,
       "prev_Port4": this.str_eqpT_Port4,
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
}
