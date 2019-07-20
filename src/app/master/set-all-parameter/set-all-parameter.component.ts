import { Component, OnInit } from "@angular/core";
import { HttpService } from "../../services/http/http.service";
import { UserService } from "../../services/user/user.service";
import { RemarkComponent } from "../../../app/shared/remark/remark/remark.component";
import { MatDialog } from "@angular/material";
import { SessionStorageService } from "ngx-webstorage";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { ErrorHandlingService } from "../../services/error-handling/error-handling.service";
import { ValidationService } from "../../services/validations/validation.service";
import { JsonDataService } from "../../services/commonData/json-data.service";

declare var swal: any;

@Component({
  selector: "app-set-all-parameter",
  templateUrl: "./set-all-parameter.component.html",
  styleUrls: ["./set-all-parameter.component.css"]
})
export class SetAllParameterComponent implements OnInit {
  obj_setAllParameter;
  sarr_setAllParameter;
  bln_loading;
  bln_isPopupOpened;
  bln_isLdap:any;
  // Declaring our Formgroup
  setAllParametersForm = new FormGroup({
    tbl_config_TimeoutPeriod: new FormControl(),
    tbl_config_PasswordExpPeriod: new FormControl(),
    tbl_config_ReminderPassword: new FormControl(),
    tbl_config_ArchivePeriod: new FormControl(),
    tbl_config_AutoDisablePeriod: new FormControl(),
    tbl_config_LoginAttempts: new FormControl(),
    tbl_config_AutoEnableChances: new FormControl(),
    tbl_config_DisabledTime: new FormControl(),
    tbl_config_PwdHistoryCount: new FormControl(),
    tbl_config_calibrationReminder: new FormControl(),
    tbl_PeriodicCalbVer: new FormControl(),
    tbl_config_PeriodicCalibDays: new FormControl()
  });

  constructor(
    private http: HttpService,
    private userService: UserService,
    private fb: FormBuilder,
    private errorHandling: ErrorHandlingService,
    private dialog?: MatDialog,
    private sessionStorage?: SessionStorageService,
    private validation?: ValidationService,
    private jsonService?: JsonDataService
  ) {
    this.jsonService.getValueFromJSON().then((res: any) =>
    {
       this.bln_isLdap = res.Ldap[0].Value;
    }).catch(err =>
    {
    });
    this.bln_loading = true;
    // Below function will return all the defined parameters from the Database
    this.http.getMethod("parameter/getAllParameters").subscribe(
      (res: any) => {
        this.bln_loading = false;
        this.obj_setAllParameter = res;
        console.log(this.obj_setAllParameter);
        this.sarr_setAllParameter = this.obj_setAllParameter.result[0];
        // Below function will map values to our Formgroup
        this.initializeFormData(this.sarr_setAllParameter);
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  get tbl_config_TimeoutPeriod() {
    return this.setAllParametersForm.get("tbl_config_TimeoutPeriod");
  }
  get tbl_config_AutoEnableChances() {
    return this.setAllParametersForm.get("tbl_config_AutoEnableChances");
  }
  get tbl_config_AutoDisablePeriod() {
    return this.setAllParametersForm.get("tbl_config_AutoDisablePeriod");
  }
  get tbl_config_LoginAttempts() {
    return this.setAllParametersForm.get("tbl_config_LoginAttempts");
  }
  get tbl_config_PasswordExpPeriod() {
    return this.setAllParametersForm.get("tbl_config_PasswordExpPeriod");
  }
  get tbl_config_DisabledTime() {
    return this.setAllParametersForm.get("tbl_config_DisabledTime");
  }
  get tbl_config_ReminderPassword() {
    return this.setAllParametersForm.get("tbl_config_ReminderPassword");
  }
  get tbl_config_ArchivePeriod() {
    return this.setAllParametersForm.get("tbl_config_ArchivePeriod");
  }
  get tbl_config_PwdHistoryCount() {
    return this.setAllParametersForm.get("tbl_config_PwdHistoryCount");
  }
  get tbl_PeriodicCalbVer() {
    return this.setAllParametersForm.get("tbl_PeriodicCalbVer");
  }
  get tbl_config_PeriodicCalibDays() {
    return this.setAllParametersForm.get("tbl_config_PeriodicCalibDays");
  }
  get tbl_config_calibrationReminder() {
    return this.setAllParametersForm.get("tbl_config_calibrationReminder");
  }

// Here we group all the form controls & apply validations
  initializeFormData(data) {
    this.setAllParametersForm = this.fb.group({
      tbl_config_TimeoutPeriod: new FormControl(
        data.tbl_config_TimeoutPeriod,
        Validators.compose([
          this.validation.requiredField,
          Validators.max(5),
          Validators.min(1)
        ])
      ),

      tbl_config_PasswordExpPeriod: new FormControl(
        data.tbl_config_PasswordExpPeriod,
        Validators.compose([
          this.validation.requiredField,
          Validators.max(90),
          Validators.min(1)
        ])
      ),
      tbl_config_ReminderPassword: new FormControl(
        data.tbl_config_ReminderPassword,
        Validators.compose([
          this.validation.requiredField,
          Validators.max(7),
          Validators.min(1)
        ])
      ),
      tbl_config_ArchivePeriod: new FormControl(data.tbl_config_ArchivePeriod,
        Validators.compose([
          this.validation.requiredField,
          Validators.max(365),
          Validators.min(1)
        ])
      ),
      tbl_config_AutoDisablePeriod: new FormControl(
        data.tbl_config_AutoDisablePeriod,
        Validators.compose([
          this.validation.requiredField,
        ])
      ),
      tbl_config_LoginAttempts: new FormControl(data.tbl_config_LoginAttempts,
        Validators.compose([
          this.validation.requiredField,
          Validators.max(5),
          Validators.min(1)
        ])
      ),
      tbl_config_AutoEnableChances: new FormControl(
        data.tbl_config_AutoEnableChances,
        Validators.compose([
          this.validation.requiredField,
          Validators.max(2),
          Validators.min(1)
        ])
      ),
      tbl_config_DisabledTime: new FormControl(data.tbl_config_DisabledTime,
        Validators.compose([
          this.validation.requiredField,
          Validators.max(90),
          Validators.min(1)
        ])
      ),
      tbl_config_PwdHistoryCount: new FormControl(
        data.tbl_config_PwdHistoryCount,
        Validators.compose([
          this.validation.requiredField,
          Validators.max(5),
          Validators.min(1)
        ])
      ),
      tbl_PeriodicCalbVer: new FormControl(data.tbl_PeriodicCalbVer,
        Validators.compose([
          this.validation.requiredField,
          Validators.max(5),
          Validators.min(1)
        ])
      ),
      tbl_config_PeriodicCalibDays: new FormControl(
        data.tbl_config_PeriodicCalibDays,
        Validators.compose([
          this.validation.requiredField,
          Validators.max(5),
          Validators.min(1)
        ])
      ),
      tbl_config_calibrationReminder: new FormControl(
        data.tbl_calibration_Reminder,
        Validators.compose([
          this.validation.requiredField
        ])
      ),
    });
  }

  //This function will call service which will accept only Numbers in the Text Field
  checkValidation(event) {
    this.validation.onlyNumbers(event);
  }

  // This function will check whether a change is made in parameters & upadte details if a change in parameters is detected
  onSubmit() {
    const formData = this.setAllParametersForm.value;
    if (
      this.sarr_setAllParameter.tbl_config_TimeoutPeriod ==
        formData.tbl_config_TimeoutPeriod &&
      this.sarr_setAllParameter.tbl_config_AutoEnableChances ==
        formData.tbl_config_AutoEnableChances &&
      this.sarr_setAllParameter.tbl_config_AutoDisablePeriod ==
        formData.tbl_config_AutoDisablePeriod &&
      this.sarr_setAllParameter.tbl_config_LoginAttempts ==
        formData.tbl_config_LoginAttempts &&
      this.sarr_setAllParameter.tbl_config_PasswordExpPeriod ==
        formData.tbl_config_PasswordExpPeriod &&
      this.sarr_setAllParameter.tbl_config_DisabledTime ==
        formData.tbl_config_DisabledTime &&
      this.sarr_setAllParameter.tbl_config_ReminderPassword ==
        formData.tbl_config_ReminderPassword &&
      this.sarr_setAllParameter.tbl_config_ArchivePeriod ==
        formData.tbl_config_ArchivePeriod &&
      this.sarr_setAllParameter.tbl_config_PwdHistoryCount ==
        formData.tbl_config_PwdHistoryCount &&
      this.sarr_setAllParameter.tbl_PeriodicCalbVer ==
        formData.tbl_PeriodicCalbVer &&
      this.sarr_setAllParameter.tbl_config_PeriodicCalibDays ==
        formData.tbl_config_PeriodicCalibDays &&
        this.sarr_setAllParameter.tbl_calibration_Reminder ==
          formData.tbl_config_calibrationReminder
    ) {
      swal("No Change in parameters", "", "error");
    } else {
      swal({
        title: "Are you sure ?", 
        text: "Do you want to edit this !",
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
            const message = { message: "Update Set All Parameters" };
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
                const action = "Update Set All Parameters";
                const configId = 1;
                const formData = this.setAllParametersForm.value;
                Object.assign(
                  data,
                  formData,
                  { configId: configId },
                  { userId: userID },
                  { userName: userName },
                  { remark: remark },
                  { action: action }
                );
                // Below API will update the parameters
                this.http
                  .putMethod("parameter/updateParameters", data)
                  .subscribe(
                    (res: any) => {
                      if (res.result == "Parameters updated successfully") {
                        swal("Parameters updated successfully", "", "success");
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
  ngOnInit() {
     // This service will check whether the user has right to view that page or not, If not it will redirect user to Home Page
    this.userService.checkRights("Set All Parameters");
  }
}
