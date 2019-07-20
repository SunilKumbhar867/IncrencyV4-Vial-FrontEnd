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
  selector: "app-admin-change-password",
  templateUrl: "./admin-change-password.component.html",
  styleUrls: ["./admin-change-password.component.css"]
})
export class AdminChangePasswordComponent implements OnInit {
  bln_loading: boolean;
  todayDate = new Date();
  // Declaring Reactive Form
  adminChangePassword = new FormGroup({
    toDate: new FormControl(),
    fromDate: new FormControl()
  });
  toolbar: string;
  pdfSrc: string;
  bln_show: boolean;
  Url: any;
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
    this.adminChangePassword = this.fb.group({
      toDate: new FormControl(this.todayDate, [Validators.required]),
      fromDate: new FormControl(this.todayDate, [Validators.required])
    });
  }

   // This function will check that from date should always be less than to date
   addEvent() {
    this.fromDate = this.adminChangePassword.value.fromDate;
    const toDate = this.datePipe.transform(this.adminChangePassword.value.toDate, "yyyy/MM/dd"  );
    const fromDate = this.datePipe.transform(  this.adminChangePassword.value.fromDate, "yyyy/MM/dd" );
     if(fromDate > toDate){
       swal("", "FROM DATE should be less than TO DATE", "warning");
       this.adminChangePassword.patchValue({
         toDate:this.todayDate,
         fromDate:this.todayDate
       });
     }
   }

  // Below Function will take input from user & send that data to Node Server API which will generate the report & send the generated path in response
  onSubmit() {
    const FileName = "RepoAuditChangeAdminPassword";
    const data: Object = {};
    const toDate = this.datePipe.transform(
      this.adminChangePassword.value.toDate,
      "yyyy/MM/dd"
    );
    const fromDate = this.datePipe.transform(
      this.adminChangePassword.value.fromDate,
      "yyyy/MM/dd"
    );
    const userID = this.sessionStorage.retrieve("userid");
    const userName = this.sessionStorage.retrieve("username");
    const ObjectData: Object = {};
    Object.assign(
      ObjectData,
      { FromDate: fromDate },
      { ToDate: toDate },
      { UserId: userID },
      { UserName: userName }
    );
    Object.assign(data, { data: ObjectData }, { FileName: FileName });
    const finalObject=Object.assign({reportObj:data},{strTableName:"tbl_audit_admin_password"});
    if (fromDate > toDate) {
      swal("", "FROM DATE should be less than TO DATE", "warning");
    } else {
      this.bln_loading = true;
      this.http
        .postMethod("report/auditAdminPasswordChange", finalObject)
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
    this.adminChangePassword.reset();
  }

  // This method will open Modal to select the printer & send the pdf Path of Generated File
  open() {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.path = this.str_path;
  }

  ngOnInit() {}
}
