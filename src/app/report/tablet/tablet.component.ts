import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { HttpService } from "../../services/http/http.service";
import { DatePipe } from "@angular/common";
import { ErrorHandlingService } from "../../services/error-handling/error-handling.service";
import { SessionStorageService } from 'ngx-webstorage';
import { JsonDataService } from '../../services/commonData/json-data.service';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { RemarkComponent } from '../../shared/remark/remark/remark.component';
import { MatDialog } from '@angular/material';
import { reject } from 'q';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../shared/modal/modal.component';
import { MessageService } from '../../services/PrintService/print.service';
//import { DataService } from 'src/app/services/commonData/data.service';
import { DataService } from "../../services/commonData/data.service";

declare var swal: any;
@Component({
  selector: 'app-tablet',
  templateUrl: './tablet.component.html',
  styleUrls: ['./tablet.component.css'],
  providers: [JsonDataService]
})
export class TabletComponent implements OnInit, OnDestroy {

  // Variables declares for Nomecaltures of Product BFG Code & Product Name
  str_LblBFGCode: string = "";

  bln_verifyReport = false; // Right verify report
  bln_isReportVerified = false;
  bln_print = false;
  bln_printAll = false;
  bln_loading: boolean;
  bln_showReport = false;
  loggedInUserId: any;
  bln_hideDatable = true;
  tabletResult: Array<any>;
  refreshDataObj: any;
  loggedInUserRights;
  pdfSrc: string;
  str_path: String;
  Url: any;
  bln_show: boolean;
  bln_showPrintReasons:boolean;
  toolbar: string;
  bln_IsPopupOpened = true;
  ProductDetails: any; // Holds the tablet details
  ReportGenerateData: any;
  //PrintReportService: Subscription;
    // View child for datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  tempReportNumberData: any;
  todayDate = new Date();
  arrReportOptions;
  arrtestType = ['Regular', 'Initial'];
  arrReportType = ['Complete', 'Incomplete'];
  arrRecordFrom = ['Current', 'Archive'];
  public tabletReport: FormGroup;
  MessageSubscription: Subscription;
  constructor(
    private dataService?: DataService,
    private fb?: FormBuilder,
    private http?: HttpService,
    public datePipe?: DatePipe,
    private errorHandling?: ErrorHandlingService,
    private sessionStorage?: SessionStorageService,
    private jsonDataService?: JsonDataService,
    private http1?: HttpClient,
    private sanitizer?: DomSanitizer,
    private dialog?: MatDialog,
    private modalService?: NgbModal,
    public data?: MessageService) {
    this.tabletReport = this.fb.group({
      reportOption: ['', Validators.required],
      testType: [this.arrtestType[0], Validators.required],
      fromDate: [this.todayDate, Validators.required],
      toDate: [this.todayDate, Validators.required],
      reportType: [this.arrReportType[0], Validators.required],
      recordFrom: [this.arrRecordFrom[0], Validators.required]
    });
    this.loggedInUserRights = this.sessionStorage.retrieve('rightsArray');
    //this.data.message$.subscribe(res => { console.log('res', res); }, err => { console.log('errrorr', err), completed => console.log("Completed",completed); });

  }

  ngOnInit() {
    // caliing developer json here to find out which weighment option we have


    this.dataService
    .getNomenclatureDetails()
    .then(res =>
    {
      this.initializeInputField(res[0]);
    })
    .catch(err =>
    {
      this.errorHandling.checkError(err.status);
    });

    this.tempReportNumberData = {};
    this.MessageSubscription = this.data.message$.subscribe(res => {

      if (res != "FirstCall") {
        const objPrintData = {
          intReportSerNo: this.ProductDetails.RepSerNo,
          reportOption: this.tabletReport.value.reportOption,
          reportType: this.tabletReport.value.reportType,
          recordFrom: this.tabletReport.value.recordFrom,
          strReason: this.tempReportNumberData.strReason,
          strUserId: this.sessionStorage.retrieve('userId'),
          strUserName: this.sessionStorage.retrieve('username'),
          intPrintCount: this.ProductDetails.PrintNo+1
        }

        this.http.postMethod('report/printcountup', objPrintData).subscribe(res => { // Logic for temporary tables
          console.log('print count increased',this.ProductDetails.RepSerNo);
          this.RefreshTableData();
          this.bln_show=false;
        }, err => {
          // console.log(err)
          // this.errorHandling.checkError(err.status);
          // this.bln_loading = false;
        })
      }
      console.log();
     }, err => { console.log('errrorr', err) });

    this.jsonDataService.getValueFromJSON().then((res: any) => {
      this.arrReportOptions = res.Tablet.filter(k => k.Value == 1).map(function (e) {
        if ((e.Name != "Edit") && (e.Name != "Coating")&& (e.Name != "Sieve Shaker") && (e.Name != "Granulation")) {
          return e.Name;
        }
      })
      this.tabletReport.patchValue({
        reportOption: this.arrReportOptions[0]
      })
    });
    // Initiate the data tables
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10
    };
    // getting user from storage
    this.loggedInUserId = this.sessionStorage.retrieve('userId');

  }


  /************** Function Detail ************/
  //This function is used to display value in input field
  /************End Function Detail ***********/
  initializeInputField(str_inputData: any)
  {
    this.str_LblBFGCode = str_inputData.BFGCode;
  }

  //***************************************************************************************** */
  // This function will check that from date should always be less than to date
  //*************************************************************************************** */
  addEvent() {
    const toDate = this.datePipe.transform(this.tabletReport.value.toDate, "yyyy/MM/dd");
    const fromDate = this.datePipe.transform(this.tabletReport.value.fromDate, "yyyy/MM/dd");
    if (fromDate > toDate) {
      swal("", "FROM DATE should be less than TO DATE", "warning");
      this.tabletReport.patchValue({
        toDate: this.todayDate,
        fromDate: this.todayDate
      });
    }
    this.bln_show = false;
  }
  //******************************************************************************** */
  onSubmit() {
    var data: Object = {};
    const toDate = this.datePipe.transform(this.tabletReport.value.toDate, 'yyyy-MM-dd');
    const fromDate = this.datePipe.transform(this.tabletReport.value.fromDate, 'yyyy-MM-dd');

    const reportOption = this.tabletReport.value.reportOption;
    const testType = this.tabletReport.value.testType;
    const reportType = this.tabletReport.value.reportType;
    const recordFrom = this.tabletReport.value.recordFrom;

    Object.assign(data, { fromDate: fromDate }, { toDate: toDate }, { reportOption: reportOption }, { testType: testType },
      { reportType: reportType }, { recordFrom: recordFrom });
    this.refreshDataObj = data;
    this.bln_loading = true;
    this.http.postMethod('tabletRoute/getTabletDetails', data).subscribe((response: any) => {
      this.bln_loading = false;
      this.bln_show = false;
      if (response.status == 'success') {
        this.bln_hideDatable = false;
        if (response.result.length !== 0) {
          // here we are checking if user has right of view all report
          var arrProducttablet = response.result;
          if (this.sessionStorage.retrieve('rightsArray').includes('View All Report')) {
            this.tabletResult = arrProducttablet;
          } else {
            arrProducttablet = arrProducttablet.filter(k => k.UserId === this.loggedInUserId);
            this.tabletResult = arrProducttablet;
          }
          if (this.dtElement.dtInstance === undefined) {
            this.dtTrigger.next();
          } else {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.dtTrigger.next();
            });
          }
        } else {
          swal("No records Found", "", "warning");
          this.bln_hideDatable = true;
        }
      } else {
        swal("Something Went Wrong", "Please select apppropriate options", "Warning");
        this.bln_hideDatable = true;
      }
    }, err => {
      this.errorHandling.checkError(err.status);
      this.bln_loading = false;
    })
  }

  doSelectRepOption(e) {
    if (e == 'Individual' || e == 'Thickness' || e == 'Diameter' || e == 'Breadth' || e == 'Length' || e == 'Individual Layer'
      || e == 'Individual Layer1' || e == 'Disintegration Tester' || e == 'Hardness' || e == 'Particle Size') {
      this.arrReportType =['Complete', 'Incomplete']
    } else {
      this.arrReportType = ['Complete'];;
    }
    this.bln_hideDatable = true;
    this.bln_show = false;
  }
  doSelectReportType(e) {
    if (e == 'Complete') {
      this.arrRecordFrom = ['Current', 'Archive'];
    } else {
      this.arrRecordFrom = ['Current'];
     }
     this.bln_hideDatable = true;
     this.bln_show = false;
  }

  cmbReportFrom_cleargrid()
  {
    this.bln_hideDatable = true;
    this.bln_show = false;
  }

  cmbTestType_cleargrid()
  {
    this.bln_hideDatable = true;
    this.bln_show = false;
  }
  //******************************************************************************************** */
  // Function usage
  //********************************************************************************************* */
  viewReport(tabRes) {
    // If printreason report open then we set flag to false
    this.bln_showPrintReasons = false;
    this.ProductDetails = tabRes;
    let reportName;
    let calculation;
    switch (this.tabletReport.value.reportOption) {
      case 'Individual':
        reportName = 'RepoTabTemplateForPTGII';
        calculation = true;
        break;
     case 'Individual Layer':
        reportName = 'RepoTabTemplateForPTGII';
        calculation = true;
        break;
     case 'Individual Layer1':
        reportName = 'RepoTabTemplateForPTGII';
        calculation = true;
        break;
      case 'Thickness':
        reportName = 'RepoVerTemplateForPTGII';
        calculation = true;
        break;
      case 'Length':
        reportName = 'RepoVerTemplateForPTGII';
        calculation = true;
        break;
      case 'Breadth':
        reportName = 'RepoVerTemplateForPTGII';
        calculation = true;
        break;
      case 'Diameter':
        reportName = 'RepoVerTemplateForPTGII';
        calculation = true;
        break;
      case 'Friabilator':
        reportName = 'RepoFriabilityLRForPTGII';
        calculation = false;
        break;
      case 'Moisture Analyzer':
        reportName = 'ReportLossDryingForPTGII';
        calculation = false;
        break;
      case 'Hardness':
        reportName = 'RepoHardDiaBreadthThickTemplateForPTGII';
        calculation = true;
        break;
      case 'Particle Size':
        reportName = 'ParticleSizeDistributionForPTGII';
        calculation = true;
        break;
      case 'Fine %':
        reportName = 'MeshTestReportForPTGII';
        calculation = true;
        break;
      case 'Tapped Density':
        reportName = 'ReportTappedDensityForPTGII';
        calculation = false;
        break;
      case 'Disintegration Tester':
        reportName = 'RepoDTTemplateForPTGII';
        calculation = true;
        break;
      case 'Group':
        reportName = 'RepoGrpTemplateForPTGII';
        calculation = true;
        break;
      case 'Group Layer':
        reportName = 'RepoGrpTemplateForPTGII';
        calculation = true;
        break;
       case 'Group Layer1':
        reportName = 'RepoGrpTemplateForPTGII';
        calculation = true;
        break;
    }
    // Check if Report is verified or not
    if (tabRes.CheckedByID != "NULL") {
      this.bln_isReportVerified = true;
    } else {
      this.bln_isReportVerified = false;
    }

    /*************************************************************** */
    const tempData = {
      recordFrom: this.tabletReport.value.recordFrom, reportOption: this.tabletReport.value.reportOption
      , reportType: this.tabletReport.value.reportType, testType: this.tabletReport.value.testType,
      RepSerNo: tabRes.RepSerNo, userId: this.sessionStorage.retrieve('userId'), username: this.sessionStorage.retrieve('username')
    }
    this.bln_loading = true;
    if (calculation == true) { // those weghments need calculations

      this.http.postMethod('tabletRoute/ViewTabReport', tempData).subscribe(res => { // Logic for temporary tables
        this.ReportGenerateData = {}
        Object.assign(this.ReportGenerateData, { data: res }, { FileName: reportName });

        console.log(JSON.stringify(this.ReportGenerateData));

        this.http.postMethod('report/GenerateReport', this.ReportGenerateData).subscribe((data: any) => {//Report generation API caliing
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

      }, err => {
        console.log(err)
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      })
    } else {// those weghments dont need calculations direct report
      let data = {}
      let report;
      if (this.tabletReport.value.reportOption == 'Friabilator') {
        report = {
          SelectedValue: tabRes.RepSerNo,
          UserId: this.sessionStorage.retrieve('userId'),
          UserName: this.sessionStorage.retrieve('username'),
          waterMark: true
        }
      } else if (this.tabletReport.value.reportOption == 'Moisture Analyzer') {
        report = {
          SelectedAction: tabRes.RepSerNo,
          UserId: this.sessionStorage.retrieve('userId'),
          UserName: this.sessionStorage.retrieve('username'),
          waterMark: true
        }
      } else if (this.tabletReport.value.reportOption == 'Tapped Density') {
        report = {
          SelectedValue: tabRes.BatchNo,
          UserId: this.sessionStorage.retrieve('userId'),
          UserName: this.sessionStorage.retrieve('username'),
          waterMark: true
        }
      }
      Object.assign(data, { data: report }, { FileName: reportName });
      this.ReportGenerateData = data;

      this.http.postMethod('report/GenerateReport', data).subscribe((data: any) => {
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
    this.bln_showReport = true;
    // Logic for show verfy report button
    if ((tabRes.CheckedByID == 'NULL' || tabRes.CheckedByID == null) && this.loggedInUserRights.includes('Verify Report') && this.loggedInUserId != tabRes.UserId) {
      this.bln_verifyReport = true;
    } else {
      this.bln_verifyReport = false;
    }

    // Logic for show self print/ Reprint button
    if (this.loggedInUserRights.includes('Reprint Report(Self)') && tabRes.UserId == this.loggedInUserId) {
         this.bln_print = true;
    } else {
      this.bln_print = false;
    }
    // Logic for show all print/ Reprint button
    if (this.loggedInUserRights.includes('Reprint All Report') && tabRes.PrintNo > 0) {
      this.bln_printAll = true;
    } else {
      this.bln_printAll = false;
    }
  }
  //********************************************************************************************* */
  printReportReasons(tabRes) {
    // I fweighment report open thne we set flag to false
    this.bln_showPrintReasons = false;
    this.bln_show = false;
    if(tabRes.PrintNo > 0){
      this.bln_loading = true;
      let data = {};
      let reportOption = this.tabletReport.value.reportOption;
      let reportType = this.tabletReport.value.reportType;
      let recordFrom = this.tabletReport.value.recordFrom;
      let RepSrNo = tabRes.RepSerNo;
      Object.assign(data, {reportOption:reportOption},{reportType:reportType},{recordFrom:recordFrom},
        {RepSrNo:RepSrNo});
        this.http.postMethod('report/printReasonReport', data).subscribe((res=>{
          let data = {};
          Object.assign(data, res, {UserId:this.sessionStorage.retrieve('userId')},
          {UserName:this.sessionStorage.retrieve('username')})
          let ReportData = {};
          Object.assign(ReportData, { data: data }, { FileName: 'RepoViewReasonPrintout' });
          this.ReportGenerateData = ReportData;
          this.http.postMethod('report/GenerateReport', ReportData).subscribe((data: any) => {
            this.toolbar = "#toolbar=0&navpanes=0";
            const rand = Math.random();
            this.str_path = data.filepath;
            this.pdfSrc = data.filepath + "?v=" + rand + this.toolbar;
            this.Url = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);
            this.bln_loading = false;
            this.bln_showPrintReasons = true;
          }, err => {
            this.errorHandling.checkError(err.status);
            this.bln_loading = false;
          })
        }), err=>{
          this.errorHandling.checkError(err.status);
          this.bln_loading = false;
        })
      console.log(tabRes)
    } else {
      swal('No Record Found','Sorry No Print Out reasons found', 'warning');
    }
  }
  /**
   * @description Function for printing the report
   */
  printReport() {
    // After first Print we have to ask for reason
    this.tempReportNumberData = {
      recordFrom: this.tabletReport.value.recordFrom
      , reportOption: this.tabletReport.value.reportOption
      , reportType: this.tabletReport.value.reportType
      , intReportSerNo: this.ProductDetails.RepSerNo
      , strUserId: this.sessionStorage.retrieve('userId')
      , strUserName: this.sessionStorage.retrieve('username')
      , intPrintCount: this.ProductDetails.PrintNo + 1
    }
    if (this.ProductDetails.PrintNo > 0) {
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

          this.generateReportWithoutWatermark().then(result => {
            this.open();
          }).catch(err => {
            this.errorHandling.checkError(err.status);

          })
        }
      })
    } else {
      Object.assign(this.tempReportNumberData, { strReason: '' })

      this.generateReportWithoutWatermark().then(result => {
        this.open();
      }).catch(err => {
        this.errorHandling.checkError(err.status);
      })
    }
  }
  /**
   * @description Function Used to generate report without watermark if print funcion called
   */
  generateReportWithoutWatermark() {
    return new Promise((resolve, reject) => {
      const reportData = this.ReportGenerateData;
      delete reportData.data.waterMark;
      Object.assign(reportData.data, { waterMark: false });
      this.http.postMethod('report/GenerateReport', reportData).subscribe((data: any) => {
        resolve(data)
      }, err => {
          reject(err)
      })
    })
  }
  /**
   * @description Below Function used to dispaly list of printer and take printOut
   */
  open() {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.path = this.str_path;
  }
  /**
   * @description Function used To verify report
   */
  VerifyReport() {
    this.bln_showPrintReasons = false;
    // After first Print we have to ask for reason
    let verifyReport = {
      recordFrom: this.tabletReport.value.recordFrom
      , reportOption: this.tabletReport.value.reportOption
      , reportType: this.tabletReport.value.reportType
      , intReportSerNo: this.ProductDetails.RepSerNo
      , strUserId: this.sessionStorage.retrieve('userId')
      , strUserName: this.sessionStorage.retrieve('username')
    }
    this.bln_loading = true;
    // Step1) First we have to verify Report
    this.http.postMethod('report/verifyreport', verifyReport).subscribe(res => {
      const tempData = {
        recordFrom: this.tabletReport.value.recordFrom, reportOption: this.tabletReport.value.reportOption
        , reportType: this.tabletReport.value.reportType, testType: this.tabletReport.value.testType,
        RepSerNo: this.ProductDetails.RepSerNo, userId: this.sessionStorage.retrieve('userId'), username: this.sessionStorage.retrieve('username')
      }

      const reportData = this.ReportGenerateData;
       // Step2) Secondly We have to move updated data to temporary tables
      this.http.postMethod('tabletRoute/ViewTabReport', tempData).subscribe(res => {
        this.bln_isReportVerified = true;
        this.RefreshTableData();
        // Step3) Finally we make report
        this.http.postMethod('report/GenerateReport', reportData).subscribe((data: any) => {
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
      })
    }, err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
    })
  }
  /**
   * @description Function is used to refresh data from table Name when User click on verify report
   */
  RefreshTableData() {
    this.http.postMethod('tabletRoute/getTabletDetails', this.refreshDataObj).subscribe((response: any) => {
      if (response.status == 'success') {
        this.bln_hideDatable = false;
        if (response.result.length !== 0) {
          // here we are checking if user has right of view all report
          var arrProducttablet = response.result;
          if (this.sessionStorage.retrieve('rightsArray').includes('View All Report')) {
            this.tabletResult = arrProducttablet;
          } else {
            arrProducttablet = arrProducttablet.filter(k => k.UserId === this.loggedInUserId);
            this.tabletResult = arrProducttablet;
          }
          if (this.dtElement.dtInstance === undefined) {
            this.dtTrigger.next();
          } else {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.dtTrigger.next();
            });
          }
        }
      } else {
        swal("Something Went Wrong", "Please select apppropriate options", "Warning");
      }
    }, err => {
      this.errorHandling.checkError(err.status);
      this.bln_loading = false;
    })
  }
  ngOnDestroy() {
    console.log('Subscribtion cleared')
    this.MessageSubscription.unsubscribe();
  }
}
