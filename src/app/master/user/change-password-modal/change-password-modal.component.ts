import { Component, OnInit, Inject } from "@angular/core";
import
{
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { HttpService } from "../../../services/http/http.service";
import { ErrorHandlingService } from "../../../services/error-handling/error-handling.service";
@Component({
  selector: "app-change-password-modal",
  templateUrl: "./change-password-modal.component.html",
  styleUrls: ["./change-password-modal.component.css"]
})
export class ChangePasswordModalComponent implements OnInit
{
  public loading = false;
  disabled = false;
  hide1: any;
  hide2: any;
  enteredNumcount:any;
  enteredspecialcount:any ;
  enteredAlphcount:any;
  alertMessage:any;
  alertMessageText:any;
  passwordLength:any;
  passwordNumeric:any;
  passwordSpecialChar:any;
  passwordAlphabetCaps:any;
  response: any;
  pattern: any;
  bln_loading:boolean;
  // creating instance of form
  ChangePass = new FormGroup({
    userID: new FormControl(),
    userName: new FormControl(),
    userPassword: new FormControl(),
    userConfirmPassword: new FormControl(),
    remark: new FormControl()
  });

  constructor(
    private http: HttpService,
    private errorHandling?: ErrorHandlingService,
    private _formBuilder?: FormBuilder,
    private dialogRef?: MatDialogRef<ChangePasswordModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
    this.http.getMethod('pwdcomplexity/getPassword').subscribe((res:any)=>{
console.log(res);
      this.response=res.result;
      this.passwordLength=  this.response.Pwd_Length;
      this.passwordNumeric= this.response.Pwd_Digit;
      this.passwordSpecialChar= this.response.Pwd_SpecialChr;
      this.passwordAlphabetCaps= this.response.Pwd_Alphabate;
      this.pattern='^(?=(?:[^A-Z]*[A-Z]){'+this.passwordAlphabetCaps+'})(?=(?:[^!@#$%^&*()]*[!@#$%^&*()]){'+this.passwordAlphabetCaps+'})(?=(?:[^0-9]*[0-9]){'+this.passwordNumeric+'}).{'+this.passwordLength+',}$';
      this.createForm(this.pattern);
    }, err =>
    {
      this.errorHandling.checkError(err.status);
      this.bln_loading=false;
    });
   }

     // Avoid Special Characters
  omit_special_char(event)
  {
    var k;
    k = event.charCode;  //
    return (k != 33 && k != 126 && k != 96 && k != 40 && k != 41 && k != 34 && k != 39 && k != 44 && k != 47 && k != 59 && k != 60
      && k != 61 && k != 62 && k != 91 && k != 93 && k != 123 && k != 125 && k != 124 && k != 92);
  }

   createForm(value){
    this.ChangePass = this._formBuilder.group({
      userID: [this.data.status.userid, [Validators.required]],
      userName: [this.data.status.username, [Validators.required]],
      userPassword: ['', Validators.pattern(value)],
      userConfirmPassword: ['', [Validators.required, matchOtherValidator('userPassword')]],
      remark: ['', [Validators.required]]
    });
   }

  passwordKey(event: any)
  {
    const value = event.target.value;
    this.enteredNumcount = (value.match(/\d/g) || []).length;
    this.enteredspecialcount = (value.match(/[~`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length;
    this.enteredAlphcount = value.length - value.replace(/[A-Z]/g, '').length;
    if (value.length < this.passwordLength)
    {
      this.alertMessage = true;
      this.alertMessageText = 'Password should contain Minimum ' + this.passwordLength + '  Letters.';
    } else if (((this.enteredspecialcount < this.passwordSpecialChar) || (this.enteredspecialcount == 0)) && (this.passwordSpecialChar != 0))
    {
      this.alertMessage = true;
      this.alertMessageText = 'Password should contain Atleast ' + this.passwordSpecialChar + ' Special Characters.';
    } else if (((this.enteredNumcount < this.passwordNumeric) || (this.enteredNumcount == 0)) && (this.passwordNumeric != 0))
    {
      this.alertMessage = true;
      this.alertMessageText = 'Password should contain Atleast ' + this.passwordNumeric + ' Number.';
    }
    else if (((this.enteredAlphcount < this.passwordAlphabetCaps) || (this.enteredAlphcount == 0)) && (this.passwordAlphabetCaps != 0))
    {
      this.alertMessage = true;
      this.alertMessageText = 'Password should contain Atleast ' + this.passwordAlphabetCaps + ' Capital Letter.';
    }
    else
    {
      this.alertMessage = false;
    }
  }

  onNoClick(): void
  {
    this.dialogRef.close();
  }

  ngOnInit() {
      // initializing form with default value like userID and username
      this.ChangePass = this._formBuilder.group({
        userID: [this.data.status.userid, [Validators.required]],
        userName: [this.data.status.username, [Validators.required]],
        userPassword: ['', [Validators.required]],
        userConfirmPassword: ['', [Validators.required, matchOtherValidator('userPassword')]],
        remark: ['', [Validators.required]]
      });
   }
    // controls for the form
  get userID() { return this.ChangePass.get('userID'); }
  get userName() { return this.ChangePass.get('userName'); }
  get userPassword() { return this.ChangePass.get('userPassword'); }
  get userConfirmPassword() { return this.ChangePass.get('userConfirmPassword'); }
  get remark() { return this.ChangePass.get('remark'); }
  onFormSubmit() {
    this.dialogRef.close(this.ChangePass.value);
  }
  reset() {
    this.ChangePass.reset();
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
        throw new Error('matchOtherValidator(): other control is not found in parent group');
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
