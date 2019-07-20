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
import { ConfigService } from "../../services/configuration/config.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent } from "../../shared/modal/modal.component";
declare var swal: any;
@Component({
  selector: "app-unauthorized-user",
  templateUrl: "./unauthorized-user.component.html",
  styleUrls: ["./unauthorized-user.component.css"]
})
export class UnauthorizedUserComponent implements OnInit {
  bln_loading: boolean;
  sarr_ipData: Array<any> = [];
  toolbar: string;
  pdfSrc: string;
  Url: any;
  bln_show: boolean;
  todayDate = new Date();
  str_path: String;
  fromDate: Date;

  // Declaring Reactive Form
  unauthorizedLogin = new FormGroup({
    ipAddress: new FormControl(),
    toDate: new FormControl(),
    fromDate: new FormControl()
  });

  constructor(
    public fb: FormBuilder,
    public datePipe: DatePipe,
    public http: HttpService,
    private errorHandling?: ErrorHandlingService,
    private sessionStorage?: SessionStorageService,
    private sanitizer?: DomSanitizer,
    private ConfigService?: ConfigService,
    private modalService?: NgbModal
  ) {
    // Initializing Reactive Form & giving validations
    this.unauthorizedLogin = this.fb.group({
      ipAddress: new FormControl("All", [Validators.required]),
      toDate: new FormControl(this.todayDate, [Validators.required]),
      fromDate: new FormControl(this.todayDate, [Validators.required])
    });
    this.getData();
  }

  //Below funtion will return list of all users IP Address
  getData() {
    // /  this.bln_loading = true;
    this.http.getMethod("login/unauthorizedUser").subscribe(
      (res: any) => {
        this.bln_loading = false;
        this.sarr_ipData = res.result;
        const data = [];
        data.push("All");
        for (let i = 0; i < Object.keys(this.sarr_ipData).length; i++) {
          data.push(this.sarr_ipData[i].HOST);
        }
        this.sarr_ipData = data;
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  // This function will check that from date should always be less than to date
  addEvent() {
    this.fromDate = this.unauthorizedLogin.value.fromDate;
    const toDate = this.datePipe.transform(
      this.unauthorizedLogin.value.toDate,
      "yyyy/MM/dd"
    );
    const fromDate = this.datePipe.transform(
      this.unauthorizedLogin.value.fromDate,
      "yyyy/MM/dd"
    );
    if (fromDate > toDate) {
      swal("", "FROM DATE should be less than TO DATE", "warning");
      this.unauthorizedLogin.patchValue({
        toDate: this.todayDate,
        fromDate: this.todayDate
      });
    }
  }

  // Below Function will take input from user & send that data to Node Server API which will generate the report & send the generated path in response
  onSubmit() {
    const FileName = "RepoAuditLoginFailure";
    const toDate = this.datePipe.transform(
      this.unauthorizedLogin.value.toDate,
      "yyyy/MM/dd"
    );
    const fromDate = this.datePipe.transform(
      this.unauthorizedLogin.value.fromDate,
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
      { SelectedValue: this.unauthorizedLogin.value.ipAddress }
    );
    Object.assign(data, { data: ObjectData }, { FileName: FileName });
    const finalObject=Object.assign({reportObj:data},{strTableName:"tbl_audit_unauthorized_user"});
    if (fromDate > toDate) {
      swal("", "FROM DATE should be less than TO DATE", "warning");
    } else {
      this.bln_loading = true;
      this.http
        .postMethod("report/auditUnauthorizedLogin", finalObject)
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
    this.unauthorizedLogin.reset();
  }

  // This method will open Modal to select the printer & send the pdf Path of Generated File
  open() {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.path = this.str_path;
  }

  ngOnInit() {}
}
