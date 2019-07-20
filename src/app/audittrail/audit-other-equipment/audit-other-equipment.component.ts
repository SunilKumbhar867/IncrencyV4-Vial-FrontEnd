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
import { ConfigService } from "../../services/configuration/config.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent } from "../../shared/modal/modal.component";
declare var swal: any;

@Component({
  selector: "app-audit-other-equipment",
  templateUrl: "./audit-other-equipment.component.html",
  styleUrls: ["./audit-other-equipment.component.css"]
})
export class AuditOtherEquipmentComponent implements OnInit {
  bln_loading: boolean;
  sarr_actions: Array<any> = ["All", "Add", "Update", "Activate", "Deactivate"];
  sarr_equipmentID: Array<any> = [];
  sarr_EquipmentData: Array<any> = [];

  // Declaring Reactive Form
  equipment = new FormGroup({
    equipmentType: new FormControl(),
    equipmentID: new FormControl(),
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
    private errorHandling?: ErrorHandlingService,
    private sessionStorage?: SessionStorageService,
    private sanitizer?: DomSanitizer,
    private ConfigService?: ConfigService,
    private modalService?: NgbModal
  ) {
    // Initializing Reactive Form & giving validations
    this.equipment = this.fb.group({
      equipmentType: new FormControl("", [Validators.required]),
      equipmentID: new FormControl("All", [Validators.required]),
      action: new FormControl("All", [Validators.required]),
      toDate: new FormControl(this.todayDate, [Validators.required]),
      fromDate: new FormControl(this.todayDate, [Validators.required])
    });
    this.getEquipmentType();
  }

  getEquipmentType() {
    this.ConfigService.getJsonFileData().subscribe(
      (res: any) => {
        const Data = [];
        for (let i = 0; i < Object.keys(res.Equipment).length; i++) {
          if (res.Equipment[i].Value == 1) {
            Data.push(res.Equipment[i].Name);
          }
        }
        this.sarr_EquipmentData = Data;
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  // Below function will filter data based on Selected Box
  onSelectType(type: any) {
    this.http.getMethod("otherequipment/getOtherEquipment").subscribe(
      (res: any) => {
        const SelectedEquipments = res.result.filter(x => x.Eqp_Type === type);
        this.sarr_equipmentID = [];
        this.sarr_equipmentID.push("All");
        for (let i = 0; i < Object.keys(SelectedEquipments).length; i++) {
          this.sarr_equipmentID.push(SelectedEquipments[i].Eqp_ID);
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
    this.fromDate = this.equipment.value.fromDate;
    const toDate = this.datePipe.transform(
      this.equipment.value.toDate,
      "yyyy/MM/dd"
    );
    const fromDate = this.datePipe.transform(
      this.equipment.value.fromDate,
      "yyyy/MM/dd"
    );
    if (fromDate > toDate) {
      swal("", "FROM DATE should be less than TO DATE", "warning");
      this.equipment.patchValue({
        toDate: this.todayDate,
        fromDate: this.todayDate
      });
    }
  }

  // Below Function will take input from user & send that data to Node Server API which will generate the report & send the generated path in response
  onSubmit() {
    const toDate = this.datePipe.transform(
      this.equipment.value.toDate,
      "yyyy/MM/dd"
    );
    const fromDate = this.datePipe.transform(
      this.equipment.value.fromDate,
      "yyyy/MM/dd"
    );
    const FileName = "RepoAuditEquipment";
    const userID = this.sessionStorage.retrieve("userid");
    const userName = this.sessionStorage.retrieve("username");
    const SelectedAction =
      this.equipment.value.action == "All" ? "" : this.equipment.value.action;
    const SelectedValue =
      this.equipment.value.equipmentID == "All"
        ? ""
        : this.equipment.value.equipmentID;
    const data: Object = {};
    const ObjectData: Object = {};
    Object.assign(
      ObjectData,
      { FromDate: fromDate },
      { ToDate: toDate },
      { SelectedType: this.equipment.value.equipmentType },
      { SelectedValue: SelectedValue },
      { SelectedAction: SelectedAction },
      { UserId: userID },
      { UserName: userName }
    );
    Object.assign(data, { data: ObjectData }, { FileName: FileName });
    const finalObject=Object.assign({reportObj:data},{strTableName:"tbl_audit_other_equipment"});
    if (fromDate > toDate) {
      swal("", "FROM DATE should be less than TO DATE", "warning");
    } else {
      this.bln_loading = true;
      this.http
        .postMethod("report/rptAuditotherEquipment", finalObject)
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
    this.equipment.reset();
  }

  // This method will open Modal to select the printer & send the pdf Path of Generated File
  open() {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.path = this.str_path;
  }

  ngOnInit() {}
}
