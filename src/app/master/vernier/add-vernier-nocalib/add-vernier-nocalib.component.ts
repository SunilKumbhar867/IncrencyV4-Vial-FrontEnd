import { Component, OnInit } from "@angular/core";
import
{
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
  selector: 'app-add-vernier-nocalib',
  templateUrl: './add-vernier-nocalib.component.html',
  styleUrls: ['./add-vernier-nocalib.component.css']
})
export class AddVernierNocalibComponent implements OnInit
{
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
    unit: new FormControl(),
    leastCount: new FormControl(),
    maxRange: new FormControl(),
    minRange: new FormControl(),
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
  get vernierCode()
  {
    return this.addVernierForm.get("vernierCode");
  }
  get vernierModelNo()
  {
    return this.addVernierForm.get("vernierModelNo");
  }
  get vernierSerialNo()
  {
    return this.addVernierForm.get("vernierSerialNo");
  }
  get unit()
  {
    return this.addVernierForm.get("unit");
  }
  get leastCount()
  {
    return this.addVernierForm.get("leastCount");
  }
  get maxRange()
  {
    return this.addVernierForm.get("maxRange");
  }
  get minRange()
  {
    return this.addVernierForm.get("minRange");
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
  )
  {
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
    });
  }

  //This function will call service which will accept only Numbers with Decimal in the Text Field
  onlyNumbersWithDecimal(event)
  {
    this.validation.onlyNumbersWithDecimal(event);
  }

  //This function will call service which will accept only Numbers in the Text Field
  onlyNumbers(event)
  {
    this.validation.onlyNumbers(event);
  }


  // Saves Data into Database
  proceedToSubmit()
  {
    this.isPopupOpened = true;
    const message = { message: "Add Vernier" };
    const dialogRef = this.dialog.open(RemarkComponent, {
      data: message,
      width: "570px"
    });
    dialogRef.afterClosed().subscribe(result =>
    {
      this.isPopupOpened = false;
      if (result !== undefined)
      {
        const data: Object = {};
        const LoggeduserId = this.sessionStorage.retrieve("userid");
        const Loggedusername = this.sessionStorage.retrieve("username");
        const newParameters =
          "Vernier Code No : " +
          this.addVernierForm.value.vernierCode +
          "  Model : " +
          this.addVernierForm.value.vernierModelNo +
          "  Serial No : " +
          this.addVernierForm.value.vernierSerialNo +
          " Unit : " +
          this.addVernierForm.value.unit +
          " Least Count : " +
          this.addVernierForm.value.leastCount +
          " Min Range : " +
          this.addVernierForm.value.minRange +
          " Max Range : " +
          this.addVernierForm.value.maxRange ;
        // Assigning values to or Object
        Object.assign(
          data,
          this.addVernierForm.value,
          { LoggeduserId: LoggeduserId },
          { Loggedusername: Loggedusername },
          { remark: result.reason },
          { hdnAction: "Add" },
          { newParameters: newParameters },
          { oldParameters: 'NA' },
        );

        this.bln_loading = true;
        this.http.postMethod("vernier/WithoutWeight", data).subscribe(
          (res: any) =>
          {
            console.log(res);
            this.bln_loading = false;
            if (res.result === "Vernier Already Exist")
            {
              swal("Vernier Already Exists", "", "error");
            } else if (res.result === "Vernier Added Successfully")
            {
              this.reset();
              swal("Vernier Added Successfully", "", "success");
              this.addVernierForm.patchValue({
                unit: "mm",
              });
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

  // Below function checks if Vernier ID is already present or not
  onKeyUpCheckID(event: any)
  {
    this.value = event.target.value;
    this.value = this.value.toLowerCase();
    this.length = this.vernierData.filter(x => x === this.value);
    if (this.length.length > 0)
    {
      this.bln_showWarningVernierCode = true;
      this.bln_exist = true;
    } else
    {
      this.bln_showWarningVernierCode = false;
      this.bln_exist = false;
    }
  }

  // Below function checks if Serial No is already present or not
  onKeyUpCheckSrNo(event: any)
  {
    const value = event.target.value.toLowerCase();
    const length = this.vernierSerialNoData.filter(x => x === value);
    if (length.length > 0)
    {
      this.bln_showWarningVernierSrNo = true;
      this.bln_exist_srNo = true;
    } else
    {
      this.bln_showWarningVernierSrNo = false;
      this.bln_exist_srNo = false;
    }
  }

  reset()
  {
    this.addVernierForm.reset();
  }

  ngOnInit()
  {
    // This service will check whether the user has right to view that page or not, If not it will redirect user to Home Page
    this.userService.checkRights("Add Instruments");
    // Below function will return all Vernier Data
    this.http.getMethod("vernier/getVernier").subscribe(
      (res: any) =>
      {
        const items = [];
        const srNo = [];
        for (let i = 0; i < Object.keys(res).length; i++)
        {
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
      err =>
      {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }
}

