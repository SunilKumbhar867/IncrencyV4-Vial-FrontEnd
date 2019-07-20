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
import { DomSanitizer } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent } from "../../shared/modal/modal.component";
declare var swal: any;
@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"]
})
export class UserComponent implements OnInit {
  bln_loading: boolean;
  sarr_userID: Array<any> = [];
  sarr_actions: Array<any> = [
    "New User Added",
    "User Temporarily Disabled",
    "User Permanently Disabled",
    "User Enabled",
    "User Edited",
    "User Locked",
    "Change Password",
    "Change Users Password"
  ];
  todayDate = new Date();
  // Declaring Reactive Form
  user = new FormGroup({
    userID: new FormControl(),
    action: new FormControl(),
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
    private errorHandling?: ErrorHandlingService,
    private sessionStorage?: SessionStorageService,
    private sanitizer?: DomSanitizer,
    private modalService?: NgbModal
  ) {
    const isAdmin = this.sessionStorage.retrieve("type");
    if (isAdmin == 1) {
      var index = this.sarr_actions.indexOf('Change Password');
      if (index > -1) {
        this.sarr_actions.splice(index, 1);
      }
    }
    // Initializing Reactive Form & giving validations
    this.user = this.fb.group({
      userID: new FormControl("All", [Validators.required]),
      action: new FormControl("New User Added", [Validators.required]),
      toDate: new FormControl(this.todayDate, [Validators.required]),
      fromDate: new FormControl(this.todayDate, [Validators.required])
    });
    this.getData();
  }

  //Below funtion will return list of all users
  getData() {
    this.bln_loading = true;
    this.http.getMethod("user/getUsers").subscribe(
      (res: any) => {
        this.bln_loading = false;
        this.sarr_userID = res.result;
        const data = [];
        data.push("All");
        for (let i = 0; i < Object.keys(this.sarr_userID).length; i++) {
          data.push(this.sarr_userID[i].status.userid);
        }
        this.sarr_userID = data;
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  // This function will check that from date should always be less than to date
  addEvent() {
    this.fromDate = this.user.value.fromDate;
    const toDate = this.datePipe.transform(
      this.user.value.toDate,
      "yyyy/MM/dd"
    );
    const fromDate = this.datePipe.transform(
      this.user.value.fromDate,
      "yyyy/MM/dd"
    );
    if (fromDate > toDate) {
      swal("", "FROM DATE should be less than TO DATE", "warning");
      this.user.patchValue({
        toDate: this.todayDate,
        fromDate: this.todayDate
      });
    }
  }

  // Below Function will take input from user & send that data to Node Server API which will generate the report & send the generated path in response
  onSubmit() {
    if (this.user.value.action == "User Edited") {
      var FileName = "RepoAuditEditUsers";
    } else if (this.user.value.action == "Change Password") {
      var FileName = "RepoAuditChangePasswordSelf";
    } else if (this.user.value.action == "Change User Password") {
      var FileName = "RepoAuditChangePassword";
    } else {
      var FileName = "RepoAuditAddUsers";
    }
    const toDate = this.datePipe.transform(
      this.user.value.toDate,
      "yyyy/MM/dd"
    );
    const fromDate = this.datePipe.transform(
      this.user.value.fromDate,
      "yyyy/MM/dd"
    );
    const userID = this.sessionStorage.retrieve("userid");
    const userName = this.sessionStorage.retrieve("username");
    var selectedValue = this.user.value.userID;
    if (selectedValue == "All") {
      selectedValue = "";
    }
    const data: Object = {};
    const ObjectData: Object = {};
    Object.assign(
      ObjectData,
      { FromDate: fromDate },
      { ToDate: toDate },
      { UserId: userID },
      { UserName: userName },
      { SelectedValue: selectedValue },
      { SelectedAction: this.user.value.action }
    );
    Object.assign(data, { data: ObjectData }, { FileName: FileName });
    const finalObject=Object.assign({reportObj:data},{strTableName:"tbl_audit_users"});
    if (fromDate > toDate) {
      swal("", "FROM DATE should be less than TO DATE", "warning");
      this.user.patchValue({
        toDate: this.todayDate,
        fromDate: this.todayDate
      });
    } else {
      this.bln_loading = true;
      this.http
        .postMethod("report/rptAuditUser",finalObject)
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
    this.user.reset();
  }

  // This method will open Modal to select the printer & send the pdf Path of Generated File
  open() {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.path = this.str_path;
  }

  ngOnInit() {}
}
