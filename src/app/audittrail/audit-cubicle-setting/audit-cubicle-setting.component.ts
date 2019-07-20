import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
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
  selector: "app-audit-cubicle-setting",
  templateUrl: "./audit-cubicle-setting.component.html",
  styleUrls: ["./audit-cubicle-setting.component.css"]
})
export class AuditCubicleSettingComponent implements OnInit {
  /** Variable Declaration */
  bln_loading: boolean;
  toolbar: string;
  pdfSrc: string;
  Url: any;
  bln_show = false;
  dtCurrentDate = new Date();
  str_path: String;
  fromDate: Date;
  dsArea = [];
  dsAction = ["Update", "Pause", "Start", "End", "Resume"];
  frmAuditCubicle = new FormGroup({
    cboArea: new FormControl("", [Validators.required]),
    cboAction: new FormControl("", [Validators.required]),
    toDate: new FormControl(this.dtCurrentDate, [Validators.required]),
    fromDate: new FormControl(this.dtCurrentDate, [Validators.required])
  });
  constructor(
    public fb: FormBuilder,
    public datePipe: DatePipe,
    public http: HttpService,
    private sessionStorage?: SessionStorageService,
    private sanitizer?: DomSanitizer,
    private modalService?: NgbModal,
    private errorHandling?: ErrorHandlingService
  ) {
    this.getAreaData();
  }

  // Below function will send data of all Area
  getAreaData() {
    this.http.getMethod("cubicle/getArea").subscribe(
      (res: any) => {
        console.log(res.result);
        const items = [];
        for (let i = 0; i < Object.keys(res.result).length; i++) {
          items.push(res.result[i].AREA);
        }
        this.dsArea = items;
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  onSubmit() {
    const toDate = this.datePipe.transform(
      this.frmAuditCubicle.value.toDate,
      "yyyy/MM/dd"
    );
    const fromDate = this.datePipe.transform(
      this.frmAuditCubicle.value.fromDate,
      "yyyy/MM/dd"
    );
    const strArea = this.frmAuditCubicle.value.cboArea;
    const strAction = this.frmAuditCubicle.value.cboAction;
    const FileName = "RepoAuditCubicleSetting";
    const data: Object = {};
    const userID = this.sessionStorage.retrieve("userid");
    const userName = this.sessionStorage.retrieve("username");
    const ObjectData: Object = {};
    Object.assign(
      ObjectData,
      { SelectedValue: strArea },
      { SelectedAction: strAction },
      { FromDate: fromDate },
      { ToDate: toDate },
      { UserId: userID },
      { UserName: userName }
    );
    Object.assign(data, { data: ObjectData }, { FileName: FileName });
    const finalObject = Object.assign(
      { reportObj: data },
      { strTableName: "tbl_audit_cubicle" }
    );
    this.bln_loading = true;
    this.http.postMethod("report/rptAuditCubicle", finalObject).subscribe(
      (res: any) => {
        if (res.data === "No records found") {
          swal("No Record Found", "Please Try Again", "warning");
          this.bln_show = false;
          this.bln_loading = false;
        } else {
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

  // This function will check that from date should always be less than to date
  addEvent() {
    this.fromDate = this.frmAuditCubicle.value.fromDate;
    const toDate = this.datePipe.transform(
      this.frmAuditCubicle.value.toDate,
      "yyyy/MM/dd"
    );
    const fromDate = this.datePipe.transform(
      this.frmAuditCubicle.value.fromDate,
      "yyyy/MM/dd"
    );
    if (fromDate > toDate) {
      swal("", "FROM DATE should be less than TO DATE", "warning");
      this.frmAuditCubicle.patchValue({
        toDate: this.dtCurrentDate,
        fromDate: this.dtCurrentDate
      });
    }
  }

  reset() {
    this.bln_show = false;
    this.frmAuditCubicle.patchValue({
      //cboProductType: this.producttype[0],
      //cboAction: this.action[0],
      toDate: this.dtCurrentDate,
      fromDate: this.dtCurrentDate
    });
  }

  // This method will open Modal to select the printer & send the pdf Path of Generated File
  open() {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.path = this.str_path;
  }

  ngOnInit() {}
}
