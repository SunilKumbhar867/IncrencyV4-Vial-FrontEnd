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
import { ConfigService } from "../../services/configuration/config.service";
import { ErrorHandlingService } from "../../services/error-handling/error-handling.service";
declare var swal: any;

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.css"]
})
export class ProductComponent implements OnInit {
  /** Variable Declaration */
  bln_loading: boolean;
  toolbar: string;
  pdfSrc: string;
  Url: any;
  bln_show = false;
  dtCurrentDate = new Date();
  str_path: String;
  fromDate: Date;

  producttype :Array<String>;
  type=["Compressed","Coated","Granulation"]
  action = [
    "Add Product",
    "Edit Product",
  ];
  frmProductTabletCapsule = new FormGroup({
    cboProductType: new FormControl("Tablet", [Validators.required]),
    prdType: new FormControl("Compressed", [Validators.required]),
    cboAction: new FormControl("", [Validators.required]),
    toDate: new FormControl(this.dtCurrentDate, [Validators.required]),
    fromDate: new FormControl(this.dtCurrentDate, [Validators.required])
  });
  constructor(
    public fb: FormBuilder,
    private ConfigService?: ConfigService,
    public datePipe?: DatePipe,
    public http?: HttpService,
    private sessionStorage?: SessionStorageService,
    private sanitizer?: DomSanitizer,
    private modalService?: NgbModal,
    private errorHandling?: ErrorHandlingService
  ) {
    this.ConfigService.getJsonFileData().subscribe(
      (res: any) => {
        const Data = [];
        for (let i = 0; i < Object.keys(res.Product).length; i++) {
          if (res.Product[i].Value == 1) {
            Data.push(res.Product[i].Name);
          }
        }
        this.producttype = Data;
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  onSubmit() {
    const toDate = this.datePipe.transform(
      this.frmProductTabletCapsule.value.toDate,
      "yyyy/MM/dd"
    );
    const fromDate = this.datePipe.transform(
      this.frmProductTabletCapsule.value.fromDate,
      "yyyy/MM/dd"
    );
    const strProductType =
      this.frmProductTabletCapsule.value.cboProductType == "Tablet" ? "1" : "2";
    const strAction =
      this.frmProductTabletCapsule.value.cboAction == "All"
        ? ""
        : this.frmProductTabletCapsule.value.cboAction;
    const FileName = "RepoAuditProduct";
    const data: Object = {};
    const userID = this.sessionStorage.retrieve("userid");
    const userName = this.sessionStorage.retrieve("username");
    const prdType=this.frmProductTabletCapsule.value.prdType;
    const ObjectData: Object = {};
    Object.assign(
      ObjectData,
      { SelectedValue: strProductType },
      { SelectedAction: strAction },
      { prdType: prdType },
      { FromDate: fromDate },
      { ToDate: toDate },
      { UserId: userID },
      { UserName: userName }
    );
    Object.assign(data, { data: ObjectData }, { FileName: FileName });
    const finalObject=Object.assign({reportObj:data},{strTableName:"tbl_audit_product"});
    console.log(JSON.stringify(finalObject));
    this.bln_loading = true;
    this.http
      .postMethod("report/rptAuditProduct", finalObject)
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

  // This function will check that from date should always be less than to date
  addEvent() {
    this.fromDate = this.frmProductTabletCapsule.value.fromDate;
    const toDate = this.datePipe.transform(
      this.frmProductTabletCapsule.value.toDate,
      "yyyy/MM/dd"
    );
    const fromDate = this.datePipe.transform(
      this.frmProductTabletCapsule.value.fromDate,
      "yyyy/MM/dd"
    );
    if (fromDate > toDate) {
      swal("", "FROM DATE should be less than TO DATE", "warning");
      this.frmProductTabletCapsule.patchValue({
        toDate: this.dtCurrentDate,
        fromDate: this.dtCurrentDate
      });
    }
  }

  reset() {
    this.bln_show = false;
    this.frmProductTabletCapsule.patchValue({
      cboProductType: this.producttype[0],
      cboAction: this.action[0],
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
