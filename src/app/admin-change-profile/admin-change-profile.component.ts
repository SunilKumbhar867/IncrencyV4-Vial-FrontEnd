import { Component, OnInit } from "@angular/core";
import { SessionStorageService } from "ngx-webstorage";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { HttpService } from "../services/http/http.service";
import { ErrorHandlingService } from "../services/error-handling/error-handling.service";
import { RemarkComponent } from "../shared/remark/remark/remark.component";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
declare var swal: any;
@Component({
  selector: "app-admin-change-profile",
  templateUrl: "./admin-change-profile.component.html",
  styleUrls: ["./admin-change-profile.component.css"]
})
export class AdminChangeProfileComponent implements OnInit {
  hide1: any;
  hide2: any;
  userID: String;
  userName: String;
  changeProfile = new FormGroup({
    selectedUserId: new FormControl(),
    selectedUserName: new FormControl(),
    userPassword: new FormControl(),
    userConfirmPassword: new FormControl()
  });
  srr_selectedUserIds: Array<String>;
  bln_loading: boolean;
  passwordLength: any;
  passwordNumeric: any;
  passwordSpecialChar: any;
  passwordAlphabetCaps: any;
  pattern: any;
  response: any;
  enteredNumcount: any;
  enteredspecialcount: any;
  enteredAlphcount: any;
  alertMessage: any;
  alertMessageText: any;
  value: any;
  bln_isPopupOpened: any;
  allUserData: any;

  constructor(
    private sessionStorage?: SessionStorageService,
    private fb?: FormBuilder,
    private http?: HttpService,
    private errorHandling?: ErrorHandlingService,
    private dialog?: MatDialog,
    public router?: Router,
  ) {
    this.http.getMethod("pwdcomplexity/getPassword").subscribe(
      (res: any) => {
        this.response = res.result;
        this.passwordLength = this.response.Pwd_Length;
        this.passwordNumeric = this.response.Pwd_Digit;
        this.passwordSpecialChar = this.response.Pwd_SpecialChr;
        this.passwordAlphabetCaps = this.response.Pwd_Alphabate;
        this.pattern =
          "^(?=(?:[^A-Z]*[A-Z]){" +
          this.passwordAlphabetCaps +
          "})(?=(?:[^!@#$%^&*()]*[!@#$%^&*()]){" +
          this.passwordAlphabetCaps +
          "})(?=(?:[^0-9]*[0-9]){" +
          this.passwordNumeric +
          "}).{" +
          this.passwordLength +
          ",}$";
        this.form(this.pattern);
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
    this.getUserData();
  }

    // Avoid Special Characters
    omit_special_char(event)
    {
      var k;
      k = event.charCode;  //
      return (k != 33 && k != 126 && k != 96 && k != 40 && k != 41 && k != 34 && k != 39 && k != 44 && k != 47 && k != 59 && k != 60
        && k != 61 && k != 62 && k != 91 && k != 93 && k != 123 && k != 125 && k != 124 && k != 92);
    }

  onSubmit() {
    const LoggeduserId = this.sessionStorage.retrieve("userid");
    const Loggedusername = this.sessionStorage.retrieve("username");
    swal({
      title: "Are you sure ?",
      text: "Do you want to edit this Profile ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    }).then(
      result => {
        if (result) {
          this.bln_isPopupOpened = true;
          const message = { message: "Admin Change Profile" };
          const dialogRef = this.dialog.open(RemarkComponent, {
            data: message,
            width: "570px",
            disableClose: true
          });
          dialogRef.afterClosed().subscribe(result => {
            this.bln_isPopupOpened = false;
            if (result !== undefined) {
              const iSAdmin = "yes";
              const data: Object = {};
              Object.assign(
                data,
                this.changeProfile.value,
                { LoggeduserId: LoggeduserId },
                { Loggedusername: Loggedusername },
                { iSAdmin: iSAdmin },
                { remark: result.reason }
              );
              console.log(data);
              this.bln_loading = true;
              this.http.putMethod("admin/changeAdminProfile", data).subscribe(
                (res: any) => {
                  this.bln_loading = false;
                  if (res.result == "Admin profile changed") {
                    swal("Admin profile changed", "", "success");
                    this.router.navigate(['authentication/login']);
                    this.sessionStorage.clear();
                  }  else {
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

  get selectedUserId() {
    return this.changeProfile.get("selectedUserId");
  }

  form(value) {
    this.changeProfile = this.fb.group({
      selectedUserId: new FormControl("", Validators.required),
      selectedUserName: new FormControl("", Validators.required),
      userPassword: new FormControl("", Validators.pattern(value)),
      userConfirmPassword: [
        "",
        [Validators.required, matchOtherValidator("userPassword")]
      ]
    });
  }

  getUserData() {
    // Populating List of Registered Users
    this.bln_loading = true;
    this.http.getMethod("user/getUsers").subscribe(
      (res: any) => {
        console.log(res);
        this.allUserData = res;
        this.bln_loading = false;
        const items = [];
        for (let i = 0; i < Object.keys(res.result).length; i++) {
          items.push(res.result[i].status.userid);
        }
        const LoggeduserId = this.sessionStorage.retrieve("userid");
        this.srr_selectedUserIds = items;
        var index = this.srr_selectedUserIds.indexOf(LoggeduserId);
        if (index > -1) {
          this.srr_selectedUserIds.splice(index, 1);
        }
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  selectUserID(id) {
    const data = [];
    for (let i = 0; i < Object.keys(this.allUserData.result).length; i++) {
      data.push(this.allUserData.result[i].status);
    }
    const selectedUserID = data.filter(x => x.userid === id);
    const username = selectedUserID[0].username;
    this.changeProfile = this.fb.group({
      selectedUserId: new FormControl(id, Validators.required),
      selectedUserName: new FormControl(username, Validators.required),
      userPassword: new FormControl("", Validators.pattern(this.pattern)),
      userConfirmPassword: [
        "",
        [Validators.required, matchOtherValidator("userPassword")]
      ]
    });
  }

  resetForm() {
    this.changeProfile.reset();
  }

  passwordKey(event: any) {
    const value = event.target.value;
    this.enteredNumcount = (value.match(/\d/g) || []).length;
    this.enteredspecialcount = (
      value.match(/[~`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []
    ).length;
    this.enteredAlphcount = value.length - value.replace(/[A-Z]/g, "").length;
    if (value.length < this.passwordLength) {
      this.alertMessage = true;
      this.alertMessageText =
        "Password should contain Minimum " + this.passwordLength + "  Letters.";
    } else if (
      (this.enteredspecialcount < this.passwordSpecialChar ||
        this.enteredspecialcount == 0) &&
      this.passwordSpecialChar != 0
    ) {
      this.alertMessage = true;
      this.alertMessageText =
        "Password should contain Atleast " +
        this.passwordSpecialChar +
        " Special Characters.";
    } else if (
      (this.enteredNumcount < this.passwordNumeric ||
        this.enteredNumcount == 0) &&
      this.passwordNumeric != 0
    ) {
      this.alertMessage = true;
      this.alertMessageText =
        "Password should contain Atleast " + this.passwordNumeric + " Number.";
    } else if (
      (this.enteredAlphcount < this.passwordAlphabetCaps ||
        this.enteredAlphcount == 0) &&
      this.passwordAlphabetCaps != 0
    ) {
      this.alertMessage = true;
      this.alertMessageText =
        "Password should contain Atleast " +
        this.passwordAlphabetCaps +
        " Capital Letter.";
    } else {
      this.alertMessage = false;
    }
  }

  ngOnInit() {
    this.userID = this.sessionStorage.retrieve("userid");
    this.userName = this.sessionStorage.retrieve("username");
  }
}

/***********************Function Detail ******************************/
/* 1) Function takes new Password as an argument and also the current conform Password as input
   2) Returns true If both same otherwise false for mismatched password
*/
/*********************Function Detail End **************************/
export function matchOtherValidator(otherControlName: string) {
  let thisControl: FormControl;
  let otherControl: FormControl;

  return function matchOtherValidate(control: FormControl) {
    if (!control.parent) {
      return null;
    }

    // Initializing the validator.
    if (!thisControl) {
      thisControl = control;
      otherControl = control.parent.get(otherControlName) as FormControl;
      if (!otherControl) {
        throw new Error(
          "matchOtherValidator(): other control is not found in parent group"
        );
      }
      otherControl.valueChanges.subscribe(() => {
        thisControl.updateValueAndValidity();
      });
    }

    if (!otherControl) {
      return null;
    }

    if (otherControl.value !== thisControl.value) {
      return {
        matchOther: true
      };
    }
    return null;
  };
}
