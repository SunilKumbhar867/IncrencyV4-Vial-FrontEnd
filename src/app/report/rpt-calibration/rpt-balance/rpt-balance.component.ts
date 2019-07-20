import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder
} from "@angular/forms";
import { DatePipe } from "@angular/common";
import { HttpService } from '../../../services/http/http.service';
import {
  DateTimeAdapter,
  OWL_DATE_TIME_FORMATS,
  OWL_DATE_TIME_LOCALE,
  OwlDateTimeComponent,
  OwlDateTimeFormats
} from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { Router } from '@angular/router';
import { SessionStorageService } from "ngx-webstorage";
import { DomSanitizer } from "@angular/platform-browser";
import { ErrorHandlingService } from '../../../services/error-handling/error-handling.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent } from '../../../shared/modal/modal.component';
import { Subscription } from "rxjs";
import { MessageService } from '../../../services/PrintService/print.service';
import { MatDialog } from "@angular/material";
const moment = (_moment as any).default ? (_moment as any).default : _moment;
import { RemarkComponent } from '../../../shared/remark/remark/remark.component';
export const MY_MOMENT_DATE_TIME_FORMATS: OwlDateTimeFormats = {
  parseInput: 'MM/YYYY',
  fullPickerInput: 'l LT',
  datePickerInput: 'MM/YYYY',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',

};

declare var swal: any;

@Component({
  selector: "app-rpt-balance",
  templateUrl: "./rpt-balance.component.html",
  styleUrls: ["./rpt-balance.component.css"],
  //changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    // `MomentDateTimeAdapter` and `OWL_MOMENT_DATE_TIME_FORMATS` can be automatically provided by importing
    // `OwlMomentDateTimeModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },

    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_DATE_TIME_FORMATS },
  ],
})
export class RptBalanceComponent implements OnInit, OnDestroy {
  bln_show: boolean = false;
  bln_IsPopupOpened = true;
  sarr_reportType = ["Complete", "Failure"];
  sarr_calibrationType = ["Daily", "Periodic"];

  todayDate = new Date();
  balanceCalibration: FormGroup;

  bln_calibrationDaily: boolean = false;
  bln_calibrationPeriodic: boolean = false;
  bln_reportSerialNo: boolean = false;

  bln_prtBtnReas: boolean = false;
  bln_preBtn: boolean = false;
  bln_noCalibBtn: boolean = false;

  bln_noCalibVisible: boolean = false;

  sarr_BalIds = [];
  sarr_RepSrNos = [];

  objArr_APIResult: any;

  sarr_resultBalData: Array<string> = [];
  sarr_resultRepSrNo: Array<string> = [];
  iarr_SrNos: Array<number> = [];

  int_length: any;

  public dateTime = new FormControl(moment());

  str_selMonthYear: string;

  str_NoCalibBtnLbl: string = "No Calibration Reason";

  bln_loading: boolean;
  toolbar: string;
  pdfSrc: string;
  str_path: any;
  Url: any;

  sarr_NoCalibDates = [];

  public bln_Loading = false;
  ReportGenerateData: any
  tempReportNumberData:any;
  MessageSubscription: Subscription;
  constructor
    (
      private fb: FormBuilder,
      public datePipe: DatePipe,
      private http?: HttpService,
      public router?: Router,
      private modalService?: NgbModal,
      private sessionStorage?: SessionStorageService,
      private sanitizer?: DomSanitizer,
      private errorHandling?: ErrorHandlingService,
      public messageService?: MessageService,
      private dialog?: MatDialog,
    ) {
    this.balanceCalibration = this.fb.group({
      calibrationType: new FormControl("", Validators.required),
      date: new FormControl(""),
      reportType: new FormControl("", Validators.required),
      balanceCode: new FormControl("", Validators.required),
      repSrNo: new FormControl("", Validators.required),
      printNo: new FormControl("", Validators.required),
      noCalibDate: new FormControl(""),
      reason: new FormControl(""),
      //reportSerialNo: new FormControl(""),
      changeDetection: ChangeDetectionStrategy.OnPush,
    });
  }
  ngOnInit() {
    this.tempReportNumberData = {};
    this.MessageSubscription = this.messageService.message$.subscribe(res => {
      console.log('Sunscribe',res)
      if (res != "FirstCall") {
       let data = this.tempReportNumberData;
       console.log(JSON.stringify(this.tempReportNumberData))
       this.http.postMethod('report/printCountUpCalibration',data).subscribe(res =>{
        console.log('print count increased');
       },err=>{
        // this.errorHandling.checkError(err.status);
        // this.bln_loading = false;
       })
      }
     }, err => { console.log('errrorr', err) });
  }
  chosenYearHandler(normalizedYear: Moment) {
    this.bln_show = false;
    const ctrlValue = this.dateTime.value;
    ctrlValue.year(normalizedYear.year());
    this.dateTime.setValue(ctrlValue);
    this.balanceCalibration.patchValue({
      reportType:'',
      balanceCode:'',
      repSrNo:'',
      printNo:''
      //reportSerialNo: ""
    });
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: OwlDateTimeComponent<Moment>) {
    this.bln_show = false;
    const ctrlValue = this.dateTime.value;
    ctrlValue.month(normalizedMonth.month());
    this.dateTime.setValue(ctrlValue);
    this.str_selMonthYear = this.datePipe.transform(ctrlValue._d, "yyyy-MM");
    datepicker.close();

    this.balanceCalibration.patchValue({
      reportType: 'Select'
    })

    this.balanceCalibration.patchValue({
      balanceCode: 'Select'
    })

    this.balanceCalibration.patchValue({
      repSrNo: 'Select'
    })

    this.balanceCalibration.patchValue({
      printNo: ""
    })

    this.bln_preBtn = false;
    this.bln_prtBtnReas = false;
    this.bln_noCalibBtn = false;

    this.bln_noCalibVisible = false;

    this.str_NoCalibBtnLbl = "No Calibration Reason";

    this.balanceCalibration.patchValue({
      reason: ""
    });
  }

  onSelectCalibrationType(calibrationType: String) {
    this.bln_show = false;
    if (calibrationType == "Periodic") {
      this.bln_calibrationPeriodic = false;
      this.bln_calibrationDaily = true;
      this.bln_reportSerialNo = true;
      const todayDate = this.datePipe.transform(this.todayDate, "yyyy-MM-dd");
      this.balanceCalibration.patchValue({
        date: todayDate,
        reportType:'',
        balanceCode:'',
        repSrNo:'',
        printNo:''
      });
    } else {
      this.bln_calibrationPeriodic = true;
      this.bln_calibrationDaily = false;
      this.bln_reportSerialNo = false;
      const todayMonth = this.datePipe.transform(this.todayDate, "yyyy-MM");

      this.balanceCalibration.patchValue({
        date: todayMonth,
        reportType:'',
        balanceCode:'',
        repSrNo:'',
        printNo:''
        //reportSerialNo: ""
      });

      this.str_selMonthYear = todayMonth;

    }
    this.bln_prtBtnReas = false;
  }

  fetchBalIds(rptType: string) {
    this.bln_show = false;
    this.balanceCalibration.patchValue({
      balanceCode:'',
      repSrNo:'',
      printNo:''
    });
    this.sarr_resultBalData = [];
    var date;
    if(this.balanceCalibration.value.calibrationType == 'Daily') {
      date = this.str_selMonthYear;
    } else {
      date = this.datePipe.transform(this.balanceCalibration.value.date, "yyyy-MM-dd");
    }
    let data = {
      date: date, reportType: rptType,
      calibrationType: this.balanceCalibration.value.calibrationType,
    };

    this.http.postMethod('calibrationbox/dailyCalibrationReport', data).subscribe((res: any) => {
  
      if (res.status === 'success') {
        this.objArr_APIResult = res;
        if(this.balanceCalibration.value.calibrationType == 'Daily') {
          const sarr_data_Bal = this.objArr_APIResult.result;

          for (let i = 0; i < Object.keys(this.objArr_APIResult.result).length; i++) {

            this.int_length = sarr_data_Bal.filter(x => x.balid === this.objArr_APIResult.result[i].Daily_BalID);

            if (this.int_length <= 0) {
              this.sarr_resultBalData.push(this.objArr_APIResult.result[i].Daily_BalID);
            }
          }//end for
          this.sarr_BalIds = this.sarr_resultBalData;
        } else {
          const sarr_data_Bal = this.objArr_APIResult.result;

          for (let i = 0; i < Object.keys(this.objArr_APIResult.result).length; i++) {

            this.int_length = sarr_data_Bal.filter(x => x.balid === this.objArr_APIResult.result[i].Periodic_BalID);

            if (this.int_length <= 0) {
              this.sarr_resultBalData.push(this.objArr_APIResult.result[i].Periodic_BalID);
            }
          }//end for
          this.sarr_BalIds = this.sarr_resultBalData;
        }

      }
    }, err => { })
  }

  fetchPrintNum(balId: string) {
    this.bln_show = false;
    this.balanceCalibration.patchValue({
      printNo:''
    });
    var obj_DataToSend;
    if(this.balanceCalibration.value.calibrationType == 'Daily') {
      var date = this.str_selMonthYear;
      var spltDate = date.split("-");

      let data = {
        title: "DailyCalibration", reportType: this.balanceCalibration.value.reportType,
        balId: balId, year: spltDate[0], month: spltDate[1],calibrationType:this.balanceCalibration.value.calibrationType,
      };
      obj_DataToSend = data;
      this.http.postMethod('calibrationbox/dailyCalibRptPrintNumCnt', obj_DataToSend).subscribe((res: any) => {
        if (res.status === 'success') {
          if (res.result[0].PrintNo != null) {
            this.balanceCalibration.patchValue({
              printNo: res.result[0].PrintNo
            })
          }
          else {
            this.balanceCalibration.patchValue({
              printNo: "0"
            })
          }

          this.bln_preBtn = true;
          this.bln_noCalibBtn = true;

          if (res.result[0].PrintNo > 0) {
            this.bln_prtBtnReas = true;
          }
          else {
            this.bln_prtBtnReas = false;
          }
        }
      }, err => { })
    } else { // for fetching Report Serial On Balance Selection In Periodic Recalibraton 
      
      let data = {
        reportType: this.balanceCalibration.value.reportType,
        balId: balId, date:this.datePipe.transform(this.balanceCalibration.value.date, "yyyy-MM-dd"), calibrationType:this.balanceCalibration.value.calibrationType,
      };

      obj_DataToSend = data;

      this.http.postMethod('calibrationbox/periodicRepoSrno', data).subscribe((res: any) => {
           if (res.status === 'success') {
             this.objArr_APIResult = res;
             const sarr_data_Rep_SrNo = this.objArr_APIResult.result;

             for (let i = 0; i < Object.keys(this.objArr_APIResult.result).length; i++) {
       
               this.int_length = sarr_data_Rep_SrNo.filter(x => x.repNo === this.objArr_APIResult.result[i].Periodic_RepNo);
       
               if (this.int_length <= 0) {
                 this.sarr_resultRepSrNo.push(this.objArr_APIResult.result[i].Periodic_RepNo);
                 this.iarr_SrNos.push(i+1);
               }
             }//end for
             this.sarr_RepSrNos = this.sarr_resultRepSrNo;
           }
         }, err => { })
    }

  }

  fetchPrintNumOnRepSr(balId: string) {
    this.bln_show = false;
    this.balanceCalibration.patchValue({
      printNo:''
    });
    var obj_DataToSend;

      let data = {
        title: "PeriodicCalibration", reportType: this.balanceCalibration.value.reportType,
        balId: balId, date:this.datePipe.transform(this.balanceCalibration.value.date, "yyyy-MM-dd"), calibrationType:this.balanceCalibration.value.calibrationType,

      };
      obj_DataToSend = data;
     // console.log(JSON.stringify(data))
      this.http.postMethod('calibrationbox/dailyCalibRptPrintNumCnt', obj_DataToSend).subscribe((res: any) => {
        if (res.status === 'success') {

          if (res.result[0].PrintNo != null) {
            this.balanceCalibration.patchValue({
              printNo: res.result[0].PrintNo
            })
          }
          else {
            this.balanceCalibration.patchValue({
              printNo: "0"
            })
          }

          this.bln_preBtn = true;
          this.bln_noCalibBtn = true;

          if (res.result[0].PrintNo > 0) {
            this.bln_prtBtnReas = true;
          }
          else {
            this.bln_prtBtnReas = false;
          }
        }
      }, err => { })
    }

  onSelectDate() {
    this.balanceCalibration.patchValue({
      reportType:'',
        balanceCode:'',
        repSrNo:'',
        printNo:''
    });
  }
  onFormSubmit() {

    this.bln_loading = true;
    var date = this.str_selMonthYear;

    if(this.balanceCalibration.value.calibrationType =='Daily') {

      let data = {
        date: date, reportType: this.balanceCalibration.value.reportType,
        balId: this.balanceCalibration.value.balanceCode,
        userId: this.sessionStorage.retrieve('userId'), username: this.sessionStorage.retrieve('username')
      };
  
      console.log("data",data);

      this.http.postMethod('calibrationbox/dailyCalibRptTempTbl', data).subscribe((res: any) => {
      if (res.status === 'success') {
        let Reportdata = {};
        Object.assign(Reportdata, { data: res.data }, { FileName: 'BalanceDailyCalibForPTGII' });
        this.ReportGenerateData = Reportdata;
     // console.log(JSON.stringify(Reportdata))
        this.http.postMethod('report/GenerateReport', Reportdata).subscribe((data: any) => {
          this.toolbar = "#toolbar=0&navpanes=0";
          const rand = Math.random();
          this.str_path = data.filepath;
          this.pdfSrc = data.filepath + "?v=" + rand + this.toolbar;
          this.Url = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);
          this.bln_loading = false;
          this.bln_show = true;
        }, err => {
          this.errorHandling.checkError(err.status);
          this.bln_loading = false;
        })
      }
    }, err => { })
    } else {
      let data = {
        date: this.datePipe.transform(this.balanceCalibration.value.date, "yyyy-MM-dd"), reportType: this.balanceCalibration.value.reportType,
        balId: this.balanceCalibration.value.balanceCode,
        repSrNo: this.balanceCalibration.value.repSrNo,

        userId: this.sessionStorage.retrieve('userId'), username: this.sessionStorage.retrieve('username')
      };
      console.log("data",data);

     var fileName;
     if(this.balanceCalibration.value.reportType =='Complete') {
       fileName ='BalancePeriodicCalibForPTGII';
     } else {
      fileName ='BalanceIncmpPeriodicCalibForPTGII';
     }
      this.http.postMethod('calibrationbox/PeriodicCalibRptTempTbl',data).subscribe((res:any)=>{

        if(res.status =='success') {
          if(res.data =='No record found') {
            swal('No Record Found', 'Sorry no record found for periodic calibration', 'warning');
            this.bln_loading = false;
          } else {
            let Reportdata = {};
            Object.assign(Reportdata, { data: res.data }, { FileName: fileName });
            this.ReportGenerateData = Reportdata;
              this.http.postMethod('report/GenerateReport', Reportdata).subscribe((data: any) => {
                this.toolbar = "#toolbar=0&navpanes=0";
                const rand = Math.random();
                this.str_path = data.filepath;
                this.pdfSrc = data.filepath + "?v=" + rand + this.toolbar;
                this.Url = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);
                this.bln_loading = false;
                this.bln_show = true;
              }, err => {
                this.errorHandling.checkError(err.status);
                this.bln_loading = false;
              })
          }

        }
      },err=>{
        this.errorHandling.checkError(err.status);
          this.bln_loading = false;
      })
    }


  }
  printReport() {
    //console.log('as',this.str_path)
    // Generate report without watermark
    var date;
    if(this.balanceCalibration.value.calibrationType =='Daily') {
      date = this.str_selMonthYear
    } else {
      date =this.datePipe.transform(this.balanceCalibration.value.date, "yyyy-MM-dd")
    }
    this.tempReportNumberData = {
      calibrationType: this.balanceCalibration.value.calibrationType,
      date:date,
      reportType: this.balanceCalibration.value.reportType,
      printNo: this.balanceCalibration.value.printNo + 1,
      BalanceID:this.balanceCalibration.value.balanceCode,
      userID: this.sessionStorage.retrieve("userid"),
      username:this.sessionStorage.retrieve("username")
    }
    if(this.balanceCalibration.value.printNo > 0) {
      this.bln_IsPopupOpened = true;
      const message = { message: 'Print Report' };
      const dialogRef = this.dialog.open(RemarkComponent, {
        data: message,
        width: '570px',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        const data: Object = {};
        if (result !== undefined) {
          Object.assign(this.tempReportNumberData, { strReason: result.reason })
          const reportData = this.ReportGenerateData;
          delete reportData.data.waterMark;
          Object.assign(reportData.data, { waterMark: false });
          this.generateReportWithoutWatermark(reportData);
        }
      })
    } else {
      Object.assign(this.tempReportNumberData, { strReason: '' })
      const reportData = this.ReportGenerateData;
      delete reportData.data.waterMark;
      Object.assign(reportData.data, { waterMark: false });
      this.generateReportWithoutWatermark(reportData);
    }


  }
  generateReportWithoutWatermark(reportData) {
    this.http.postMethod('report/GenerateReport', reportData).subscribe((data: any) => {
      this.str_path = data.filepath;
      this.open();
    }, err => {
       swal('','Something went wrong, Please try again', 'error')
    })
  }
  open() {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.path = this.str_path;
  }
  openNoReasDailyCalibFrm() {

    const userID = this.sessionStorage.retrieve("userid");
    const userName = this.sessionStorage.retrieve("username");

    if (this.str_NoCalibBtnLbl == "Save Changes") {

      this.bln_Loading = false;

      swal({
        title: 'Are You Sure?',
        text: "Do You Want To Save Reason ?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result == true) {

          let data = {
            date: this.balanceCalibration.value.noCalibDate,
            balId: this.balanceCalibration.value.balanceCode,
            reason: this.balanceCalibration.value.reason,
            UserId: userID,
            UserName: userName
          };

          this.bln_Loading = true;

          this.http.postMethod('calibrationbox/addNoRemarkCalib', data).subscribe((res: any) => {
            this.bln_Loading = false;

            if (res.result === 'No Remark Added Successfully') {
              swal('No Calibration Reason Added Successfully', '', 'warning');
              this.balanceCalibration.reset();
              this.bln_preBtn = false;
              this.bln_prtBtnReas = false;
              this.bln_noCalibVisible = false;
              this.bln_calibrationPeriodic = false;

              this.bln_noCalibBtn = false;

              //this.dateTime.setValue("");
              this.str_NoCalibBtnLbl = "No Calibration Reason";
            } else {
              swal('Can not No Calibration Reason, Try again', '', 'error');
            }
          },
            err => {
              this.errorHandling.checkError(err.status);
              this.bln_Loading = false;
            });
        }
      }, function (dismiss) { })
    }
    else//No Calibration text
    {
      this.bln_noCalibVisible = true;

      this.bln_preBtn = false;
      this.bln_prtBtnReas = false;

      this.str_NoCalibBtnLbl = "Save Changes";

      let data = {
        date: this.str_selMonthYear,
        balId: this.balanceCalibration.value.balanceCode
      };

      this.http.postMethod('calibrationbox/noRemarkCalibDate', data).subscribe((res: any) => {

        if (res.status === 'success') {
          this.sarr_NoCalibDates = res.result;
        }
      }, err => { })
    }
  }

  // Below Function will take input from user & send that data to Node Server API which will generate the report & send the generated path in response
  onPrtReasBtnClk() {
    var date;
    if(this.balanceCalibration.value.calibrationType =='Daily') {
      date = this.str_selMonthYear
    } else {
      date =this.datePipe.transform(this.balanceCalibration.value.date, "yyyy-MM-dd")
    }
    const printReason = {
      calibrationType: this.balanceCalibration.value.calibrationType,
      reportType: this.balanceCalibration.value.reportType,
      printNo: this.balanceCalibration.value.printNo + 1,
      date:date,
      BalanceID:this.balanceCalibration.value.balanceCode,
      userID: this.sessionStorage.retrieve("userid"),
      username:this.sessionStorage.retrieve("username")
    }
    this.bln_loading = true;
    this.http.postMethod('report/printReasonReportCalibration',printReason).subscribe((res:any) =>{
      let ReportData = {};
          Object.assign(ReportData, { data: res }, { FileName: 'RepoViewReasonPrintout' });
          this.ReportGenerateData = ReportData;
          this.http.postMethod('report/GenerateReport', ReportData).subscribe((data: any) => {
            this.toolbar = "#toolbar=0&navpanes=0";
            const rand = Math.random();
            this.str_path = data.filepath;
            this.pdfSrc = data.filepath + "?v=" + rand + this.toolbar;
            this.Url = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);
            this.bln_loading = false;
            this.bln_show = true;
          }, err => {
            this.errorHandling.checkError(err.status);
            this.bln_loading = false;
          })
    },err=>{
      this.errorHandling.checkError(err.status);
      this.bln_loading = false;
    })
    // const FileName = "RepoViewReasonPrintoutDaily";
    // const data: Object = {};
    // const userID = this.sessionStorage.retrieve("userid");
    // const userName = this.sessionStorage.retrieve("username");
    // const ObjectData: Object = {};
    // Object.assign(
    //   ObjectData,
    //   { UserId: userID },
    //   { UserName: userName }
    // );
    // Object.assign(data, { data: ObjectData }, { FileName: FileName });
    // console.log(data)

    // this.bln_loading = true;
    // this.http
    //   .postMethod("report/GenerateReport", data)
    //   .subscribe((res: any) => {
    //     this.toolbar = "#toolbar=0&navpanes=0";
    //     const rand = Math.random();
    //     this.str_path = res.filepath;
    //     this.pdfSrc = res.filepath + "?v=" + rand + this.toolbar;
    //     this.Url = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);
    //     this.bln_loading = false;
    //     this.bln_show = true;
    //   });
  }

  Reset() {
    this.balanceCalibration.reset();
    this.bln_preBtn = false;
    this.bln_prtBtnReas = false;
    this.bln_show = false;

    this.str_NoCalibBtnLbl = "No Calibration Reason";

    // const todayMonth = this.datePipe.transform(this.todayDate, "yyyy-MM");
    // console.log("Reset todayMonth", todayMonth);
    // this.balanceCalibration.patchValue({
    //   date: todayMonth,
    // });

    // this.balanceCalibration.patchValue({
    //   dateTime: todayMonth,
    // });

    // this.str_selMonthYear = todayMonth;
    // console.log("Reset this.str_selMonthYear", this.str_selMonthYear);

    this.bln_noCalibVisible = false;
    this.bln_calibrationPeriodic = false;
  }
  ngOnDestroy() {
    console.log('Subscribtion cleared')
    this.MessageSubscription.unsubscribe()
  }
}
