import { Component, OnInit } from "@angular/core";
import
{
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { DatePipe } from "@angular/common";
import { HttpService } from "../../services/http/http.service";
import { SessionStorageService } from "ngx-webstorage";
import { DomSanitizer } from "@angular/platform-browser";
import { ErrorHandlingService } from "../../services/error-handling/error-handling.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent } from "../../shared/modal/modal.component";
declare var swal: any;
@Component({
  selector: 'app-audit-alert-setting',
  templateUrl: './audit-alert-setting.component.html',
  styleUrls: ['./audit-alert-setting.component.css']
})
export class AuditAlertSettingComponent implements OnInit
{
  bln_loading: boolean;
  todayDate = new Date();
  // Declaring Reactive Form
  areaSetting = new FormGroup({
    selectedArea: new FormControl(),
    toDate: new FormControl(),
    fromDate: new FormControl()
  });
  toolbar: string;
  pdfSrc: string;
  Url: any;
  bln_show: boolean;
  sarr_areaName: Array<String> = [];
  str_path: String;
  fromDate: Date;
  sarr_areaBatch:  Array<String> = [];

  constructor(
    public fb: FormBuilder,
    public datePipe: DatePipe,
    public http: HttpService,
    private sessionStorage?: SessionStorageService,
    private sanitizer?: DomSanitizer,
    private errorHandling?: ErrorHandlingService,
    private modalService?: NgbModal
  )
  {
    this.http.getMethod("alert/getAuditData").subscribe(
      (res: any) =>
      {
        console.log(res);
        for (let i = 0; i < Object.keys(res.result).length; i++)
        {
          this.sarr_areaName.push(res.result[i].Area);
        }
        // Removes Duplicates From Array
        this.sarr_areaName = this.sarr_areaName.filter(
          (el, i, a) => i === a.indexOf(el)
        );
        for (let i = 0; i < Object.keys(res.result).length; i++)
        {
          this.sarr_areaBatch.push(res.result[i].Batch);
        }
        // Removes Duplicates From Array
        this.sarr_areaBatch= this.sarr_areaBatch.filter(
          (el, i, a) => i === a.indexOf(el)
        );
      },
      err =>
      {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
    // Initializing Reactive Form & giving validations
    this.areaSetting = this.fb.group({
      selectedArea: new FormControl("", [Validators.required]),
      selectedBatch: new FormControl("", [Validators.required]),
      toDate: new FormControl(this.todayDate, [Validators.required]),
      fromDate: new FormControl(this.todayDate, [Validators.required])
    });
  }

  // This function will check that from date should always be less than to date
  addEvent()
  {
    this.fromDate = this.areaSetting.value.fromDate;
    const toDate = this.datePipe.transform(
      this.areaSetting.value.toDate,
      "yyyy/MM/dd"
    );
    const fromDate = this.datePipe.transform(
      this.areaSetting.value.fromDate,
      "yyyy/MM/dd"
    );
    if (fromDate > toDate)
    {
      swal("", "FROM DATE should be less than TO DATE", "warning");
      this.areaSetting.patchValue({
        toDate: this.todayDate,
        fromDate: this.todayDate
      });
    }
  }

  // Below Function will take input from user & send that data to Node Server API which will generate the report & send the generated path in response
  onSubmit()
  {
    const FileName = "RepoAuditAlert";
    const toDate = this.datePipe.transform(
      this.areaSetting.value.toDate,
      "yyyy/MM/dd"
    );
    const fromDate = this.datePipe.transform(
      this.areaSetting.value.fromDate,
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
      { SelectedValue: this.areaSetting.value.selectedArea },
      { SelectedAction: this.areaSetting.value.selectedBatch }
    );
    Object.assign(data, { data: ObjectData }, { FileName: FileName });
    const finalObject = Object.assign({ reportObj: data }, { strTableName: "tbl_audit_alertsetting" });
    console.log(JSON.stringify(finalObject));
    if (fromDate > toDate)
    {
      swal("", "FROM DATE should be less than TO DATE", "warning");
    } else
    {
     this.bln_loading = true;
      this.http
        .postMethod("report/rptAuditAlert", finalObject)
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
  reset()
  {
    this.bln_show = false;
    this.areaSetting.reset();
  }

  // This method will open Modal to select the printer & send the pdf Path of Generated File
  open()
  {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.path = this.str_path;
  }

  ngOnInit() { }
}

