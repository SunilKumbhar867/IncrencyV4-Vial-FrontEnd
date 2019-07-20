import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild
} from "@angular/core";
import { HttpService } from "../../../services/http/http.service";
import { ErrorHandlingService } from "../../../services/error-handling/error-handling.service";
import { Subject } from "rxjs";
import { SessionStorageService } from "ngx-webstorage";
import { RemarkComponent } from "../../../shared/remark/remark/remark.component";
import { MatDialog } from "@angular/material";
import { DataTableDirective } from "angular-datatables";
declare var swal: any;
@Component({
  selector: "app-view-machine",
  templateUrl: "./view-machine.component.html",
  styleUrls: ["./view-machine.component.css"]
})
export class ViewMachineComponent implements AfterViewInit, OnDestroy, OnInit {
  arrMachineData: Array<any>;
  bln_Loading: boolean;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  bln_IsPopupOpened: boolean;
  str_status: string;
  bln_showActivate: boolean;
  constructor(
    private http: HttpService,
    private errorHandling?: ErrorHandlingService,
    private sessionStorage?: SessionStorageService,
    private dialog?: MatDialog
  ) {
    let userRigths = this.sessionStorage.retrieve("rightsarray");
    if (userRigths.includes("Activate / Deactivate"))
    {
      this.bln_showActivate = true;
    } else
    {
      this.bln_showActivate = false;
    }
    this.getMachineList();
  }

  // Below function will return all Machine Data
  getMachineList() {
    this.bln_Loading = true;
    this.http.getMethod("machine/all").subscribe(
      (json_Response: any) => {
        //console.log(json_Response);
        this.bln_Loading = false;
        this.arrMachineData = json_Response;
        this.rerender();
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_Loading = false;
      }
    );
  }

  // Below Function will Toggle Machine Status Activate / Deactivate
  toggleStatus(machine, status) {
    if (status == 1) {
      this.str_status = "Activate";
    } else {
      this.str_status = "Deactivate";
    }
    swal({
      title: "Are You Sure?",
      text:
        "Do You Want To " + this.str_status + " " + machine.Machine_ID + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    }).then(
      result => {
        if (result == true) {
          this.bln_IsPopupOpened = true;
          const message = { message: this.str_status + " Equipment" };
          const dialogRef = this.dialog.open(RemarkComponent, {
            data: message,
            width: "570px",
            disableClose: true
          });
          dialogRef.afterClosed().subscribe(result => {
            const data: Object = {};
            if (result !== undefined) {
              const userId = this.sessionStorage.retrieve("userId").trim();
              const userName = this.sessionStorage.retrieve("userName").trim();
              const action = this.str_status;
              const remark = result.reason.trim();
              const machineID = machine.Machine_ID;
              const data = {
                userId: userId,
                userName: userName,
                action: action,
                remark: remark,
                machineID: machineID
              };
              //console.log(data);
              this.bln_Loading = true;
              this.http
                .postMethod("machine/updateActiveDeactive", data)
                .subscribe(
                  (res: any) => {
                    this.bln_Loading = false;
                    if (res.result == "Machine Activated Successfully") {
                      swal("Equipment Activated Successfully", "", "success");
                      this.getMachineList();
                      this.rerender();
                    } else if (
                      res.result == "Machine Deactivated Successfully"
                    ) {
                      swal("Equipment Deactivated Successfully", "", "success");
                      this.getMachineList();
                      this.rerender();
                    } else {
                      swal("Something went wrong", "", "error");
                    }
                  },
                  err => {
                    this.errorHandling.checkError(err.status);
                    this.bln_Loading = false;
                  }
                );
            }
          });
        }
      },
      function(dismiss) {}
    );
  }

  // For Initializing Datatables
  rerender(): void {
    if (this.dtElement.dtInstance === undefined) {
      this.dtTrigger.next();
    } else {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    }
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10
    };
  }

  ngAfterViewInit(): void {
    //this.rerender();
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    console.log("ondistroy called");
  }
}
