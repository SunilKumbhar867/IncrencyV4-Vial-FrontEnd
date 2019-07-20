import { Component, OnInit, Input } from "@angular/core";
import { NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { HttpService } from "../../services/http/http.service";
import { ErrorHandlingService } from "../../services/error-handling/error-handling.service";
declare var swal:any;

@Component({
  selector: 'app-remark-modal',
  templateUrl: './remark-modal.component.html',
  styleUrls: ['./remark-modal.component.css']
})
export class RemarkModalComponent implements OnInit {
  bln_loading: boolean;
  sarr_printers: Array<String>;
  highlight: any;
  str_selectedPrinter: String;
  // Receives Path of Pdf File to be printed
  @Input() path:String;
  @Input() int_printNo:string;
  @Input() str_frmName:string;
  @Input() str_userId:any;
  @Input() str_userName:any;

  /**Batch Summary Report */
  @Input() str_batchNo:any;
  @Input() str_prdType:string;
  @Input() str_cubType:string;
  @Input() str_reportOption:any;
  @Input() str_side:any;
  @Input() str_prdID:string;
  @Input() str_prdName:string;
  @Input() str_prdVersion:any;
  @Input() str_version:any;

  str_remark: string ='';
  dataObject = {};

  constructor( public activeModal: NgbActiveModal,
    public http: HttpService,
    private errorHandling?: ErrorHandlingService,
    private modalService?: NgbModal) { }

  ngOnInit()
  {
      // This will populate the list of all the Printers
      this.http.postMethod("report/GetPrinters", "").subscribe(
        (res: any) => {
          this.sarr_printers = res.PrinterName;
        },
        err => {
          this.errorHandling.checkError(err.status);
        }
      );
  }

  close()
  {
    this.modalService.dismissAll();
  }

  selectedPrinter(printer: String)
  {
    this.highlight = printer;
    this.str_selectedPrinter = printer;
  }

  print()
  {

    if((this.str_remark == '' ||  this.str_remark == null || this.str_remark == undefined) && (this.int_printNo >= "1"))
    {
        swal({
           title: "Please enter remark!",
           text: "",
           type: "error",
           allowOutsideClick: false,
         });
     }
     else
     {
       if(this.str_selectedPrinter == undefined)
       {
         swal("Please Select Printer","","error");
       }
       else
       {

        if(this.str_frmName == "BatchSummary")
        {
          this.createObjectForBatchSummary();
        }

        //console.log(JSON.stringify(this.dataObject));
         this.modalService.dismissAll();
         this.http.postMethod("report/printReportRemark", this.dataObject).subscribe((res: any) => {
           if(res.status =="success"){
             swal("Print Successful..!","","success");
           }else{
             swal("Print Failed","","error");
           }
         },err=>{
           this.errorHandling.checkError(err.status);
         });
       }
     }
  }

  createObjectForBatchSummary()
  {
    if((this.str_remark == '' ||  this.str_remark == null || this.str_remark == undefined) && (this.int_printNo == "0"))
    {
        var str_remark = "NA";
    }
    else
    {
      var str_remark = this.str_remark;
    }
    this.dataObject = {
      strSelectedPrinter: this.str_selectedPrinter,
      filepath: this.path,
      str_remark: str_remark,
      int_printNo: this.int_printNo,
      str_userId: this.str_userId,
      str_userName: this.str_userName,
      str_batchNo: this.str_batchNo,
      str_side: this.str_side,
      str_prdType: this.str_prdType,
      str_cubType: this.str_cubType,
      str_reportOption: this.str_reportOption,
      str_frmName: this.str_frmName,
      str_prdID: this.str_prdID,
      str_prdName: this.str_prdName,
      str_prdVersion: this.str_prdVersion,
      str_version: this.str_version
    };
  }

  // createObjectForProductSummary()
  // {
  //   if((this.str_remark == '' ||  this.str_remark == null || this.str_remark == undefined) && (this.int_printNo == "0"))
  //   {
  //       var str_remark = "NA";
  //   }
  //   else
  //   {
  //     var str_remark = this.str_remark;
  //   }
  //   this.data ={
  //     strSelectedPrinter: this.str_selectedPrinter,
  //     filepath: this.path,
  //     str_remark: str_remark,
  //     int_printNo: this.int_printNo,
  //     str_userId: this.str_userId,
  //     str_userName: this.str_userName,
  //     str_prdType: this.str_prdType,
  //     str_cubType: this.str_cubType,
  //     str_prdID: this.str_prdID,
  //     str_prdName: this.str_prdName,
  //     str_prdVersion: this.str_prdVersion,
  //     str_version: this.str_version,
  //     str_frmName: this.str_frmName
  //   };
  // }

}
