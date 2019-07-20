import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  FormArray
} from "@angular/forms";
import { DatePipe } from "@angular/common";
import { ErrorHandlingService } from "../../../services/error-handling/error-handling.service";
import { HttpService } from "../../../services/http/http.service";
import { SessionStorageService } from "ngx-webstorage";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ConfigService } from "../../../services/configuration/config.service";
import { RemarkComponent } from "../../../shared/remark/remark/remark.component";
import { ValidationService } from "../../../services/validations/validation.service";
import { DataService } from "../../../services/commonData/data.service";
import { UserService } from "../../../services/user/user.service";
import { SettingService } from '../../../services/setting/setting.service';
declare var swal: any;
@Component({
  selector: "app-edit-vernier",
  templateUrl: "./edit-vernier.component.html",
  styleUrls: ["./edit-vernier.component.css"]
})
export class EditVernierComponent implements OnInit, OnDestroy {
  vernierData: any[];
  sarr_vernierCubData = [];
  bln_loading: boolean;
  sarr_department: Array<String>;
  bln_isCalibration: boolean = false;
  weights: FormArray;
  HideRadioPart: boolean;
  highlight: any;
  highlight1: any;
  day1: any;
  day: any;
  selecteDaysArray = [];
  minDate = new Date();
  difference: number;
  monthDates = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31
  ];
  bln_editmode: boolean = true;
  // Initializing Form Group
  addVernierForm = new FormGroup({
    vernierCode: new FormControl(),
    vernierModelNo: new FormControl(),
    vernierSerialNo: new FormControl(),
    department: new FormControl(),
    unit: new FormControl(),
    leastCount: new FormControl(),
    maxRange: new FormControl(),
    minRange: new FormControl(),
    cal_store_type: new FormControl(),
    calibration_date: new FormControl(),
    duration: new FormControl(),
    set_reminder: new FormControl(),
    weights: new FormArray([])
  });
  isPopupOpened: boolean;
  value: any;
  length: any;
  bln_showWarningitemCode: boolean;
  bln_exist: boolean;
  allVernierData: any;
  str_radioval: string;
  iarr_monthDatesArray = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31
  ];
  iarr_monthDates: Array<any> = [];
  vernierID: any;
  oldVernierSpecific: any;
  interval: any;

  // For Validations we need to get the control of specific FormControl
  get vernierCode() {
    return this.addVernierForm.get("vernierCode");
  }
  get vernierModelNo() {
    return this.addVernierForm.get("vernierModelNo");
  }
  get vernierSerialNo() {
    return this.addVernierForm.get("vernierSerialNo");
  }
  get department() {
    return this.addVernierForm.get("department");
  }
  get unit() {
    return this.addVernierForm.get("unit");
  }
  get leastCount() {
    return this.addVernierForm.get("leastCount");
  }
  get maxRange() {
    return this.addVernierForm.get("maxRange");
  }
  get minRange() {
    return this.addVernierForm.get("minRange");
  }
  get cal_store_type() {
    return this.addVernierForm.get("cal_store_type");
  }
  get calibration_date() {
    return this.addVernierForm.get("calibration_date");
  }
  get duration() {
    return this.addVernierForm.get("duration");
  }
  get set_reminder() {
    return this.addVernierForm.get("set_reminder");
  }

  constructor(
    private fb: FormBuilder,
    private errorHandling?: ErrorHandlingService,
    private http?: HttpService,
    private sessionStorage?: SessionStorageService,
    private dialog?: MatDialog,
    private ConfigService?: ConfigService,
    public datepipe?: DatePipe,
    public snackBar?: MatSnackBar,
    private validation?: ValidationService,
    private dataService?: DataService,
    private userService?: UserService,
    private settingservice ?: SettingService
  ) {
    this.getDepartment();
    this.bln_isCalibration = true;
    this.removeWhenLoad();
    this.iarr_monthDates = this.iarr_monthDatesArray;
  }

  // Below function will return Dynamic Weights
  getWeights() {
    return this.fb.group({
      std_wt: new FormControl("", Validators.required),
      neg_Tol: new FormControl("", Validators.required),
      pos_Tol: new FormControl("", Validators.required),
      periodic: ""
    });
  }

  sarr_temp_wt_array: Array<any> = [];
  DynamicFormArray: Array<any> = [];

  // On Vernier Select
  doSelect(event) {
    const selectedVernier = this.allVernierData.find(
      k => k.VernierID === event
    );
    this.oldVernierSpecific = selectedVernier;
    if (selectedVernier.locked === 1) {
      swal("", "This Vernier is being edited from another terminal", "warning");
      this.addVernierForm.reset();
    } else {
      this.bln_editmode = false;
      if (selectedVernier.CalibStoreType === 1) {
        this.str_radioval = "set_days";
        this.HideRadioPart = false;
        this.iarr_monthDates = this.iarr_monthDatesArray;
      } else {
        this.str_radioval = "set_dates";
        this.HideRadioPart = true;
        var number = selectedVernier.Caldates;
        var b = number.split(",").map(function(item) {
          return parseInt(item, 10);
        });
        this.selecteDaysArray = b;
      }
      this.vernierID = selectedVernier.VernierID;
      this.sarr_temp_wt_array = selectedVernier.WtDetail;

      this.iarr_monthDates = this.iarr_monthDates.filter(
        val => !this.selecteDaysArray.includes(val)
      );

      this.DynamicFormArray = this.sarr_temp_wt_array.map(
        c =>
          new FormGroup({
            std_wt: new FormControl(c.Ver_StdBlock),
            neg_Tol: new FormControl(c.Ver_NegTol),
            pos_Tol: new FormControl(c.Ver_PosTol),
            periodic: new FormControl(c.Ver_blnPeriodic)
          })
      );

      // Mapping values based on Selected Vernier ID
      this.addVernierForm = this.fb.group({
        vernierCode: new FormControl(
          selectedVernier.VernierID,
          Validators.required
        ),
        vernierModelNo: new FormControl(
          selectedVernier.Model,
          Validators.compose([this.validation.requiredField])
        ),
        vernierSerialNo: new FormControl(
          selectedVernier.VernierNo,
          Validators.compose([this.validation.requiredField])
        ),
        department: new FormControl(
          selectedVernier.Ver_Dept,
          Validators.compose([this.validation.requiredField])
        ),
        unit: new FormControl(
          "mm",
          Validators.compose([this.validation.requiredField])
        ),
        leastCount: new FormControl(
          selectedVernier.leastCount,
          Validators.compose([this.validation.requiredField])
        ),
        maxRange: new FormControl(
          selectedVernier.RangeMaxVal,
          Validators.compose([this.validation.requiredField])
        ),
        minRange: new FormControl(
          selectedVernier.RangeMinVal,
          Validators.compose([this.validation.requiredField])
        ),
        cal_store_type: new FormControl(
          this.str_radioval,
          Validators.compose([this.validation.requiredField])
        ),
        calibration_date: [selectedVernier.CalDueDT],
        duration: [selectedVernier.CalDuration],
        set_reminder: [selectedVernier.CalReminder, Validators.required],
        weights: new FormArray(this.DynamicFormArray)
      });
    }
  }

  // If Edit Mode Selected
  editMode() {
    this.bln_editmode = true;
    this.sessionStorage.store("EditMode", true);
    // Lock the selected Vernier ID
    this.dataService
      .setLocked(
        this.sessionStorage.retrieve("userId"),
        "tbl_vernier",
        "VernierNo",
        this.addVernierForm.value.vernierCode,
        "locked",
        "1"
      )
      .then(res => {})
      .catch(err => {
        console.log(err);
      });
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 2000
    });
  }

  // Reset the Form values
  resetForm() {
    this.dataService.setLocked(
      this.sessionStorage.retrieve("userId"),
      "tbl_vernier",
      "VernierNo",
      this.addVernierForm.value.vernierCode,
      "locked",
      "0"
    );
    this.bln_editmode = false;
    this.addVernierForm.reset();
    this.sessionStorage.store("EditMode", false);
    const control = <FormArray>this.addVernierForm.controls["weights"];
    while (control.length !== 0) {
      control.removeAt(0);
    }
  }

  // On Select Add Weights will check conditions if all satisfied then push the weight to weights Array
  addWeights(): void {
    this.weights = this.addVernierForm.get("weights") as FormArray;
    const control = <FormArray>this.addVernierForm.controls["weights"];

    if (control.length === 0) {
      this.weights.push(this.getWeights());
    } else {
      const checkConditions = control.at(control.length - 1);
      if (checkConditions.value.std_wt === "") {
        swal("", "Standard weight cannot be blank!", "warning");
      } else if (
        Number(checkConditions.value.std_wt) >
        Number(this.addVernierForm.controls["maxRange"].value)
      ) {
        swal(
          "",
          "Standard weight cannot be greater than Maximum Operating Range!",
          "warning"
        );
      } else if (
        Number(checkConditions.value.std_wt) <
        Number(this.addVernierForm.controls["minRange"].value)
      ) {
        swal(
          "",
          "Standard weight cannot be less than Minimum Operating Range!",
          "warning"
        );
      } else if (checkConditions.value.neg_Tol === "") {
        swal("", "Negative Tolerance cannot be blank!", "warning");
      } else if (
        Number(checkConditions.value.neg_Tol) >
        Number(checkConditions.value.std_wt)
      ) {
        swal(
          "",
          "Negative tolerance cannot be greater than Standard weight",
          "warning"
        );
      } else if (checkConditions.value.pos_Tol === "") {
        swal("", "Positive Tolerance cannot be blank!", "warning");
      } else if (
        Number(checkConditions.value.pos_Tol) <
        Number(checkConditions.value.std_wt)
      ) {
        swal(
          "",
          "Positive tolerance cannot be less than Standard weight",
          "warning"
        );
      } else if (
        Number(checkConditions.value.pos_Tol) <
        Number(checkConditions.value.neg_Tol)
      ) {
        swal(
          "",
          "Negative tolerance cannot be greater than positive tolerance",
          "warning"
        );
      } else if (
        Number(checkConditions.value.pos_Tol) ==
        Number(checkConditions.value.neg_Tol)
      ) {
        swal(
          "",
          "Negative Tolerance can not be greater than or equal to Positive Tolerance!",
          "warning"
        );
      } else {
        this.weights.push(this.getWeights());
      }
    }
  }

  // On From Submit
  onSubmit() {
    if (this.addVernierForm.value.radio1 === "set_days") {
      if (
        this.addVernierForm.value.duration <
        this.addVernierForm.value.set_reminder
      ) {
        swal("", "Reminder cannot be greater than duration", "warning");
      } else if (this.addVernierForm.value.set_reminder > 7) {
        swal("", "Reminder cannot be greater 7", "warning");
      } else {
        this.proceedToSubmit();
      }
    } else {
      const selectedDaysArray = this.selecteDaysArray.sort((a, b) => a - b); // Ascending sort
      this.difference = selectedDaysArray[1] - selectedDaysArray[0];
      for (let i = 0; i < selectedDaysArray.length - 1; i++) {
        for (let j = i + 1; j < i + 2; j++) {
          if (this.difference > selectedDaysArray[j] - selectedDaysArray[i]) {
            this.difference = selectedDaysArray[j] - selectedDaysArray[i];
          }
        }
      }
      if (this.difference > 7 && this.addVernierForm.value.set_reminder > 7) {
        swal("", "Maximum limit for reminder day is 7", "warning");
      } else if (
        this.addVernierForm.value.set_reminder > this.difference &&
        this.difference <= 7
      ) {
        swal(
          "",
          "Reminder should be less than or equal to minimum difference",
          "warning"
        );
      } else if (this.addVernierForm.value.set_reminder > 7) {
        swal("", "Maximum limit for reminder day is 7", "warning");
      } else {
        this.proceedToSubmit();
      }
    }
  }

  // Checks all conditions if true will upadate the vernier details
  proceedToSubmit() {
    this.weights = this.addVernierForm.get("weights") as FormArray;
    const control = <FormArray>this.addVernierForm.controls["weights"];
    if (control.length == 0) {
      swal("", "Calibration Weights cannot be blank!", "warning");
    } else {
      const checkConditions = control.at(control.length - 1);
      if (checkConditions.value.std_wt === "") {
        swal("", "Standard weight cannot be blank!", "warning");
      } else if (
        Number(checkConditions.value.std_wt) >
        Number(this.addVernierForm.controls["maxRange"].value)
      ) {
        swal(
          "",
          "Standard weight cannot be greater than Maximum Operating Range!",
          "warning"
        );
      } else if (
        Number(checkConditions.value.std_wt) <
        Number(this.addVernierForm.controls["minRange"].value)
      ) {
        swal(
          "",
          "Standard weight cannot be less than Minimum Operating Range!",
          "warning"
        );
      } else if (checkConditions.value.neg_Tol === "") {
        swal("", "Negative Tolerance cannot be blank!", "warning");
      } else if (
        Number(checkConditions.value.neg_Tol) >
        Number(checkConditions.value.std_wt)
      ) {
        swal(
          "",
          "Negative tolerance cannot be greater than Standard weight",
          "warning"
        );
      } else if (checkConditions.value.pos_Tol === "") {
        swal("", "Positive Tolerance cannot be blank!", "warning");
      } else if (
        Number(checkConditions.value.pos_Tol) <
        Number(checkConditions.value.std_wt)
      ) {
        swal(
          "",
          "Positive tolerance cannot be less than Standard weight",
          "warning"
        );
      } else if (
        Number(checkConditions.value.pos_Tol) <
        Number(checkConditions.value.neg_Tol)
      ) {
        swal(
          "",
          "Negative tolerance cannot be greater than positive tolerance",
          "warning"
        );
      } else if (
        Number(checkConditions.value.pos_Tol) ==
        Number(checkConditions.value.neg_Tol)
      ) {
        swal(
          "",
          "Negative Tolerance can not be greater than or equal to Positive Tolerance!",
          "warning"
        );
      } else {
        this.isPopupOpened = true;
        const message = { message: "Edit Vernier" };
        const dialogRef = this.dialog.open(RemarkComponent, {
          data: message,
          width: "570px"
        });
        dialogRef.afterClosed().subscribe(result => {
          this.isPopupOpened = false;
          if (result !== undefined) {
            const data: Object = {};
            const LoggeduserId = this.sessionStorage.retrieve("userid");
            const Loggedusername = this.sessionStorage.retrieve("username");
            const newParameters =
              " ID: " +
              this.addVernierForm.value.vernierCode +
              "  Model: " +
              this.addVernierForm.value.vernierModelNo +
              "  Serial No : " +
              this.addVernierForm.value.vernierSerialNo +
              " Department : " +
              this.addVernierForm.value.department +
              " Unit : " +
              this.addVernierForm.value.unit +
              " Least Count : " +
              this.addVernierForm.value.leastCount +
              " Max Range : " +
              this.addVernierForm.value.maxRange +
              " Min Range : " +
              this.addVernierForm.value.minRange +
              " Calibration Date : " +
              this.datepipe.transform(
                this.addVernierForm.value.calibration_date,
                "yyyy-MM-dd"
              );

            const oldParameters =
              " ID: " +
              this.oldVernierSpecific.VernierID +
              "  Model: " +
              this.oldVernierSpecific.Model +
              "  Serial No : " +
              this.oldVernierSpecific.VernierNo +
              " Department : " +
              this.oldVernierSpecific.Ver_Dept +
              " Unit : " +
              this.oldVernierSpecific.RangeUnit +
              " Least Count : " +
              this.oldVernierSpecific.leastCount +
              " Max Range : " +
              this.oldVernierSpecific.RangeMinVal +
              " Min Range : " +
              this.oldVernierSpecific.RangeMaxVal +
              " Calibration Date : " +
              this.datepipe.transform(
                this.oldVernierSpecific.CalDueDT,
                "yyyy-MM-dd"
              );

            const oldWeights = this.oldVernierSpecific.WtDetail;

            Object.assign(
              data,
              this.addVernierForm.value,
              { LoggeduserId: LoggeduserId },
              { Loggedusername: Loggedusername },
              { remark: result.reason },
              { oldParameters: oldParameters },
              { oldWeights: oldWeights },
              { hdnAction: "Edit" },
              { cal_dates: this.selecteDaysArray },
              { newParameters: newParameters },
              {
                calibration_date: this.datepipe.transform(
                  this.addVernierForm.value.calibration_date,
                  "yyyy-MM-dd"
                )
              }
            );
            this.bln_loading = true;
            this.http.putMethod("vernier/updateVernier", data).subscribe(
              (res: any) => {
                this.bln_loading = false;
                if (res.result === "Vernier Updated Successfully") {
                  swal("Vernier Updated Successfully", "", "success");
                  this.sessionStorage.store("EditMode", false);
                  this.dataService.setLocked(
                    this.sessionStorage.retrieve("userId"),
                    "tbl_vernier",
                    "VernierNo",
                    this.addVernierForm.value.vernierCode,
                    "locked",
                    "0"
                  );
                  this.resetForm();
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
    }
  }

  // On Component Load by default one Row of Dynamic Weight is addded so we remove the first position so it can start again from 0
  removeWhenLoad() {
    const control = <FormArray>this.addVernierForm.controls.weights;
    control.removeAt(0);
  }

  // Removes the selected weight from weights array
  removeWeight(i) {
    const control = <FormArray>this.addVernierForm.controls.weights;
    control.removeAt(i);
  }

  // Toggles between Set Days & Set Dates
  radio(val) {
    if (val === "set_days") {
      this.HideRadioPart = false;
    } else {
      this.HideRadioPart = true;
    }
  }

  // ***********************************************************************************//
  // Below functions hightlight the date which we select in se dates section            //
  // ***********************************************************************************//
  selectDay(day, event: any) {
    this.highlight = day;
    this.day = day;
  }
  selectDay1(day, event: any) {
    this.highlight1 = day;
    this.day1 = day;
  }
  // **********************************************************************************//
  //  Below function pushes the date which we select in to selected dates              //
  // **********************************************************************************//
  push() {
    const index: number = this.monthDates.indexOf(this.day);
    if (index !== -1) {
      this.monthDates.splice(index, 1);
      this.selecteDaysArray.push(this.day);
      this.highlight = "";
    }
  }
  // **********************************************************************************//
  //  Below function pops the date which we select in to selected dates                //
  // **********************************************************************************//
  pop() {
    const index: number = this.selecteDaysArray.indexOf(this.day1);
    if (index !== -1) {
      this.selecteDaysArray.splice(index, 1);
      this.monthDates.push(this.day1);
      this.highlight1 = "";
    }
  }

  // Populating List of Departments
  getDepartment() {
    this.http.getMethod("department/getDepartments").subscribe(
      (res: any) => {
        const items = [];
        for (let i = 0; i < Object.keys(res.result).length; i++) {
          items.push(res.result[i].department_name);
        }
        this.sarr_department = items;
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }
  async getCubiclesData()
  {
    const res = await this.settingservice.getCubicle();
    return res;
  }
  // Below function will return all vernier data
  getVernierData() {
    this.sarr_vernierCubData = [];
      //get cubicle data from API
      this.getCubiclesData().then((res : any)=> {
        const cubicleData= res.filter((x:any) => x.Sys_VernierID != "None");
        cubicleData.forEach(element => {
            this.sarr_vernierCubData.push(element.Sys_VernierID);
        });
       }).catch(err => {
        console.log(err)
      });

    this.http.getMethod("vernier/getVernier").subscribe(
      (res: any) => {
        this.allVernierData = res;
        const items = [];
        for (let i = 0; i < Object.keys(res).length; i++) {
          items.push(res[i].VernierID);
        }
        let data2 = items.filter((x:any) => this.sarr_vernierCubData.indexOf(x) < 0);

        this.vernierData = data2;
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  ngOnInit() {
    // This service will check whether the user has right to view that page or not, If not it will redirect user to Home Page
    this.userService.checkRights("Edit Instruments");
    this.interval = setInterval(() => {
      this.getVernierData();
    }, 1000);
  }

  //This function will call service which will accept only Numbers with Decimal in the Text Field
  onlyNumbersWithDecimal(event) {
    this.validation.onlyNumbersWithDecimal(event);
  }

  //This function will call service which will accept only Numbers in the Text Field
  onlyNumbers(event) {
    this.validation.onlyNumbers(event);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}

// Second component for Edit Mode
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
