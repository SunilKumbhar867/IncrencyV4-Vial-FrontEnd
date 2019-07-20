import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { HttpService } from "../../services/http/http.service";
import { UserService } from "../../services/user/user.service";
import { DatePipe } from "@angular/common";
import { MatDialog } from "@angular/material";
import
{
  FormControl,
  FormGroup,
  Validators,
  FormBuilder
} from "@angular/forms";
import { ErrorHandlingService } from "../../services/error-handling/error-handling.service";
import { ValidationService } from "../../services/validations/validation.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
declare var swal: any;

@Component({
  selector: "app-login-ldap",
  templateUrl: "./login-ldap.component.html",
  styleUrls: ["./login-ldap.component.css"]
})
export class LoginLdapComponent implements OnInit
{
  // loginForm: FormGroup;
  loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  });
  bln_loading = false;
  obj_loginResponse: any;
  obj_setAllParameter: any;
  flag = true;
  str_warningState = "success";
  bln_changePasswordButton: boolean = false;
  str_message = "Please login with your User ID and Password.";
  bln_suspiciousActivity: boolean;
  userResponse: any;
  showValidateBtn: boolean = false;
  hideLogin: boolean = false;
  constructor(
    public datepipe: DatePipe,
    private userService: UserService,
    public router: Router,
    private http: HttpService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private errorHandling: ErrorHandlingService,
    private validation?: ValidationService,
    private modalService?: NgbModal
  )
  {
    this.modalService.dismissAll();
    this.dialog.closeAll();
    // Declaring our Form Group
    this.loginForm = this.fb.group({
      username: new FormControl(
        "",
        Validators.compose([this.validation.requiredField])
      ),
      password: new FormControl(
        "",
        Validators.compose([this.validation.requiredField])
      )
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

  // Below function will check User ID is valid to not if valid will then proceed with Further Validations
  checkUserID()
  {
    const username = this.loginForm.value.username;
    const data = { user: username }
    if (username == "")
    {

    } else
    {
      this.http.postMethod('Login/checkuserstatusLds', data).subscribe((res: any) =>
      {
        if (res.status == "success")
        {
          this.userResponse = res;
          this.str_message = 'Please login with your User ID and Password.';
          this.str_warningState = 'success';
          if (res.result[0].Status == 0)
          {
            if (res.result[0].active == 0)
            {
              if (res.result[0].realPassword == "NULL" || res.result[0].realPassword == null)
              {
                if (this.loginForm.value.username != '')
                {
                  this.showValidateBtn = true;
                }
              } else
              {
                if (this.loginForm.value.username != '')
                {
                  this.hideLogin = true;
                }
              }
            } else
            {
              this.hideLogin = false;
              if (res.result[0].source == 'SOFTWARE')
              {
                this.str_message = 'User Already Active on Software';
                this.str_warningState = 'warning';
              } else
              {
                this.str_message = 'User Already Active on IDS';
                this.str_warningState = 'warning';
              }
            }
          } else
          {
            switch (res.result[0].Status)
            {
              case 1: {
                this.str_message = 'Temporary Disabled, Please try again';
                this.str_warningState = 'warning';
                break;
              }
              case 2: {
                this.str_message = 'Permanent Disabled, Please contact Admin';
                this.str_warningState = 'danger';
                break;
              }
              default: {
                this.str_message = 'Please login with your User ID and Password';
                this.str_warningState = 'success';
                break;
              }
            }
            this.hideLogin = false;
          }
        } else
        {
          this.hideLogin = false;
          this.str_message = 'Please enter valid UserID or Username.';
          this.str_warningState = 'danger';
        }
      }, (err) =>
        {
          this.errorHandling.checkError(err.status)
        })
    }
  }

  // Validate User with Windows Server
  validate()
  {
    const strUserName = this.userResponse.result[0].UserName;
    const strPassword = this.loginForm.value.password;
    const data = { strUserName, strPassword };
    this.bln_loading=true;
    this.http.postMethod('ldap/validate', data).subscribe((res: any) =>
    {
      this.bln_loading=false;
      if (res.response == "Authenticated")
      {
        const strUserName = this.userResponse.result[0].UserInitials
        const data = { user: this.loginForm.value.username, strUserName: strUserName }
        this.bln_loading=true;
        this.http.postMethod('login/validateUser', data).subscribe((res: any) =>
        {
          this.bln_loading=false;
          if (res.result == "User Validated Successfully")
          {
            this.userService.storeUserDetailsLdap(this.userResponse);
            swal(" ", "Welcome " + strUserName, "success")
            this.router.navigate(["/home"]);
          }
        })
      } else
      {
        swal("Authentication Failed", "", "error")
        this.str_message = 'Authentication Failed';
        this.str_warningState = 'danger';
      }
    }, (err) =>
      {
        this.errorHandling.checkError(err.status)
      })
  }

  // This function takes username & password as input & checks all the contitions if statisified user gets logged into the system or else shows messages as per user's status
  onFormSubmit()
  {
    if (this.loginForm.value.username !== '' && this.loginForm.value.password !== '')
    {
      const strUserName = this.userResponse.result[0].UserName;
      const strPassword = this.loginForm.value.password;
      const data = JSON.stringify({ strUserName, strPassword });
      this.bln_loading=true;
      this.http.postMethod('ldap/validate', data).subscribe((res: any) =>
      {
        this.bln_loading=false;
        if (res.response == "Authenticated")
        {
          const strUserName = this.userResponse.result[0].UserInitials
          const data = { user: this.loginForm.value.username, strUserName: strUserName }
          this.bln_loading=true;
          this.http.postMethod('login/validateUser', data).subscribe((res: any) =>
          {
            this.bln_loading=false;
            if (res.result == "User Validated Successfully")
            {
              this.userService.storeUserDetailsLdap(this.userResponse);
              swal(" ", "Welcome " + strUserName, "success")
              this.router.navigate(["/home"]);
            }
          })
        } else
        {
          swal("Authentication Failed", "", "error")
          this.str_message = 'Authentication Failed';
          this.str_warningState = 'danger';
        }
      }, (err) =>
        {
          this.errorHandling.checkError(err.status)
        })
    }

  }

  // Below function will reset the form values
  resetForm()
  {
    this.loginForm.reset();
  }

  ngOnInit() { }
}
