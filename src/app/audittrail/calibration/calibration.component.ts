import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpService } from '../../services/http/http.service';
import { ErrorHandlingService } from '../../services/error-handling/error-handling.service';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-calibration',
  templateUrl: './calibration.component.html',
  styleUrls: ['./calibration.component.css']
})
export class CalibrationComponent implements OnInit {
  bln_loading: boolean;
  sarr_roleName:Array<any>=[];
  sarr_actions:Array<any>=['All','Add','Edit'];

  // Declaring Reactive Form
  roles = new FormGroup({
    roleName:new FormControl(),
    action:new FormControl(),
    toDate: new FormControl(),
    fromDate: new FormControl(),
  });

  constructor(public fb: FormBuilder, public datePipe: DatePipe,public http:HttpService, private errorHandling?: ErrorHandlingService,private sessionStorage?: SessionStorageService)
  {
    // Initializing Reactive Form & giving validations
    this.roles = this.fb.group({
      roleName: new FormControl('All', [Validators.required]),
      action: new FormControl('All', [Validators.required]),
      toDate: new FormControl('', [Validators.required]),
      fromDate: new FormControl('', [Validators.required]),
    });
    this.getData();
  }

  //Below funtion will return list of all roles
  getData()
  {
    this.bln_loading = true;
    this.http.getMethod('role/getRoleGroup').subscribe((res: any) =>
    {
      this.bln_loading = false;
      const items = [];
      items.push('All');
      for (let i = 0; i < res.result.length; i++)
      {
        items.push(res.result[i].roleName);
      }
      this.sarr_roleName = items;
    }, err =>
      {
        this.errorHandling.checkError(err.status);
        this.bln_loading=false;
      });
  }

  // Below Function will take input from user & send that data to Node Server API which will generate the report & send the generated path in response
  onSubmit()
  {
    const toDate = this.datePipe.transform(this.roles.value.toDate, 'dd/MM/yyyy');
    const fromDate = this.datePipe.transform(this.roles.value.fromDate, 'dd/MM/yyyy');
    const userID = this.sessionStorage.retrieve("userid");
    const data: Object = {};
    Object.assign(data, { fromDate: fromDate }, { toDate: toDate },{selectedRoleName:this.roles.value.roleName},{selectedAction:this.roles.value.action}, { userID: userID })
    console.log(data);
    // this.http.postMethod('',data).subscribe((res:any)=>{

    // });
  }

  // Below function will reset the form values
  reset(){
    this.roles.reset();
  }

  ngOnInit()
  {

  }

}
