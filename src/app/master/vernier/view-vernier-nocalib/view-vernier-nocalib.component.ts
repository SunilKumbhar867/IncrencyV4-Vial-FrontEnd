import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorHandlingService } from '../../../services/error-handling/error-handling.service';
import { HttpService } from '../../../services/http/http.service';
import { SessionStorageService } from 'ngx-webstorage';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { RemarkComponent } from '../../../shared/remark/remark/remark.component';
import { DataTableDirective } from 'angular-datatables';
declare var swal: any;
@Component({
  selector: 'app-view-vernier-nocalib',
  templateUrl: './view-vernier-nocalib.component.html',
  styleUrls: ['./view-vernier-nocalib.component.css']
})
export class ViewVernierNocalibComponent implements OnInit {
  public loading = false;
  bln_hide_detail = false;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  vernierData: any;
  sarr_verniereWeights: Array<any> = [];
  str_vernier_name: string;
  bln_IsPopupOpened: boolean;
  str_status: string;
  bln_Loading: boolean;
  bln_showActivate: boolean;

  // constructor(private errorHandling?: ErrorHandlingService, private http?: HttpService, private sessionStorage?: SessionStorageService,
  //   ) {
  //     this.loading = true;
  //     this.http.getMethod('vernier/getVernier').subscribe((data:any) => {
  //       console.log(data)
  //     this.loading = false;
  //     this.vernierData = data;
  //     this.dtTrigger.next();
  //   },
  //   err => {
  //     this.errorHandling.checkError(err.status);
  //     this.loading = false;
  //   }
  // );
  // }
  constructor(private errorHandling?: ErrorHandlingService, private http?: HttpService, private sessionStorage?: SessionStorageService,
    private dialog?: MatDialog)
  {
    this.getVernierData();
    let userRigths = this.sessionStorage.retrieve("rightsarray");
    if (userRigths.includes("Activate / Deactivate"))
    {
      this.bln_showActivate = true;
    } else
    {
      this.bln_showActivate = false;
    }
  }

  getVernierData()
  {
    this.loading = true;
    this.http.getMethod('vernier/getVernier').subscribe((data: any) =>
    {
      console.log(data)
      this.loading = false;
      this.vernierData = data;
      this.rerender();
    },
      err =>
      {
        this.errorHandling.checkError(err.status);
        this.loading = false;
      }
    );
  }

  ngOnInit() {
    // initialization of data tables
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
  }

  ngOnDestroy() {

  }

  // Below Function will Toggle Vernier Status Activate / Deactivate
  toggleStatus(vernier, status)
  {
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
        "Do You Want To " + this.str_status + " " + vernier.VernierID + "?",
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
          const message = { message: this.str_status + " Vernier" };
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
              const vernierID = vernier.VernierID;
              const data = {
                userId: userId,
                userName: userName,
                action: action,
                remark: remark,
                vernierID: vernierID
              };
              console.log(data);
              this.bln_Loading = true;
              this.http
                .postMethod("vernier/updateActiveDeactive", data)
                .subscribe(
                  (res: any) =>
                  {
                    this.bln_Loading = false;
                    if (res.result == "Vernier Activated Successfully")
                    {
                      swal("Vernier Activated Successfully", "", "success");
                      this.getVernierData();
                      this.rerender();
                    } else if (
                      res.result == "Vernier Deactivated Successfully"
                    )
                    {
                      swal("Vernier Deactivated Successfully", "", "success");
                      this.getVernierData();
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

  // *****************************************************************************************//
  // Below function takes argument as selected balance and show it to user                   //
  // *****************************************************************************************//
  viewDetail(vernier) {
    this.bln_hide_detail = true;
    this.str_vernier_name = vernier.VernierID;
    this.sarr_verniereWeights = vernier.WtDetail;
  }
   // **************************************************************************************//
}
