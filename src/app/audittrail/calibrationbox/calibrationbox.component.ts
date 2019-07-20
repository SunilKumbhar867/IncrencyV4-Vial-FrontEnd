import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { DatePipe } from "@angular/common";
import { HttpService } from "../../services/http/http.service";
import { ErrorHandlingService } from "../../services/error-handling/error-handling.service";
import { SessionStorageService } from "ngx-webstorage";
import { JsonDataService } from "../../services/commonData/json-data.service";
import { DomSanitizer } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent } from "../../shared/modal/modal.component";
import { ConfigService } from "../../services/configuration/config.service";
declare var swal: any;
@Component({
  selector: "app-calibrationbox",
  templateUrl: "./calibrationbox.component.html",
  styleUrls: ["./calibrationbox.component.css"]
})
export class CalibrationboxComponent implements OnInit {
  bln_loading: boolean;
  sarr_actions: Array<any> = ["All", "Add", "Update"];
  sarr_calibrationBox: Array<any> ;
  sarr_calibrationDetails: Array<any> = [];
  sarr_calibrationID: Array<any> = [];

  // Declaring Reactive Form
  calibrationBox = new FormGroup({
    boxType: new FormControl(),
    boxID: new FormControl(),
    action: new FormControl(),
    toDate: new FormControl(),
    fromDate: new FormControl()
  });
  path: any;
  Url: any;
  toolbar: string;
  temp: any;
  todayDate = new Date();
  pdfSrc: string;
  bln_show: boolean;
  str_path: String;
  fromDate: Date;

  constructor(
    public fb: FormBuilder,
    public datePipe: DatePipe,
    public http: HttpService,
    private ConfigService: ConfigService,
    private errorHandling?: ErrorHandlingService,
    private sessionStorage?: SessionStorageService,
    private jsonData?: JsonDataService,
    private sanitizer?: DomSanitizer,
    private modalService?: NgbModal
  ) {
    // Initializing Reactive Form & giving validations
    this.calibrationBox = this.fb.group({
      boxType: new FormControl("", [Validators.required]),
      boxID: new FormControl("All", [Validators.required]),
      action: new FormControl("All", [Validators.required]),
      toDate: new FormControl(this.todayDate, [Validators.required]),
      fromDate: new FormControl(this.todayDate, [Validators.required])
    });
    this.getData();
    this.getUnitData();
  }

  // Below function will return array of Calibration Boxes From Developer Panel
  getUnitData() {
    this.ConfigService.getJsonFileData().subscribe(
      (res: any) => {
        const Data = [];
        for (let i = 0; i < Object.keys(res.CalibrationBox).length; i++) {
          if (res.CalibrationBox[i].Value == 1) {
            Data.push(res.CalibrationBox[i].Name);
          }
        }
        this.sarr_calibrationBox = Data;
        console.log(this.sarr_calibrationBox);
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  //Below funtion will return list of all Calibration Box Details
  getData() {
    this.bln_loading = true;
    this.http.getMethod("calibrationbox/getCalibration").subscribe(
      (res: any) => {
        this.bln_loading = false;
        this.sarr_calibrationDetails = res;
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  // Below function will filter data based on Selected Box
  onSelectType(type: String) {
    if (type == "Weight Box") {
      const SelectedBox = this.sarr_calibrationDetails.filter(
        x => x.CB_Type === type
      );
      this.sarr_calibrationID = [];
      for (let i = 0; i < Object.keys(SelectedBox).length; i++) {
        this.sarr_calibrationID.push(SelectedBox[i].CB_ID);
      }
      this.sarr_calibrationID = this.sarr_calibrationID.filter(
        (el, i, a) => i === a.indexOf(el)
      );
    } else if (type == "Block Box") {
      const SelectedBox = this.sarr_calibrationDetails.filter(
        x => x.CB_Type === type
      );
      this.sarr_calibrationID = [];
      for (let i = 0; i < Object.keys(SelectedBox).length; i++) {
        this.sarr_calibrationID.push(SelectedBox[i].CB_ID);
      }
      this.sarr_calibrationID = this.sarr_calibrationID.filter(
        (el, i, a) => i === a.indexOf(el)
      );
    }
  }

  // This function will check that from date should always be less than to date
  addEvent() {
    this.fromDate = this.calibrationBox.value.fromDate;
    const toDate = this.datePipe.transform(
      this.calibrationBox.value.toDate,
      "yyyy/MM/dd"
    );
    const fromDate = this.datePipe.transform(
      this.calibrationBox.value.fromDate,
      "yyyy/MM/dd"
    );
    if (fromDate > toDate) {
      swal("", "FROM DATE should be less than TO DATE", "warning");
      this.calibrationBox.patchValue({
        toDate: this.todayDate,
        fromDate: this.todayDate
      });
    }
  }

  // Below Function will take input from user & send that data to Node Server API which will generate the report & send the generated path in response
  onSubmit() {
    const toDate = this.datePipe.transform(
      this.calibrationBox.value.toDate,
      "yyyy/MM/dd"
    );
    const fromDate = this.datePipe.transform(
      this.calibrationBox.value.fromDate,
      "yyyy/MM/dd"
    );
    const FileName = "RepoAuditCalibrationBox";
    const userID = this.sessionStorage.retrieve("userid");
    const userName = this.sessionStorage.retrieve("username");
    const SelectedAction =
      this.calibrationBox.value.action == "All"
        ? ""
        : this.calibrationBox.value.action;
    const data: Object = {};
    const ObjectData: Object = {};
    Object.assign(
      ObjectData,
      { FromDate: fromDate },
      { ToDate: toDate },
      { selectedBoxType: this.calibrationBox.value.boxType },
      { SelectedValue: this.calibrationBox.value.boxID },
      { SelectedAction: SelectedAction },
      { UserId: userID },
      { UserName: userName }
    );
    Object.assign(data, { data: ObjectData }, { FileName: FileName });
    const finalObject=Object.assign({reportObj:data},{strTableName:"tbl_audit_calibrationbox"});
    if (fromDate > toDate) {
      swal("", "FROM DATE should be less than TO DATE", "warning");
    } else {
      this.bln_loading = true;
      this.http
        .postMethod("report/rptCalibrationBox", finalObject)
        .subscribe((res: any) => {
          if (res.data === "No records found") {
            swal("No Record Found", "Please Try Again", "warning");
            this.bln_show = false;
            this.bln_loading = false;
          } else{
            this.toolbar = "#toolbar=0&navpanes=0";
            const rand = Math.random();
            this.str_path = res.filepath;
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
  reset() {
    this.bln_show = false;
    this.calibrationBox.reset();
  }

  // This method will open Modal to select the printer & send the pdf Path of Generated File
  open() {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.path = this.str_path;
  }

  ngOnInit() {}
}
