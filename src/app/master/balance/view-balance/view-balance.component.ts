import { Component, OnInit, ViewChild } from "@angular/core";
import { ErrorHandlingService } from "../../../services/error-handling/error-handling.service";
import { HttpService } from "../../../services/http/http.service";
import { SessionStorageService } from "ngx-webstorage";
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { MatDialog } from "@angular/material";
import { RemarkComponent } from "../../../shared/remark/remark/remark.component";
declare var swal: any;
@Component({
  selector: "app-view-balance",
  templateUrl: "./view-balance.component.html",
  styleUrls: ["./view-balance.component.css"]
})
export class ViewBalanceComponent implements OnInit
{
  public loading = false;
  bln_hide_detail = false;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  balanceData: any;
  sarr_balancewt: Array<any> = [];
  str_balance_name: string;
  bln_IsPopupOpened: boolean;
  str_status: string;
  bln_Loading: boolean;
  bln_showActivate: boolean;
  int_dp:any;
  constructor(private errorHandling?: ErrorHandlingService, private http?: HttpService, private sessionStorage?: SessionStorageService,
    private dialog?: MatDialog)
  {
    this.getBalanceData();
    let userRigths = this.sessionStorage.retrieve("rightsarray");
    if (userRigths.includes("Activate / Deactivate"))
    {
      this.bln_showActivate = true;
    } else
    {
      this.bln_showActivate = false;
    }

  }

  getBalanceData()
  {
    this.loading = true;
    // Get All Balance Details
    this.http.getMethod("balance/getBalanceDetails").subscribe(
      (data: any) =>
      {
        console.log(data);
        this.loading = false;
        this.balanceData = data.result;
        this.rerender();
      },
      err =>
      {
        this.errorHandling.checkError(err.status);
        this.loading = false;
      }
    );
  }

  // Below Function will Toggle Balance Status Activate / Deactivate
  toggleStatus(balance, status)
  {
    console.log(balance);
    if (status == 1)
    {
      this.str_status = "Activate";
    } else
    {
      this.str_status = "Deactivate";
    }
    swal({
      title: "Are You Sure?",
      text:
        "Do You Want To " + this.str_status + " " + balance.Bal_ID + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    }).then(
      result =>
      {
        if (result == true)
        {
          this.bln_IsPopupOpened = true;
          const message = { message: this.str_status + " Balance" };
          const dialogRef = this.dialog.open(RemarkComponent, {
            data: message,
            width: "570px",
            disableClose: true
          });
          dialogRef.afterClosed().subscribe(result =>
          {
            const data: Object = {};
            if (result !== undefined)
            {
              const userId = this.sessionStorage.retrieve("userId").trim();
              const userName = this.sessionStorage.retrieve("userName").trim();
              const action = this.str_status;
              const remark = result.reason.trim();
              const balID = balance.Bal_ID;
              const data = {
                userId: userId,
                userName: userName,
                action: action,
                remark: remark,
                balID: balID
              };
              console.log(data);
              this.bln_Loading = true;
              this.http
                .postMethod("balance/updateActiveDeactive", data)
                .subscribe(
                  (res: any) =>
                  {
                    this.bln_Loading = false;
                    if (res.result == "Balance Activated Successfully")
                    {
                      swal("Balance Activated Successfully", "", "success");
                      this.getBalanceData();
                      this.rerender();
                    } else if (
                      res.result == "Balance Deactivated Successfully"
                    )
                    {
                      swal("Balance Deactivated Successfully", "", "success");
                      this.getBalanceData();
                      this.rerender();
                    } else
                    {
                      swal("Something went wrong", "", "error");
                    }
                  },
                  err =>
                  {
                    this.errorHandling.checkError(err.status);
                    this.bln_Loading = false;
                  }
                );
            }
          });
        }
      },
      function (dismiss) { }
    );
  }

  ngOnInit()
  {
    // initialization of data tables
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10
    };
  }

  // For Initializing Datatables
  rerender(): void
  {
    if (this.dtElement.dtInstance === undefined)
    {
      this.dtTrigger.next();
    } else
    {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) =>
      {
        // Destroy the table first
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    }
  }

  ngOnDestroy() { }

  // *****************************************************************************************//
  // Below function takes argument as selected balance and show it to user                   //
  // *****************************************************************************************//
  viewDetail(balance)
  {
    console.log(balance);
    this.bln_hide_detail = true;
    this.int_dp = balance.Bal_DP;
    this.str_balance_name = balance.Bal_ID;
    this.sarr_balancewt = balance.WtDetail;
    // console.log(this.sarr_balancewt)
  }
  // **************************************************************************************//
}
