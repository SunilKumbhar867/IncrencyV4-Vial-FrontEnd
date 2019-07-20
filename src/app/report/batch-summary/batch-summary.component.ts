import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { HttpService } from "../../services/http/http.service";
import { DatePipe } from "@angular/common";
import { ErrorHandlingService } from "../../services/error-handling/error-handling.service";
import { SessionStorageService } from 'ngx-webstorage';
import { JsonDataService } from '../../services/commonData/json-data.service';
import { DataService } from '../../services/commonData/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RemarkModalComponent } from '../../shared/remark-modal/remark-modal.component';
import { ModalComponent } from '../../shared/modal/modal.component';
declare var swal:any;
@Component({
  selector: 'app-batch-summary',
  templateUrl: './batch-summary.component.html',
  styleUrls: ['./batch-summary.component.css'],
  providers: [DataService]
})
export class BatchSummaryComponent implements OnInit {
  frm_batchSummary: FormGroup;

  obj_cubicType: any;

  sarr_prdTypes = [];
  sarr_Types = [];
  sarr_batchNo = [];
  sarr_rptOption = [];
  sarr_prdDetail = [];
  sarr_side = [];

  bln_show: boolean;
  bln_loading: boolean;

  int_reportOption: any;
  strProductDetail:string;

  pdfSrc: string;
  Url: any;
  toolbar: string;
  str_path: String;
  str_reportName: string = "";
  str_tableName: string = '';
  bln_print: boolean;

  constructor(private fb: FormBuilder,
    private http?: HttpService,
    public datePipe?: DatePipe,
    private errorHandling?: ErrorHandlingService,
    private jsonDataService?: JsonDataService,
    private sessionStorage?: SessionStorageService,
    private sanitizer?: DomSanitizer,
    private dataService?: DataService,
    private modalService?: NgbModal){}

  ngOnInit()
  {
    this.bln_show = false;
    this.bln_print = false;
    this.frm_batchSummary = this.fb.group({
      str_prodType : new FormControl('', [Validators.required]),
      str_type: new FormControl('', [Validators.required]),
      str_batchNo: new FormControl('',[Validators.required]),
      str_rptOption: new FormControl('',[Validators.required]),
      str_prdDetail: new FormControl('',[Validators.required]),
      str_side: new FormControl('',[Validators.required]),
      int_printNo: new FormControl(''),
    });

    this.getProductTypeWithParameters();

    this.dataService.getNomenclatureDetails().then((obj: any) => {
      this.strProductDetail = `${obj[0].BFGCode} | ${obj[0].ProductName} | Product Version | Version`;
    });
  }

  getProductTypeWithParameters()
  {
    // getting product type ie. Tablet,Capsule from developers json
    this.jsonDataService.getValueFromJSON().then((res: any) => {
      this.obj_cubicType = res.ProductTypes;

      this.sarr_prdTypes = res.Product.filter(k => k.Value == 1).map(function (element) {
        return element.Name;
      });

      this.sarr_Types = this.obj_cubicType.filter(k => k.type == 'Tablet')[0].typeArray.filter(k => k.Value == 1).map(function (element) {
          return element.Name;
        });

        this.jsonDataService.getValueFromJSON().then((res: any) => {
          this.sarr_rptOption = res.Tablet.filter(k => k.Value == 1).map(function (e)
          {
            if((e.Name != "Edit") && (e.Name != "Coating") && (e.Name != "Tapped Density")
            && (e.Name != "Sieve Shaker") && (e.Name != "Granulation")
            && (e.Name != "Particle Size") && (e.Name != "Fine %") && (e.Name != "Group")
            && (e.Name != "Group Layer") && (e.Name != "Group Layer1"))
            {
              return e.Name;
            }
          })
        });

      this.frm_batchSummary.patchValue({
        str_prodType: this.sarr_prdTypes[0]
      });

    });
  }

  cmbPrdType_getCubicleTypes(str_prdType:string) // Compression/coating/Capsule Filling
  {
    this.bln_show = false;
    this.sarr_rptOption = [];
    if (str_prdType == 'Tablet')
    {
      this.sarr_Types = this.obj_cubicType.filter(k => k.type == 'Tablet')[0]
        .typeArray.filter(k => k.Value == 1).map(function (e) {
          return e.Name;
        });
      this.frm_batchSummary.patchValue({
        str_type: this.sarr_Types[0]
      })
    }
    else if (str_prdType == 'Capsule')
    {
      this.sarr_Types = this.obj_cubicType.filter(k => k.type == 'Capsule')[0]
        .typeArray.filter(k => k.Value == 1).map(function (e) {
          return e.Name;
        });
      this.frm_batchSummary.patchValue({
        str_type: this.sarr_Types[0]
      })
    }
  }

  cmbCubicleType_getReportOptions(str_cubicleType:string) //All parameter names
  {
    this.bln_show = false;
    this.sarr_rptOption = [];
    if (str_cubicleType == 'Compression')
    {
      this.jsonDataService.getValueFromJSON().then((res: any) => {
        this.sarr_rptOption = res.Tablet.filter(k => k.Value == 1).map(function (e)
        {
          if((e.Name != "Edit") && (e.Name != "Coating") && (e.Name != "Tapped Density")
            && (e.Name != "Sieve Shaker") && (e.Name != "Granulation")
            && (e.Name != "Particle Size") && (e.Name != "Fine %") && (e.Name != "Group")
            && (e.Name != "Group Layer") && (e.Name != "Group Layer1"))
          {
            return e.Name;
          }
        })
      });
    }
    else if(str_cubicleType == 'Coating')
    {
      this.jsonDataService.getValueFromJSON().then((res: any) => {
        this.sarr_rptOption = res.TabletCoating.filter(k => k.Value == 1).map(function (e)
        {
          if(e.Name != "Group")
          {
            return e.Name;
          }
        })
      });
    }
    else//capsule filling
    {
      this.jsonDataService.getValueFromJSON().then((res: any) => {
        this.sarr_rptOption = res.Capsule.filter(k => k.Value == 1).map(function (e)
        {
          if(e.Name != "Edit")
          {
            return e.Name;
          }
        })
      });
    }
  }

  cboReportOption_side(str_rptoption:any)
  {
    this.bln_show = false;
    this.sarr_side = [];
    if(str_rptoption == "Moisture Analyzer")
    {
      this.sarr_side.push('Single');
    }
    else
    {
      this.sarr_side.push('Single','Double');
    }
  }

  cmbSide_getProductDetail(str_side:string)
  {
    this.bln_show = false;
    var sendData = {};
    var int_prdType, str_side1;
    var str_reportOption = this.frm_batchSummary.value.str_rptOption;
    this.getTableName(str_reportOption);
    this.str_tableName = "tbl_batchsummary_master"+this.int_reportOption;

    (this.frm_batchSummary.value.str_prodType == "Tablet") ? int_prdType = "1" : int_prdType = "2";
    (str_side == "Single") ? str_side1 = "NA" : str_side1 = "LEFT";

    Object.assign(sendData,
      { str_productType: int_prdType },
      { str_cubicleType: this.frm_batchSummary.value.str_type } ,
      { str_db_tableName: this.str_tableName },
      { str_side: str_side1 });

      if (this.hasNull(sendData))
      {
        this.sarr_prdDetail = [];
      }
      else
      {
        this.sarr_prdDetail = [];

        this.http.postMethod('batch/getProduct', sendData).subscribe(((result:any) => {

          if (result.data.length != 0)
          {
            var arrProductDetail = result.data;
            arrProductDetail = arrProductDetail.map(function (e) {
              return `${e.BFGCode} | ${e.ProductName} | ${e.PVersion} | ${e.Version}`
            })
            this.sarr_prdDetail = arrProductDetail;
          }
          else
          {
            this.sarr_prdDetail = [];
          }
        }), err => {
            this.errorHandling.checkError(err.status);
        });
      }
  }

  cmbPrd_getBatches(str_prdDetail:any)
  {
    this.bln_show = false;
    var sendData = {};
    var int_prdType;
    var str_reportOption = this.frm_batchSummary.value.str_rptOption;
    var str_side1;

    (this.frm_batchSummary.value.str_side == "Single") ? str_side1 = "NA" : str_side1 = "LEFT";

   this.getTableName(str_reportOption);
   this.str_tableName = "tbl_batchsummary_master"+this.int_reportOption;

   (this.frm_batchSummary.value.str_prodType == "Tablet") ? int_prdType = "1" : int_prdType = "2";

   const str_prd = str_prdDetail.split("|");

    Object.assign(sendData,
      { str_productType: int_prdType },
      { str_cubicleType: this.frm_batchSummary.value.str_type } ,
      { str_db_tableName: this.str_tableName },
      { str_prdID: str_prd[0].trim() },
      { str_prdName: str_prd[1].trim() },
      { str_prdVersion: str_prd[2].trim() },
      { str_version: str_prd[3].trim() },
      { str_side: str_side1 });

      if (this.hasNull(sendData))
      {
        this.sarr_batchNo = [];
      }
      else
      {
        this.sarr_batchNo = [];

        this.http.postMethod('batch/getBatches', sendData).subscribe(((result:any) => {

          if (result.data.length != 0)
          {
            result.data.forEach(element => {
              this.sarr_batchNo.push(element.BatchNo);
            });
          }
          else
          {
            this.sarr_batchNo = [];
          }
        }), err => {
            this.errorHandling.checkError(err.status);
        })
      }
  }

  cmbBatch_getPrintNo(str_batch:any)
  {
    this.bln_show = false;
    var sendData = {};
    var int_prdType;
    var str_side1;

   (this.frm_batchSummary.value.str_side == "Single") ? str_side1 = "NA" : str_side1 = "LEFT";
   (this.frm_batchSummary.value.str_prodType == "Tablet") ? int_prdType = "1" : int_prdType = "2";

   const str_prd = this.frm_batchSummary.value.str_prdDetail.split("|");

    Object.assign(sendData,
      { str_productType: int_prdType },
      { str_cubicleType: this.frm_batchSummary.value.str_type } ,
      { str_reportOption: this.frm_batchSummary.value.str_rptOption } ,
      { str_prdID: str_prd[0].trim() },
      { str_prdName: str_prd[1].trim() },
      { str_prdVersion: str_prd[2].trim() },
      { str_version: str_prd[3].trim() },
      { str_batches: str_batch },
      { str_side: str_side1 });

      this.http.postMethod('batch/getPrintNo', sendData).subscribe(((res:any) => {
        if(res.result.length != 0)
        {
            this.frm_batchSummary.patchValue({int_printNo:res.result[0]['PrintNo'] });
            (res.result[0]['PrintNo'] > 1) ? this.bln_print = true : this.bln_print = false;
        }
        else
        {
          this.frm_batchSummary.patchValue({int_printNo:'0' });
          this.bln_print = false;
        }

      }), err => {
          this.errorHandling.checkError(err.status);
      })
  }

   btnPrintReason_click()
  {
    this.str_reportName = "RepoBatchSummaryPrintReason";
    const userID = this.sessionStorage.retrieve("userid");
    const userName = this.sessionStorage.retrieve("username");
    const data: Object = {};
    const ObjectData: Object = {};
    var int_prdType, str_side1;

    (this.frm_batchSummary.value.str_prodType == "Tablet") ? int_prdType = "1" : int_prdType = "2";
    (this.frm_batchSummary.value.str_side == "Single") ? str_side1 = "NA" : str_side1 = "LEFT";

    const str_prdDetail = this.frm_batchSummary.value.str_prdDetail;
    const str_prd = str_prdDetail.split("|");

    Object.assign(
      ObjectData,
        { str_productType: int_prdType },
        { str_cubicleType: this.frm_batchSummary.value.str_type } ,
        { str_batches: this.frm_batchSummary.value.str_batchNo } ,
        { str_reportOption: this.frm_batchSummary.value.str_rptOption },
        { str_side: str_side1},
        { UserId: userID },
        { UserName: userName },
        { str_prdID: str_prd[0].trim() },
        { str_prdName: str_prd[1].trim() },
        { str_prdVersion: str_prd[2].trim() },
        { str_version: str_prd[3].trim()}
      );

      console.log(JSON.stringify(ObjectData));
      Object.assign(data, { data: ObjectData }, { FileName: this.str_reportName });

      this.bln_loading = true;
      this.http.postMethod("report/GenerateReport", data).subscribe((res: any) => {
          this.toolbar = "#toolbar=0&navpanes=0";
          const rand = Math.random();
          this.str_path = res.filepath;
          this.pdfSrc = res.filepath + "?v=" + rand + this.toolbar;
          this.Url = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);
          this.bln_loading = false;
          this.bln_show = true;
        },error =>{
          this.bln_loading = false;
          this.errorHandling.checkError(error.status);
        });
   }

  btnReset_click()
  {
    this.bln_show = false;
    this.frm_batchSummary.reset();
  }

  onSubmit()
  {
    var int_prdType, str_side1;
    var str_reportOption = this.frm_batchSummary.value.str_rptOption;

    this.getTableName(str_reportOption);

    this.str_tableName = "tbl_batchsummary_master"+this.int_reportOption;
    var str_tableName_detail = "tbl_batchsummary_detail"+this.int_reportOption;

    (this.frm_batchSummary.value.str_prodType == "Tablet") ? int_prdType = "1" : int_prdType = "2";
    (this.frm_batchSummary.value.str_side == "Single") ? str_side1 = "NA" : str_side1 = "LEFT";

    const userID = this.sessionStorage.retrieve("userid");
    const userName = this.sessionStorage.retrieve("username");
    const data: Object = {};
    const ObjectData: Object = {};

    const str_prdDetail = this.frm_batchSummary.value.str_prdDetail;
    const str_prd = str_prdDetail.split("|");

    Object.assign(
      ObjectData,
      { str_productType: int_prdType },
      { str_tableName_master: this.str_tableName },
      { str_tableName_detail: str_tableName_detail },
      { str_cubicleType: this.frm_batchSummary.value.str_type } ,
      { str_batches: this.frm_batchSummary.value.str_batchNo } ,
      { UserId: userID },
      { UserName: userName },
      { str_prdID: str_prd[0].trim() },
      { str_prdName: str_prd[1].trim() },
      { str_prdVersion: str_prd[2].trim() },
      { str_version: str_prd[3].trim()},
      { str_reportOption: str_reportOption},
      { str_side : str_side1}
    );

   // console.log(JSON.stringify(ObjectData));

    if(str_reportOption == "Individual" || str_reportOption == "Individual Layer" || str_reportOption == "Individual Layer1")
    {
      this.str_reportName = "TabletRepoBatchSummaryIndividual";
    }
    else if(str_reportOption == "Thickness" || str_reportOption == "Breadth" || str_reportOption == "Length" || str_reportOption == "Diameter")
    {
      this.str_reportName = "TabletRepoBatchSummaryVernier";
    }
    else if(str_reportOption == "Hardness")
    {
      this.str_reportName = "TabletRepoBatchSummaryHardness";
    }
    else if(str_reportOption == "Disintegration Tester")
    {
      this.str_reportName = "TabletRepoBatchSummaryDT";
    }
    else if(str_reportOption == "Friabilator")
    {
      this.str_reportName = "TabletRepoBatchSummaryFrability";
    }
    else if(str_reportOption == "Moisture Analyzer")
    {
      this.str_reportName = "TabletRepoBatchSummaryLOD";
    }
//console.log(JSON.stringify(ObjectData));
    this.http.postMethod("batch/storeBatchTempData", ObjectData).subscribe((res:any) =>{
      if(res.status == "Success")
      {

        Object.assign(
          ObjectData,
          { UserId: userID },
          { UserName: userName },
          { HmiId: res.data}
        );

        Object.assign(data, { data: ObjectData }, { FileName: this.str_reportName });
            this.bln_loading = true;
            this.http.postMethod("report/GenerateReport", data)
              .subscribe((res: any) => {
                this.toolbar = "#toolbar=0&navpanes=0";
                const rand = Math.random();
                this.str_path = res.filepath;
                this.pdfSrc = res.filepath + "?v=" + rand + this.toolbar;
                this.Url = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);
                this.bln_loading = false;
                this.bln_show = true;
              }, err => {
                this.bln_loading = false;
                this.errorHandling.checkError(err.status);
            });
      }
      else
      {
        console.log("No Data Found");
      }
    });

  }

  btnPrint_showPrintList()
  {
    if(this.str_reportName == "RepoBatchSummaryPrintReason")
    {
      const modalRef = this.modalService.open(ModalComponent);
      modalRef.componentInstance.path = this.str_path.slice(26);
    }
    else
    {
      var int_prdType, str_side1;
      (this.frm_batchSummary.value.str_prodType == "Tablet") ? int_prdType = "1" : int_prdType = "2";
      (this.frm_batchSummary.value.str_side == "Single") ? str_side1 = "NA" : str_side1 = "LEFT";

      const str_prdDetail = this.frm_batchSummary.value.str_prdDetail;
      const str_prd = str_prdDetail.split("|");

      const modalRef = this.modalService.open(RemarkModalComponent);
      modalRef.componentInstance.path = this.str_path.slice(26);
      modalRef.componentInstance.int_printNo = this.frm_batchSummary.value.int_printNo;
      modalRef.componentInstance.str_frmName = "BatchSummary";
      modalRef.componentInstance.str_userId = this.sessionStorage.retrieve("userid");
      modalRef.componentInstance.str_userName = this.sessionStorage.retrieve("username");
      modalRef.componentInstance.str_batchNo = this.frm_batchSummary.value.str_batchNo;
      modalRef.componentInstance.str_prdType = int_prdType;
      modalRef.componentInstance.str_cubType = this.frm_batchSummary.value.str_type;
      modalRef.componentInstance.str_reportOption = this.frm_batchSummary.value.str_rptOption;
      modalRef.componentInstance.str_prdID = str_prd[0].trim();
      modalRef.componentInstance.str_prdName = str_prd[1].trim();
      modalRef.componentInstance.str_prdVersion = str_prd[2].trim();
      modalRef.componentInstance.str_version = str_prd[3].trim();
      modalRef.componentInstance.str_side = str_side1;
    }
    this.bln_show = false;
    this.frm_batchSummary.reset();
  }

  //************************************************************************************************************** */
  // Below function checks if object to be sent to server has no null or balnk value
  //************************************************************************************************************ */
  hasNull(target)
  {
    for (var member in target)
    {
      if (target[member] == null || target[member] == "")
        return true;
    }
    return false;
  }

  getTableName(str_reportOption: any)
  {
    (str_reportOption == "Individual") ? this.int_reportOption = 1 :
    (str_reportOption == "Group") ? this.int_reportOption = 2 :
    (str_reportOption == "Thickness") ? this.int_reportOption = 3 :
    (str_reportOption == "Breadth") ? this.int_reportOption = 4 :
    (str_reportOption == "Length") ? this.int_reportOption = 5 :
    (str_reportOption == "Diameter") ? this.int_reportOption = 6 :
    (str_reportOption == "Hardness") ? this.int_reportOption = "_hdlb" :
    (str_reportOption == "Disintegration Tester") ? this.int_reportOption = 13 :
    (str_reportOption == "Friabilator") ? this.int_reportOption = 8 :
    (str_reportOption == "Individual Layer") ? this.int_reportOption = 9 :
    (str_reportOption == "Group Layer") ? this.int_reportOption = 10 :
    (str_reportOption == "Individual Layer1") ? this.int_reportOption = 11 :
    (str_reportOption == "Group Layer1") ? this.int_reportOption = 12 :
    (str_reportOption == "Moisture Analyzer") ? this.int_reportOption = 16 :
    (str_reportOption == "Differential") ? this.int_reportOption = "_diff" : this.int_reportOption=0;

    return this.int_reportOption;
  }

}
