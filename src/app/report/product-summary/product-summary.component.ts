import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { HttpService } from "../../services/http/http.service";
import { DatePipe } from "@angular/common";
import { ErrorHandlingService } from "../../services/error-handling/error-handling.service";
import { SessionStorageService } from 'ngx-webstorage';
import { JsonDataService } from '../../services/commonData/json-data.service';
import { DataService } from '../../services/commonData/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../shared/modal/modal.component';
import { RemarkModalComponent } from '../../shared/remark-modal/remark-modal.component';
declare var swal: any;

@Component({
  selector: 'app-product-summary',
  templateUrl: './product-summary.component.html',
  styleUrls: ['./product-summary.component.css'],
  providers: [DataService]
})
export class ProductSummaryComponent implements OnInit {

  public frm_prdSummary: FormGroup;
  dt_todayDate = new Date();
  sarr_prdType = [];
  sarr_CubicType = [];
  sarr_rptOption = [];
  sarr_prdDetail = [];

  obj_CubicType: any;
  strProductType:string;
  bln_show: boolean;
  bln_loading: boolean;
  str_reportName: string = "";

  pdfSrc: string;
  Url: any;
  toolbar: string;
  str_path: String;

  constructor(private fb: FormBuilder,
    private http?: HttpService,
    public datePipe?: DatePipe,
    private errorHandling?: ErrorHandlingService,
    private sessionStorage?: SessionStorageService,
    private jsonDataService?: JsonDataService,
    private dataService?: DataService,
    private sanitizer?: DomSanitizer,
    private modalService?: NgbModal,
  private http1?:HttpClient) {

    this.frm_prdSummary = this.fb.group({
      str_prdType: new FormControl('', [Validators.required]),
      str_cubicType: new FormControl('', [Validators.required]),
      str_rptOption: new FormControl('', [Validators.required]),
      str_prdDetail: new FormControl('', [Validators.required]),
      dt_fromDate: new FormControl(this.dt_todayDate, [Validators.required]),
      dt_toDate: new FormControl(this.dt_todayDate, [Validators.required])
    })
  }

  ngOnInit()
  {
    this.jsonDataService.getValueFromJSON().then((res: any) => {
      this.sarr_prdType = res.Product.filter(k => k.Value == 1).map(function (e) {
        return e.Name;
      });

      this.obj_CubicType = res.ProductTypes;
      this.sarr_CubicType = this.obj_CubicType.filter(k => k.type == 'Tablet')[0].typeArray.filter(k => k.Value == 1).map(function (e) {
          return e.Name;
      });

      this.jsonDataService.getValueFromJSON().then((res: any) => {
        this.sarr_rptOption = res.Tablet.filter(k => k.Value == 1).map(function (e)
        {
          if((e.Name != "Edit") && (e.Name != "Coating"))
          {
            return e.Name;
          }
        })
      });

      this.frm_prdSummary.patchValue({
        str_prdType: this.sarr_prdType[0]
      });

    });

    this.dataService.getNomenclatureDetails().then((obj: any) => {
      this.strProductType = `${obj.BFGCode} | ${obj.ProductName} | Product Version | Version`;
    })
  }

  cmbPrdType_getcubicType(str_prdTypes:string) {
    if ( str_prdTypes == 'Tablet')
    {
      this.sarr_CubicType = this.obj_CubicType.filter(k => k.type == 'Tablet')[0].typeArray.filter(k => k.Value == 1).map(function (e) {
          return e.Name;
        });

      this.frm_prdSummary.patchValue({
        str_cubicType: this.sarr_CubicType[0]
      })

      this.jsonDataService.getValueFromJSON().then((res: any) => {
        this.sarr_rptOption = res.Tablet.filter(k => k.Value == 1).map(function (e)
        {
          if((e.Name != "Edit") && (e.Name != "Coating"))
          {
            return e.Name;
          }
        })
      });
    }
    else if (str_prdTypes == 'Capsule')
    {
      this.sarr_CubicType = this.obj_CubicType.filter(k => k.type == 'Capsule')[0].typeArray.filter(k => k.Value == 1).map(function (e) {
          return e.Name;
        });

        this.jsonDataService.getValueFromJSON().then((res: any) => {
          this.sarr_rptOption = res.Capsule.filter(k => k.Value == 1).map(function (e)
          {
            if(e.Name != "Edit")
            {
              return e.Name;
            }
          })
        });

      this.frm_prdSummary.patchValue({
        str_cubicType: this.sarr_CubicType[0]
      })
    }
  }

  cmbRptOption_getPrdDetail(str_paramName:string)
  {
    this.getProductDetail(str_paramName);
  }

  getProductDetail(str_paramNames:string) {
    var sendData = {};
    Object.assign(sendData, { productType: this.frm_prdSummary.value.str_prdType }
      , { selectType: this.frm_prdSummary.value.str_cubicType }
      , { reportOption: this.frm_prdSummary.value.str_rptOption });
    console.log(sendData)
    if (this.hasNull(sendData))
    {
      this.sarr_prdDetail = [];
    }
    else
    {
      this.http1.post('http://localhost:3000/API_V1/product/getProductDetailBatchSummary', sendData).subscribe((result: any) => {
        if (result.status == 'success')
        {
          var arrProductDetail = result.data;
          arrProductDetail = arrProductDetail.map(function (e) {
            return `${e.BFGCode} | ${e.ProductName} | ${e.PVersion} | ${e.Version}`
          })
          this.sarr_prdDetail = arrProductDetail;
        }
      }, err => {
        this.errorHandling.checkError(err.status);
      })
    }

  }

  chkDateValidation()
  {
    const toDate = this.datePipe.transform(this.frm_prdSummary.value.dt_toDate, "yyyy/MM/dd");
    const fromDate = this.datePipe.transform(this.frm_prdSummary.value.dt_fromDate, "yyyy/MM/dd");
    if (fromDate > toDate)
     {
       swal({
            title: "From date should be less than To date!",
            text: "",
            type: "error",
            allowOutsideClick: false,
          });

      this.frm_prdSummary.patchValue({
        dt_toDate: this.dt_todayDate,
        dt_fromDate: this.dt_todayDate
      });
    }
  }

  btnReset()
  {
    this.bln_show = false;
    this.frm_prdSummary.reset();
  }

  onSubmit()
  {
    this.str_reportName = "RepoProductSummary";
    const userID = this.sessionStorage.retrieve("userid");
    const userName = this.sessionStorage.retrieve("username");
    const IP = this.sessionStorage.retrieve("userIP");
    const int_ip = IP.split(".");
    const data: Object = {};
    const ObjectData: Object = {};
    const str_productType = this.frm_prdSummary.value.str_prdType;
    const str_cubicleType = this.frm_prdSummary.value.str_cubicType;
    const str_rptOption = this.frm_prdSummary.value.str_rptOption;
    const toDate = this.datePipe.transform(this.frm_prdSummary.value.dt_toDate, "yyyy-MM-dd");
    const fromDate = this.datePipe.transform(this.frm_prdSummary.value.dt_fromDate, "yyyy-MM-dd");
    const str_prdDetail = this.frm_prdSummary.value.str_prdDetail;
    const str_prd = str_prdDetail.split("|");

    Object.assign(
      ObjectData,
      { prdType: str_productType },
      { cubicleType: str_cubicleType },
      { paramName: str_rptOption },
      { prdID: str_prd[0].trim() },
      { prdName: str_prd[1].trim() },
      { prdVersion: str_prd[2].trim() },
      { version: str_prd[3].trim() },
      { ToDt: toDate },
      { fromDt: fromDate },
      { UserId: userID },
      { UserName: userName },
      { HmiId: int_ip[3]}
    );

    Object.assign(data, { data: ObjectData }, { FileName: this.str_reportName });
    this.bln_loading = true;
    this.http
      .postMethod("report/GenerateReport", data)
      .subscribe((res: any) => {
        this.toolbar = "#toolbar=0&navpanes=0";
        const rand = Math.random();
        this.str_path = res.filepath;
        this.pdfSrc = res.filepath + "?v=" + rand + this.toolbar;
        this.Url = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);
        this.bln_loading = false;
        this.bln_show = true;
      });
  }

  btnPrintReason()
  {
    this.str_reportName = "RepoProductSummaryPrintReason";
    const userID = this.sessionStorage.retrieve("userid");
    const userName = this.sessionStorage.retrieve("username");
    const data: Object = {};
    const ObjectData: Object = {};
    const ObjectDataCheckNoData: Object = {};
    const str_productType = this.frm_prdSummary.value.str_prdType;
    const str_cubicleType = this.frm_prdSummary.value.str_cubicType;
    const str_rptOption = this.frm_prdSummary.value.str_rptOption;
    const toDate = this.datePipe.transform(this.frm_prdSummary.value.dt_toDate, "yyyy-MM-dd");
    const fromDate = this.datePipe.transform(this.frm_prdSummary.value.dt_fromDate, "yyyy-MM-dd");
    const str_prdDetail = this.frm_prdSummary.value.str_prdDetail;
    const str_prd = str_prdDetail.split("|");

    Object.assign(
      ObjectDataCheckNoData,
      { prdType: str_productType },
      { cubicleType: str_cubicleType },
      { paramName: str_rptOption },
      { prdID: str_prd[0].trim() },
      { prdName: str_prd[1].trim() },
      { prdVersion: str_prd[2].trim() },
      { version: str_prd[3].trim() }
    );

    this.http.postMethod("product/getPrintNo", ObjectDataCheckNoData).subscribe((res: any) => {
      if(res.result[0]['PrintNo'] == 0)
      {
        swal({
          title: "No Data Found!",
          text: "",
          type: "error",
          allowOutsideClick: false,
        });
      }
      else
      {
        Object.assign(
          ObjectData,
          { prdType: str_productType },
          { cubicleType: str_cubicleType },
          { paramName: str_rptOption },
          { prdID: str_prd[0].trim() },
          { prdName: str_prd[1].trim() },
          { prdVersion: str_prd[2].trim() },
          { version: str_prd[3].trim() },
          { ToDt: toDate },
          { fromDt: fromDate },
          { UserId: userID },
          { UserName: userName }
        );

        Object.assign(data, { data: ObjectData }, { FileName: this.str_reportName });

        this.bln_loading = true;
        this.http
          .postMethod("report/GenerateReport", data)
          .subscribe((res: any) => {
            this.toolbar = "#toolbar=0&navpanes=0";
            const rand = Math.random();
            this.str_path = res.filepath;
            this.pdfSrc = res.filepath + "?v=" + rand + this.toolbar;
            this.Url = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);
            this.bln_loading = false;
            this.bln_show = true;
          });
      }
    });

  }

  btnPrint_showPrintList()
  {
    if(this.str_reportName == "RepoProductSummary")
    {
      const ObjectData: Object = {};
      const userID = this.sessionStorage.retrieve("userid");
      const userName = this.sessionStorage.retrieve("username");
      const str_productType = this.frm_prdSummary.value.str_prdType;
      const str_cubicleType = this.frm_prdSummary.value.str_cubicType;
      const str_rptOption = this.frm_prdSummary.value.str_rptOption;
      const toDate = this.datePipe.transform(this.frm_prdSummary.value.dt_toDate, "yyyy-MM-dd");
      const fromDate = this.datePipe.transform(this.frm_prdSummary.value.dt_fromDate, "yyyy-MM-dd");
      const str_prdDetail = this.frm_prdSummary.value.str_prdDetail;
      const str_prd = str_prdDetail.split("|");

      Object.assign(
        ObjectData,
        { prdType: str_productType },
        { cubicleType: str_cubicleType },
        { paramName: str_rptOption },
        { prdID: str_prd[0].trim() },
        { prdName: str_prd[1].trim() },
        { prdVersion: str_prd[2].trim() },
        { version: str_prd[3].trim() },
        { ToDt: toDate },
        { fromDt: fromDate },
        { UserId: userID },
        { UserName: userName }
      );

      this.http.postMethod("product/getPrintNo", ObjectData).subscribe((res: any) => {
        swal({
          title: 'Are you sure ?',
          text: "Do you want to print report?",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }).then((result) =>
        {
          if (result)
         {
          const modalRef = this.modalService.open(RemarkModalComponent);
          modalRef.componentInstance.path = this.str_path.slice(26);
          modalRef.componentInstance.int_printNo = res.result[0]['PrintNo'];
          modalRef.componentInstance.str_frmName = "ProductSummary";
          modalRef.componentInstance.str_userId = this.sessionStorage.retrieve("userid");
          modalRef.componentInstance.str_userName = this.sessionStorage.retrieve("username");
          modalRef.componentInstance.str_prdType = this.frm_prdSummary.value.str_productType;
          modalRef.componentInstance.str_cubType = this.frm_prdSummary.value.str_cubicleType;
          modalRef.componentInstance.str_prdID = this.frm_prdSummary.value.str_prd[0].trim();
          modalRef.componentInstance.str_prdName = this.frm_prdSummary.value.str_prd[1].trim();
          modalRef.componentInstance.str_prdVersion = this.frm_prdSummary.value.str_prd[2].trim();
          modalRef.componentInstance.str_version = this.frm_prdSummary.value.str_prd[3].trim();
         }
        }, function (dismiss) { });
      });
    }
    else
    {
      swal({
        title: 'Are you sure ?',
        text: "Do you want to print report?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) =>
      {
        if (result)
       {
        const modalRef = this.modalService.open(ModalComponent);
        modalRef.componentInstance.path = this.str_path.slice(26);
       }
      }, function (dismiss) { });
    }
  }

  // Below function checks if object to be sent to server has no null or balnk value
  hasNull(target)
  {
    for (var member in target)
    {
      if (target[member] == null || target[member] == "")
        return true;
    }
    return false;
  }
}
