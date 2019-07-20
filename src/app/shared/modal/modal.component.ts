import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { HttpService } from "../../services/http/http.service";
import { ErrorHandlingService } from "../../services/error-handling/error-handling.service";
import { MessageService } from "../../services/PrintService/print.service";
import { reject } from "q";
import { Observable } from "rxjs";
declare var swal: any;
@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.css"],
})
export class ModalComponent implements OnInit {
  bln_loading: boolean;
  @Output() valueChange = new EventEmitter();
  sarr_printers: Array<String>;
  highlight: any;
  str_selectedPrinter: String;
  // Receives Path of Pdf File to be printed
  @Input() path: String;
  observablePrint: Observable<String>;
  constructor(
    public activeModal: NgbActiveModal,
    public http: HttpService,
    private errorHandling?: ErrorHandlingService,
    private modalService?: NgbModal,
    private data?: MessageService
  ) {}

  // Highlights & Selects the Selected Printer
  selectedPrinter(printer: String) {
    this.highlight = printer;
    this.str_selectedPrinter = printer;
  }

  print() : Observable<String> {
    if (this.str_selectedPrinter == undefined) {
      swal("Please Select Printer", "", "error");
    } else {
      const data = {
        strSelectedPrinter: this.str_selectedPrinter,
        filepath: this.path
      };
      this.modalService.dismissAll();
      this.http.postMethod("report/PrintReport", data).subscribe(
        (res: any) => {
          if (res.Message == "Print Successfull") {
            //  this.data.sendMessage('Print Successfull');
            // this.observablePrint = new Observable(observer => {
            //   // observable execution
            //   observer.next("Print Success");
            // });
              this.data.sendMessage('Printed');
            swal("Print Successfull..!", "", "success");
          } else {
            //  this.data.sendMessage('Print Failed');
            swal("Print Failed", "", "error");
          }
        },
        err => {
          this.errorHandling.checkError(err.status);
        }
      );

      return this.observablePrint;
    }
  }
  // This will close the Modal
  close() {
    this.modalService.dismissAll();
  }

  ngOnInit() {
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
}
