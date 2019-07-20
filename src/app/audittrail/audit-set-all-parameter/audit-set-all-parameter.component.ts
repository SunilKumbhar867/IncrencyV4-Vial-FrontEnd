import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { DatePipe } from "@angular/common";
import { HttpService } from "../../services/http/http.service";
import { SessionStorageService } from "ngx-webstorage";
import { DomSanitizer } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent } from "../../shared/modal/modal.component";
import { ErrorHandlingService } from "../../services/error-handling/error-handling.service";
declare var swal: any;
@Component({
  selector: "app-audit-set-all-parameter",
  templateUrl: "./audit-set-all-parameter.component.html",
  styleUrls: ["./audit-set-all-parameter.component.css"]
})
export class AuditSetAllParameterComponent implements OnInit {
  bln_loading: boolean;
  // Add  "PERIODIC CALIBRATION BALANCE" &  "PERIODIC CALIBRATION VERNIER" if Individual Calibration of Equipments is required
  parameters: Array<String> = [
    "NO. OF ATTEMPTS FOR TRYING LOGIN",
    "PASSWORD AGING PERIOD",
    "LOCK PERIOD",
    "NO. OF DAYS TO REMIND PASSWORD AGING",
    "AUTO ENABLE CHANCES",
    "PASSWORD HISTORY COUNT",
    "AUTODISABLE PERIOD FOR NON LOGIN USER",
    "TIME OUT PERIOD",
    "ARCHIVE TIME PERIOD",
  ];

  parametersLdap: Array<String> = [
    "TIME OUT PERIOD",
    "ARCHIVE TIME PERIOD",
  ];
  todayDate = new Date();
  // Declaring Reactive Form
  setAllParameters = new FormGroup({
    selectedParameter: new FormControl(),
    toDate: new FormControl(),
    fromDate: new FormControl()
  });
  toolbar: string;
  pdfSrc: string;
  Url: any;
  bln_show: boolean;
  str_path: String;
  fromDate: Date;

  constructor(
    public fb: FormBuilder,
    public datePipe: DatePipe,
    public http: HttpService,
    private sessionStorage?: SessionStorageService,
    private sanitizer?: DomSanitizer,
    private modalService?: NgbModal,
    private errorHandling?: ErrorHandlingService,
  ) {
    // Initializing Reactive Form & giving validations
    this.setAllParameters = this.fb.group({
      selectedParameter: new FormControl("NO. OF ATTEMPTS FOR TRYING LOGIN", [
        Validators.required
      ]),
      toDate: new FormControl(this.todayDate, [Validators.required]),
      fromDate: new FormControl(this.todayDate, [Validators.required])
    });
  }

  // This function will check that from date should always be less than to date
  addEvent() {
    this.fromDate = this.setAllParameters.value.fromDate;
    const toDate = this.datePipe.transform(
      this.setAllParameters.value.toDate,
      "yyyy/MM/dd"
    );
    const fromDate = this.datePipe.transform(
      this.setAllParameters.value.fromDate,
      "yyyy/MM/dd"
    );
    if (fromDate > toDate) {
      swal("", "FROM DATE should be less than TO DATE", "warning");
      this.setAllParameters.patchValue({
        toDate: this.todayDate,
        fromDate: this.todayDate
      });
    }
  }

  // Below Function will take input from user & send that data to Node Server API which will generate the report & send the generated path in response
  onSubmit() {
    const FileName = "RepoAuditAllPeriods";
    const toDate = this.datePipe.transform(
      this.setAllParameters.value.toDate,
      "yyyy/MM/dd"
    );
    const fromDate = this.datePipe.transform(
      this.setAllParameters.value.fromDate,
      "yyyy/MM/dd"
    );
    const userID = this.sessionStorage.retrieve("userid");
    const userName = this.sessionStorage.retrieve("username");
    const data: Object = {};
    const ObjectData: Object = {};
    Object.assign(
      ObjectData,
      { FromDate: fromDate },
      { ToDate: toDate },
      { UserId: userID },
      { UserName: userName },
      { SelectedValue: this.setAllParameters.value.selectedParameter }
    );
    Object.assign(data, { data: ObjectData }, { FileName: FileName });
    const finalObject=Object.assign({reportObj:data},{strTableName:"tbl_audit_all_periods"});
    if (fromDate > toDate) {
      swal("", "FROM DATE should be less than TO DATE", "warning");
    } else {
      this.bln_loading = true;
      this.http
        .postMethod("report/auditsetAllParameters", finalObject)
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
    this.setAllParameters.reset();
  }

   // This method will open Modal to select the printer & send the pdf Path of Generated File
   open() {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.path = this.str_path;
  }

  ngOnInit() {}
}
