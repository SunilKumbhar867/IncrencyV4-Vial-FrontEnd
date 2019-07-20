import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { DatePipe } from "@angular/common";
import { HttpService } from "../../services/http/http.service";
import { ErrorHandlingService } from "../../services/error-handling/error-handling.service";
import { SessionStorageService } from "ngx-webstorage";
import { DomSanitizer } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent } from "../../shared/modal/modal.component";
import { ConfigService } from "../../services/configuration/config.service";
import { MasterDataService } from "../../services/master/master-data.service";
declare var swal: any;

@Component({
  selector: "app-instrument-usage",
  templateUrl: "./instrument-usage.component.html",
  styleUrls: ["./instrument-usage.component.css"]
})
export class InstrumentUsageComponent implements OnInit {
  bln_loading: boolean;
  sarr_equipmentData: Array<any> = [];
  sarr_equipmentID: Array<any> = [];
  todayDate = new Date();
  // Declaring Reactive Form
  instrumentUsage = new FormGroup({
    enquipmentType: new FormControl(),
    enquipmentID: new FormControl(),
    toDate: new FormControl(),
    fromDate: new FormControl()
  });
  toolbar: string;
  pdfSrc: string;
  Url: any;
  bln_show: boolean;
  str_path: String;
  sarr_balanceData: Array<any> = [];
  sarr_vernierData: Array<any> = [];
  sarr_equipmentOtherData: Array<any> = [];
  ReportGenerateData: any;

  constructor(
    public fb: FormBuilder,
    public datePipe: DatePipe,
    public http: HttpService,
    private errorHandling?: ErrorHandlingService,
    private sessionStorage?: SessionStorageService,
    private sanitizer?: DomSanitizer,
    private modalService?: NgbModal,
    private ConfigService?: ConfigService,
    private MasterDataService?: MasterDataService
  ) {
    // Initializing Reactive Form & giving validations
    this.instrumentUsage = this.fb.group({
      enquipmentType: new FormControl("", [Validators.required]),
      enquipmentID: new FormControl("", [Validators.required]),
      toDate: new FormControl(this.todayDate, [Validators.required]),
      fromDate: new FormControl(this.todayDate, [Validators.required])
    });
    this.getEquipmentData();
    //Return All Data From Master Service
    this.MasterDataService.getBalanceData().subscribe((data: any) => {
      this.sarr_balanceData = data.result;
    });
    this.MasterDataService.getVernierData().subscribe((data: any) => {
      this.sarr_vernierData = data;
    });
    this.MasterDataService.getEquipmentData().subscribe((data: any) => {
      this.sarr_equipmentOtherData = data.result;
    });
  }

  // Below function will return array of Equipment Type from Developer Panel
  getEquipmentData() {
    this.ConfigService.getJsonFileData().subscribe(
      (res: any) => {
        const Data = [];
        if (res.Balance[6].Value == 1) {
          Data.push(res.Balance[6].Name);
        }
        if (res.Vernier[0].Value == 1) {
          Data.push(res.Vernier[0].Name);
        }
        for (let i = 0; i < Object.keys(res.Equipment).length; i++) {
          if (res.Equipment[i].Value == 1) {
            Data.push(res.Equipment[i].Name);
          }
        }
        this.sarr_equipmentData = Data;
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  // This function will check that from date should always be less than to date
  addEvent() {
    const toDate = this.datePipe.transform(
      this.instrumentUsage.value.toDate,
      "yyyy/MM/dd"
    );
    const fromDate = this.datePipe.transform(
      this.instrumentUsage.value.fromDate,
      "yyyy/MM/dd"
    );
    if (fromDate > toDate) {
      swal("", "FROM DATE should be less than TO DATE", "warning");
      this.instrumentUsage.patchValue({
        toDate: this.todayDate,
        fromDate: this.todayDate
      });
    }
  }

  // This Function will fill Equipment ID Based to Equipment Type Selected
  onEquipmentSelect(type: String) {
    this.sarr_equipmentID = [];
    var items = [];
    switch (type) {
      case "Balance":
        for (let i = 0; i < Object.keys(this.sarr_balanceData).length; i++) {
          items.push(this.sarr_balanceData[i].Bal_ID);
          this.sarr_equipmentID = items;
        }
        break;
      case "Vernier":
        for (let i = 0; i < Object.keys(this.sarr_vernierData).length; i++) {
          items.push(this.sarr_vernierData[i].VernierNo);
          this.sarr_equipmentID = items;
        }
        break;
    }
    if (
      type == "Hardness" ||
      type == "Disintegration Tester" ||
      type == "Friabilator" ||
      type == "Moisture Analyzer" ||
      type == "Tapped Density" ||
      type == "Sieve Shaker"
    ) {
      for (
        let i = 0;
        i < Object.keys(this.sarr_equipmentOtherData).length;
        i++
      ) {
        if (type == this.sarr_equipmentOtherData[i].Eqp_Type) {
          items.push(this.sarr_equipmentOtherData[i].Eqp_ID);
        }
        this.sarr_equipmentID = items;
      }
    }
  }

  // Below Function will take input from user & send that data to Node Server API which will generate the report & send the generated path in response
  onSubmit() {
    const FileName = "RepoAuditInstrumentUsageLog";
    const toDate = this.datePipe.transform(
      this.instrumentUsage.value.toDate,
      "yyyy/MM/dd"
    );
    const fromDate = this.datePipe.transform(
      this.instrumentUsage.value.fromDate,
      "yyyy/MM/dd"
    );
    const userID = this.sessionStorage.retrieve("userid");
    const userName = this.sessionStorage.retrieve("username");
    const data: Object = {};
    const ObjectData: Object = {};
    var selectedValue = this.instrumentUsage.value.enquipmentType;
    var selectedAction = this.instrumentUsage.value.enquipmentID;
    if (selectedAction == "All") {
      selectedAction = "";
    }
    Object.assign(
      ObjectData,
      { FromDate: fromDate },
      { ToDate: toDate },
      { UserId: userID },
      { UserName: userName },
      { SelectedValue: selectedValue },
      { SelectedAction: selectedAction }
    );
    Object.assign(data, { data: ObjectData });
    console.log(JSON.stringify(data));

    if (fromDate > toDate) {
      swal("", "FROM DATE should be less than TO DATE", "warning");
    } else {
      this.bln_loading = true;
      this.http
        .postMethod("instrument/saveTempData", data)
        .subscribe((res: any) => {
          if (res[0].result === "Data not exist") {
            swal("No Record Found", "Please Try Again", "warning");
            this.bln_show = false;
            this.bln_loading = false;
          } else{
            let reportData = {};
            Object.assign(reportData,{data:res[0]},{ FileName: FileName })
            this.ReportGenerateData = reportData;
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
          }
        },
        err => {
          this.errorHandling.checkError(err.status);
          this.bln_loading = false;
        });
    }
  }

  // Below function will reset the form values
  reset() {
    this.instrumentUsage.reset();
  }

  // This method will open Modal to select the printer & send the pdf Path of Generated File
  open() {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.path = this.str_path;
  }
  printReport() {
    const reportData = this.ReportGenerateData;
    delete reportData.data.waterMark;
    Object.assign(reportData.data, { waterMark: false });
    this.http.postMethod('report/GenerateReport', reportData).subscribe((data: any) => {
      this.open();
    }, err => { 
      swal('','something went wrong, Please try again')
    })
  }
  ngOnInit() {}
}
