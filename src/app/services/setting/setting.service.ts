import { Injectable } from '@angular/core';
import { ConfigService } from '../configuration/config.service';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  obj_cubicleType : any;
  obj_cubicleArea : any;
  obj_machine : any;
  obj_batches : any;
  obj_productSample : any;
  obj_batchStatus: any;
  obj_batchMaxStatus: any;
  obj_prdDetail: any;

  sarr_cubicleData: Array<string> = [];
  sarr_cubicleArea: Array<string> = [];
  sarr_machine: Array<string> = [];
  sarr_batches: Array<string> = [];

  constructor(private http: HttpService, private jsonService: ConfigService) { }

   /************** Function Detail ************/
  //This function is used to get list of machine
  //From tbl_machine table of database
  /************End Function Detail ***********/
  getMachine()
  {
    return new Promise((resolve,reject) =>{
      this.http.getMethod('machine/all').subscribe(res =>{
        this.obj_machine = res;
        this.sarr_machine = this.obj_machine;
        resolve(this.sarr_machine);
      },err =>{
        reject('Machine Data not found')
      })
    } )
  }

   /************** Function Detail ************/
  //This function is used to get list of cubicle area
  //From tbl_cubical_area table of database
  /************End Function Detail ***********/
  getCubicleArea()
  {
    return new Promise((resolve,reject) =>{
      this.http.getMethod('cubicle/area/all').subscribe(res =>{
        this.obj_cubicleArea = res;
        this.sarr_cubicleArea = this.obj_cubicleArea.result;
        resolve(this.sarr_cubicleArea);
      },err =>{
        reject('Area not found')
      })
    } )
  }

  /************** Function Detail ************/
  //This function is used to get list of cubicle
  //From tbl_cubical table of database
  /************End Function Detail ***********/
  getCubicle()
  {
    return new Promise((resolve,reject) =>{
      this.http.getMethod('cubicle/all').subscribe(res =>{
        this.obj_cubicleType = res;
        this.sarr_cubicleData = this.obj_cubicleType.result;
        resolve(this.sarr_cubicleData);
      },err =>{
        reject('Cubicle data not found')
      })
    } )
  }
  /************** Function Detail ************/
  //This function is used to get list of batches
  //From tbl_batches table of database
  /************End Function Detail ***********/
  getBatches()
  {
    return new Promise((resolve,reject) =>{
      this.http.getMethod('cubicle/batch/all').subscribe(res =>{
        this.obj_batches = res;
        this.sarr_batches = this.obj_batches.result;
        resolve(this.sarr_batches);
      },err =>{
        reject('Batches not found')
      })
    } );
  }


   /************** Function Detail ************/
  //This function is used to get weighing status detail
  //From tbl_system_weighingStatus table of database
  /************End Function Detail ***********/
  getWeighingStatus()
  {
    return this.http.getMethod("cubicle/wgmtStatus").map(
      (res:any)=>{
        const data = res.result;
        return data;
      });
  }
     /************** Function Detail ************/
  //This function is used to get quantity detail
  //From tbl_cubicle_product_sample table of database
  /************End Function Detail ***********/
  getProductSample(int_cubicleNo: number)
  {
    return new Promise((resolve, reject) => {
      this.obj_productSample =
      {
        "intCubicleNo":int_cubicleNo
      };

      this.http.postMethod('cubicle/ProductSamples', this.obj_productSample).subscribe((res:any) => {
        const sarr_result = res.result[0];
        resolve(sarr_result);
      }, err => {
        reject('Error occured')
      })
    })
  }

    /************** Function Detail ************/
  //This function is used to get maximum batch status detail
  //From tbl_batches table of database
  /************End Function Detail ***********/
  getMaxBatchStatus(int_cubicleNo: number)
  {
    return new Promise((resolve, reject) => {
      this.obj_batchStatus =
      {
        "intCubicleNo":int_cubicleNo
      };

      this.http.postMethod('cubicle/batchStatus', this.obj_batchStatus).subscribe((res:any) => {
        const sarr_result = res.result[0];
        resolve(sarr_result);
      }, err => {
        reject('Error occured')
      })
    })
  }

    /************** Function Detail ************/
  //This function is used to get maximum batch status detail of particular batch
  //From tbl_batches table of database
  /************End Function Detail ***********/
  getMaxBatchStatusOfSendBatch(str_Batch: any)
  {
    return new Promise((resolve, reject) => {
      this.obj_batchMaxStatus =
      {
        "strBatch":str_Batch
      };
      this.http.postMethod('cubicle/maxBatchStatus', this.obj_batchMaxStatus).subscribe((res:any) => {
        const sarr_result = res.result[0];
        resolve(sarr_result);
      }, err => {
        reject('Error occured')
      })
    })
  }

    /************** Function Detail ************/
  //This function is used to get product detail cubicle type wise
  //From tbl_product_master table of database
  /************End Function Detail ***********/
  getProductDetails(str_cubicType: string, str_areaName: any)
  {
    return new Promise((resolve, reject) => {
      this.obj_prdDetail =
      {
        "type": str_cubicType,
        "areaName": str_areaName
      };

      this.http.postMethod('product/getProductDetails', this.obj_prdDetail).subscribe((res:any) => {
        const sarr_result = res.result;
        resolve(sarr_result);
      }, err => {
        reject('Error occured')
      })
    })
  }

     /************** Function Detail ************/
  //This function is used to get alert detail
  //From tbl_alert_param_duration table of database
  /************End Function Detail ***********/
  getAlertDurations(int_cubicNo:number)
  {
    return new Promise((resolve, reject) => {
      const obj_alertDetail =
      {
        "CubicNo": int_cubicNo
      };

      this.http.postMethod('alert/get', obj_alertDetail).subscribe((res:any) => {
        const sarr_result = res.result[0];
        resolve(sarr_result);
      }, err => {
        reject('Error occured')
      })
    });
  }
}
