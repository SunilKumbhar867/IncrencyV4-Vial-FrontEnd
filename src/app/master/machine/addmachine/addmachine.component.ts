import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import { HttpService } from "../../../services/http/http.service";
import { MatDialog } from "@angular/material";
import { SessionStorageService } from "ngx-webstorage";
import { ErrorHandlingService } from "../../../services/error-handling/error-handling.service";
import { ValidationService } from "../../../services/validations/validation.service";
import { RemarkComponent } from "../../../shared/remark/remark/remark.component";
import { JsonDataService } from "../../../services/commonData/json-data.service";
import { UserService } from "../../../services/user/user.service";

declare var swal: any;
@Component({
  selector: "app-addmachine",
  templateUrl: "./addmachine.component.html",
  styleUrls: ["./addmachine.component.css"]
})
export class AddmachineComponent implements OnInit {
  bln_Loading: boolean = false;
  sarr_rotaryType = ["Single", "Double"];
  bln_IDexist: boolean = false;
  arrMachineData: any;
  frmAddMachine: FormGroup;
  bln_IsPopupOpened = true;
  obj_GetMachineRes: any;

  arrCubicleType: Array<String> = [];

  get strMachineID() {
    return this.frmAddMachine.get("strMachineID");
  }
  get str_make() {
    return this.frmAddMachine.get("str_make");
  }
  get str_model() {
    return this.frmAddMachine.get("str_model");
  }
  get str_serialNo() {
    return this.frmAddMachine.get("str_serialNo");
  }
  get strRotaryType() {
    return this.frmAddMachine.get("strRotaryType");
  }
  get strCubicleType() {
    return this.frmAddMachine.get("strCubicleType");
  }

  constructor(
    private http: HttpService,
    private fb: FormBuilder,
    private dialog?: MatDialog,
    private sessionStorage?: SessionStorageService,
    private errorHandling?: ErrorHandlingService,
    private validation?: ValidationService,
    private jsonData?: JsonDataService,
    private userService?: UserService,
  ) {
    this.frmAddMachine = this.fb.group({
      strMachineID: new FormControl(
        "",
        Validators.compose([this.validation.requiredField])
      ),
      str_make: new FormControl(
        "",
        Validators.compose([this.validation.requiredField])
      ),
      str_model: new FormControl(
        "",
        Validators.compose([this.validation.requiredField])
      ),
      str_serialNo: new FormControl(
        "",
        Validators.compose([this.validation.requiredField])
      ),
      strRotaryType: new FormControl(
        this.sarr_rotaryType[0],
        Validators.compose([this.validation.requiredField])
      ),
      strCubicleType: new FormControl(
        this.arrCubicleType[0],
        Validators.compose([this.validation.requiredField])
      )
    });
  }

  ngOnInit() {
    // This service will check whether the user has right to view that page or not, If not it will redirect user to Home Page
    this.userService.checkRights("Add Equipment");
    this.getMachineList();
    this.jsonData
      .getValueFromJSON()
      .then((res: any) => {
        const objCubicleType = res.CubicleType.filter(k => k.Value == 1);
        objCubicleType.forEach(element => {
          this.arrCubicleType.push(element.Name);
        });

        this.frmAddMachine.patchValue({
          strCubicleType: this.arrCubicleType[0]
        });
      })
      .catch(err => {});
  }

  onSubmit() {
    this.onFormSubmit();
  }

  checkDataExistForID(machineID) {
    const ID = machineID.target.value;
    let objDuplicateID = "";
    objDuplicateID = this.arrMachineData.find(
      k => k.Machine_ID.toLowerCase() === ID.toLowerCase()
    );
    if (objDuplicateID != undefined) {
      this.bln_IDexist = true;
    } else {
      this.bln_IDexist = false;
    }
  }

  getMachineList() {
    this.http.getMethod("machine/all").subscribe(
      json_Response => {
        this.arrMachineData = json_Response;
        // console.log(this.arrMachineData);
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_Loading = false;
      }
    );
  }

  public onFormSubmit() {
    this.bln_Loading = false;
    const strMachineId = this.frmAddMachine.value.strMachineID.trim();
    const strMake = this.frmAddMachine.value.str_make.trim();
    const strModel = this.frmAddMachine.value.str_model.trim();
    const str_serialNo = this.frmAddMachine.value.str_serialNo.trim();
    const strRotaryType = this.frmAddMachine.value.strRotaryType.trim();
    const strCubicleType = this.frmAddMachine.value.strCubicleType.trim();
    swal({
      title: "Are You Sure?",
      text: "Do You Want To Add Equipment Code No. " + strMachineId + " ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    }).then(
      result => {
        if (result == true) {
          this.bln_IsPopupOpened = true;
          const message = { message: "Add Equipment" };
          const dialogRef = this.dialog.open(RemarkComponent, {
            data: message,
            width: "570px",
            disableClose: true
          });
          dialogRef.afterClosed().subscribe(result => {
            const data: Object = {};

            if (result !== undefined) {
              const userId = this.sessionStorage.retrieve("userId").trim();
              const userName = this.sessionStorage.retrieve("userName").trim();
              const action = "Add";
              const remark = result.reason.trim();
              const newData =
                "Equipment Code No.:" +
                strMachineId +
                " Make:" +
                strMake +
                " Model:" +
                strModel +
                " SerialNo:" +
                str_serialNo +
                " RotaryType:" +
                strRotaryType +
                " CubicleType:" +
                strCubicleType;
              Object.assign(
                data,
                { MachineID: strMachineId },
                { Make: strMake },
                { Model: strModel },
                { SrNo: str_serialNo },
                { RotaryType: strRotaryType },
                { CubicleType: strCubicleType },
                { loggedUserId: userId },
                { loggedUserName: userName },
                { action: action },
                { remark: remark },
                { newData: newData }
              );
             // console.log(JSON.stringify(data));
              this.bln_Loading = true;
              this.http.postMethod("machine/save", data).subscribe(
                res => {
                  this.bln_Loading = false;
                  this.obj_GetMachineRes = res;
                  if (
                    this.obj_GetMachineRes.result === "Machine Already Exist"
                  ) {
                    swal("Equipment Already Exist", "", "warning");
                    this.getMachineList();
                  } else if (
                    this.obj_GetMachineRes.result ===
                    "Machine Added Successfully"
                  ) {
                    swal("Equipment Added Successfully", "", "success");
                    this.frmAddMachine.reset();
                    this.getMachineList();
                  } else {
                    swal("Can not Add Equipment, Try again", "", "error");
                  }
                },
                err => {
                  this.errorHandling.checkError(err.status);
                  this.bln_Loading = false;
                }
              );
            }
          });
        }
      },
      function(dismiss) {}
    );
  }

  onReset() {
    this.frmAddMachine.reset();
    this.bln_IDexist = false;
  }
}
