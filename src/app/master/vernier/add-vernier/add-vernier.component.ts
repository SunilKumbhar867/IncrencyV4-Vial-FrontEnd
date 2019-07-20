import { Component, OnInit } from "@angular/core";
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
import { MatDialog } from "@angular/material";
import { ConfigService } from "../../../services/configuration/config.service";
import { RemarkComponent } from "../../../shared/remark/remark/remark.component";
import { ValidationService } from "../../../services/validations/validation.service";
import { UserService } from "../../../services/user/user.service";
declare var swal: any;
@Component({
  selector: "app-add-vernier",
  templateUrl: "./add-vernier.component.html",
  styleUrls: ["./add-vernier.component.css"]
})
export class AddVernierComponent implements OnInit {
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
  // creating instance of formgroup
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
    weights: this.fb.array([this.getWeights()])
  });
  isPopupOpened: boolean;
  value: any;
  length: any;
  bln_showWarningVernierCode: boolean;
  bln_exist: boolean;
  vernierData = [];
  vernierSerialNoData = [];
  bln_showWarningVernierSrNo: boolean;
  bln_exist_srNo: boolean;

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
    private validation?: ValidationService,
    private userService?: UserService,
  ) {
    // Grouping our individual FormControls using Form Builder
    this.addVernierForm = this.fb.group({
      vernierCode: new FormControl(
        "",
        Validators.compose([this.validation.requiredField])
      ),
      vernierModelNo: new FormControl(
        "",
        Validators.compose([this.validation.requiredField])
      ),
      vernierSerialNo: new FormControl(
        "",
        Validators.compose([this.validation.requiredField])
      ),
      department: new FormControl(
        "NA",
        Validators.compose([this.validation.requiredField])
      ),
      unit: new FormControl(
        "mm",
        Validators.compose([this.validation.requiredField])
      ),
      leastCount: new FormControl(
        "",
        Validators.compose([this.validation.requiredField])
      ),
      maxRange: new FormControl(
        "",
        Validators.compose([this.validation.requiredField])
      ),
      minRange: new FormControl(
        "",
        Validators.compose([this.validation.requiredField])
      ),
      cal_store_type: ["set_days"],
      calibration_date: [new Date()],
      duration: [""],
      set_reminder: ["", Validators.compose([this.validation.requiredField])],
      weights: this.fb.array([this.getWeights()])
    });
    this.getDepartment();
    this.removeWhenLoad();
  }

  //This function will call service which will accept only Numbers with Decimal in the Text Field
  onlyNumbersWithDecimal(event) {
    this.validation.onlyNumbersWithDecimal(event);
  }

  //This function will call service which will accept only Numbers in the Text Field
  onlyNumbers(event) {
    this.validation.onlyNumbers(event);
  }

  // Returns Fields for Dynamic Weights
  getWeights() {
    return this.fb.group({
      stdBlock: new FormControl("", Validators.required),
      negTol: new FormControl("", Validators.required),
      posTol: new FormControl("", Validators.required),
      periodic: ""
    });
  }

  // Add weights to our Weights Array
  addWeights(): void {
    this.weights = this.addVernierForm.get("weights") as FormArray;
    const weightsData = this.weights.value;
    //  console.log(weightsData);
    const arr_stdWeights = [];
    for (let i = 0; i < Object.keys(weightsData).length; i++) {
      arr_stdWeights.push(weightsData[i].stdBlock);
    }
    // console.log(arr_stdWeights);

    const control = <FormArray>this.addVernierForm.controls["weights"];
    if (control.length === 0) {
      this.weights.push(this.getWeights());
    } else {
      // If below conditions are satisfied the weights is pushed into Weights Array
      const checkConditions = control.at(control.length - 1);
      if (checkConditions.value.stdBlock === "") {
        swal("", "Standard weight cannot be blank!", "warning");
      } else if (
        Number(checkConditions.value.stdBlock) >
        Number(this.addVernierForm.value.maxRange)
      ) {
        swal(
          "",
          "Standard weight cannot be greater than Maximum Operating Range!",
          "warning"
        );
      } else if (
        Number(checkConditions.value.stdBlock) <
        Number(this.addVernierForm.controls["minRange"].value)
      ) {
        swal(
          "",
          "Standard weight cannot be less than Minimum Operating Range!",
          "warning"
        );
      } else if (checkConditions.value.negTol === "") {
        swal("", "Negative Tolerance cannot be blank!", "warning");
      } else if (
        Number(checkConditions.value.negTol) >
        Number(checkConditions.value.stdBlock)
      ) {
        swal(
          "",
          "Negative tolerance cannot be greater than Standard weight",
          "warning"
        );
      } else if (checkConditions.value.posTol === "") {
        swal("", "Positive Tolerance cannot be blank!", "warning");
      } else if (
        Number(checkConditions.value.posTol) <
        Number(checkConditions.value.stdBlock)
      ) {
        swal(
          "",
          "Positive tolerance cannot be less than Standard weight",
          "warning"
        );
      } else if (
        Number(checkConditions.value.posTol) <
        Number(checkConditions.value.negTol)
      ) {
        swal(
          "",
          "Negative tolerance cannot be greater than positive tolerance",
          "warning"
        );
      } else if (
        Number(checkConditions.value.posTol) ==
        Number(checkConditions.value.negTol)
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

  // Checks conditions before proceeding with saving data to database
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
        //
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

  // Saves Data into Database
  proceedToSubmit() {
    this.weights = this.addVernierForm.get("weights") as FormArray;
    const control = <FormArray>this.addVernierForm.controls["weights"];
    if (control.length == 0) {
      swal("", "Calibration Weights cannot be blank!", "warning");
    } else {
      const checkConditions = control.at(control.length - 1);
      if (checkConditions.value.stdBlock === "") {
        swal("", "Standard weight cannot be blank!", "warning");
      } else if (
        Number(checkConditions.value.stdBlock) >
        Number(this.addVernierForm.controls["maxRange"].value)
      ) {
        swal(
          "",
          "Standard weight cannot be greater than Maximum Operating Range!",
          "warning"
        );
      } else if (
        Number(checkConditions.value.stdBlock) <
        Number(this.addVernierForm.controls["minRange"].value)
      ) {
        swal(
          "",
          "Standard weight cannot be less than Minimum Operating Range!",
          "warning"
        );
      } else if (checkConditions.value.negTol === "") {
        swal("", "Negative Tolerance cannot be blank!", "warning");
      } else if (
        Number(checkConditions.value.negTol) >
        Number(checkConditions.value.stdBlock)
      ) {
        swal(
          "",
          "Negative tolerance cannot be greater than Standard weight",
          "warning"
        );
      } else if (checkConditions.value.posTol === "") {
        swal("", "Positive Tolerance cannot be blank!", "warning");
      } else if (
        Number(checkConditions.value.posTol) <
        Number(checkConditions.value.stdBlock)
      ) {
        swal(
          "",
          "Positive tolerance cannot be less than Standard weight",
          "warning"
        );
      } else if (
        Number(checkConditions.value.posTol) <
        Number(checkConditions.value.negTol)
      ) {
        swal(
          "",
          "Negative tolerance cannot be greater than positive tolerance",
          "warning"
        );
      } else if (
        Number(checkConditions.value.posTol) ==
        Number(checkConditions.value.negTol)
      ) {
        swal(
          "",
          "Negative Tolerance can not be greater than or equal to Positive Tolerance!",
          "warning"
        );
      } else {
        this.isPopupOpened = true;
        const message = { message: "Add Vernier" };
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
            // Assigning values to or Object
            Object.assign(
              data,
              this.addVernierForm.value,
              { LoggeduserId: LoggeduserId },
              { Loggedusername: Loggedusername },
              { remark: result.reason },
              { hdnAction: "Add" },
              { cal_dates: this.selecteDaysArray },
              { newParameters: newParameters },
              {
                calibration_date: this.datepipe.transform(
                  this.addVernierForm.value.calibration_date,
                  "yyyy-MM-dd"
                )
              }
            );
            console.log(JSON.stringify(data));
            this.bln_loading = true;
            this.http.postMethod("vernier/storeVernier", data).subscribe(
              (res: any) => {
                this.bln_loading = false;
                if (res.result === "Vernier Already Exist") {
                  swal("Vernier Already Exists", "", "error");
                } else if (res.result === "Vernier Added Successfully") {
                  this.reset();
                  swal("Vernier Added Successfully", "", "success");
                  this.addVernierForm.patchValue({
                    unit: "mm",
                  });
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

  // Below function checks if Vernier ID is already present or not
  onKeyUpCheckID(event: any) {
    this.value = event.target.value;
    this.value = this.value.toLowerCase();
    this.length = this.vernierData.filter(x => x === this.value);
    if (this.length.length > 0) {
      this.bln_showWarningVernierCode = true;
      this.bln_exist = true;
    } else {
      this.bln_showWarningVernierCode = false;
      this.bln_exist = false;
    }
  }

  // Below function checks if Serial No is already present or not
  onKeyUpCheckSrNo(event: any) {
    const value = event.target.value.toLowerCase();
    const length = this.vernierSerialNoData.filter(x => x === value);
    if (length.length > 0) {
      this.bln_showWarningVernierSrNo = true;
      this.bln_exist_srNo = true;
    } else {
      this.bln_showWarningVernierSrNo = false;
      this.bln_exist_srNo = false;
    }
  }

  reset() {
    this.addVernierForm.reset();
    // Clear the FormArray
    const control = <FormArray>this.addVernierForm.controls["weights"];
    while (control.length !== 0) {
      control.removeAt(0);
    }
  }

  ngOnInit() {
    // This service will check whether the user has right to view that page or not, If not it will redirect user to Home Page
    this.userService.checkRights("Add Instruments");
    // Below function will return all Vernier Data
    this.http.getMethod("vernier/getVernier").subscribe(
      (res: any) => {
        const items = [];
        const srNo = [];
        for (let i = 0; i < Object.keys(res).length; i++) {
          items.push(res[i].VernierID);
          srNo.push(res[i].VernierNo);
        }
        this.vernierData = items
          .toLocaleString()
          .toLowerCase()
          .split(",");
        this.vernierSerialNoData = srNo
          .toLocaleString()
          .toLowerCase()
          .split(",");
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }
}
