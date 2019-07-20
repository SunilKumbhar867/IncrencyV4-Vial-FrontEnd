import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  FormBuilder
} from "@angular/forms";
import { HttpService } from "../../../services/http/http.service";
import { ErrorHandlingService } from "../../../services/error-handling/error-handling.service";
import { SessionStorageService } from "ngx-webstorage";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar, MatDialog } from "@angular/material";
import { NotificationService } from '../../../services/notification/notification.service';
import { RemarkComponent } from "../../../shared/remark/remark/remark.component";
import "rxjs/add/operator/toPromise";
import { DataService } from "../../../services/commonData/data.service";
declare var swal: any;
@Component({
  selector: "app-manage-user-edit",
  templateUrl: "./manage-user-edit.component.html",
  styleUrls: ["./manage-user-edit.component.css"]
})
export class ManageUserEditComponent implements OnInit, OnDestroy {
  bln_loading: boolean = false;
  sarr_department: Array<String>;
  roles: Array<any>;
  roleNames: Array<String>;
  param: Subscription;
  params: any;
  bln_editMode: boolean = false;
  bln_userLocked: Number;
  MRoleRight = true;
  MSplRight = true;
  ViewMode = false;
  interval: any;
  getParticularUser: any;
  userDepartment: any;
  userRole: any;
  allrights: any[];
  tempArray: any;
  specialRightsArray: any;
  rolesRights: any;
  specialsRights: any;
  int_activeUser: any;
  str_logginUserRole: any;
  str_role:any;
  // ********** Declaration of form *********** //
  form = new FormGroup({
    userid: new FormControl(),
    username: new FormControl(),
    userInitials: new FormControl(),
    role: new FormControl(),
    department: new FormControl(),
    status: new FormControl(),
    roleRights: new FormArray([]),
    specialRights: new FormArray([])
  });
  statusText: string;
  myVar: boolean;
  bln_isPopupOpened: boolean;

  constructor(
    private http: HttpService,
    private errorHandling?: ErrorHandlingService,
    private sessionStorage?: SessionStorageService,
    private route?: ActivatedRoute,
    private router?: Router,
    private fb?: FormBuilder,
    public snackBar?: MatSnackBar,
    private dialog?: MatDialog,
    private dataService?: DataService,
    private notifyService ?: NotificationService
  ) {
    this.gettingAllRights();
    this.getDepartmentData();
    this.getRoleData();
  }

  get role() {
    return this.form.get("role");
  }
  get department() {
    return this.form.get("department");
  }

  ngOnInit() {
    this.allrights = [];
    this.bln_loading = true;
    this.param = this.route.queryParams.subscribe(params => {
      this.bln_loading = false;
      this.params = params;
      this.int_activeUser = this.params.active;
      this.str_logginUserRole = this.params.loginRole;
      this.str_role = this.params.role;
      const data: Object = {};
      Object.assign(data, { userid: this.params.userid });
      this.bln_loading = true;
      this.http.postMethod("role/getUserRights", data).subscribe(
        (res: any) => {
          console.log(res);
          this.bln_userLocked = res.result.locked.data[0];
          if (this.bln_userLocked == 1) {
            swal(
              "",
              "This user is being edited from another terminal",
              "error"
            );
            this.router.navigate(["master/user/manage-user"]);
            this.ViewMode = true;
          } else {
            this.dataService
              .setLocked(
                this.sessionStorage.retrieve("userId"),
                "tbl_users",
                "UserID",
                this.params.userid,
                "locked",
                "1"
              )
              .then(res => {})
              .catch(err => {});
            this.snackBar.openFromComponent(SnackBarEditComponent, {
              duration: 2000
            });
            this.sessionStorage.store("EditMode", true);
            this.getParticularUser = res.result;

            this.userRole = this.getParticularUser.Role;
            this.userDepartment = this.getParticularUser.Department;

            this.bln_loading = false;
            this.tempArray = this.getParticularUser.rights;

            this.specialRightsArray = this.allrights.filter(
              item => this.tempArray.indexOf(item) < 0
            );
            this.rolesRights = this.tempArray.map(c => new FormControl(true));
            this.specialsRights = this.specialRightsArray.map(
              c => new FormControl(false)
            );
            if (this.params.status == 0) {
              this.statusText = "Enable";
            } else if (this.params.status == 1) {
              this.statusText = "Temporary Disabled";
            } else if (this.params.status == 2) {
              this.statusText = "Permanent Disabled";
            } else if (this.params.status == 4) {
              this.statusText = "Auto Disabled";
            } else {
              this.statusText = "User Locked";
            }
            this.form = this.fb.group({
              // *****************passing default roles rights to formarray************//
              roleRights: new FormArray(this.rolesRights),
              specialRights: new FormArray(this.specialsRights),
              userid: [this.params.userid, [Validators.required]],
              username: [this.params.username, [Validators.required]],
              userInitials : [this.params.UserInitials, [Validators.required]],
              role: [[Validators.required]],
              department: [[Validators.required]],
              status: [this.statusText, [Validators.required]]
            });
            this.form.controls["role"].setValue(this.userRole);
            this.form.controls["department"].setValue(this.userDepartment);
            // *Calculating Remove Rights array form (this.userAllRoles) And Assigning it false//
            const removeRights: Array<any> = res.result.removeRights;
            if (removeRights.length > 0) {
              for (let i = 0; i < removeRights.length; i++) {
                const index = this.tempArray.indexOf(removeRights[i]);
                this.rolesRights[index].setValue(false);
              }
            }
            // **************************************************************//
            // *Calculating Special Rights array form (this.userAllRoles) And Assigning it true//
            const splRights: Array<any> = res.result.splRights;
            if (splRights.length > 0) {
              for (let i = 0; i < splRights.length; i++) {
                const index = this.specialRightsArray.indexOf(splRights[i]);
                this.specialsRights[index].setValue(true);
              }
            }
          }
        },
        err => {
          this.errorHandling.checkError(err.status);
          this.bln_loading = false;
        }
      );
    });
    // console.log(this.bln_userLocked)
    if(this.int_activeUser == 1)
    {
      this.notifyService.showWarningWithTimeout('This user is active from another terminal!', "Alert!");
    }
  }

  release() {
    this.notifyService.hideWarningToast();
    this.dataService.setLocked(
      this.sessionStorage.retrieve("userId"),
      "tbl_users",
      "UserID",
      this.params.userid,
      "locked",
      "0"
    );
    this.router.navigate(["master/user/manage-user"]);
  }

  changeFun(value) {
    if (value === "") {
      this.myVar = false;
    } else {
      this.form = new FormGroup({
        userid: new FormControl(),
        username: new FormControl(),
        role: new FormControl(),
        department: new FormControl(),
        status: new FormControl(),
        roleRights: new FormArray([]),
        specialRights: new FormArray([])
      });
      const temp = this.roles.find(k => k.roleName === value);
      this.tempArray = temp.roleRight;
      this.specialRightsArray = this.allrights.filter(
        item => this.tempArray.indexOf(item) < 0
      );
      this.rolesRights = this.tempArray.map(c => new FormControl(true));
      this.specialsRights = this.specialRightsArray.map(
        c => new FormControl(false)
      );
      this.form = this.fb.group({
        // *****************passing default roles rights to formarray************//
        roleRights: new FormArray(this.rolesRights),
        specialRights: new FormArray(this.specialsRights),
        userid: new FormControl(this.params.userid, [Validators.required]),
        username: new FormControl(this.params.username, [Validators.required]),
        role: new FormControl("", [Validators.required]),
        department: new FormControl("", [Validators.required]),
        status: new FormControl(this.params.status, [Validators.required])
      });
      setTimeout(() => {
        this.form.controls["role"].setValue(value);
        this.form.controls["department"].setValue(this.userDepartment);
      }, 0);
    }
  }

  onSubmit() {
    this.bln_isPopupOpened = true;
    const message = { message: "Edit User" };
    const selectedRoleRights = this.form.value.roleRights
      .map((v, i) => (v ? this.tempArray[i] : null))
      .filter(v => v !== null);
    const selectedSplRights = this.form.value.specialRights
      .map((v, i) => (v ? this.specialRightsArray[i] : null))
      .filter(v => v !== null);
    const role = this.getParticularUser.rights;
    const specialright = this.getParticularUser.splRights;
    const removeright = this.getParticularUser.removeRights;
    const totalRights = role.concat(specialright);
    const selectedUserRightsarray = totalRights.concat(removeright);
    const concatSubmitedArray = selectedRoleRights.concat(selectedSplRights);
    const alreadySelectedRights = totalRights.filter((i:any)=> removeright.indexOf(i) < 0);

    // const isSameArray = this.CheckForSameArray(
    //   concatSubmitedArray,
    //   selectedUserRightsarray
    // );

    const isSameArray = this.CheckForSameArray(
      concatSubmitedArray,
      alreadySelectedRights
    );

    if (
      isSameArray &&
      this.getParticularUser.Department == this.form.value.department &&
      this.getParticularUser.Role == this.form.value.role &&
      this.getParticularUser.UserInitials == this.form.value.userInitials
    ) {
      swal("No change", "", "warning");
    } else {
      const dialogRef = this.dialog.open(RemarkComponent, {
        data: message,
        width: "570px"
      });
      dialogRef.afterClosed().subscribe(result => {
        this.bln_isPopupOpened = false;
        const data: Object = {};
        if (result !== undefined) {
          const remark = result.reason;
          const userID = this.form.value.userid;
          const username = this.form.value.username;
          const status = this.form.value.status;
          const loggedUserid = this.sessionStorage.retrieve("userid");
          const loggedUsername = this.sessionStorage.retrieve("username");
          Object.assign(
            data,
            { selectedRoleRights: selectedRoleRights },
            { selectedSplRights: selectedSplRights },
            { remark: remark },
            { userID: userID },
            { username: username },
            { status: status },
            { loggedUserid: loggedUserid },
            { loggedUsername: loggedUsername },
            { hdnAction: "User Edited" },
            { role: this.form.value.role },
            { department: this.form.value.department },
            {userInitials:this.form.value.userInitials }
          );
          console.log(data);
          this.bln_loading = true;
          this.http.putMethod("user/updateUser", data).subscribe(
            (response: any) => {
              this.bln_loading = false;
              if ((response.result = "User Updated Successfully")) {
                swal("User details updated successfully", "", "success");
                this.router.navigate(["master/user/manage-user"]);
                this.release();
              }
            },
            err => {
              this.errorHandling.checkError(err.status);
              this.bln_loading = false;
            }
          );
        }
      });
    }
  }

  ModRoleRight() {
    this.MRoleRight = false;
  }

  ModSplRight() {
    this.MSplRight = false;
  }

  gettingAllRights() {
    this.http
      .getMethod("Right/getRight")
      .toPromise()
      .then((rights: any) => {
        const Rights: Array<any> = [];
        for (let i = 0; i < Object.keys(rights).length; i++) {
          Rights.push(rights[i].Right_Name);
        }
        this.allrights = Rights;
      })
      .catch(err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      });
  }

  getDepartmentData() {
    // Populating List of Departments
    this.bln_loading = true;
    this.http.getMethod("department/getDepartments").subscribe(
      (res: any) => {
        this.bln_loading = false;
        const items = [];
        for (let i = 0; i < Object.keys(res.result).length; i++) {
          items.push(res.result[i].department_name);
        }
        this.sarr_department = items;
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  getRoleData() {
    this.bln_loading = true;
    this.http.getMethod("role/getRoleGroup").subscribe(
      (response: any) => {
        this.bln_loading = false;
        this.roles = response.result;
        const LoggedInUserRole = this.sessionStorage.retrieve("userrole");
        const temp = this.roles.find(k => k.roleName === LoggedInUserRole);
        const UsrRoleRightsArray = temp.roleRight;
        const FinalArray: Array<any> = [];
        for (let i = 0; i < Object.keys(this.roles).length; i++) {
          FinalArray.push(this.roles[i].roleName);
        }
        this.roleNames = FinalArray;
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  CheckForSameArray(arr1, arr2) {
    return $(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0;
  }

  ngOnDestroy() {
    this.param.unsubscribe();
    clearInterval(this.interval);
    this.sessionStorage.store("EditMode", false);
  }
}

@Component({
  selector: "app-snackbar",
  template: `
    <p style="text-align:center">Edit Mode Enabled</p>
  `,
  styles: [
    `
      .example-pizza-party {
        color: hotpink;
      }
    `
  ]
})
export class SnackBarEditComponent {}

@Component({
  selector: "app-snackbar",
  template: `
    <p style="text-align:center">View Mode Enabled</p>
  `,
  styles: [
    `
      .example-pizza-party {
        color: hotpink;
      }
    `
  ]
})
export class SnackBarViewComponent {}
