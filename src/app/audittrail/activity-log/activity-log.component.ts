import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpService } from '../../services/http/http.service';
import { ErrorHandlingService } from '../../services/error-handling/error-handling.service';
import { SessionStorageService } from 'ngx-webstorage';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent } from "../../shared/modal/modal.component";
declare var swal:any;
@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.css']
})
export class ActivityLogComponent implements OnInit {
  bln_loading: boolean;
  sarr_userData:Array<any>=[];
  pdfSrc: string;
  Url: any;
  bln_show: boolean;
  toolbar: string;
  todayDate = new Date();
  str_path: String;
  fromDate: Date;
  // Declaring Reactive Form
  activityLog = new FormGroup({
    userID:new FormControl(),
    toDate: new FormControl(),
    fromDate: new FormControl(),
  });


  constructor(public fb: FormBuilder, public datePipe: DatePipe,public http:HttpService, private errorHandling?: ErrorHandlingService,private sessionStorage?: SessionStorageService,private sanitizer?: DomSanitizer,
    private modalService?: NgbModal)
  {
    // Initializing Reactive Form & giving validations
    this.activityLog = this.fb.group({
      userID: new FormControl('All', [Validators.required]),
      toDate: new FormControl(this.todayDate, [Validators.required]),
      fromDate: new FormControl(this.todayDate, [Validators.required]),
    });
    this.getData();
  }

  //Below funtion will return list of all users
  getData()
  {
    this.bln_loading = true;
    this.http.getMethod("user/getUsers").subscribe(
      (res: any) =>
      {
        this.bln_loading = false;
        this.sarr_userData = res.result;
        const data=[];
        data.push('All');
        for(let i=0;i<Object.keys(this.sarr_userData).length;i++){
          data.push(this.sarr_userData[i].status.userid)
        }
        this.sarr_userData=data;
      },
      err =>
      {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

   // This function will check that from date should always be less than to date
   addEvent() {
    this.fromDate = this.activityLog.value.fromDate;
    const toDate = this.datePipe.transform(this.activityLog.value.toDate, "yyyy/MM/dd"  );
    const fromDate = this.datePipe.transform(  this.activityLog.value.fromDate, "yyyy/MM/dd" );
     if(fromDate > toDate){
       swal("", "FROM DATE should be less than TO DATE", "warning");
       this.activityLog.patchValue({
         toDate:this.todayDate,
         fromDate:this.todayDate
       });
     }
   }

  // Below Function will take input from user & send that data to Node Server API which will generate the report & send the generated path in response
  onSubmit()
  {
    const FileName = "RepoActivityLog";
    const toDate = this.datePipe.transform(this.activityLog.value.toDate, 'yyyy-MM-dd');
    const fromDate = this.datePipe.transform(this.activityLog.value.fromDate, 'yyyy-MM-dd');
    const userID = this.sessionStorage.retrieve("userid");
    const userName = this.sessionStorage.retrieve("username");
    const data: Object = {};
    const ObjectData: Object = {};
    var selectedValue = this.activityLog.value.userID;
    if (selectedValue == 'All')
    {
      selectedValue = '';
    }
    Object.assign(
      ObjectData,
      { FromDate: fromDate },
      { ToDate: toDate },
      { UserId: userID },
      { UserName: userName },
      {SelectedValue:selectedValue}
    );
    Object.assign(data, { data: ObjectData }, { FileName: FileName });
    const finalObject=Object.assign({reportObj:data},{strTableName:"tbl_activity_log"});
    console.log(JSON.stringify(finalObject))
    if (fromDate > toDate) {
      swal("", "FROM DATE should be less than TO DATE", "warning");
    } else {
      this.bln_loading = true;
      this.http
        .postMethod("report/auditActivityLog", finalObject)
        .subscribe((res: any) => {
          if (res.data === "No records found") {
            swal("No Record Found", "Please Try Again", "warning");
            this.bln_show = false;
            this.bln_loading = false;
          } else{
            this.toolbar = "#toolbar=0&navpanes=0";
            const rand = Math.random();
            this.str_path = res.filepath;
            console.log(this.str_path);
            this.pdfSrc = res.filepath + "?v=" + rand + this.toolbar;
            this.Url = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);
            this.bln_loading = false;
            this.bln_show = true;
          }
        },
        err => {
          this.errorHandling.checkError(err.status);
          this.bln_loading = false;
        }
      );
    }
  }

  // Below function will reset the form values
  reset(){
    this.bln_show = false;
    this.activityLog.reset();
  }

  // This method will open Modal to select the printer & send the pdf Path of Generated File
  open() {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.path = this.str_path;
  }

  ngOnInit()
  {

  }

}
