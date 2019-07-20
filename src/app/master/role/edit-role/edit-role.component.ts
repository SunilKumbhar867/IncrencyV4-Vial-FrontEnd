import { Component, OnInit, OnDestroy } from "@angular/core";
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
import { MatDialog, MatSnackBar } from "@angular/material";
import { SessionStorageService } from "ngx-webstorage";
import { RemarkComponent } from "../../../shared/remark/remark/remark.component";
import { DataService } from "../../../services/commonData/data.service";
declare var swal: any;

@Component({
  selector: "app-edit-role",
  templateUrl: "./edit-role.component.html",
  styleUrls: ["./edit-role.component.css"]
})
export class EditRoleComponent implements OnInit, OnDestroy {
  sarr_loggedUserRoles: any;
  rolesArray: any;
  roleName: any;
  bln_loading: boolean;
  bln_editMode: boolean = false;
  bln_isPopupOpened: boolean;
  bln_myVar: boolean = false;
  checkRoleData: any;
  bln_isSame: boolean;
  bln_isSameRight: boolean = false;
  sarr_roleName: Array<any> = [];

  // Declaring Reactve Form
  editRoleForm = new FormGroup({
    roles1: new FormArray([]),
    enterRole: new FormControl()
  });
  response: any;
  constructor(
    private http: HttpService,
    public snackBar?: MatSnackBar,
    private userService?: UserService,
    private fb?: FormBuilder,
    private errorHandling?: ErrorHandlingService,
    private dialog?: MatDialog,
    private sessionStorage?: SessionStorageService,
    private dataService ?: DataService
  ) {
    this.sarr_loggedUserRoles = this.sessionStorage.retrieve("rightsarray");
    this.rolesArray = this.sarr_loggedUserRoles.map(
      c => new FormControl(false)
    );
    this.editRoleForm = this.fb.group({
      roles1: new FormArray(this.rolesArray),
      enterRole: new FormControl("", Validators.required)
    });
    this.getRolesGroup();
  }

  get enterRole() {
    return this.editRoleForm.get("enterRole");
  }

  // Show Role Name To Edit Based on Below Conditions
  getRolesGroup() {
    this.http.getMethod("role/getRoleGroup").subscribe(
      (response: any) => {
        console.log(response);
        this.response = response.result;
        const FinalArray: Array<any> = [];
        for (let i = 0; i < response.result.length; i++) {
          // Below will check is rights are same or not with rights of User who is logged in
          const isSame = this.CheckForSameArray(
            response.result[i].roleRight,
            this.sarr_loggedUserRoles
          );
          const isSameRights = this.FindOne(
            this.sarr_loggedUserRoles,
            response.result[i].roleRight
          );
          // If all below condition is satisfied then Push the Role Name to Edit
          if (
            !isSame &&
            isSameRights &&
            response.result[i].roleRight.length <
              this.sarr_loggedUserRoles.length
          ) {
            FinalArray.push(response.result[i].roleName);
          }
        }
        this.roleName = FinalArray;
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  // On Submit save the Role to Database
  onSubmit() {

    const rights: Array<any> = this.editRoleForm.value.roles1
      .map((v, i) => (v ? this.sarr_loggedUserRoles[i] : null))
      .filter(v => v !== null);

      const roleName = this.editRoleForm.value.enterRole;

      const temp = this.response.find(k => k.roleName === roleName);

      // Check for Same rights if already present
      const isRightChg = this.CheckForSameArray(
        temp.roleRight,
        rights
      );

      if (isRightChg) {
        this.bln_isSameRight = true;
      }
      else
      {
        this.bln_isSameRight = false;
      }

    if (rights.length === 0) {
      swal("At least one right must be assigned to a role", "", "warning");
    }
    else if (this.bln_isSameRight == true) {
      swal("No change", "", "warning");
    }
    else if(rights.toString() == "Add User")
    {
      swal("At least one right must be assigned to a role along with Add User", "", "warning");
    }
    else
    {
      swal({
        title: "Are you sure ?",
        text: "Do you want to edit this role rights", 
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No"
      }).then(
        result => {
          if (result) {
            const roleName = this.editRoleForm.value.enterRole;
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
            const message = { message: "Edit Role" };
            const dialogRef = this.dialog.open(RemarkComponent, {
              data: message,
              width: "570px"
            });
            dialogRef.afterClosed().subscribe(result => {
              this.sessionStorage.store("EditMode", false);
              this.bln_myVar = true;
              this.bln_editMode = true;
              this.bln_isPopupOpened = false;
              const data: Object = {};
              if (result !== undefined) {
                const remark = result.reason;
                const selectedrights: Array<
                  any
                > = this.editRoleForm.value.roles1
                  .map((v, i) => (v ? this.sarr_loggedUserRoles[i] : null))
                  .filter(v => v !== null);
                const roleName = this.editRoleForm.value.enterRole;
                const userID = this.sessionStorage.retrieve("userid");
                const userName = this.sessionStorage.retrieve("username");
                Object.assign(
                  data,
                  { roleName: roleName },
                  { roleRights: selectedrights },
                  { userID: userID },
                  { userName: userName },
                  { remark: remark },
                  { action: "Edit" }
                );
                this.bln_loading = true;
                this.http.putMethod("Role/updateRole", data).subscribe(
                  res => {
                    this.bln_loading = false;
                    if ((res = "Role Updated Successfully")) {
                      swal("Role Updated Successfully", "", "success");
                      this.dataService.setLocked(this.sessionStorage.retrieve("userId"),"tbl_role","role_name",
                      this.editRoleForm.value.enterRole,"locked","0");
                      this.getRolesGroup();
                      this.editRoleForm.reset();
                    } else {
                      swal("Something Went Wrong", "", "error");
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

  // After Editing the Role release the Role & Reset the Form
  Reset() {
    this.dataService.setLocked(this.sessionStorage.retrieve("userId"),"tbl_role","role_name",
    this.editRoleForm.value.enterRole,"locked","0");
    this.sessionStorage.store("EditMode", false);
    this.editRoleForm.reset();
    this.clearCheckBoxes();
    this.bln_myVar = false;
    this.bln_editMode = false;
  }

  // After Editing the Role Clear all selected checkbox
  clearCheckBoxes() {
    for (let i = 0; i < this.sarr_loggedUserRoles.length; i++) {
      this.rolesArray[i].setValue(false);
    }
  }

  // Role Edit Mode
  Edit() {
    if (
      this.editRoleForm.get("enterRole").value === "" ||
      this.editRoleForm.get("enterRole").value === null
    ) {
      swal("Please Select role", "", "warning");
    } else {
      this.bln_editMode = true;
      this.sessionStorage.store("EditMode", true);
      this.dataService.setLocked(this.sessionStorage.retrieve("userId"),"tbl_role","role_name",
      this.editRoleForm.value.enterRole,"locked","1").then(res => {
        }).catch(err => {
          console.log(err)
       });
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 2000
      });
    }
  }

  // // Update the lock so of it is 1 then No other user can edit that same role untill that role is realeased
  // updateLock(value) {
  //   const data: Object = {};
  //   const roleName = this.editRoleForm.value.enterRole;
  //   if (value == "Edit") {
  //     Object.assign(data, { roleName: roleName }, { type: value }, { lock: 1 });
  //   } else {
  //     Object.assign(data, { roleName: roleName }, { type: value }, { lock: 0 });
  //   }
  //   this.http.putMethod("role/updateLockStatus", data).subscribe(
  //     (res: any) => {},
  //     err => {
  //       this.errorHandling.checkError(err.status);
  //       this.bln_loading = false;
  //     }
  //   );
  // }

  // Fetch All Role Data
  getRoleData() {
    this.http.getMethod("role/getRoleGroup").subscribe(
      (response: any) => {
        this.response = response.result;
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  // On Select Role
  changeFun(value) {
    if (value === "") {
      this.bln_myVar = false;
    } else {
      const temp = this.response.find(k => k.roleName === value);
      if (temp.lock === 1) {
        swal("", "This role is being edited from another terminal", "warning");
        this.editRoleForm.reset();
      } else {
        this.clearCheckBoxes();
        this.bln_myVar = true;
        // setting here the rights value to true for that selected role
        const tempArray = temp.roleRight;
        for (let i = 0; i < tempArray.length; i++) {
          const index = this.sarr_loggedUserRoles.indexOf(tempArray[i]);
          this.rolesArray[index].setValue(true);
        }
      }
    }
  }

   // Below function will check if same rights present or not
  CheckForSameArray(arr1, arr2) {
    return $(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0;
  }

  // Check for same rights of Logged in User against all role rights
  FindOne(superset, subset) {
    if (0 === subset.length) {
      return false;
    }
    return subset.every(function(value) {
      return superset.indexOf(value) >= 0;
    });
  }

  // On Select of Particular right checks wheter to give user more rights corresponsing to that Right
  selectOne(right: string, isChecked: boolean) {
    if (right === "Test") {
      const index1 = this.sarr_loggedUserRoles.indexOf("View Report(Self)");
      if (isChecked === true) {
        this.rolesArray[index1].setValue(true);
      } else {
        this.rolesArray[index1].setValue(false);
      }
    } else
    if (right === "Weighment") {
      const index1 = this.sarr_loggedUserRoles.indexOf("View Report(Self)");
      if (isChecked === true) {
        this.rolesArray[index1].setValue(true);
      } else {
        this.rolesArray[index1].setValue(false);
      }
    } else if (right === "View Report(Self)") {
      const index1 = this.sarr_loggedUserRoles.indexOf("Weighment");
      if (isChecked === true) {
        this.rolesArray[index1].setValue(true);
      } else {
        this.rolesArray[index1].setValue(false);
      }
    }
    // else if (right === "Reprint Report(Self)") {
    //   const index1 = this.sarr_loggedUserRoles.indexOf("Weighment");
    //   if (isChecked === true) {
    //     this.rolesArray[index1].setValue(true);
    //   } else {
    //     this.rolesArray[index1].setValue(false);
    //   }
    //   const index2 = this.sarr_loggedUserRoles.indexOf("View Report(Self)");
    //   if (isChecked === true) {
    //     this.rolesArray[index2].setValue(true);
    //   } else {
    //     this.rolesArray[index2].setValue(false);
    //   }
    // }
    else if (right === "Reprint Report(Self)") {
      const index1 = this.sarr_loggedUserRoles.indexOf("Test");
      if (isChecked === true) {
        this.rolesArray[index1].setValue(true);
      } else {
        this.rolesArray[index1].setValue(false);
      }
      const index2 = this.sarr_loggedUserRoles.indexOf("View Report(Self)");
      if (isChecked === true) {
        this.rolesArray[index2].setValue(true);
      } else {
        this.rolesArray[index2].setValue(false);
      }
    }
    else if (right === "Reprint All Report") {
      const index1 = this.sarr_loggedUserRoles.indexOf("View All Report");
      if (isChecked === true) {
        this.rolesArray[index1].setValue(true);
      } else {
        this.rolesArray[index1].setValue(false);
      }
    } else if (right === "Edit Cubicle") {
      const index1 = this.sarr_loggedUserRoles.indexOf("System Setting");
      if (isChecked === true) {
        this.rolesArray[index1].setValue(true);
      } else {
        this.rolesArray[index1].setValue(false);
      }
    }
  }

  ngOnInit() {
     // This service will check whether the user has right to view that page or not, If not it will redirect user to Home Page
     this.userService.checkRights("Edit Role");
    // Check wheter that role is edited by other user or not
    this.checkRoleData = setInterval(() => {
      this.getRoleData();
    }, 1000);

  }
  ngOnDestroy() {
    // Clear the interval when user leaves that component
    clearInterval(this.checkRoleData);
  }
}

// New Component For snackabar
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
export class SnackBarComponent {}
