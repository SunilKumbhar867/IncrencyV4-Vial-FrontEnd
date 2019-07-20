import { Component, OnInit } from '@angular/core';
import { SettingService } from '../../services/setting/setting.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { CubicleFieldsComponent } from './cubicle-fields/cubicle-fields.component';
import { DataService } from '../../services/commonData/data.service';
import { AlertSettingComponent } from './alert-setting/alert-setting.component';

@Component({
  selector: 'app-cubicle-setting',
  templateUrl: './cubicle-setting.component.html',
  styleUrls: ['./cubicle-setting.component.css']
})
export class CubicleSettingComponent implements OnInit {

  sarr_areaName = [];
  sarr_areaWiseDataFromCubicleTable = [];
  sarr_cubicleData: Array<any> = [];
  sarr_cubicleAndBatchData: Array<string> = [];
  str_array_CubicleData: Array<string> = [];

  lbl_productCode: string = '';
  lbl_machineCode: string = '';

  bln_showHideTable : boolean = false;

  frm_sysSetting: FormGroup;

  get str_area()
  {
    return this.frm_sysSetting.get('str_area');
  }
  constructor(private settingservice ?: SettingService, private fb ?: FormBuilder
    ,private dialog?: MatDialog,private dataservice ?: DataService) { }

  ngOnInit()
  {
    this.frm_sysSetting=this.fb.group({
      str_area: ['']
    });

    this.bln_showHideTable = false;
    this.sarr_areaName = [];

     //get Cubicle Area from api
     this.settingservice.getCubicle().then((res:any)=>{
      const str_area = res.filter((x:any) => x.Sys_CubicName != "NULL");
      str_area.forEach(element => {
         this.sarr_areaName.push(element.Sys_Area);
      });
      var reallyUniqueArr = this.sarr_areaName.filter((item, pos, ar) => ar.indexOf(item) === pos)
      this.sarr_areaName = [];
      this.sarr_areaName = reallyUniqueArr;
     });

      //getNomenclature detail from api
      this.dataservice.getNomenclatureDetails().then((res:any)=>{
        this.lbl_productCode = res[0].BFGCode;
        this.lbl_machineCode = res[0].MachineCode;
      });
  }

  cboareaName_fillData(selectedItem: any)
  {
    this.bln_showHideTable = true; //show table
    this.sarr_areaWiseDataFromCubicleTable = [];
    var strBatchStatus = '';

    this.settingservice.getCubicle().then((res:any)=>{
      this.sarr_areaWiseDataFromCubicleTable = res.filter((x:any)=> (x.Sys_Area == selectedItem) && (x.Sys_CubicName != "NULL"));

      this.settingservice.getBatches().then((res:any) =>{

        this.sarr_areaWiseDataFromCubicleTable.forEach(element => {
          const str_batches = res.filter((y:any) => (y.CubicNo == element.Sys_CubicNo));

          if(str_batches.length == 0)
          {
            Object.assign(element,{BatchStatus:"No Batch"});
          }
          else if(str_batches.length == 1)
          {
            strBatchStatus = str_batches[0]['Status'];
            Object.assign(element,{BatchStatus:strBatchStatus});
          }
          else
          {
            if(element.Sys_Batch == "NULL")
            {
              Object.assign(element,{BatchStatus:"No Batch"});
            }
            else
            {
              strBatchStatus = str_batches[str_batches.length-1]['Status'];
              Object.assign(element,{BatchStatus:strBatchStatus});
            }

          }
        });
      });
     // console.log(this.sarr_areaWiseDataFromCubicleTable);
     }).catch(err => {
      console.log(err)
    });
  }


  btnupdate_openComponent(selectedValue: any)
  {
    const str_areaName = this.frm_sysSetting.value.str_area;
    const int_cubicleNo = selectedValue.Sys_CubicNo;
    const str_machineCode = selectedValue.Sys_MachineCode.trim();
    const str_rotaryType = selectedValue.Sys_RotaryType.trim();
    const str_cubicleName = selectedValue.Sys_CubicName.trim();
    const str_cubicleType = selectedValue.Sys_CubType.trim();
    const str_PrdID = selectedValue.Sys_BFGCode;

    const dialogRef = this.dialog.open(CubicleFieldsComponent, {
      width: '1200px',
      height: '640px',
      disableClose: true,
      data:{
        str1:str_areaName, str2:this.lbl_machineCode,
        str3:int_cubicleNo, str4:str_machineCode,
        str5:str_rotaryType, str6:str_cubicleName,
        str7:this.lbl_productCode, str8:str_cubicleType, str9:str_PrdID
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.cboareaName_fillData(str_areaName);
    });
  }

  btnAlert_openComponent(selectedValue: any)
  {
    const str_areaName = this.frm_sysSetting.value.str_area;
    const str_cubicleName = selectedValue.Sys_CubicName.trim();
    const int_cubicleNo = selectedValue.Sys_CubicNo;
    const str_PrdID = selectedValue.Sys_BFGCode;
    const str_batch = selectedValue.Sys_Batch;

    const dialogRef = this.dialog.open(AlertSettingComponent, {
      width: '700px',
      height: '500px',
      disableClose: true,
      data:{
        str1:str_areaName, str2:str_cubicleName, str3:this.lbl_productCode,
        str4:int_cubicleNo, str5:str_PrdID, str6:str_batch
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.cboareaName_fillData(str_areaName);
    });
  }

}
