import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { ConfigService } from '../configuration/config.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  objarr_APIData: any;
  obj_LockedData: any;
  obj_Nomenclatures : any;
  objArr_APIResult: any;

  sarr_deptName: Array<string> = [];
  sarr_Nomenclature: Array<string> = [];

  constructor(private http: HttpService, private jsonService: ConfigService) { }

  /************** Function Detail ************/
  //This function is used to get list of department name
  //From tbl_department table of database
  /************End Function Detail ***********/
  getDepartmentName() {
    this.sarr_deptName=[];
    this.http.getMethod('department/getDepartments').subscribe((res:any)=>{
      for(let i=0;i<Object.keys(res.result).length;i++){
        this.sarr_deptName.push(res.result[i].department_name);
      }
    });
    return  this.sarr_deptName;
  }

  /**
   * This function is used to update locked status on edit button in database table
   *  one id will be edited someone then other user can not edit same id
   *  user id ,type(table name),field name(dbColName) is inserted in tbl_edit_status table.
   * int_lockedColumnValue :- 0:-unLocked(can edit) and 1:-Locked(can not edit)
   * Function locks or release
   * @param str_userid Logged in userId
   * @param str_dbTableName Table name in which want to set locked
   * @param str_columnName Where condition column name
   * @param str_inputValue Where condition column value
   * @param str_lockedColumnName Locked column name
   * @param int_lockedColumnValue Locked column value
   * @returns Promise
   */
  setLocked(str_userid: any,str_dbTableName: string, str_columnName: string, str_inputValue: any,
    str_lockedColumnName: string,int_lockedColumnValue: any) {
    return new Promise((resolve, reject) => {
      this.obj_LockedData =
      {
        userID: str_userid,
        Type: str_dbTableName,
        dbColName: str_columnName,
        commonValue: str_inputValue,
        lockedColName: str_lockedColumnName,
        lockedValue: int_lockedColumnValue
      };
      //console.log(JSON.stringify(this.obj_LockedData));
      this.http.postMethod('editstatus/editstatus', this.obj_LockedData).subscribe(res => {
        this.objArr_APIResult = res;
        const sarr_result = this.objArr_APIResult.result;
        resolve(sarr_result.result);
      }, err => {
        reject('Error occured')
      })
    })
  }
  /**
   * Function used to set locked for multiple where condition on edit button in database table
   * one id will be edited someone then other user can not edit same id
   * user id ,type(table name),field name is inserted in tbl_edit_status table.
   * int_lockedColumnValue :- `0:-unLocked(can edit)` and `1:-Locked(can not edit)`
   * Function locks or release
   *
   * @param str_userid Looged in User Id
   * @param str_dbTableName Table name in which want to set locked
   * @param arr_Cond where condition array
   * @param str_lockedColumnName Locked column name
   * @param int_lockedColumnValue Locked column value
   * @return Promise
   */
  MultiCondiLocked(str_userid: any, str_dbTableName: string, arr_Cond: Array<object>,
    str_lockedColumnName: string, int_lockedColumnValue: any) {
    return new Promise((resolve, reject) => {
      const obj_LockedData =
        {
          userID: str_userid,
          Type: str_dbTableName,
          arr_Cond: arr_Cond,
          lockedColName: str_lockedColumnName,
          lockedValue: int_lockedColumnValue
        };
      this.http.postMethod('editstatus/multiCondEditStatus', obj_LockedData).subscribe(res => {
        this.objArr_APIResult = res;
        const sarr_result = this.objArr_APIResult.result;
        resolve(sarr_result);
      }, err => {
        reject('Error occured')
      })
    })
  }
  /************** Function Detail ************/
  //This function is used to get list of nomenclature name
  //From tbl_nomenclature table of database
  /************End Function Detail ***********/
  getNomenclatureDetails()
  {
    return new Promise((resolve, reject) => {
      this.http.getMethod('nomenclature/getNomenclatures').subscribe(res => {
        this.obj_Nomenclatures = res;
        this.sarr_Nomenclature = this.obj_Nomenclatures.result;
        resolve(this.sarr_Nomenclature);
      }, err => {
        reject('Error occured')
      })
    })
  }
}
