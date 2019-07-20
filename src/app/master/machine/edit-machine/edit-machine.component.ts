import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { MatDialog } from "@angular/material";
import { SessionStorageService } from "ngx-webstorage";
import { JsonDataService } from "../../../services/commonData/json-data.service";
import { ErrorHandlingService } from "../../../services/error-handling/error-handling.service";
import { HttpService } from "../../../services/http/http.service";
import { ValidationService } from "../../../services/validations/validation.service";
import { RemarkComponent } from "../../../shared/remark/remark/remark.component";
import { DataService } from "../../../services/commonData/data.service";
import { UserService } from "../../../services/user/user.service";

declare var swal: any;

@Component({
  selector: "app-edit-machine",
  templateUrl: "./edit-machine.component.html",
  styleUrls: ["./edit-machine.component.css"]
})
export class EditMachineComponent implements OnInit {
  bln_Loading: boolean = false;
  sarr_rotaryType = ["Single", "Double"];
  arrMachineData: any;
  arrMachineID: Array<String> = [];
  frmEditMachine: FormGroup;
  bln_IsPopupOpened = true;
  obj_GetMachineRes: any;
  blnIsEdit: Boolean = false;
  arrCubicleType: Array<String> = [];
  selectedMachine: any;

  old_make: any;
  old_serial: any;
  old_cubType: any;
  old_rotaryType: any;
  old_model: any;

  constructor(
    private http: HttpService,
    private fb: FormBuilder,
    private dialog?: MatDialog,
    private sessionStorage?: SessionStorageService,
    private errorHandling?: ErrorHandlingService,
    private validation?: ValidationService,
    private jsonData?: JsonDataService,
    private dataService?: DataService,
    private userService?: UserService
  ) {
    this.frmEditMachine = this.fb.group({
      strMachineId: new FormControl(
        "Select",
        Validators.compose([
          Validators.required,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ),
      str_make: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ),
      str_model: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ),
      str_serialNo: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ),
      strRotaryType: new FormControl(
        this.sarr_rotaryType[0],
        Validators.required
      ),
      strCubicleType: new FormControl(
        this.arrCubicleType[0],
        Validators.required
      )
    });
  }

  disableControls() {
    this.frmEditMachine.controls["strMachineId"].enable();
    this.frmEditMachine.controls["str_make"].disable();
    this.frmEditMachine.controls["str_model"].disable();
    this.frmEditMachine.controls["str_serialNo"].disable();
    this.frmEditMachine.controls["strRotaryType"].disable();
    this.frmEditMachine.controls["strCubicleType"].disable();
  }
  enableControls() {
    this.frmEditMachine.controls["strMachineId"].disable();
    this.frmEditMachine.controls["str_make"].enable();
    this.frmEditMachine.controls["str_model"].enable();
    this.frmEditMachine.controls["str_serialNo"].enable();
    this.frmEditMachine.controls["strRotaryType"].enable();
    this.frmEditMachine.controls["strCubicleType"].enable();
  }

  ngOnInit() {
    // This service will check whether the user has right to view that page or not, If not it will redirect user to Home Page
    this.userService.checkRights("Edit Equipment");
    this.disableControls();
    this.getMachineList();
    this.jsonData
      .getValueFromJSON()
      .then((res: any) => {
        const objCubicleType = res.CubicleType.filter(k => k.Value == 1);
        objCubicleType.forEach(element => {
          this.arrCubicleType.push(element.Name);
        });
        this.frmEditMachine.patchValue({
          strCubicleType: this.arrCubicleType[0]
        });
      })
      .catch(err => {});
  }

  //Below Function will fetch detials of Particular Selected Machine ID
  selectedIndexChanged(event) {
    if (event != "Select") {
      // this.http.getMethod(`machine/${event}`).subscribe(
        this.http.getMethod(`machine/all`).subscribe(
        (response: any) => {

          this.selectedMachine = response.filter((x:any) => x.Machine_ID == event);

          this.old_make = this.selectedMachine[0].Machine_Make;
          this.old_serial = this.selectedMachine[0].Machine_SerialNo;
          this.old_cubType = this.selectedMachine[0].Machine_CubicleType;
          this.old_rotaryType = this.selectedMachine[0].Machine_Rotary;
          this.old_model = this.selectedMachine[0].Machine_Model;

          this.frmEditMachine.patchValue({
            str_make: this.selectedMachine[0].Machine_Make,
            str_model: this.selectedMachine[0].Machine_Model,
            str_serialNo: this.selectedMachine[0].Machine_SerialNo,
            strRotaryType: this.selectedMachine[0].Machine_Rotary,
            strCubicleType:
            this.selectedMachine[0].Machine_CubicleType === null
                ? ""
                : this.selectedMachine[0].Machine_CubicleType
          });
        },
        err => {
          this.errorHandling.checkError(err.status);
          this.bln_Loading = false;
        }
      );
    }
  }

  toggleEdit(blnEdit) {
    this.sessionStorage.store("EditMode", blnEdit);
  }

  edit() {
    if (
      this.frmEditMachine.value.strMachineId == "Select" ||
      this.frmEditMachine.value.strMachineId == null
    ) {
      swal("Please Select Equipment Code No.", "", "error");
    } else {
      if (this.selectedMachine[0].locked.data[0] == 1) {
        swal(
          "",
          "This Equipment is being edited from another terminal",
          "warning"
        );
      } else {
        this.dataService
          .setLocked(
            this.sessionStorage.retrieve("userId"),
            "tbl_machine",
            "Machine_ID",
            this.frmEditMachine.value.strMachineId,
            "locked",
            "1"
          )
          .then(res => {})
          .catch(err => {});
        this.blnIsEdit = true;
        this.enableControls();
        this.toggleEdit(this.blnIsEdit);
      }
    }
  }

  // Below Function will give us all Machine ID List
  getMachineList() {
    this.http.getMethod("machine/all").subscribe(
      json_Response => {
        let arrResponse: any = json_Response;
        this.arrMachineID.push("Select");
        arrResponse.forEach(element => {
          this.arrMachineID.push(element.Machine_ID);
        });
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_Loading = false;
      }
    );
  }

  public onSubmit() {
    if(this.old_make == this.frmEditMachine.value.str_make.trim()
    && this.old_serial == this.frmEditMachine.value.str_serialNo.trim()
    && this.old_cubType == this.frmEditMachine.value.strCubicleType.trim()
    && this.old_rotaryType == this.frmEditMachine.value.strRotaryType.trim()
    && this.old_model == this.frmEditMachine.value.str_model.trim())
    {
      swal({
        title: "No Change!",
        text: "",
        type: "error",
        allowOutsideClick: false,
      });
    }
    else
    {
      const strMachineId: String = this.frmEditMachine.controls[
        "strMachineId"
      ].value.trim();
      const strMake = this.frmEditMachine.value.str_make.trim();
      const strModel = this.frmEditMachine.value.str_model.trim();
      const str_serialNo = this.frmEditMachine.value.str_serialNo.trim();
      const strRotaryType = this.frmEditMachine.value.strRotaryType.trim();
      const strCubicleType = this.frmEditMachine.value.strCubicleType.trim();
      swal({
        title: "Are You Sure?",
        text: "Do You Want To Edit Equipment Code No. " + strMachineId + " ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        cancelButtonText: "No"
      }).then(
        result => {
          if (result == true) {
            this.bln_IsPopupOpened = true;
            const message = { message: "Edit Equipment" };
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
                const action = "Edit";
                const remark = result.reason.trim();
                var str_newData = "";
                var str_oldData = "";
                /***************check old data with new data ***********/
                if (strMake != this.selectedMachine[0].Machine_Make) {
                  str_oldData = "Make: " + this.selectedMachine[0].Machine_Make;
                  str_newData = "Make: " + strMake;
                }
                if (strModel != this.selectedMachine[0].Machine_Model) {
                  str_newData += " Model: " + strModel;
                  str_oldData +=
                    " Model: " + this.selectedMachine[0].Machine_Model;
                }
                if (str_serialNo != this.selectedMachine[0].Machine_SerialNo) {
                  str_newData += " Serial No: " + str_serialNo;
                  str_oldData +=
                    " Serial No: " + this.selectedMachine[0].Machine_SerialNo;
                }
                if (strRotaryType != this.selectedMachine[0].Machine_Rotary) {
                  str_newData += " Rotary Type: " + strRotaryType;
                  str_oldData +=
                    " Rotary Type: " + this.selectedMachine[0].Machine_Rotary;
                }
                if (
                  strCubicleType != this.selectedMachine[0].Machine_CubicleType
                ) {
                  str_newData += " Cubicle Type: " + strCubicleType;
                  str_oldData +=
                    " Cubicle Type: " +
                    this.selectedMachine[0].Machine_CubicleType;
                }
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
                  { oldData: str_oldData },
                  { newData: str_newData }
                );
                if (str_oldData == str_newData) {
                  swal("No Change", "", "warning");
                } else {
                  //console.log(data);
                  this.bln_Loading = true;
                  this.http.postMethod("machine/edit", data).subscribe(
                    res => {
                      //console.log(res);
                      this.bln_Loading = false;
                      this.obj_GetMachineRes = res;
                      if (
                        this.obj_GetMachineRes.result ===
                        "Machine Edited Successfully"
                      ) {
                        swal("Equipment Edited Successfully", "", "success");
                        this.dataService.setLocked(
                          this.sessionStorage.retrieve("userId"),
                          "tbl_machine",
                          "Machine_ID",
                          this.frmEditMachine.controls["strMachineId"].value,
                          "locked",
                          "0"
                        );
                        this.frmEditMachine.reset();
                        this.toggleEdit(false);
                        this.getMachineList();
                        this.frmEditMachine.controls["strMachineId"].enable();
                        this.blnIsEdit = false;
                      } else {
                        swal("Can not Edit Equipment, Try again", "", "error");
                      }
                    },
                    err => {
                      this.errorHandling.checkError(err.status);
                      this.bln_Loading = false;
                    }
                  );
                }
              }
            });
          }
        },
        function(dismiss) {}
      );
    }
  }

  // Reset the form to its Actual Stage as it was on Page Load
  onReset() {
    if (this.frmEditMachine.controls["strMachineId"].value == null) {
      swal("Please Select Equipment Code No.", "", "error");
    } else {
      this.dataService.setLocked(
        this.sessionStorage.retrieve("userId"),
        "tbl_machine",
        "Machine_ID",
        this.frmEditMachine.controls["strMachineId"].value,
        "locked",
        "0"
      );
      this.blnIsEdit = false;
      this.disableControls();
      this.toggleEdit(false);
      this.frmEditMachine.reset();
    }
  }
}
