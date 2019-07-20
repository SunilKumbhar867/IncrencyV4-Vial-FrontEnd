import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { HttpService } from "../../services/http/http.service";
import { DatePipe } from "@angular/common";
import { ErrorHandlingService } from "../../services/error-handling/error-handling.service";
import { SessionStorageService } from 'ngx-webstorage';
import { JsonDataService } from '../../services/commonData/json-data.service';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
declare var swal: any;

@Component({
  selector: 'app-capsule',
  templateUrl: './capsule.component.html',
  styleUrls: ['./capsule.component.css']
})
export class CapsuleComponent implements OnInit {
  bln_verifyReport = false;
  bln_print = false;
  bln_printAll = false;
  bln_loading: boolean;
  bln_showReport = false;
  strloggedInUserId: any;
  bln_hideDatable = true;
  arrTabletResult: Array<any>;
  arrLoggedInUserRights;
    // View child for datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  todayDate = new Date();
  arrReportOptions;
  arrtestType = ['Regular', 'Initial'];
  arrReportType = ['Complete', 'Incomplete'];
  arrRecordFrom = ['Current', 'Archive'];
  public capsuleReport: FormGroup;
  constructor(private fb: FormBuilder,
    private http?: HttpService,
    public datePipe?: DatePipe,
    private errorHandling?: ErrorHandlingService,
    private sessionStorage?: SessionStorageService,
    private jsonDataService?: JsonDataService,
    private http1?: HttpClient) { 
    this.capsuleReport = this.fb.group({
      reportOption: ['', Validators.required],
      testType: [this.arrtestType[0], Validators.required],
      fromDate: [this.todayDate, Validators.required],
      toDate: [this.todayDate, Validators.required],
      reportType: [this.arrReportType[0], Validators.required],
      recordFrom: [this.arrRecordFrom[0], Validators.required]
    });
    this.arrLoggedInUserRights = this.sessionStorage.retrieve('rightsArray');
    }

  ngOnInit() {
    // caliing developer json here to find out which weighment option we have
    this.jsonDataService.getValueFromJSON().then((res: any) => {
      this.arrReportOptions = res.Tablet.filter(k => k.Value == 1).map(function (e) {
        if ((e.Name != "Edit") && (e.Name != "Coating")) {
          return e.Name;
        }
      })
      this.capsuleReport.patchValue({
        reportOption: this.arrReportOptions[0]
      })
    });
    // Initiate the data tables
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10
    };
    // getting user from storage
    this.strloggedInUserId = this.sessionStorage.retrieve('userId');
   // console.log(this.loggedInUserRights);
  }
  //***************************************************************************************** */
  // This function will check that from date should always be less than to date
  //*************************************************************************************** */
  addEvent() {
    const toDate = this.datePipe.transform(this.capsuleReport.value.toDate, "yyyy/MM/dd");
    const fromDate = this.datePipe.transform(this.capsuleReport.value.fromDate, "yyyy/MM/dd");
    if (fromDate > toDate) {
      swal("", "FROM DATE should be less than TO DATE", "warning");
      this.capsuleReport.patchValue({
        toDate: this.todayDate,
        fromDate: this.todayDate
      });
    }
  }
  //******************************************************************************** */
  onSubmit() {
    var data: Object = {};
    const toDate = this.datePipe.transform(this.capsuleReport.value.toDate, 'yyyy-MM-dd');
    const fromDate = this.datePipe.transform(this.capsuleReport.value.fromDate, 'yyyy-MM-dd');

    const reportOption = this.capsuleReport.value.reportOption;
    const testType = this.capsuleReport.value.testType;
    const reportType = this.capsuleReport.value.reportType;
    const recordFrom = this.capsuleReport.value.recordFrom;

    Object.assign(data, { fromDate: fromDate }, { toDate: toDate }, { reportOption: reportOption }, { testType: testType },
      { reportType: reportType }, { recordFrom: recordFrom });
    console.log(JSON.stringify(data))
    this.bln_loading = true;
    this.http.postMethod('capsuleRoute/getCapsuleDetails', data).subscribe((response: any) => {
      this.bln_loading = false;
      if (response.status == 'success') {
        this.bln_hideDatable = false;
        if (response.result.length !== 0) {
          // here we are checking if user has right of view all report
          var arrProducttablet = response.result;
          if (this.sessionStorage.retrieve('rightsArray').includes('View All Report')) {
            this.arrTabletResult = arrProducttablet;
          } else {
            arrProducttablet = arrProducttablet.filter(k => k.UserId === this.strloggedInUserId);
            this.arrTabletResult = arrProducttablet;
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
    if (e == 'Individual' || e == 'Differential' || e == 'Diameter' || e == 'Length' || e == 'Disintegration Tester') {
      this.arrReportType = ['Complete', 'Incomplete']
    } else {
      this.arrReportType = ['Complete'];;
    }
  }
  doSelectReportType(e) {
    if (e == 'Complete') {
      this.arrRecordFrom = ['Current', 'Archive'];
    } else {
      this.arrRecordFrom = ['Current'];
    }
  }
  //******************************************************************************************** */
  // Function usage
  //********************************************************************************************* */
  viewReport(tabRes) {
    this.bln_showReport = true;
    // Logic for show verfy report button
    if ((tabRes.CheckedByID == 'NULL' || tabRes.CheckedByID == null)
      && this.arrLoggedInUserRights.includes('Verify Report') && this.strloggedInUserId != tabRes.UserId) {
      this.bln_verifyReport = true;
    } else {
      this.bln_verifyReport = false;
    }
    // Logic for show self print/ Reprint button
    if (this.arrLoggedInUserRights.includes('Reprint Report(Self)') && tabRes.UserId == this.strloggedInUserId) {
      this.bln_print = true;
    } else {
      this.bln_print = false;
    }
    // Logic for show all print/ Reprint button
    if (this.arrLoggedInUserRights.includes('Reprint All Report') && tabRes.PrintNo > 0) {
      this.bln_printAll = true;
    } else {
      this.bln_printAll = false;
    }

  }
  //********************************************************************************************* */
  printReport(tabRes) {
    console.log(tabRes);
  }
}
