import { Component, OnInit, OnDestroy } from "@angular/core";
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
import { MatDialog, MatSnackBar } from "@angular/material";
import { ConfigService } from "../../../services/configuration/config.service";
import { RemarkComponent } from "../../../shared/remark/remark/remark.component";
import { ValidationService } from "../../../services/validations/validation.service";
import { DataService } from "../../../services/commonData/data.service";
import { UserService } from "../../../services/user/user.service";
import { SettingService } from '../../../services/setting/setting.service';
declare var swal: any;
@Component({
  selector: 'app-edit-vernier-nocalib',
  templateUrl: './edit-vernier-nocalib.component.html',
  styleUrls: ['./edit-vernier-nocalib.component.css']
})
export class EditVernierNocalibComponent implements OnInit, OnDestroy
{
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

  bln_editmode: boolean = true;
  // Initializing Form Group
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
  bln_showWarningitemCode: boolean;
  bln_exist: boolean;
  allVernierData: any;
  str_radioval: string;

  iarr_monthDates: Array<any> = [];
  vernierID: any;
  oldVernierSpecific: any;
  interval: any;

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
    public snackBar?: MatSnackBar,
    private validation?: ValidationService,
    private dataService?: DataService,
    private userService?: UserService,
    private settingservice ?: SettingService
  )
  {
    this.bln_isCalibration = true;
  }



  // On Vernier Select
  doSelect(event)
  {
    const selectedVernier = this.allVernierData.find(
      k => k.VernierID === event
    );
    this.oldVernierSpecific = selectedVernier;
    if (selectedVernier.locked === 1)
    {
      swal("", "This Vernier is being edited from another terminal", "warning");
      this.addVernierForm.reset();
    } else
    {
      this.bln_editmode = false;

      this.vernierID = selectedVernier.VernierID;

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
      });
    }
  }

  // If Edit Mode Selected
  editMode()
  {
    if (
      this.addVernierForm.get("vernierCode").value === "" ||
      this.addVernierForm.get("vernierCode").value === null
    ) {
      swal("Please Select Vernier Code No", "", "warning");
    }
    else
    {
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
        .then(res => { })
        .catch(err =>
        {
          console.log(err);
        });
      this.snackBar.openFromComponent(SnackBarComponentNoCalib, {
        duration: 2000
      });
    }
  }

  // Reset the Form values
  resetForm()
  {
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
  }


  // Checks all conditions if true will upadate the vernier details
  proceedToSubmit()
  {
    if(
      this.oldVernierSpecific.Model.trim() == this.addVernierForm.value.vernierModelNo.trim() &&
      this.oldVernierSpecific.VernierNo.trim() == this.addVernierForm.value.vernierSerialNo.trim() &&
      this.oldVernierSpecific.leastCount == this.addVernierForm.value.leastCount &&
      this.oldVernierSpecific.RangeMinVal == this.addVernierForm.value.minRange &&
      this.oldVernierSpecific.RangeMaxVal == this.addVernierForm.value.maxRange
    )
    {
      swal({
        title: "No Change!",
        text: "",
        type: "error",
        allowOutsideClick: false
      });
    }
    else
    {
      this.isPopupOpened = true;
      const message = { message: "Edit Vernier" };
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
            " Department : " +
            this.addVernierForm.value.department +
            " Unit : " +
            this.addVernierForm.value.unit +
            " Least Count : " +
            this.addVernierForm.value.leastCount +
            " Min Range : " +
            this.addVernierForm.value.minRange +
            " Max Range : " +
            this.addVernierForm.value.maxRange ;

          const oldParameters =
            "Vernier Code No: " +
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
            " Min Range : " +
            this.oldVernierSpecific.RangeMinVal +
            " Max Range : " +
            this.oldVernierSpecific.RangeMaxVal;

          Object.assign(
            data,
            this.addVernierForm.value,
            { LoggeduserId: LoggeduserId },
            { Loggedusername: Loggedusername },
            { remark: result.reason },
            { oldParameters: oldParameters },
            { hdnAction: "Edit" },
            { newParameters: newParameters },
          );
          this.bln_loading = true;
          console.log(JSON.stringify(data));
          this.http.putMethod("vernier/updateWithoutWeight", data).subscribe(
            (res: any) =>
            {
              this.bln_loading = false;
              if (res.result === "Vernier Updated Successfully")
              {
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
  }


  async getCubiclesData()
  {
    const res = await this.settingservice.getCubicle();
    return res;
  }

  // Below function will return all vernier data
  getVernierData()
  {
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
      (res: any) =>
      {
        this.allVernierData = res;
        const items = [];
        for (let i = 0; i < Object.keys(res).length; i++)
        {
          items.push(res[i].VernierID);
        }
        let data2 = items.filter((x:any) => this.sarr_vernierCubData.indexOf(x) < 0);
        this.vernierData = data2;
      },
      err =>
      {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  ngOnInit()
  {
    // This service will check whether the user has right to view that page or not, If not it will redirect user to Home Page
    this.userService.checkRights("Edit Instruments");
    this.interval = setInterval(() =>
    {
      this.getVernierData();
    }, 1000);
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

  ngOnDestroy()
  {
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
export class SnackBarComponentNoCalib { }
