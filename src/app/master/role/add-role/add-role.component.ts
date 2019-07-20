import { Component, OnInit } from "@angular/core";
import { HttpService } from "../../../../app/services/http/http.service";
import { UserService } from "../../../../app/services/user/user.service";
import {
  FormBuilder,
  FormArray,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import { ErrorHandlingService } from "../../../../app/services/error-handling/error-handling.service";
import { MatDialog } from "@angular/material";
import { SessionStorageService } from "ngx-webstorage";
import { RemarkComponent } from "../../../shared/remark/remark/remark.component";
import { ValidationService } from "../../../services/validations/validation.service";
declare var swal: any;

@Component({
  selector: "app-add-role",
  templateUrl: "./add-role.component.html",
  styleUrls: ["./add-role.component.css"]
})
export class AddRoleComponent implements OnInit {
  sarr_allRights: any;
  sarr_loggedUserRoles: any;
  sarr_roleName: Array<any> = [];
  bln_loading = false;
  bln_isPopupOpened = true;
  flag: boolean;
  bln_disableRest: boolean = false;
  bln_isSame: boolean;
  str_sameRigtAssignRole: string;
  bln_exist: boolean;
  bln_showWarning: boolean;

  // Declaring Reactive Form
  roleForm = new FormGroup({
    roles: new FormArray([]),
    enterRole: new FormControl()
  });

  constructor(
    private http: HttpService,
    private userService: UserService,
    private fb: FormBuilder,
    private errorHandling: ErrorHandlingService,
    private dialog?: MatDialog,
    private sessionStorage?: SessionStorageService,
    private validation?: ValidationService
  ) {
    // Getting List of all Roles to avoid user to create same role again
    this.http.getMethod("role/getRoleGroup").subscribe(
      (res: any) => {
        this.bln_loading = false;
        const items = [];
        for (let i = 0; i < res.result.length; i++) {
          items.push(res.result[i].roleName);
        }
        this.sarr_roleName = items;
        this.sarr_roleName = this.sarr_roleName
          .toLocaleString()
          .toLowerCase()
          .split(",");
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );

    this.flag = false;
    // Logged in User Rights
    this.sarr_loggedUserRoles = this.sessionStorage.retrieve("rightsarray");
    this.sarr_allRights = this.sarr_loggedUserRoles.map(
      c => new FormControl({ value: false, disabled: false })
    );
    // Populating Checkbox Rights
    this.roleForm = this.fb.group({
      enterRole: new FormControl(
        "",
        Validators.compose([this.validation.requiredField])
      ),
      roles: new FormArray(this.sarr_allRights, Validators.required)
    });
  }

  get enterRole() {
    return this.roleForm.get("enterRole");
  }

  // On Submit checks conditions, if all satisfied adds that Role
  submit() {
    // Below function will check the checkbox status whether True or False & return its actual Label if Chekbox is checked
    const rights: Array<any> = this.roleForm.value.roles
      .map((v, i) => (v ? this.sarr_loggedUserRoles[i] : null))
      .filter(v => v !== null);

      this.http.getMethod("role/getRoleGroup").subscribe(
        (res: any) => {
          this.bln_loading = false;
          const items = [];
          for (let i = 0; i < res.result.length; i++) {
            items.push(res.result[i].roleName);
            // Check for Same rights if already present
            const isSame = this.CheckForSameArray(
              res.result[i].roleRight,
              rights
            );
            if (isSame) {
              this.bln_isSame = true;
              swal(
                "",
                "Same Rights are already assigned to " +
                  res.result[i].roleName,"warning"
              );
              this.dialog.closeAll();
            }
          }
          this.sarr_roleName = items;
        },
        err => {
          this.errorHandling.checkError(err.status);
          this.bln_loading = false;
        }
      );

    if (rights.length === 0) {
      swal("At least one right must be assigned to a role", "", "warning");
    }
    else if(rights.toString() == "Add User")
    {
      swal("At least one right must be assigned to a role along with Add User", "", "warning");
    }
    else {
      swal({
        title: "Are you sure ?",
        text: "You want to add this Role",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No"
      }).then(
        result => {
          if (result) {
            const roleName = this.roleForm.value.enterRole;
            const data: Object = {};
            Object.assign(data, { roleName: roleName }, { rights: rights });
            this.bln_loading = true;
            this.http.getMethod("role/getRoleGroup").subscribe(
              (res: any) => {
                this.bln_loading = false;
                const items = [];
                for (let i = 0; i < res.result.length; i++) {
                  items.push(res.result[i].roleName);
                  // Check for Same rights if already present
                  const isSame = this.CheckForSameArray(
                    res.result[i].roleRight,
                    rights
                  );
                  if (isSame) {
                    this.bln_isSame = true;
                    swal(
                      "",
                      "Same Rights are already assigned to " +
                        res.result[i].roleName,"warning"
                    );
                    this.dialog.closeAll();
                  }
                }
                this.sarr_roleName = items;
              },
              err => {
                this.errorHandling.checkError(err.status);
                this.bln_loading = false;
              }
            );
            this.bln_isSame = false;
            this.bln_isPopupOpened = true;
            const message = { message: "Add Role" };
            const dialogRef = this.dialog.open(RemarkComponent, {
              data: message,
              width: "570px",
              disableClose: true
            });
            dialogRef.afterClosed().subscribe(result => {
              this.bln_isPopupOpened = false;
              if (result !== undefined) {
                const data: Object = {};
                const userID = this.sessionStorage.retrieve("userid");
                const userName = this.sessionStorage.retrieve("username");
                const remark = result.reason;
                const action = "Add";
                const roleName = this.roleForm.value.enterRole;
                const roleRights = this.roleForm.value.roles;
                Object.assign(
                  data,
                  { roleName: roleName },
                  { roleRights: rights },
                  { userId: userID },
                  { userName: userName },
                  { remark: remark },
                  { action: action }
                );
                this.http.postMethod("role/storeRole", data).subscribe(
                  (res: any) => {
                    if (res.result == "Role Added Successfully") {
                      swal("Role Added successfully", "", "success");
                      this.roleForm.reset();
                    } else if (res.result == "Role Already Exist") {
                      swal("Role name already Exists!", "", "error");
                    } else {
                      swal("Something went wrong", "", "error");
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
        },
        function(dismiss) {}
      );
    }
  }

  // Below function will Check if same role is already present or not
  onKey(event: any) {
    const value = event.target.value.toLowerCase();
    const length = this.sarr_roleName.filter(x => x === value);
    if (length.length > 0) {
      this.bln_showWarning = true;
      this.bln_exist = true;
    } else {
      this.bln_showWarning = false;
      this.bln_exist = false;
    }
  }

  // Below function will check if same rights present or not
  CheckForSameArray(arr1, arr2) {
    return $(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0;
  }

  // On Select of Particular right checks wheter to give user more rights corresponsing to that Right
  selectOne(right: string, isChecked: boolean) {
    if (right === "Test") {
      const index1 = this.sarr_loggedUserRoles.indexOf("View Report(Self)");
      if (isChecked === true) {
        this.sarr_allRights[index1].setValue(true);
      } else {
        this.sarr_allRights[index1].setValue(false);
      }
    } else if (right === "View Report(Self)") {
      const index1 = this.sarr_loggedUserRoles.indexOf("Test");
      if (isChecked === true) {
        this.sarr_allRights[index1].setValue(true);
      } else {
        this.sarr_allRights[index1].setValue(false);
      }
    } else if (right === "Reprint Report(Self)") {
      const index1 = this.sarr_loggedUserRoles.indexOf("Test");
      if (isChecked === true) {
        this.sarr_allRights[index1].setValue(true);
      } else {
        this.sarr_allRights[index1].setValue(false);
      }
      const index2 = this.sarr_loggedUserRoles.indexOf("View Report(Self)");
      if (isChecked === true) {
        this.sarr_allRights[index2].setValue(true);
      } else {
        this.sarr_allRights[index2].setValue(false);
      }
    } else if (right === "Reprint All Report") {
      const index1 = this.sarr_loggedUserRoles.indexOf("View All Report");
      if (isChecked === true) {
        this.sarr_allRights[index1].setValue(true);
      } else {
        this.sarr_allRights[index1].setValue(false);
      }
    }
  }

  // Selects All Rights
  selectAll(flag) {
    if (this.flag === false) {
      for (let i = 0; i < this.sarr_allRights.length; i++) {
        this.sarr_allRights[i].setValue(true);
      }

      this.flag = true;
    } else {
      for (let i = 0; i < this.sarr_allRights.length; i++) {
        this.sarr_allRights[i].setValue(false);
      }
      this.flag = false;
    }
  }

  reset(){
    this.roleForm.reset();
  }
  ngOnInit() {
     // This service will check whether the user has right to view that page or not, If not it will redirect user to Home Page
    this.userService.checkRights("Add Role");
  }
}
