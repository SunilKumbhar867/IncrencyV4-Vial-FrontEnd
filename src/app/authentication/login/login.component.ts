import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { HttpService } from "../../services/http/http.service";
import { UserService } from "../../services/user/user.service";
import { DatePipe } from "@angular/common";
declare var swal: any;
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import
{
  FormControl,
  FormGroup,
  Validators,
  FormBuilder
} from "@angular/forms";
import { ErrorHandlingService } from "../../services/error-handling/error-handling.service";
import { ValidationService } from "../../services/validations/validation.service";
import
{
  NgbModal
} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit
{
  // loginForm: FormGroup;
  loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
  });
  bln_loading = false;
  obj_loginResponse: any;
  obj_setAllParameter: any;
  flag = true;
  str_warningState = "success";
  bln_changePasswordButton: boolean = false;
  str_message = "Please login with your UserId and Password.";
  bln_suspiciousActivity: boolean;
  constructor(
    public datepipe: DatePipe,
    private userService: UserService,
    public router: Router,
    private http: HttpService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private errorHandling: ErrorHandlingService,
    private validation?: ValidationService,
    private modalService?: NgbModal,
  )
  {
    this.modalService.dismissAll();
    this.dialog.closeAll();
    // Declaring our Form Group
    this.loginForm = this.fb.group({
      username: new FormControl("", Validators.compose([this.validation.requiredField])),
      password: new FormControl("", Validators.compose([this.validation.requiredField]))
    });
  }

  get username()
  {
    return this.loginForm.get("username");
  }
  get password()
  {
    return this.loginForm.get("password");
  }

  // This function takes username & password as input & checks all the contitions if statisified user gets logged into the system or else shows messages as per user's status
  onFormSubmit()
  {
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;
    const data = { userId: username, userPass: password };
    this.bln_loading = true;
    //This will check & return user's status
    this.http.postMethod("login/checkStatus", data).subscribe((res: any) =>
    {
      console.log(res);
      this.obj_loginResponse = res;
      this.bln_loading = false;
      if (this.obj_loginResponse.result == "Wrong Password" || this.obj_loginResponse.result == "Temporary Disable"
        || this.obj_loginResponse.result == "Invalild credential" || this.obj_loginResponse.result == "Suspicious Activity")
      {
        this.str_warningState = "danger";
        this.str_message = "Incorrect Credentials";
        // If status if Temporary disabled this will disable the user from entering username & password for a period of time which is defined in Set All Parameters Master
        if (this.obj_loginResponse.result == "Suspicious Activity")
        {
          this.str_message = "Suspicious Activity Found, Contact Admin";
          this.str_warningState = "danger";
        }
        if (this.obj_loginResponse.result == "Temporary Disable")
        {
          const data = { userId: this.loginForm.value.username, ACT: "User Locked", Remark: "Locked" }
          this.http.postMethod('login/updateUserLock', data).subscribe((res: any) =>
          {

          }, err =>
            {
              this.errorHandling.checkError(err.status);
              this.bln_loading = false;
            });
          this.loginForm.get('username').disable();
          this.loginForm.get('password').disable();
          const disabledTime = this.obj_setAllParameter.result[0].tbl_config_DisabledTime;
          const date1 = new Date();
          date1.setSeconds(date1.getSeconds() + disabledTime);
          const id = setInterval(() =>
          {
            const seconds = this.checkTempDisTime(date1);
            this.str_message = 'User Locked, Try Again After ' + seconds + ' seconds';
            this.str_warningState = 'danger';
            if (seconds === 1)
            {
              clearInterval(id);
              this.loginForm.get('username').enable();
              this.loginForm.get('password').enable();
              this.str_message = 'Please login with your User ID and Password';
              this.str_warningState = 'success';
            }
          }, 1000);
          this.resetForm();
        }
      } else
      {
        // If user is Logging in for the First Time
        if (this.obj_loginResponse.result.PwdChg.data == 1)
        {
          this.userService.storeUserDetails(this.obj_loginResponse);
          swal("Please Change Your Password", "", "success");
          this.router.navigate(["/changePassword"], {
            queryParams: { forced: 1 }
          });
        } else if (this.obj_loginResponse.result.PwdChg.data == 0)
        {
          // Check if user is already active or not
          if (this.obj_loginResponse.result.active == 1)
          {
            this.str_message = "User Already Active";
            this.str_warningState = "danger";
          } else if (this.obj_loginResponse.result.active == 0)
          {
            // Based on user status following cases will get execute
            switch (this.obj_loginResponse.result.Status)
            {
              // User Enabled
              case 0: {
                this.userService.storeUserDetails(this.obj_loginResponse);
                var today = new Date();
                var PasswordExpPeriod = this.obj_setAllParameter.result[0].tbl_config_PasswordExpPeriod;
                var ReminderPassword = this.obj_setAllParameter.result[0].tbl_config_ReminderPassword;
                var userID = this.obj_loginResponse.result.UserID;
                var PwdChgDate = new Date(this.obj_loginResponse.result.PwdChgDate);
                const reminder = PasswordExpPeriod - ReminderPassword;
                const timeDiff = Math.abs(today.getTime() - PwdChgDate.getTime());
                const diff_pwch_today = Math.ceil(timeDiff / (1000 * 3600 * 24));
                // Check if password is expired or not if expires will force user to change password
                if (diff_pwch_today > PasswordExpPeriod)
                {
                  swal("Password Expired", "Please change your password", "warning");
                  this.router.navigate(["/changePassword"], {
                    queryParams: { forced: 1 }
                  });
                } else if (reminder <= diff_pwch_today)
                {
                  // The below API will change Active = 1 & make the user Login into the System
                  const data: Object = {};
                  Object.assign(data, { userId: userID }, { source: 'SOFTWARE' });
                  this.bln_loading = true;
                  this.http
                    .putMethod("login/setUserActive", data)
                    .subscribe(res =>
                    {
                      this.bln_loading = false;
                    }, err =>
                      {
                        this.errorHandling.checkError(err.status);
                        this.bln_loading = false;
                      });
                  this.router.navigate(["/home"]);
                  this.openDialog();
                } else
                {
                  const data: Object = {};
                  Object.assign(data, { userId: userID }, { source: 'SOFTWARE' });

                  this.bln_loading = true;
                  this.http
                    .putMethod("login/setUserActive", data)
                    .subscribe(res =>
                    {
                      this.bln_loading = false;
                    }, err =>
                      {
                        this.errorHandling.checkError(err.status);
                        this.bln_loading = false;
                      });
                  this.router.navigate(["/home"]);
                }
                break;
              }
              // Temporary Disabled
              case 1: {
                console.log('ss');
                if (this.obj_loginResponse.result.PREV_STATUS == 11)
                {
                  this.str_message = "Suspicious Activity Found, Contact Admin";
                  this.str_warningState = "danger";
                } else
                {
                  this.str_message = "User Temporary Disabled, Contact Admin";
                  this.str_warningState = "warning";
                }
                break;
              }
              // Permanent Disabled
              case 2: {
                this.str_message = "User Permanent Disabled, Contact Admin";
                this.str_warningState = "danger";
                break;
              }
              // Auto Disabled it will force user to change the password
              case 4: {
                this.str_message = "User Auto Disabled, Change Password";
                this.str_warningState = "danger";
                swal("Auto Disabled...!", "Please Change your Password", "warning")
                this.userService.storeUserDetails(this.obj_loginResponse);
                this.router.navigate(["/changePassword"], { queryParams: { forced: 1 } });
                break;
              }
              // User Locked
              case 6: {
                this.str_message = "User Locked, Please contact Admin";
                this.str_warningState = "danger";
                break;
              }
            }
          }
        }
      }
    }
      , err =>
      {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  // Below function will navigate user to Change Password Component
  changePassword()
  {
    this.router.navigate(["/changePassword"], {
      queryParams: { forced: 1 }
    });
  }

  // This will return how much seconds to disable the user from entering username & Passowrd
  checkTempDisTime(value)
  {
    const date1 = value;
    const date2 = new Date();
    const timeDiff = Math.abs(date1.getTime() - date2.getTime());
    const seconds = Math.ceil(timeDiff / 1000);
    return seconds;
  }


  // Below function will reset the form values
  resetForm()
  {
    this.loginForm.reset();
  }

  // Dailog box which will Prompt user to change his passowrd
  openDialog(): void
  {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: "315px",
      data: { flag: this.flag }
    });

    dialogRef.afterClosed().subscribe(result =>
    {
      if (result === true)
      {
        this.router.navigate(["/changePassword"]);
      }
    });
  }

  ngOnInit()
  {
    // Below Fuction returns ALl Set All Parameters Data
    this.http.getMethod("parameter/getAllParameters").subscribe(res =>
    {
      this.obj_setAllParameter = res;
    }, err =>
      {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      });
  }
}

// Second Component For Dialog Box
@Component({
  selector: "app-dialog-box",
  template: `
    <div class="row" style="text-align:center;">
      <div class="col-sm-12">
        <h1 mat-dialog-title>Change Your Password</h1>
        <div mat-dialog-content>
          <p>Do you want to change password ?</p>
          <input matInput [(ngModel)]="data.flag" hidden />
        </div>
        <div mat-dialog-actions align="center">
        <button class="btn btn-info" mat-button [mat-dialog-close]="data.flag" cdkFocusInitial>Yes</button>
        &nbsp;&nbsp;&nbsp;
        <button class="btn btn-info" mat-button (click)="onNoClick()">No</button>
        </div>
      </div>
    </div>
  `
})
export class DialogBoxComponent
{
  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void
  {
    this.dialogRef.close();
  }
}
