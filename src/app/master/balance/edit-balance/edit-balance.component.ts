import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl
} from "@angular/forms";
import { MatDialog, MatSnackBar } from "@angular/material";
import { HttpService } from "../../../services/http/http.service";
import { DatePipe } from "@angular/common";
import { ErrorHandlingService } from "../../../services/error-handling/error-handling.service";
import { SessionStorageService } from "ngx-webstorage";
import { RemarkComponent } from "../../../shared/remark/remark/remark.component";
import { ConfigService } from "../../../services/configuration/config.service";
import { ValidationService } from "../../../services/validations/validation.service";
import { DataService } from "../../../services/commonData/data.service";
import { UserService } from "../../../services/user/user.service";
import { SettingService } from '../../../services/setting/setting.service';
declare var swal: any;
@Component({
  selector: "app-edit-balance",
  templateUrl: "./edit-balance.component.html",
  styleUrls: ["./edit-balance.component.css"]
})
export class EditBalanceComponent implements OnInit {
  public bln_loading = false;
  weights: FormArray;
  EditCounter: any;
  edit_interval: any;
  DynamicFormArray: Array<any> = [];
  sarr_balanceCubData = [];
  difference: number;
  department: any[];
  sarr_temp_wt_array: Array<any> = [];
  todayDate = new Date();
  DynamicWeight: any;
  int_BalDp:any;
  highlight1: any;
  day1: any;
  day: any;
  str_radioval: any;
  count = 0;
  totalSum = 0;
  set_calibDate: Date;
  HideRadioPart = false;
  isCalibration = true;
  isPopupOpened = true;
  bln_editmode = true;
  highlight: any;
  unitData = [];
  minDate = new Date();
  // listing months array
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
  selecteDaysArray = [];
  DailyArray = [];
  BalanceCalibrationWeightControl: any;
  // Initialization of Balance form //
  addBalance = new FormGroup({
    balID: new FormControl(),
    modelNo: new FormControl(),
    make: new FormControl(),
    serialNo: new FormControl(),
    selectedUnit: new FormControl(),
    department: new FormControl(),
    leastCount: new FormControl(),
    maxCapacity: new FormControl(),
    minCapacity: new FormControl(),
    minOperatingRange: new FormControl(),
    maxOperatingRange: new FormControl(),
    calibration_date: new FormControl(),
    duration: new FormControl(),
    cal_store_type: new FormControl(),
    set_reminder: new FormControl(),
    weights: new FormArray([]),
  });
  balanceData: any;
  data1 = [];
  Id: any;
  daily: any;
  oldBalanceSpecific: any;

  constructor(
    private fb: FormBuilder,
    private dialog?: MatDialog,
    private http?: HttpService,
    public datepipe?: DatePipe,
    private ConfigService?: ConfigService,
    private errorHandling?: ErrorHandlingService,
    private sessionStorage?: SessionStorageService,
    public snackBar?: MatSnackBar,
    private validation?: ValidationService,
    private dataService?: DataService,
    private userService?: UserService,
    private settingservice ?: SettingService
  ) {
    this.fetchData();
    this.edit_interval = setInterval(() => {
      this.fetchData();
    }, 1000);
    // Initialization of Select dates //
    this.iarr_monthDates = this.iarr_monthDatesArray;
    // Get All Units related to Balance from Developer Panel
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
  async getCubiclesData()
  {
    const res = await this.settingservice.getCubicle();
    return res;
  }
  // Below function will return all balance details
  fetchData() {
    this.sarr_balanceCubData = [];
    //get cubicle data from API
    this.getCubiclesData().then((res : any)=> {
      const cubicleData= res.filter((x:any) => x.Sys_BalID != "None");
      cubicleData.forEach(element => {
          this.sarr_balanceCubData.push(element.Sys_BalID);
      });
     }).catch(err => {
      console.log(err)
    });

    this.http.getMethod("balance/getBalanceDetails").subscribe(
      (data: any) => {
        this.bln_loading = false;
        const items = [];
        this.data1 = data.result;
        for (let i = 0; i < Object.keys(this.data1).length; i++) {
          items.push(this.data1[i].Bal_ID);
        }
        let data2 = items.filter((x:any) => this.sarr_balanceCubData.indexOf(x) < 0);
        this.balanceData = data2;
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  // Below function will return all dapartment details
  getDepartments() {
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

  ngOnInit() {
    // This service will check whether the user has right to view that page or not, If not it will redirect user to Home Page
    this.userService.checkRights("Edit Instruments");
    // Fetching Calibration Weight Control From Devdeloppe Panel
    this.ConfigService.getJsonFileData().subscribe((res: any) => {
      this.BalanceCalibrationWeightControl =
        res.BalanceCalibrationWeightControl;
    });
    this.DynamicWeight = this.addBalance.controls.weights;
    // Fetching  department for the first time //
    this.getDepartments();
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
  get duration() {
    return this.addBalance.get("duration");
  }
  get set_reminder() {
    return this.addBalance.get("set_reminder");
  }

  // ****************************************************************************//
  // doSelect function - this function activated when balance selected. filtered only selected
  // balance from list of balances
  // ****************************************************************************//
  public doSelect = (value: any) => {
    const temp = this.data1.find(k => k.Bal_ID === value);
    this.int_BalDp = temp.Bal_DP;
    this.oldBalanceSpecific = temp;
    this.selecteDaysArray = [];

    if (temp.locked === 1) {
      swal("", "This balance is being edited from another terminal", "warning");
      this.addBalance.reset();
    } else {
      this.bln_editmode = false;
      if (temp.Bal_CalbStoreType.data[0] === 1) {
        this.str_radioval = "set_days";
        this.HideRadioPart = false;
        this.iarr_monthDates = this.iarr_monthDatesArray;
      } else {
        this.str_radioval = "set_dates";
        this.HideRadioPart = true;
        var number = temp.Bal_CalbDates;
        var b = number.split(",").map(function(item) {
          return parseInt(item, 10);
        });
        this.selecteDaysArray = b;
      }

      this.iarr_monthDates = this.iarr_monthDates.filter(
        val => !this.selecteDaysArray.includes(val)
      );
      // *****************************************************************************************//
      this.sarr_temp_wt_array = temp.WtDetail;
      // *****************************************************************************************//
      //   Below code - Creation of Dynamic weight array that is already assigned  to the particular //
      //   selected code                                                                           //
      // *****************************************************************************************//
      this.DynamicFormArray = this.sarr_temp_wt_array.map(
        c =>
          new FormGroup({
            std_wt: new FormControl(parseFloat(c.Bal_StdWt).toFixed( this.int_BalDp )),
            neg_Tol: new FormControl(parseFloat(c.Bal_NegTol).toFixed( this.int_BalDp )),
            pos_Tol: new FormControl(parseFloat(c.Bal_PosTol).toFixed( this.int_BalDp )),
            daily: new FormControl(c.Bal_Daily),
            linerity: new FormControl(c.Bal_Linearity),
            eccentricity: new FormControl(c.Bal_IsEccentricity),
            repetability: new FormControl(c.Bal_IsRepetability),
            periodic: new FormControl(c.Bal_Periodic),
            uncertinity: new FormControl(c.Bal_IsUncertinity)
          })
      );

      // Initialize form on the based of selected balance //
      this.addBalance = this.fb.group({
        balID: new FormControl(
          temp.Bal_ID,
          Validators.compose([this.validation.requiredField])
        ),
        modelNo: new FormControl(
          temp.Bal_Model,
          Validators.compose([this.validation.requiredField])
        ),
        make: new FormControl(
          temp.Bal_Make,
          Validators.compose([this.validation.requiredField])
        ),
        serialNo: new FormControl(
          temp.Bal_SrNo,
          Validators.compose([this.validation.requiredField])
        ),
        selectedUnit: new FormControl(
          temp.Bal_Unit,
          Validators.compose([this.validation.requiredField])
        ),
        department: new FormControl(
          temp.Bal_Dept,
          Validators.compose([this.validation.requiredField])
        ),
        leastCount: new FormControl(
          temp.Bal_LeastCnt,
          Validators.compose([this.validation.requiredField])
        ),
        maxCapacity: new FormControl(
          temp.Bal_MaxCap,
          Validators.compose([this.validation.requiredField])
        ),
        minCapacity: new FormControl(
          temp.Bal_MinCap,
          Validators.compose([this.validation.requiredField])
        ),
        minOperatingRange: new FormControl(
          temp.Bal_MinoptRange,
          Validators.compose([this.validation.requiredField])
        ),
        maxOperatingRange: new FormControl(
          temp.Bal_MaxoptRange,
          Validators.compose([this.validation.requiredField])
        ),
        duration: new FormControl(
          temp.Bal_CalbDuration,
          Validators.compose([this.validation.requiredField,this.validation.validateZeroEntry])
        ),

        calibration_date: new FormControl(
          temp.Bal_CalbDueDt,
          Validators.compose([this.validation.requiredField])
        ),
        //calibration_date: new FormControl(temp.Bal_CalbDueDt),
        //calibration_date: new FormControl(this.set_calibDate),

        //duration: new FormControl(temp.Bal_CalbDuration),
        cal_store_type: new FormControl(this.str_radioval),
        set_reminder: new FormControl(
          temp.Bal_CalbReminder,
          Validators.compose([this.validation.requiredField,this.validation.validateZeroEntry])
        ),
        // Assigned that created dynamic weight array to the weights //
        weights: new FormArray(this.DynamicFormArray)
      });
    }
    this.checkDisabling();
  };
  // *****************************************************************************************//
  //   onFormSubmit() - Final Submission function that takes all the field values           //
  // *****************************************************************************************//
  public onFormSubmit() {

    let formName = this.addBalance.value;

    let cntChkCalibWt = this.oldBalanceSpecific.WtDetail.length;

    let dayCalibDetSame = 0;
    let datesCalibDetSame = 0;

    let cntChgCalibWtRow = 0;

    if
    (
      (this.addBalance.value.cal_store_type == "set_days" && this.oldBalanceSpecific.Bal_CalbStoreType.data[0] == 1) &&
      (this.oldBalanceSpecific.Bal_CalbDuration == this.addBalance.value.duration)
    )
    {
      dayCalibDetSame = 1;
    }

    if(this.addBalance.value.cal_store_type == "set_dates")
    {
      dayCalibDetSame = 0;

      var balCalibDates = this.oldBalanceSpecific.Bal_CalbDates;
      var splittedCalibDates = balCalibDates.split(",");

      if(splittedCalibDates.length == this.selecteDaysArray.length)
      {
        for (let i = 0; i <= this.oldBalanceSpecific.Bal_CalbDates.length - 1; i++)
        {
          if
          (
            splittedCalibDates[i] == this.selecteDaysArray[i]
          )
          {
            datesCalibDetSame;
          }
          else
          {
            datesCalibDetSame++;
          }
        }
      }
      else
      {
        datesCalibDetSame = 0;
      }
    }

    if(formName.weights.length == this.oldBalanceSpecific.WtDetail.length)
    {
      for (let i = 0; i <= cntChkCalibWt - 1; i++) {

        if
        (
          formName.weights[i].std_wt == this.oldBalanceSpecific.WtDetail[i].Bal_StdWt &&
          formName.weights[i].neg_Tol == this.oldBalanceSpecific.WtDetail[i].Bal_NegTol &&
          formName.weights[i].pos_Tol == this.oldBalanceSpecific.WtDetail[i].Bal_PosTol &&
          (
            formName.weights[i].daily == this.oldBalanceSpecific.WtDetail[i].Bal_Daily ||
            formName.weights[i].daily == undefined && this.oldBalanceSpecific.WtDetail[i].Bal_Daily == 0
          ) &&
          (
            formName.weights[i].periodic == this.oldBalanceSpecific.WtDetail[i].Bal_Periodic ||
            formName.weights[i].periodic == undefined && this.oldBalanceSpecific.WtDetail[i].Bal_Periodic == 0
          )
        )
        {
          cntChgCalibWtRow;
        }
        else
        {
          cntChgCalibWtRow++;
        }
      }
    }
    else
    {
      cntChgCalibWtRow++;
    }

    if (
      formName.modelNo.trim() == this.oldBalanceSpecific.Bal_Model.trim() &&
      formName.make.trim() == this.oldBalanceSpecific.Bal_Make.trim() &&
      formName.serialNo.trim() == this.oldBalanceSpecific.Bal_SrNo.trim() &&
      formName.selectedUnit.trim() == this.oldBalanceSpecific.Bal_Unit.trim() &&
      formName.leastCount == this.oldBalanceSpecific.Bal_LeastCnt &&
      formName.minCapacity == this.oldBalanceSpecific.Bal_MinCap &&
      formName.maxCapacity == this.oldBalanceSpecific.Bal_MaxCap &&
      formName.minOperatingRange == this.oldBalanceSpecific.Bal_MinoptRange &&
      formName.maxOperatingRange == this.oldBalanceSpecific.Bal_MaxoptRange &&
      formName.calibration_date == this.oldBalanceSpecific.Bal_CalbDueDt &&
      formName.set_reminder == this.oldBalanceSpecific.Bal_CalbReminder &&
      formName.weights.length == this.oldBalanceSpecific.WtDetail.length &&
      cntChgCalibWtRow == 0 &&
      ((dayCalibDetSame == 1 && this.addBalance.value.cal_store_type == "set_days") ||
      (datesCalibDetSame == 0 && this.addBalance.value.cal_store_type == "set_dates"))
    ) {
      swal({
        title: "No Change!",
        text: "",
        type: "error",
        allowOutsideClick: false
      });
    }
    else
    {
      // First check if cali_store_type is set_days or set dates
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
  }

  //This function will call service which will accept only Numbers with Decimal in the Text Field
  onlyNumbersWithDecimal(event) {
    this.validation.onlyNumbersWithDecimal(event);
  }

  //This function will call service which will accept only Numbers in the Text Field
  onlyNumbers(event) {
    this.validation.onlyNumbers(event);
  }

  // *****************************************************************************************//
  //   proceedToSubmit() - Takes All value that is edited by user and update them in database//
  // *****************************************************************************************//
  proceedToSubmit() {
    if (this.daily !== this.BalanceCalibrationWeightControl[0].Value) {
      swal(
        ``,
        `Please Select Maximum ${
          this.BalanceCalibrationWeightControl[0].Value
        } Weight for Daily Calibration`,
        `info`
      );
    } else {
      this.weights = this.addBalance.get("weights") as FormArray;

      const control = <FormArray>this.addBalance.controls["weights"];
      if (control.length == 0) {
        swal("", "Calibration Weights cannot be blank!", "warning");
      } else {
        this.isPopupOpened = true;
        const message = { message: "Edit Balance" };
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

              const oldParameters =
              " ID: " +
              this.oldBalanceSpecific.Bal_ID +","+
              "  Model: " +
              this.oldBalanceSpecific.Bal_Model +","+
              "  Serial No : " +
              this.oldBalanceSpecific.Bal_SrNo +","+
              " Unit : " +
              this.oldBalanceSpecific.Bal_Unit +","+
              " Least Count : " +
              this.oldBalanceSpecific.Bal_LeastCnt +","+
              " Max Range : " +
              this.oldBalanceSpecific.Bal_MaxoptRange +","+
              " Min Range : " +
              this.oldBalanceSpecific.Bal_MinoptRange +","+
              " Max Capacity : " +
              this.oldBalanceSpecific.Bal_MaxCap +","+
              " Min Capacity : " +
              this.oldBalanceSpecific.Bal_MinCap +","+
              " Calibration Date : " +
              this.datepipe.transform(
                this.oldBalanceSpecific.Bal_CalbDueDt,
                "yyyy-MM-dd"
              );

              const oldWeights = this.oldBalanceSpecific.WtDetail;

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
              hdnAction: "Edit",
              LoggeduserId: LoggeduserId,
              Loggedusername: Loggedusername,
              newParameter:newParameters,
              oldParameter:oldParameters,
              oldWeights:oldWeights,
              bal_dp: this.int_BalDp
            });
            //console.log(JSON.stringify(data))
           this.bln_loading = true;
            this.http.putMethod("balance/updateBalance", data).subscribe(
              (res: any) => {
                this.bln_loading = false;
                if (res.result === "Balance Updated Successfully") {
                  clearInterval(this.EditCounter);
                  swal("Balance Updated Successfully", "", "success");
                  this.dataService.setLocked(
                    this.sessionStorage.retrieve("userId"),
                    "tbl_balance",
                    "Bal_ID",
                    this.addBalance.value.balID,
                    "locked",
                    "0"
                  );
                  const control = <FormArray>(
                    this.addBalance.controls["weights"]
                  );
                  while (control.length !== 0) {
                    control.removeAt(0);
                  }
                } else {
                  swal("Something went wrong", "", "error");
                }
                this.addBalance.reset();
                this.fetchData();

                this.sessionStorage.store("EditMode", false);
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

  // *****************************************************************************************//
  //   resetForm() - Reset the user form as well as remove editMode
  // *****************************************************************************************//
  resetForm() {
    this.dataService.setLocked(
      this.sessionStorage.retrieve("userId"),
      "tbl_balance",
      "Bal_ID",
      this.addBalance.value.balID,
      "locked",
      "0"
    );
    if (this.addBalance.value.balID !== null) {
      // HERE RELEASE API WILL RELEASE THE BALANCE
      clearInterval(this.EditCounter);
    }
    this.addBalance.reset();
    this.sessionStorage.store("EditMode", false);
    const control = <FormArray>this.addBalance.controls["weights"];
    while (control.length !== 0) {
      control.removeAt(0);
    }
  }
  // *****************************************************************************************//
  //   radio() - disable the specific part whether is is set_days or set_dates based on user
  // selection
  // *****************************************************************************************//
  radio(val) {

    if (val === "set_days") {
      this.HideRadioPart = false;
    } else {
      this.HideRadioPart = true;
    }
  }
  // Below functions hightlight the date which we select in se dates section
  selectDay(day, event: any) {
    this.highlight = day;
    this.day = day;
  }
  selectDay1(day, event: any) {
    this.highlight1 = day;
    this.day1 = day;
  }
  // *****************************************************************************************//
  //   push() - Push element from monthdates to selected dates and vice-versa
  // *****************************************************************************************//
  push() {
    const index: number = this.iarr_monthDates.indexOf(this.day);
    if (index !== -1) {
      this.iarr_monthDates.splice(index, 1);
      this.selecteDaysArray.push(this.day);
      this.highlight = "";
    }
  }
  // *****************************************************************************************//
  //   pop() - Pop element from monthdates to selected dates and vice-versa
  // *****************************************************************************************//
  pop() {
    const index: number = this.selecteDaysArray.indexOf(this.day1);
    if (index !== -1) {
      this.selecteDaysArray.splice(index, 1);
      this.iarr_monthDates.push(this.day1);
      this.highlight1 = "";
    }
  }
  // *****************************************************************************************//
  //   addWeights() - This function adds Dynamic weights
  // *****************************************************************************************//
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
          this.checkDisabling();
        }
      }
      this.DailyArray = [];
      for (let i = 0; i < control.length; i++) {
        this.DailyArray.push(i);
      }
    }
  }
  // *****************************************************************************************//
  //   getweights() - This function Initialize dynamic weights every time component loaded
  // *****************************************************************************************//
  public getweights() {
    return this.fb.group({
      std_wt: ["", Validators.required],
      neg_Tol: ["", [Validators.required]],
      pos_Tol: ["", [Validators.required]],
      daily: [{ value: false, disabled: false }],
      linerity: [{ value: false, disabled: false }],
      eccentricity: [{ value: false, disabled: false }],
      repetability: [{ value: false, disabled: false }],
      periodic: [{ value: false, disabled: false }],
      uncertinity: [{ value: false, disabled: false }]
    });
  }
  // *****************************************************************************************//
  //   removeWeight() - This function Removes weight from dynamic weights array
  // *****************************************************************************************//
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

  // Below Function will Disable Calibration Weigths to be Added
  checkDisabling() {
    const control = <FormArray>this.addBalance.controls["weights"];

    // for Daily
    this.daily = control.controls.filter(ctl => ctl.value.daily == true).length;

    control.controls.forEach(ctl => {
      ctl["controls"].daily.value != true &&
      this.daily == this.BalanceCalibrationWeightControl[0].Value
        ? ctl["controls"].daily.disable()
        : ctl["controls"].daily.enable();
    });
    // for Periodic
    const periodic = control.controls.filter(ctl => ctl.value.periodic == true)
      .length;

    control.controls.forEach(ctl => {
      ctl["controls"].periodic.value != true &&
      periodic == this.BalanceCalibrationWeightControl[1].Value
        ? ctl["controls"].periodic.disable()
        : ctl["controls"].periodic.enable();
    });
    // For Linerity
    const linerity = control.controls.filter(ctl => ctl.value.linerity == true)
      .length;

    control.controls.forEach(ctl => {
      ctl["controls"].linerity.value != true &&
      linerity == this.BalanceCalibrationWeightControl[2].Value
        ? ctl["controls"].linerity.disable()
        : ctl["controls"].linerity.enable();
    });
    // For Eccentricity
    const eccentricity = control.controls.filter(
      ctl => ctl.value.eccentricity == true
    ).length;

    control.controls.forEach(ctl => {
      ctl["controls"].eccentricity.value != true &&
      eccentricity == this.BalanceCalibrationWeightControl[3].Value
        ? ctl["controls"].eccentricity.disable()
        : ctl["controls"].eccentricity.enable();
    });
    // For Uncertainty
    const uncertinity = control.controls.filter(
      ctl => ctl.value.uncertinity == true
    ).length;

    control.controls.forEach(ctl => {
      ctl["controls"].uncertinity.value != true &&
      uncertinity == this.BalanceCalibrationWeightControl[4].Value
        ? ctl["controls"].uncertinity.disable()
        : ctl["controls"].uncertinity.enable();
    });
    // For repetability

    const repetability = control.controls.filter(
      ctl => ctl.value.repetability == true
    ).length;

    control.controls.forEach(ctl => {
      ctl["controls"].repetability.value != true &&
      repetability == this.BalanceCalibrationWeightControl[5].Value
        ? ctl["controls"].repetability.disable()
        : ctl["controls"].repetability.enable();
    });
  }

  editMode() {
    // THIS WILL LOCK THE BALANCE
    this.dataService
      .setLocked(
        this.sessionStorage.retrieve("userId"),
        "tbl_balance",
        "Bal_ID",
        this.addBalance.value.balID,
        "locked",
        "1"
      )
      .then(res => {})
      .catch(err => {
        console.log(err);
      });
    this.EditCounter = setInterval(() => {
      this.addBalance.value.balID;
    }, 5000);
    this.bln_editmode = true;
    this.sessionStorage.store("EditMode", true);
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 2000
    });
  }
  // *****************************************************************************************//
  //   ngOnDestroy() - This function is final function that called when component leaves DOM
  // *****************************************************************************************//
  ngOnDestroy() {
    clearInterval(this.edit_interval);
    clearInterval(this.EditCounter);
  }
}
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
