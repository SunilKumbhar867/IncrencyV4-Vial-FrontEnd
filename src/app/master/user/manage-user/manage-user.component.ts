import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { HttpService } from "../../../services/http/http.service";
import { MatDialog } from "@angular/material";
import { SessionStorageService } from "ngx-webstorage";
import { ErrorHandlingService } from "../../../services/error-handling/error-handling.service";
import { ConfigService } from "../../../services/configuration/config.service";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { RemarkComponent } from "../../../shared/remark/remark/remark.component";
import { Router } from "@angular/router";
import { ChangePasswordModalComponent } from "../change-password-modal/change-password-modal.component";
import { UserService } from "../../../services/user/user.service";
import { JsonDataService } from "../../../services/commonData/json-data.service";
declare var swal: any;
@Component({
  selector: "app-manage-user",
  templateUrl: "./manage-user.component.html",
  styleUrls: ["./manage-user.component.css"]
})
export class ManageUserComponent implements OnInit
{
  bln_loading: boolean;
  bln_isPopupOpened: boolean;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  statuses = [
    "Select",
    "Enable",
    "Temporary Disable",
    "Permanent Disable",
    "Lock User",
    "Auto Disable"
  ];
  bln_manageUser: boolean = false;
  bln_manageUserPassword: boolean = false;
  bln_manageUserEdit: boolean = false;
  selectedData: any;
  bln_show: boolean = false;
  selected: any;
  selectedStatusvalue: any;
  sarr_userData: any;
  msg: any;
  loggedUserRole: any;
  statusText: any;
  status: any;
  passWordExpiryPeriod: any;
  passWordStatus: any;
  todayDate: any;
  alluserData: any;
  bln_isLdap: any;
  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private dialog?: MatDialog,
    public router?: Router,
    public localStorage?: SessionStorageService,
    private errorHandling?: ErrorHandlingService,
    private jsonService?: ConfigService,
    private sessionStorage?: SessionStorageService,
    private userService?: UserService,
    private jsonDataService?: JsonDataService
  )
  {

    this.todayDate = Date();
    setTimeout(() =>
    {
      this.selected = "Select";
    }, 1000);
    const LoggeInUSerRights = this.sessionStorage.retrieve("rightsarray");
    if (LoggeInUSerRights.find(k => k === "Manage User") !== undefined)
    {
      this.bln_manageUser = true;
    } else
    {
      this.bln_manageUser = false;
    }
    if (LoggeInUSerRights.find(k => k === "Change Password") !== undefined)
    {
      this.bln_manageUserPassword = true;
    } else
    {
      this.bln_manageUserPassword = false;
    }
    if (LoggeInUSerRights.find(k => k === "Edit User") !== undefined)
    {
      this.bln_manageUserEdit = true;
    } else
    {
      this.bln_manageUserEdit = false;
    }
    this.jsonDataService.getValueFromJSON().then((res: any) =>
    {
      this.bln_isLdap = res.Ldap[0].Value;
    }).catch(err =>
    {
    });
  }

  changePassword(obj)
  {
    swal({
      title: "Are you sure ?",
      text: "Do you want to change password for this user ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    }).then(
      result =>
      {
        this.bln_isPopupOpened = true;
        Object.assign(obj, { message: "Change Password By Admin" });
        console.log(obj);
        const dialogRef = this.dialog.open(ChangePasswordModalComponent, {
          data: obj,
          width: "700px"
        });
        dialogRef.afterClosed().subscribe(result =>
        {
          this.bln_isPopupOpened = false;
          if (result !== undefined)
          {
            const loggedUserId = this.sessionStorage.retrieve("userid");
            Object.assign(
              result,
              { hdnAction: "Change Password By Admin" },
              { loggedUserId: loggedUserId }
            );
            this.bln_loading = true;
            this.http.postMethod("admin/updateUserPassword", result).subscribe(
              (res: any) =>
              {
                this.bln_loading = false;
                console.log(res.result);
                if (res.result === "User Password Updated")
                {
                  swal("User Password Updated", "", "success");
                } else
                {
                  swal("Something went wrong", "", "error");
                }
              },
              err =>
              {
                this.errorHandling.checkError(err.status);
                this.bln_loading = false;
              }
            );
          }
        });
      },
      function (dismiss) { }
    );
  }

  ViewEditUser(user: any)
  {
    const data: Object = {};
    Object.assign(
      data,
      { userid: user.userdata.UserID },
      { username: user.userdata.UserName },
      { status: user.userdata.Status },
      { role: user.userdata.Role },
      { department: user.userdata.Department },
      { active: user.userdata.active },
      { loginRole: this.loggedUserRole },
      { UserInitials: user.userdata.UserInitials }
    );
    this.router.navigate(["/master/user/manage-user-edit"], {
      queryParams: data
    });
  }

  buttonClicked(value: any, obj: any)
  {
    swal({
      title: "Are you sure?",
      text: "Do you want to " + value + " User.",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    }).then(
      result =>
      {
        if (result === true)
        {
          this.bln_isPopupOpened = true;
          const message = { message: value + " User" };
          const dialogRef = this.dialog.open(RemarkComponent, {
            data: message,
            width: "570px"
          });
          // tslint:disable-next-line:no-shadowed-variable
          dialogRef.afterClosed().subscribe(result =>
          {
            this.bln_isPopupOpened = false;
            const data: Object = {};
            if (result !== undefined)
            {
              const remark = result.reason;
              const loggeduserid = this.sessionStorage.retrieve("userid");
              const loggedusername = this.sessionStorage.retrieve("username");
              const action = "Update User";
              const userid = obj.userdata.UserID;
              const role = obj.userdata.Role;
              const department = obj.userdata.Department;
              const userName = obj.userdata.UserName;
              Object.assign(
                data,
                { loggeduserid: loggeduserid },
                { loggedusername: loggedusername },
                { remark: remark },
                { action: action },
                { userid: userid },
                { status: value },
                { role: role },
                { department: department },
                { userName: userName }
              );
              this.bln_loading = true;
              this.http.putMethod("admin/updateUserStatus", data).subscribe(
                (res: any) =>
                {
                  this.bln_loading = false;
                  switch (res.result)
                  {
                    case 0:
                      this.msg = "Enabled";
                      break;
                    case 1:
                      this.msg = "Temporary Disabled";
                      break;
                    case 2:
                      this.msg = "Permanent Disabled";
                      break;
                  }
                  swal(this.msg + " !", "User has been " + this.msg, "success");
                  this.getData();
                },
                err =>
                {
                  this.errorHandling.checkError(err.status);
                  this.bln_loading = false;
                }
              );
            }
          });
        }
      },
      function (dismiss) { }
    );
  }

  getData()
  {
    this.bln_loading = true;
    this.http.getMethod("user/getUsers").subscribe(
      (res: any) =>
      {
        this.bln_loading = false;
        this.sarr_userData = res.result;
        this.alluserData = res.result;
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
      },
      err =>
      {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  onSelect(val)
  {
    this.bln_show = false;
    switch (val)
    {
      case "Select":
        this.selectedStatusvalue = "Select";
        break;

      case "Enable":
        this.selectedStatusvalue = 0;
        break;

      case "Temporary Disable":
        this.selectedStatusvalue = 1;
        break;

      case "Permanent Disable":
        this.selectedStatusvalue = 2;
        break;

      case "Lock User":
        this.selectedStatusvalue = 6;
        break;

      case "Auto Disable":
        this.selectedStatusvalue = 4;
        break;
    }
    this.sarr_userData = this.alluserData.filter(
      x => x.userdata.Status === this.selectedStatusvalue
    );
    if (val === "Select")
    {
      this.getData();
    }
    this.dataTableReset();
  }

  dataTableReset()
  {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) =>
    {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  getStatusColor(color)
  {
    switch (color)
    {
      case 1:
        this.statusText = "Temporary Disabled";
        return "orange";
      case 4:
        this.statusText = "Auto Disabled";
        return "black";
      case 0:
        this.statusText = "Enable";
        return "Green";
      case 2:
        this.statusText = "Permanent Disabled";
        return "red";
      case 6:
        this.statusText = "Locked";
        return "black";
    }
  }

  ngOnInit()
  {
    // This service will check whether the user has right to view that page or not, If not it will redirect user to Home Page
    //  this.userService.checkRights("Manage User");
    this.loggedUserRole = this.sessionStorage.retrieve("userrole");

    this.getData();
    this.bln_loading = true;
    this.http.getMethod("parameter/getAllParameters").subscribe(
      (res: any) =>
      {
        this.passWordExpiryPeriod = res.result.tbl_config_PasswordExpPeriod;
        this.bln_loading = false;
      },
      err =>
      {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }
}
