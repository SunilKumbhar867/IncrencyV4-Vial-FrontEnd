import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { HttpService } from "../../../services/http/http.service";
import { DatePipe } from "@angular/common";
import { ErrorHandlingService } from "../../../services/error-handling/error-handling.service";
import { SessionStorageService } from "ngx-webstorage";
import { RemarkComponent } from "../../../shared/remark/remark/remark.component";
import { ConfigService } from "../../../services/configuration/config.service";
import { ValidationService } from "../../../services/validations/validation.service";
import { UserService } from "../../../services/user/user.service";
declare var swal: any;
@Component({
  selector: "app-add-balance",
  templateUrl: "./add-balance.component.html",
  styleUrls: ["./add-balance.component.css"]
})
export class AddBalanceComponent implements OnInit {
  public bln_loading = false;
  difference: number;
  department: any[];
  DynamicWeight: any;
  highlight1: any;
  day1: any;
  day: any;
  count = 0;
  // creating instance of formgroup
  public addBalance: FormGroup;
  totalSum = 0;
  HideRadioPart = false;
  isCalibration = true;
  isPopupOpened = true;
  highlight: any;
  unitData = [];
  dailyChecked: any;
  minDate = new Date();
  // listing months array
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
  selecteDaysArray = [];
  DailyArray = [];
  value: any;
  bln_showWarningitemCode: boolean;
  bln_exist: boolean;
  balanceData = [];
  length: any[];
  daily: any;
  periodic: any;
  BalanceCalibrationWeightControl: any;
  constructor(
    private fb: FormBuilder,
    private dialog?: MatDialog,
    private http?: HttpService,
    public datepipe?: DatePipe,
    private errorHandling?: ErrorHandlingService,
    private sessionStorage?: SessionStorageService,
    private ConfigService?: ConfigService,
    private validation?: ValidationService,
    private userService?: UserService
  ) {
    this.bln_loading = true;
    // Below API will return list of all balance ID's
    this.http.getMethod("balance/getBalanceDetails").subscribe(
      (data: any) => {
        this.bln_loading = false;
        const items = [];
        for (let i = 0; i < Object.keys(data.result).length; i++) {
          items.push(data.result[i].Bal_ID);
        }
        this.balanceData = items;
        this.balanceData = this.balanceData
          .toLocaleString()
          .toLowerCase()
          .split(",");
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
    this.getUnitData("B");
  }

  // Below function will return array of Unit from Developer Panel
  getUnitData(b) {
    this.ConfigService.getJsonFileData().subscribe(
      (res: any) => {
        const items = res.Unit.filter(x => x.menu == b);
        const Data = [];
        for (let i = 0; i < Object.keys(items).length; i++) {
          if (items[i].Value == 1) {
            Data.push(items[i].Name);
          }
        }
        this.unitData = Data;
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  // For Validations we need to get the control of specific FormControl
  get balID() {
    return this.addBalance.get("balID");
  }
  get modelNo() {
    return this.addBalance.get("modelNo");
  }
  get make() {
    return this.addBalance.get("make");
  }
  get serialNo() {
    return this.addBalance.get("serialNo");
  }
  get selectedUnit() {
    return this.addBalance.get("selectedUnit");
  }
  get leastCount() {
    return this.addBalance.get("leastCount");
  }
  get maxCapacity() {
    return this.addBalance.get("maxCapacity");
  }
  get minCapacity() {
    return this.addBalance.get("minCapacity");
  }
  get minOperatingRange() {
    return this.addBalance.get("minOperatingRange");
  }
  get maxOperatingRange() {
    return this.addBalance.get("maxOperatingRange");
  }
  get set_reminder() {
    return this.addBalance.get("set_reminder");
  }
  get std_wt() {
    return this.addBalance.get("std_wt");
  }
  get neg_Tol() {
    return this.addBalance.get("neg_Tol");
  }
  get pos_Tol() {
    return this.addBalance.get("pos_Tol");
  }
  get weights(): FormArray {
    return this.addBalance.get("weights") as FormArray;
  }

  // Below Function will Disable Calibration Weigths to be Added
  checkDisabling() {
    // for Daily
    this.daily = this.weights.controls.filter(
      ctl => ctl.value.daily == true
    ).length;
    this.weights.controls.forEach(ctl => {
      ctl["controls"].daily.value != true &&
      this.daily == this.BalanceCalibrationWeightControl[0].Value
        ? ctl["controls"].daily.disable()
        : ctl["controls"].daily.enable();
    });
    // for Periodic
    const periodic = this.weights.controls.filter(
      ctl => ctl.value.periodic == true
    ).length;

    this.periodic = this.weights.controls.filter(
      ctl => ctl.value.periodic == true
    ).length;

    this.weights.controls.forEach(ctl => {
      ctl["controls"].periodic.value != true &&
      periodic == this.BalanceCalibrationWeightControl[1].Value
        ? ctl["controls"].periodic.disable()
        : ctl["controls"].periodic.enable();
    });

    this.weights.controls.forEach(ctl => {
      ctl["controls"].periodic.value != true &&
      this.periodic == this.BalanceCalibrationWeightControl[1].Value
        ? ctl["controls"].periodic.disable()
        : ctl["controls"].periodic.enable();
    });
    // For Linerity
    const linerity = this.weights.controls.filter(
      ctl => ctl.value.linerity == true
    ).length;
    this.weights.controls.forEach(ctl => {
      ctl["controls"].linerity.value != true &&
      linerity == this.BalanceCalibrationWeightControl[2].Value
        ? ctl["controls"].linerity.disable()
        : ctl["controls"].linerity.enable();
    });
    // For Eccentricity
    const eccentricity = this.weights.controls.filter(
      ctl => ctl.value.eccentricity == true
    ).length;
    this.weights.controls.forEach(ctl => {
      ctl["controls"].eccentricity.value != true &&
      eccentricity == this.BalanceCalibrationWeightControl[3].Value
        ? ctl["controls"].eccentricity.disable()
        : ctl["controls"].eccentricity.enable();
    });
    // For Uncertainty
    const uncertainty = this.weights.controls.filter(
      ctl => ctl.value.uncertainty == true
    ).length;
    this.weights.controls.forEach(ctl => {
      ctl["controls"].uncertainty.value != true &&
      uncertainty == this.BalanceCalibrationWeightControl[4].Value
        ? ctl["controls"].uncertainty.disable()
        : ctl["controls"].uncertainty.enable();
    });
    // For repetability
    const repetability = this.weights.controls.filter(
      ctl => ctl.value.repetability == true
    ).length;
    this.weights.controls.forEach(ctl => {
      ctl["controls"].repetability.value != true &&
      repetability == this.BalanceCalibrationWeightControl[5].Value
        ? ctl["controls"].repetability.disable()
        : ctl["controls"].repetability.enable();
    });
  }

  ngOnInit() {
    //  private userService?: UserService,
    // This service will check whether the user has right to view that page or not, If not it will redirect user to Home Page
    this.userService.checkRights("Add Instruments");
    // Fetching Calibration Weight Control From Devdeloppe Panel
    this.ConfigService.getJsonFileData().subscribe((res: any) => {
      this.BalanceCalibrationWeightControl =
        res.BalanceCalibrationWeightControl;
    });
    // Initializinig the Form Group
    this.addBalance = this.fb.group({
      balID: ["", Validators.compose([this.validation.requiredField])],
      modelNo: ["", Validators.compose([this.validation.requiredField])],
      make: ["", Validators.compose([this.validation.requiredField])],
      serialNo: ["", Validators.compose([this.validation.requiredField])],
      department: ["NA", Validators.compose([this.validation.requiredField])],
      selectedUnit: ["", Validators.compose([this.validation.requiredField])],
      leastCount: ["", Validators.compose([this.validation.requiredField])],
      maxCapacity: ["", Validators.compose([this.validation.requiredField])],
      minCapacity: ["", Validators.compose([this.validation.requiredField])],
      minOperatingRange: [
        "",
        Validators.compose([this.validation.requiredField])
      ],
      maxOperatingRange: [
        "",
        Validators.compose([this.validation.requiredField])
      ],
      calibration_date: [new Date()],
      duration: [""],
      cal_store_type: ["set_days"],
      set_reminder: ["", Validators.compose([this.validation.requiredField])],
      weights: this.fb.array([
        // it created dynamic form array for calibration
        this.getweights()
      ])
    });
    // setting control to DynamicWeights of calibration weights
    this.DynamicWeight = this.addBalance.controls.weights;
    // bydefault there is one row so clear that row on first load
    this.removeWhenLoad();
    this.getDepartments();
  }
  // ****************************************************************************//
  // get weight create the dynamic form array for calibration                   //
  // ***************************************************************************//
  public getweights() {
    return this.fb.group({
      std_wt: ["", Validators.required],
      neg_Tol: ["", Validators.required],
      pos_Tol: ["", Validators.required],
      daily: [{ value: false, disabled: false }],
      linerity: [{ value: false, disabled: false }],
      eccentricity: [{ value: false, disabled: false }],
      repetability: [{ value: false, disabled: false }],
      periodic: [{ value: false, disabled: false }],
      uncertainty: [{ value: false, disabled: false }]
    });
  }
  // **********************************************************************************//
  //                 Below function fetching the available departments                //
  // **********************************************************************************//
  public getDepartments() {
    this.bln_loading = true;
    this.http.getMethod("department/getDepartments").subscribe(
      (res: any) => {
        this.bln_loading = false;
        const items = [];
        for (let i = 0; i < Object.keys(res.result).length; i++) {
          items.push(res.result[i].department_name);
        }
        this.department = items;
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }
  // *********************************************************************************//
  // Below function checks the conditions of calibration (greater or lesser)          //
  // **********************************************************************************//
  public addWeights() {
    if (this.addBalance.controls["leastCount"].value === "") {
      swal("", "Please Enter Least Count !", "warning");
    } else if (this.addBalance.controls["maxCapacity"].value === "") {
      swal("", "Please Enter Maximum Capacity !", "warning");
    } else if (this.addBalance.controls["minCapacity"].value === "") {
      swal("", "Please Enter Minimum Capacity !", "warning");
    } else if (
      Number(this.addBalance.controls["maxCapacity"].value) <=
      Number(this.addBalance.controls["minCapacity"].value)
    ) {
      swal(
        "",
        "Maximum Capacity can not be less than or equal to Minimum Capacity !",
        "error"
      );
    } else if (this.addBalance.controls["minOperatingRange"].value === "") {
      swal("", "Please Enter Minimum Operating Range !", "warning");
    } else if (this.addBalance.controls["maxOperatingRange"].value === "") {
      swal("", "Please Enter Maximum Operating Range !", "warning");
    } else if (
      Number(this.addBalance.controls["minOperatingRange"].value) <
      Number(this.addBalance.controls["minCapacity"].value)
    ) {
      swal(
        "",
        "Minimum Operating Range Cannot Be Less Than Minimum Capacity",
        "error"
      );
    } else if (
      Number(this.addBalance.controls["maxOperatingRange"].value) >
      Number(this.addBalance.controls["maxCapacity"].value)
    ) {
      swal(
        "",
        "Maximum Operating Range Cannot Be Greater Than Maximum Capacity",
        "error"
      );
    } else if (
      Number(this.addBalance.controls["minOperatingRange"].value) >
      Number(this.addBalance.controls["maxOperatingRange"].value)
    ) {
      swal(
        "",
        "Maximum Operating Range Cannot Be Less Than OR Equal To Minimum Operating Range",
        "error"
      );
    } else {
      const control = <FormArray>this.addBalance.controls["weights"];
      if (control.length === 0) {
        control.push(this.getweights());
      } else {
        const checkConditions = control.at(control.length - 1);
        if (checkConditions.value.std_wt === "") {
          swal("", "Standard weight cannot be blank!", "warning");
        } else if (
          Number(checkConditions.value.std_wt) >
          Number(this.addBalance.controls["maxOperatingRange"].value)
        ) {
          swal(
            "",
            "Standard weight cannot be greater than Maximum Operating Range!",
            "warning"
          );
        } else if (
          Number(checkConditions.value.std_wt) <
          Number(this.addBalance.controls["minOperatingRange"].value)
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
        } else {
          control.push(this.getweights());
        }
      }
      this.DailyArray = [];
      // If All the above conditions true then push that new row of weights in formArray
      for (let i = 0; i < control.length; i++) {
        this.DailyArray.push(i);
      }
      this.checkDisabling();
    }
  }
  // ********************************************************************************************* //
  // Below function remove the weights from the formArray on delete button                       //
  // ********************************************************************************************* //
  public removeWeight(i: number) {
    const control = <FormArray>this.addBalance.controls["weights"];
    control.removeAt(i);
    this.DailyArray = [];
    // tslint:disable-next-line:no-shadowed-variable
    for (let i = 0; i < control.length; i++) {
      this.DailyArray.push(i);
    }
    this.checkDisabling();
  }
  // ***************************************************************************************//
  //                 Below function removes the first blank weight when page loads          //
  // ************************************************************************************* //
  public removeWhenLoad() {
    const control = <FormArray>this.addBalance.controls["weights"];
    control.removeAt(0);
  }
  // ************************************************************************************** //
  // Below function handles the condition for whether it is set days or set dayes          //
  // *************************************************************************************//
  public onFormSubmit() {
    if (this.addBalance.value.radio1 === "set_days") {
      if (this.addBalance.value.duration < this.addBalance.value.set_reminder) {
        swal("", "Reminder cannot be greater than duration", "warning");
      } else if (this.addBalance.value.set_reminder > 7) {
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
      if (this.difference > 7 && this.addBalance.value.set_reminder > 7) {
        swal("", "Maximum limit for reminder day is 7", "warning");
      } else if (
        this.addBalance.value.set_reminder > this.difference &&
        this.difference <= 7
      ) {
        swal(
          "",
          "Reminder should be less than or equal to minimum difference",
          "warning"
        );
      } else if (this.addBalance.value.set_reminder > 7) {
        swal("", "Maximum limit for reminder day is 7", "warning");
      } else {
        this.proceedToSubmit();
      }
    }
  }
  // ******************************************************************************************* //
  // Below function takes all the parameter that visible in the DOM and saves it in database    //
  // *******************************************************************************************//
  proceedToSubmit() {

    if (this.daily !== this.BalanceCalibrationWeightControl[0].Value) {
      swal(
        ``,
        `Please Select Maximum ${
          this.BalanceCalibrationWeightControl[0].Value
        } Weight for Daily Calibration`,
        `info`
      );
    }
    if (this.periodic !== this.BalanceCalibrationWeightControl[1].Value) {
      swal(
        ``,
        `Please Select Maximum ${
          this.BalanceCalibrationWeightControl[1].Value
        } Weight for Periodic Calibration`,
        `info`
      );
    }else {
      this.isPopupOpened = true;

      let int_dp = this.validation.getDPValue(this.addBalance.value.leastCount);

      const message = { message: "Add Balance" };
      const dialogRef = this.dialog.open(RemarkComponent, {
        data: message,
        width: "570px"
      });
      dialogRef.afterClosed().subscribe(result => {
        this.isPopupOpened = false;
        const data: Object = {};
        if (result !== undefined) {
          const newParameters =
              " ID: " +
              this.addBalance.value.balID +","+
              "  Model: " +
              this.addBalance.value.modelNo +","+
              "  Serial No : " +
              this.addBalance.value.serialNo +","+
              " Unit : " +
              this.addBalance.value.selectedUnit +","+
              " Least Count : " +
              this.addBalance.value.leastCount +","+
              " Max Range : " +
              this.addBalance.value.maxOperatingRange +","+
              " Min Range : " +
              this.addBalance.value.minOperatingRange +","+
              " Max Capacity : " +
              this.addBalance.value.maxCapacity +","+
              " Min Capacity : " +
              this.addBalance.value.minCapacity +","+
              " Calibration Date : " +
              this.datepipe.transform(
                this.addBalance.value.calibration_date,
                "yyyy-MM-dd"
              );

          const LoggeduserId = this.sessionStorage.retrieve("userid");
          const Loggedusername = this.sessionStorage.retrieve("username");
          Object.assign(data, {
            balID: this.addBalance.value.balID,
            cal_store_type: this.addBalance.value.cal_store_type,
            calibration_date: this.datepipe.transform(
              this.addBalance.value.calibration_date,
              "yyyy-MM-dd"
            ),
            department: this.addBalance.value.department,
            duration: this.addBalance.value.duration,
            leastCount: this.addBalance.value.leastCount,
            make: this.addBalance.value.make,
            maxCapacity: this.addBalance.value.maxCapacity,
            maxOperatingRange: this.addBalance.value.maxOperatingRange,
            minCapacity: this.addBalance.value.minCapacity,
            minOperatingRange: this.addBalance.value.minOperatingRange,
            modelNo: this.addBalance.value.modelNo,
            selectedUnit: this.addBalance.value.selectedUnit,
            serialNo: this.addBalance.value.serialNo,
            set_reminder: this.addBalance.value.set_reminder,
            cal_dates: this.selecteDaysArray,
            weights: this.addBalance.value.weights,
            remark: result.reason,
            hdnAction: "Add",
            LoggeduserId: LoggeduserId,
            Loggedusername: Loggedusername,
            newParameter:newParameters,
            bal_dp:int_dp
          });
          console.log(JSON.stringify(data));
          this.bln_loading = true;
          this.http.postMethod("balance/addBalance", data).subscribe(
            (res: any) => {
              this.bln_loading = false;
              if (res.result === "Balance Id already exist") {
                swal("Balance Already Exists", "", "error");
              } else if (res.result === "Balance Added Successfully") {
                swal("Balance Added Successfully", "", "success");
                this.addBalance.reset();
                // this will clear our Form Array
                const control = <FormArray>this.addBalance.controls["weights"];
                while (control.length !== 0) {
                  control.removeAt(0);
                }
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

  //This function will call service which will accept only Numbers with Decimal in the Text Field
  onlyNumbersWithDecimal(event) {
    this.validation.onlyNumbersWithDecimal(event);
  }

  //This function will call service which will accept only Numbers in the Text Field
  onlyNumbers(event) {
    this.validation.onlyNumbers(event);
  }

  // Below Function will disable the from id Balance ID Already Exists
  onKeyUp(event: any) {
    this.value = event.target.value;
    this.value = this.value.toLowerCase();
    this.length = this.balanceData.filter(x => x === this.value);
    if (this.length.length > 0) {
      this.bln_showWarningitemCode = true;
      this.bln_exist = true;
    } else {
      this.bln_showWarningitemCode = false;
      this.bln_exist = false;
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
  // **********************************************************************************//
  radio(val) {
    if (val === "set_days") {
      this.HideRadioPart = false;
    } else {
      this.HideRadioPart = true;
    }
  }
  reset() {
    this.addBalance.reset();
    // Clear the FormArray
    const control = <FormArray>this.addBalance.controls["weights"];
    while (control.length !== 0) {
      control.removeAt(0);
    }
  }
  // *************************************************************************************//
  ngOnDestroy() {}
}
