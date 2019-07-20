import { Component, OnInit } from "@angular/core";
import
{
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { HttpService } from "../../../services/http/http.service";
import { MatDialog } from "@angular/material";
import { SessionStorageService } from "ngx-webstorage";
import { ErrorHandlingService } from "../../../services/error-handling/error-handling.service";
import { ConfigService } from "../../../services/configuration/config.service";
import { RemarkComponent } from "../../../shared/remark/remark/remark.component";
import { ValidationService } from "../../../services/validations/validation.service";
import { UserService } from "../../../services/user/user.service";

declare var swal: any;
@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.css"]
})
export class AddUserComponent implements OnInit
{
  sarr_loggedUserRoles: any;
  hide1: any;
  hide2: any;
  bln_loading: boolean;
  sarr_roles: any;
  sarr_department: any;
  sarr_users: any;
  hidden = false;
  disabled = true;
  selectedRole: any;
  sarr_rights: any;
  bln_showWarningitemCode: boolean;
  bln_exist: boolean;
  bln_rightsArrayBox: boolean = false;
  value: any;
  length: any;
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
  userIDMaxlenth: number;
  bln_isPopupOpened: boolean;
  addUserForm = new FormGroup({
    userID: new FormControl(),
    userName: new FormControl(),
    userInitials: new FormControl(),
    userRoles: new FormControl(),
    userDepartment: new FormControl(),
    userPassword: new FormControl(),
    userConfirmPassword: new FormControl()
  });
  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private dialog?: MatDialog,
    public localStorage?: SessionStorageService,
    private errorHandling?: ErrorHandlingService,
    private jsonService?: ConfigService,
    private sessionStorage?: SessionStorageService,
    private validation?: ValidationService,
    private userService?: UserService,
  )
  {
    this.sarr_loggedUserRoles = this.sessionStorage.retrieve("rightsarray");
    //User ID Max Length controlled from Developer Panel
    this.jsonService.getJsonFileData().subscribe((res: any) =>
    {
      this.userIDMaxlenth = res.User[0].Value;
    });
    //Below Function will store values as per Specified in Password Policy
    this.http.getMethod("pwdcomplexity/getPassword").subscribe(
      (res: any) =>
      {
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
      err =>
      {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
    // Populating List of Departments
    this.http.getMethod("department/getDepartments").subscribe(
      (res: any) =>
      {
        const items = [];
        for (let i = 0; i < Object.keys(res.result).length; i++)
        {
          items.push(res.result[i].department_name);
        }
        this.sarr_department = items;
      },
      err =>
      {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
    // Populating List of Roles
    this.http.getMethod("role/getRoleGroup").subscribe(
      (response: any) =>
      {
        console.log(response);
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
        this.sarr_roles = FinalArray;
      },
      err =>
      {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );

    // Populating List of Registered Users
    this.http.getMethod("user/getUsers").subscribe(
      (res: any) =>
      {
        const items = [];
        for (let i = 0; i < Object.keys(res.result).length; i++)
        {
          items.push(res.result[i].status.userid);
        }
        this.sarr_users = items;
        this.sarr_users = this.sarr_users
          .toLocaleString()
          .toLowerCase()
          .split(",");
      },
      err =>
      {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
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

  // Avoid Numbers
  omit_numbers(event)
  {

    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123)) || k ==32;
  }

  // Avoid Special Characters
  omit_special_char(event)
  {
    var k;
    k = event.charCode;  //
    return (k != 33 && k != 126 && k != 96 && k != 40 && k != 41 && k != 34 && k != 39 && k != 44 && k != 47 && k != 59 && k != 60
      && k != 61 && k != 62 && k != 91 && k != 93 && k != 123 && k != 125 && k != 124 && k != 92);
  }


  //Password Validations as per specified in Password Policy
  passwordKey(event: any)
  {
    const value = event.target.value;
    this.enteredNumcount = (value.match(/\d/g) || []).length;
    this.enteredspecialcount = (
      value.match(/[~`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []
    ).length;
    this.enteredAlphcount = value.length - value.replace(/[A-Z]/g, "").length;
    if (value.length < this.passwordLength)
    {
      this.alertMessage = true;
      this.alertMessageText =
        "Password should contain Minimum " + this.passwordLength + "  Letters.";
    } else if (
      (this.enteredspecialcount < this.passwordSpecialChar ||
        this.enteredspecialcount == 0) &&
      this.passwordSpecialChar != 0
    )
    {
      this.alertMessage = true;
      this.alertMessageText =
        "Password should contain Atleast " +
        this.passwordSpecialChar +
        " Special Characters.";
    } else if (
      (this.enteredNumcount < this.passwordNumeric ||
        this.enteredNumcount == 0) &&
      this.passwordNumeric != 0
    )
    {
      this.alertMessage = true;
      this.alertMessageText =
        "Password should contain Atleast " + this.passwordNumeric + " Number.";
    } else if (
      (this.enteredAlphcount < this.passwordAlphabetCaps ||
        this.enteredAlphcount == 0) &&
      this.passwordAlphabetCaps != 0
    )
    {
      this.alertMessage = true;
      this.alertMessageText =
        "Password should contain Atleast " +
        this.passwordAlphabetCaps +
        " Capital Letter.";
    } else
    {
      this.alertMessage = false;
    }
  }

  //Initializing the Form & Passing value Pattern for Password
  form(value)
  {
    this.addUserForm = this.fb.group({
      userID: new FormControl(
        "",
        Validators.compose([this.validation.requiredField])
      ),
      userName: new FormControl(
        "",
        Validators.compose([this.validation.requiredField])
      ),
      userInitials: new FormControl(
        "",
        Validators.compose([this.validation.requiredField])
      ),
      userRoles: new FormControl("", Validators.required),
      userDepartment: new FormControl("", Validators.required),
      userPassword: new FormControl("", Validators.pattern(value)),
      userConfirmPassword: [
        "",
        [Validators.required, matchOtherValidator("userPassword")]
      ]
    });
  }

  // On Key Up Event to Check is User ID Already Exists or not
  onKeyUpUser(event: any)
  {
    this.value = event.target.value;
    this.value = this.value.toLowerCase();
    this.length = this.sarr_users.filter(x => x === this.value);
    if (this.length.length > 0)
    {
      this.bln_showWarningitemCode = true;
      this.bln_exist = true;
    } else
    {
      this.bln_showWarningitemCode = false;
      this.bln_exist = false;
    }
  }

  get userID()
  {
    return this.addUserForm.get("userID");
  }
  get userName()
  {
    return this.addUserForm.get("userName");
  }
  get userInitials()
  {
    return this.addUserForm.get("userInitials");
  }
  get userRoles()
  {
    return this.addUserForm.get("userRoles");
  }
  get userDepartment()
  {
    return this.addUserForm.get("userDepartment");
  }
  get userPassword()
  {
    return this.addUserForm.get("userPassword");
  }
  get userConfirmPassword()
  {
    return this.addUserForm.get("userConfirmPassword");
  }

  // ON Role Select Show corresponding rights according to that role
  OnChange(role: string)
  {
    // Populaing rights based on selected role
    const data = { role: role };
    this.http.postMethod("role/getRoleRight", data).subscribe(
      (res: any) =>
      {
        const items = [];
        for (let i = 0; i < Object.keys(res.result).length; i++)
        {
          items.push(res.result[i].role_rights);
        }
        this.sarr_rights = items;
        this.selectedRole = role;
      },
      err =>
      {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
    this.bln_rightsArrayBox = true;
  }

  //On Form Submit
  onFormSubmit()
  {
    swal({
      title: "Are you sure ?",
      text: "Do you want to add this user ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    }).then(
      result =>
      {
        if (result)
        {
          this.bln_isPopupOpened = true;
          const message = { message: "Add User" };
          const dialogRef = this.dialog.open(RemarkComponent, {
            data: message,
            width: "570px",
            disableClose: true
          });
          dialogRef.afterClosed().subscribe(result =>
          {
            this.bln_isPopupOpened = false;
            if (result !== undefined)
            {
              const data: Object = {};
              const loggeduserID = this.sessionStorage.retrieve("userid");
              const loggeduserName = this.sessionStorage.retrieve("username");
              const remark = result.reason;
              const action = "New User Added";
              const formData = this.addUserForm.value;
              Object.assign(
                data,
                formData,
                { loggeduserID: loggeduserID },
                { loggeduserName: loggeduserName },
                { remark: remark },
                { action: action }
              );
              this.bln_loading = true;
              this.http.postMethod("user/storeUser", data).subscribe(
                (res: any) =>
                {
                  this.bln_loading = false;
                  if (res.result == "User Added Successfully")
                  {
                    swal("User Added Successfully", "", "success");
                    this.addUserForm.reset();
                    this.bln_rightsArrayBox = false;
                  } else if (res.result == "User Id Already Exist")
                  {
                    swal("User Id Already Exist", "", "warning");
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
        }
      },
      function (dismiss) { }
    );
  }

  // Reset the Form
  reset()
  {
    this.bln_showWarningitemCode = false;
    this.alertMessage = false;
    this.addUserForm.reset();
    this.bln_rightsArrayBox = false;
  }

  ngOnInit()
  {
    // This service will check whether the user has right to view that page or not, If not it will redirect user to Home Page
    this.userService.checkRights("Add User");
  }
}
/***********************Function Detail ******************************/
/* 1) Function takes new Password as an argument and also the current conform Password as input
   2) Returns true If both same otherwise false for mismatched password
*/
/*********************Function Detail End **************************/
export function matchOtherValidator(otherControlName: string)
{
  let thisControl: FormControl;
  let otherControl: FormControl;

  return function matchOtherValidate(control: FormControl)
  {
    if (!control.parent)
    {
      return null;
    }

    // Initializing the validator.
    if (!thisControl)
    {
      thisControl = control;
      otherControl = control.parent.get(otherControlName) as FormControl;
      if (!otherControl)
      {
        throw new Error(
          "matchOtherValidator(): other control is not found in parent group"
        );
      }
      otherControl.valueChanges.subscribe(() =>
      {
        thisControl.updateValueAndValidity();
      });
    }

    if (!otherControl)
    {
      return null;
    }

    if (otherControl.value !== thisControl.value)
    {
      return {
        matchOther: true
      };
    }

    return null;
  };
}
