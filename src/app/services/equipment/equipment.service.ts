import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { ConfigService } from '../configuration/config.service';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  sarr_viewResult1: Array<string> = [];
  sarr_viewResult2: Array<string> = [];
  sarr_resultEqpTable: Array<string> = [];
  sarr_resultEqpData: Array<string> = [];

  obj_sendOject: any;
  objArr_APIResult: any;
  obj_calibDetail: any;

  str_colName_Cubical: string;
  int_length: any;

  constructor(private http: HttpService, private jsonService: ConfigService) { }

   /************************Function Detail*********************/
  /* This function is used to get data from database using equipment type.
  /* Get data from both tbl_otherequipment table and tbl_cubical.
  /* Edit :- take data whose id's are not assigned to cubicle
  /* View :- take all data
  /**************End Function Detail***************************/

  getEquipmentData(str_eqpType: string,bln_isEdit: any) {
    this.sarr_resultEqpData = [];
    return new Promise((resolve, reject) => {
      this.obj_sendOject =
      {
        "Eqp_Type": str_eqpType,
        "id": this.getColumnName_Equipment(str_eqpType)
      };
      this.http.postMethod('otherequipment/getDetailData', this.obj_sendOject).subscribe((res:any)=>{
        this.objArr_APIResult = res;
        const sarr_data_CubicTable = this.objArr_APIResult.result2;
        if(bln_isEdit == 0)//edit equipment
        {
          for(let i=0;i<Object.keys(this.objArr_APIResult.result1).length;i++){
              this.int_length = sarr_data_CubicTable.filter(x => x.eqpid === this.objArr_APIResult.result1[i].Eqp_ID);
              if(this.int_length <= 0)
              {
                this.sarr_resultEqpData.push(this.objArr_APIResult.result1[i].Eqp_ID);
              }
          }//end for
        }
        else//view equipment
        {
          this.sarr_viewResult1 = [];
          this.sarr_viewResult2 = [];
          this.sarr_viewResult1.push(this.objArr_APIResult.result1);
          this.sarr_viewResult2.push(this.objArr_APIResult.result2);
          this.sarr_resultEqpData = this.sarr_viewResult1.concat(this.sarr_viewResult2);
        }
        resolve(this.sarr_resultEqpData);
      },err => {
        reject('Error occured')
      })
    });
  }

   /************************Function Detail*********************/
  /* This function is used to send cubicle table column name to
  /*  get data of particular id from tbl_cubical
  /**************End Function Detail***************************/
  getColumnName_Equipment(str_eqpType: string)
  {
    this.str_colName_Cubical = '';
    if(str_eqpType == "Hardness")
    {
      this.str_colName_Cubical = 'Sys_HardID';
    }
    else if(str_eqpType == "Disintegration Tester")
    {
      this.str_colName_Cubical = 'Sys_DTID';
    }
    else if(str_eqpType == "Friabilator")
    {
      this.str_colName_Cubical = 'Sys_FriabID';
    }
    else if(str_eqpType == "Moisture Analyzer")
    {
      this.str_colName_Cubical = 'Sys_MoistID';
    }
    else if(str_eqpType == "Tapped Density")
    {
      this.str_colName_Cubical = 'Sys_TapDensityID';
    }
    else if(str_eqpType == "Sieve Shaker")
    {
      this.str_colName_Cubical = 'Sys_SieveShakerID';
    }
    return this.str_colName_Cubical;
  }

    /************** Function Detail ************/
  //This function is used to get hardness and Ma calibration detail Eqp type,EqpID wise
  //From tbl_Hardness_Weight,tbl_Moitureanalyzer_weight table of database
  /************End Function Detail ***********/
  getCalibrationDetails(str_eqpType: string,str_eqpID: string)
  {
    return new Promise((resolve, reject) => {
      this.obj_calibDetail =
      {
        "type":str_eqpType,
        "ID":str_eqpID
      };

      this.http.postMethod('otherequipment/getweights', this.obj_calibDetail).subscribe((res:any) => {
        const sarr_result = res.result;
        resolve(sarr_result);
      }, err => {
        reject('Error occured')
      })
    })
  }

}
