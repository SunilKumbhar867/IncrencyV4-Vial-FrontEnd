import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpService } from "../../services/http/http.service";
import { SessionStorageService } from "ngx-webstorage";
import { UserService } from "../../services/user/user.service";
import { ErrorHandlingService } from "../../services/error-handling/error-handling.service";
declare var swal;
@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"]
})
export class ChangePasswordComponent implements OnInit {
  public loading = false;
  passarray: Array<any>;
  username: any;
  userType: any;
  hide: any;
  hide1: any;
  hide2: any;
  userId: string;
  response: any;
  private sub: any;
  id: number;
  forced: number;
  enteredNumcount: any;
  enteredspecialcount: any;
  enteredAlphcount: any;
  alertMessage: any;
  alertMessageText: any;
  passwordLength: any;
  passwordNumeric: any;
  passwordSpecialChar: any;
  passwordAlphabetCaps: any;
  myForm = new FormGroup({
    old_password: new FormControl(),
    new_password: new FormControl(),
    conform_password: new FormControl(),
    remark: new FormControl()
  });
  bln_loading: boolean;
  pattern: any;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public http: HttpService,
    public sessionStorage: SessionStorageService,
    public usr: UserService,
    private errorHandling?: ErrorHandlingService
  ) {
    this.http.getMethod("pwdcomplexity/getPassword").subscribe(
      (res: any) => {
        this.response = res.result;
        console.log(this.response);
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
        this.createForm(this.pattern);
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

    // Avoid Special Characters
    omit_special_char(event)
    {
      var k;
      k = event.charCode;  //
      return (k != 33 && k != 126 && k != 96 && k != 40 && k != 41 && k != 34 && k != 39 && k != 44 && k != 47 && k != 59 && k != 60
        && k != 61 && k != 62 && k != 91 && k != 93 && k != 123 && k != 125 && k != 124 && k != 92);
    }

  ngOnInit() {
    this.userId = this.sessionStorage.retrieve("userId");
    this.username = this.sessionStorage.retrieve("username");
    this.userType = this.sessionStorage.retrieve("type");
    this.getHistoryPassword(this.userId);
    this.sub = this.route.queryParams.subscribe(params => {
      // Defaults to 0 if no query param provided.
      this.forced = +params["forced"] || 0;
    });
  }
  createForm(value) {
    this.myForm = this.fb.group(
      {
        old_password: ["", Validators.required],
        new_password: ["", Validators.pattern(value)],
        conform_password: [
          "",
          [Validators.required, matchOtherValidator("new_password")]
        ],
        remark: ["", Validators.required]
      },
      { validator: CheckforPsw("new_password", this.passarray) }
    );
  }
  onSubmit() {
    const link = "login/updatepassword";
    const txtUserID = this.userId;
    const txtUserName = this.username;
    const txtPwd = this.myForm.value.new_password;
    const txtOldPwd = this.myForm.value.old_password;
    const remark = this.myForm.value.remark;
    const data = {
      userId: txtUserID,
      userName: txtUserName,
      userPassword: txtPwd,
      userOldPassword: txtOldPwd,
      remark: remark,
      status: this.userType
    };
    console.log(data);
    this.loading = true;
    this.http.postMethod(link, data).subscribe(response => {
      this.loading = false;
      this.response = response;
      if (this.response.result === "Password Changed Successfully") {
        swal("Password Changed Successfully", "", "success");
        this.router.navigate(["/authentication/login"]);
      } else if (this.response.result === "Old Password is Wrong") {
        swal("Old Password is Wrong", "", "warning");
      }
    });
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

  // Outsider Functions
  resetForm() {
    this.myForm.reset();
  }
  /***********************Function Detail ******************************/
  /* 1) Function takes userId as a Input
     2) Returns Array containing history of password
  */
  /*********************Function Detail End **************************/
  getHistoryPassword(value) {
    const userid = value;
    const data = { userId: userid };
    this.loading = true;
    this.http
      .postMethod("login/passwordHistory", data)
      .subscribe((response: Array<any>) => {
        this.loading = false;
        this.passarray = response;
        this.createForm(this.pattern);
      });
  }
  home() {
    this.router.navigate(["/home"]);
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
/***********************Function Detail ******************************/
/* 1) Function takes new Password as an argument and also the Password history array as input
   2) Returns true If current password is present inthe history
*/
/*********************Function Detail End **************************/
export function CheckforPsw(passwordKey: string, passarray: Array<any>) {
  return (group: FormGroup) => {
    const password = group.controls[passwordKey];
    const array = passarray;
    const pass = password.value;
    if (array.find(k => k.realPassword === pass) !== undefined) {
      return password.setErrors({ history: "true" });
    }
    return true;
  };
}
