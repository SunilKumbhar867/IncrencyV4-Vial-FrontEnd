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
import { JsonDataService } from '../../services/commonData/json-data.service';
import { DataService } from '../../services/commonData/data.service';

declare var swal: any;
@Component({
  selector: "app-vernier",
  templateUrl: "./vernier.component.html",
  styleUrls: ["./vernier.component.css"]
})
export class VernierComponent implements OnInit {
  bln_loading: boolean;
  sarr_vernierID: Array<any> = [];
  sarr_actions: Array<any> = ["All", "Add", "Edit","Activate","Deactivate"];
  todayDate = new Date();
  // Declaring Reactive Form
  vernier = new FormGroup({
    vernierID: new FormControl(),
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
  int_showHideVernierCalib: any;
  str_vernierid: string;

  constructor(
    public fb: FormBuilder,
    public datePipe: DatePipe,
    public http: HttpService,
    private errorHandling?: ErrorHandlingService,
    private sessionStorage?: SessionStorageService,
    private sanitizer?: DomSanitizer,
    private modalService?: NgbModal,
    private jsonData?: JsonDataService,
    private dataservice ?: DataService
  ) {
    // Initializing Reactive Form & giving validations
    this.vernier = this.fb.group({
      vernierID: new FormControl("All", [Validators.required]),
      action: new FormControl("All", [Validators.required]),
      toDate: new FormControl(this.todayDate, [Validators.required]),
      fromDate: new FormControl(this.todayDate, [Validators.required])
    });
    this.getData();
  }

  //Below funtion will return list of all Vernier ID's
  getData() {
    this.bln_loading = true;
    this.http.getMethod("vernier/getVernier").subscribe(
      (res: any) => {
        this.bln_loading = false;
        const items = [];
        items.push("All");
        for (let i = 0; i < Object.keys(res).length; i++) {
          items.push(res[i].VernierID);
        }
        this.sarr_vernierID = items;
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  // This function will check that from date should always be less than to date
  addEvent() {
    this.fromDate = this.vernier.value.fromDate;
    const toDate = this.datePipe.transform(
      this.vernier.value.toDate,
      "yyyy/MM/dd"
    );
    const fromDate = this.datePipe.transform(
      this.vernier.value.fromDate,
      "yyyy/MM/dd"
    );
    if (fromDate > toDate) {
      swal("", "FROM DATE should be less than TO DATE", "warning");
      this.vernier.patchValue({
        toDate: this.todayDate,
        fromDate: this.todayDate
      });
    }
  }

  // Below Function will take input from user & send that data to Node Server API which will generate the report & send the generated path in response
  onSubmit() {
    const toDate = this.datePipe.transform(
      this.vernier.value.toDate,
      "yyyy/MM/dd"
    );
    const fromDate = this.datePipe.transform(
      this.vernier.value.fromDate,
      "yyyy/MM/dd"
    );

    this.jsonData.getValueFromJSON().then((res: any) =>
    {
      this.int_showHideVernierCalib = res.EquipmentCalibration[1].Value;

      if(this.int_showHideVernierCalib == "1")
      {
        var FileName = "RepoAuditVernier";
      }
      else
      {
        var FileName = "RepoAuditVernierNoCalib";
      }

      const userID = this.sessionStorage.retrieve("userid");
      const userName = this.sessionStorage.retrieve("username");
      const SelectedValue =
        this.vernier.value.vernierID == "All" ? "" : this.vernier.value.vernierID;
      const SelectedAction =
        this.vernier.value.action == "All" ? "" : this.vernier.value.action;
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
      const finalObject=Object.assign({reportObj:data},{strTableName:"tbl_audit_vernier"});
      if (fromDate > toDate) {
        swal("", "FROM DATE should be less than TO DATE", "warning");
      } else {
        this.bln_loading = true;
        this.http
          .postMethod("report/rptAuditVernier", finalObject)
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
    });

  }

  // Below function will reset the form values
  reset() {
    this.bln_show = false;
    this.vernier.reset();
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
      this.str_vernierid = res[0].VernierID;
    });
  }
}
