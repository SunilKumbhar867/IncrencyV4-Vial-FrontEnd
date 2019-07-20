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
import { DataService } from '../../services/commonData/data.service';
declare var swal: any;
@Component({
  selector: "app-balance",
  templateUrl: "./balance.component.html",
  styleUrls: ["./balance.component.css"]
})
export class BalanceComponent implements OnInit {
  bln_loading: boolean;
  sarr_balanceID: Array<any> = [];
  sarr_actions: Array<any> = ["All", "Add", "Edit","Activate","Deactivate"];
  todayDate = new Date();
  // Declaring Reactive Form
  balance = new FormGroup({
    balanceID: new FormControl(),
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
  str_balanceid: string;

  constructor(
    public fb: FormBuilder,
    public datePipe: DatePipe,
    public http: HttpService,
    private errorHandling?: ErrorHandlingService,
    private sessionStorage?: SessionStorageService,
    private sanitizer?: DomSanitizer,
    private modalService?: NgbModal,
    private dataservice ?: DataService
  ) {
    // Initializing Reactive Form & giving validations
    this.balance = this.fb.group({
      balanceID: new FormControl("All", [Validators.required]),
      action: new FormControl("All", [Validators.required]),
      toDate: new FormControl(this.todayDate, [Validators.required]),
      fromDate: new FormControl(this.todayDate, [Validators.required])
    });
    this.getData();
  }

  //Below funtion will return list of all Balance ID's
  getData() {
    this.bln_loading = true;
    this.http.getMethod("balance/getBalanceDetails").subscribe(
      (data: any) => {
        this.bln_loading = false;
        const items = [];
        items.push("All");
        for (let i = 0; i < Object.keys(data.result).length; i++) {
          items.push(data.result[i].Bal_ID);
        }
        this.sarr_balanceID = items;
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  // This function will check that from date should always be less than to date
  addEvent() {
    this.fromDate = this.balance.value.fromDate;
    const toDate = this.datePipe.transform(
      this.balance.value.toDate,
      "yyyy/MM/dd"
    );
    const fromDate = this.datePipe.transform(
      this.balance.value.fromDate,
      "yyyy/MM/dd"
    );
    if (fromDate > toDate) {
      swal("", "FROM DATE should be less than TO DATE", "warning");
      this.balance.patchValue({
        toDate: this.todayDate,
        fromDate: this.todayDate
      });
    }
  }

  // Below Function will take input from user & send that data to Node Server API which will generate the report & send the generated path in response
  onSubmit() {
    const toDate = this.datePipe.transform(
      this.balance.value.toDate,
      "yyyy/MM/dd"
    );
    const fromDate = this.datePipe.transform(
      this.balance.value.fromDate,
      "yyyy/MM/dd"
    );
    const FileName = "RepoAuditBalance";
    const userID = this.sessionStorage.retrieve("userid");
    const userName = this.sessionStorage.retrieve("username");
    const SelectedValue =
      this.balance.value.balanceID == "All" ? "" : this.balance.value.balanceID;
    const SelectedAction =
      this.balance.value.action == "All" ? "" : this.balance.value.action;
    const data: Object = {};
    const ObjectData: Object = {};
    Object.assign(
      ObjectData,
      { FromDate: fromDate },
      { ToDate: toDate },
      { UserId: userID },
      { UserName: userName },
      { SelectedValue: SelectedValue },
      { SelectedAction: SelectedAction }
    );
    Object.assign(data, { data: ObjectData }, { FileName: FileName });
    const finalObject=Object.assign({reportObj:data},{strTableName:"tbl_audit_bal_setting"});
    if (fromDate > toDate) {
      swal("", "FROM DATE should be less than TO DATE", "warning");
    } else {
      this.bln_loading = true;
      this.http
        .postMethod("report/rptAuditBalance", finalObject)
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
    this.balance.reset();
  }

   // This method will open Modal to select the printer & send the pdf Path of Generated File
   open() {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.path = this.str_path;
  }

  ngOnInit()
  {
    //getNomenclature detail from api
    this.dataservice.getNomenclatureDetails().then((res:any)=>{
      this.str_balanceid = res[0].BalanceID;
    });
  }
}
