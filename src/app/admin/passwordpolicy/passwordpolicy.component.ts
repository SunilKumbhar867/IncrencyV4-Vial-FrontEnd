import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { HttpService } from "../../services/http/http.service";
import { UserService } from "../../services/user/user.service";
import { ErrorHandlingService } from "../../services/error-handling/error-handling.service";
import { MatDialog } from "@angular/material";
import { SessionStorageService } from "ngx-webstorage";
import { RemarkComponent } from "../../shared/remark/remark/remark.component";
import { ValidationService } from "../../../app/services/validations/validation.service";
declare var swal: any;

@Component({
  selector: "app-passwordpolicy",
  templateUrl: "./passwordpolicy.component.html",
  styleUrls: ["./passwordpolicy.component.css"]
})
export class PasswordpolicyComponent implements OnInit {
  bln_loading;
  obj_pwdComplexity;
  bln_isPopupOpened;
  // Declaring the Form Group
  passwordComplexityForm = new FormGroup({
    passwordLength: new FormControl(),
    specialCharacters: new FormControl(),
    numericLength: new FormControl(),
    alphabetUppercase: new FormControl()
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
    this.bln_loading = true;
    // Below function will map the database values to our formgroup
    this.http.getMethod("pwdcomplexity/getPassword").subscribe(
      (res: any) => {
        this.bln_loading = false;
        this.obj_pwdComplexity = res.result;
        this.passwordComplexityForm = this.fb.group({
          passwordLength: new FormControl(
            this.obj_pwdComplexity.Pwd_Length,
            Validators.compose([this.validation.requiredField])
          ),
          specialCharacters: new FormControl(
            this.obj_pwdComplexity.Pwd_SpecialChr,
            Validators.compose([this.validation.requiredField])
          ),
          numericLength: new FormControl(
            this.obj_pwdComplexity.Pwd_Digit,
            Validators.compose([this.validation.requiredField])
          ),
          alphabetUppercase: new FormControl(
            this.obj_pwdComplexity.Pwd_Alphabate,
            Validators.compose([this.validation.requiredField])
          )
        });
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  get passwordLength() {
    return this.passwordComplexityForm.get("passwordLength");
  }
  get specialCharacters() {
    return this.passwordComplexityForm.get("specialCharacters");
  }
  get numericLength() {
    return this.passwordComplexityForm.get("numericLength");
  }
  get alphabetUppercase() {
    return this.passwordComplexityForm.get("alphabetUppercase");
  }

  //This function will call service which will accept only Numbers in the Text Field
  onlyNumbers(event: any) {
    this.validation.onlyNumbers(event);
  }

  // Below function will check the necessary conditions for password complexity & store new values for Password Complexity
  onSubmit() {
    let formData = this.passwordComplexityForm.value;
    var total =
      Number(formData.specialCharacters) +
      Number(formData.numericLength) +
      Number(formData.alphabetUppercase);
    if (
      this.obj_pwdComplexity.Pwd_Length == formData.passwordLength &&
      this.obj_pwdComplexity.Pwd_SpecialChr == formData.specialCharacters &&
      this.obj_pwdComplexity.Pwd_Digit == formData.numericLength &&
      this.obj_pwdComplexity.Pwd_Alphabate == formData.alphabetUppercase
    ) {
      swal("No Change in parameters", "", "error");
    } else {
      if (formData.passwordLength > 20) {
        swal("", "Password Length cannot be greater than 20", "error");
      } else {
        if (formData.passwordLength < total) {
          swal(
            "",
            "Password Length cannot be smaller than addition of rest 3 parameters (Special Characters + Numeric + Alphabet) ",
            "error"
          );
        } else {
          swal({
            title: "Are you sure ?", 
            text: "Do you want to edit Password Policy ?",
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
                const message = { message: "Update Password Policy" };
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
                    const action = "Update Password Policy";
                    const Pwd_id = this.obj_pwdComplexity.Pwd_id;
                    const formData = this.passwordComplexityForm.value;
                    const oldData =
                      "Pwd_Length : " +
                      this.obj_pwdComplexity.Pwd_Length +
                      " Pwd_Alphabate : " +
                      this.obj_pwdComplexity.Pwd_Alphabate +
                      " Pwd_Digit : " +
                      this.obj_pwdComplexity.Pwd_Digit +
                      " Pwd_SpecialChr : " +
                      this.obj_pwdComplexity.Pwd_SpecialChr;
                    const newData =
                      "Pwd_Length : " +
                      formData.passwordLength +
                      " Pwd_Alphabate : " +
                      formData.alphabetUppercase +
                      " Pwd_Digit : " +
                      formData.numericLength +
                      " Pwd_SpecialChr : " +
                      formData.specialCharacters;
                    Object.assign(
                      data,
                      formData,
                      { Pwd_id: Pwd_id },
                      { userId: userID },
                      { userName: userName },
                      { remark: remark },
                      { action: action },
                      { oldData: oldData },
                      { newData: newData }
                    );
                    this.http
                      .putMethod("pwdcomplexity/updatePassword", data)
                      .subscribe(
                        (res: any) => {
                          if (
                            res.result.result ==
                            "Password Complexity Updated Successfully"
                          ) {
                            swal(
                              "Password Complexity Updated Successfully",
                              "",
                              "success"
                            );
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
    }
  }

  ngOnInit() {
    // This service will check whether the user has right to view that page or not, If not it will redirect user to Home Page
    this.userService.checkRights("Password Policy");
  }
}
