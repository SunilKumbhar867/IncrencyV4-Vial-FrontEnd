import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { DataService } from "../../../services/commonData/data.service";
import { HttpService } from "../../../services/http/http.service";
import { SessionStorageService } from "ngx-webstorage";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ErrorHandlingService } from "../../../services/error-handling/error-handling.service";
import { RemarkComponent } from "../../../shared/remark/remark/remark.component";
import { ConfigService } from "../../../services/configuration/config.service";
import { JsonDataService } from "../../../services/commonData/json-data.service";
import { ValidationService } from "../../../services/validations/validation.service";
import { EquipmentService } from "../../../services/equipment/equipment.service";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { DatePipe } from "@angular/common";
import { UserService } from "../../../services/user/user.service";

declare var swal: any;

@Component({
  selector: "app-edit-other-eqp",
  templateUrl: "./edit-other-eqp.component.html",
  styleUrls: ["./edit-other-eqp.component.css"]
})
export class EditOtherEqpComponent implements OnInit {
  /**********************Variable Declaration**********************/
  bln_Loading: boolean;
  bln_flgShowHideControl_Make: boolean; // For hardness and DT show dropdown else show text box
  bln_flgMakeMsg: boolean; // for text box validation
  btn_disableEdit: boolean;
  bln_isRemarkPopupOpened: boolean;
  bln_formDisableInvalid: boolean;
  bln_showCalibrationForHD: any;
  bln_showCalibrationForMA: any;
  bln_isCalibration: boolean = false;
  bln_ifLenghtMore: boolean = false;
  bln_IsChangeInWeightArray: boolean = false;

  objarr_getEqpID: any;
  objarr_getInputData: any;
  obj_LockedData: any;
  obj_submitData: any;
  objarr_apiSubmitData: any;
  objarr_make: any;

  sarr_getEquipmentType: Array<string> = [];
  sarr_getEquipmentId: Array<string> = [];
  sarr_getJsonEqpMake: any;
  sarr_getMake: Array<string> = [];
  sarr_getInputData: any;
  sarr_selectedWeights: Array<any> = [];
  sarr_oldselectedWeights: Array<any> = [];

  StdWeight: any = "";
  NegTol: any = "";
  PosTol: any = "";
  calibrationType: any = "Periodic";

  int_length: any;
  int_weightLength: number = 0;
  minDate = new Date();

  frm_editEquipment: FormGroup;

  closeResult: string;
  /**********************End Variable Declaration**********************/
  get str_equipmentType() {
    return this.frm_editEquipment.get("str_equipmentType");
  }
  get str_equipmentID() {
    return this.frm_editEquipment.get("str_equipmentID");
  }
  get str_model() {
    return this.frm_editEquipment.get("str_model");
  }
  get str_make() {
    return this.frm_editEquipment.get("str_make");
  }
  get str_Serial() {
    return this.frm_editEquipment.get("str_serialNo");
  }
  get dt_calibrationDT() {
    return this.frm_editEquipment.get("dt_calibrationDT");
  }

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private http: HttpService,
    private sessionStorage?: SessionStorageService,
    private dialog?: MatDialog,
    private errorHandling?: ErrorHandlingService,
    private jsonService?: ConfigService,
    private jsonData?: JsonDataService,
    private snackBar?: MatSnackBar,
    private validation?: ValidationService,
    private equipmentservice?: EquipmentService,
    private modalService?: NgbModal,
    public datePipe?: DatePipe,
    private userService?: UserService
  ) {
    this.frm_editEquipment = this.fb.group({
      str_equipmentType: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],
      str_equipmentID: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],
      str_model: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],
      str_make: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],
      str_serialNo: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],
      dt_calibrationDT: [""]
    });
  }

  ngOnInit() {
    // This service will check whether the user has right to view that page or not, If not it will redirect user to Home Page
    this.userService.checkRights("Edit Instruments");
    this.bln_formDisableInvalid = false;
    this.bln_flgShowHideControl_Make = true;
    this.bln_flgMakeMsg = false;
    this.btn_disableEdit = false;

    this.jsonData
      .getValueFromJSON()
      .then((res: any) => {
        const sarr_getJsonObjectEqpType = res.Equipment;
        for (
          let i = 0;
          i < Object.keys(sarr_getJsonObjectEqpType).length;
          i++
        ) {
          if (sarr_getJsonObjectEqpType[i].Value === 1) {
            this.sarr_getEquipmentType.push(sarr_getJsonObjectEqpType[i].Name);
          }
        }
        this.bln_showCalibrationForHD = res.EquipmentCalibration[3].Value;
        this.bln_showCalibrationForMA = res.EquipmentCalibration[2].Value;
      })
      .catch(err => {
        console.log(err);
      });
  }
  /*****************Functions and Procedures***************/

  /************** Function Detail ************/
  //This function is used to blank input field after any action perform
  /************End Function Detail ***********/
  blankInputFields(str_type: string) {
    this.frm_editEquipment = this.fb.group({
      str_equipmentType: [
        str_type,
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],
      str_equipmentID: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],
      str_model: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],
      str_make: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],
      str_serialNo: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],
      dt_calibrationDT: [""]
    });
  }

  /************** Function Detail ************/
  //This function is used to get equipment id on selection of equipment type
  /************End Function Detail ***********/
  getEquipmentID(str_type: any) {
    this.sarr_getMake = [];
    this.sarr_getEquipmentId = [];
    this.blankInputFields(str_type);

    if (str_type == "Hardness" || str_type == "Moisture Analyzer") {
      this.bln_isCalibration = true;
    } else {
      this.bln_isCalibration = false;
    }

    this.equipmentservice
      .getEquipmentData(str_type, 0)
      .then((res: any) => {
        this.sarr_getEquipmentId = res;
      })
      .catch(err => {
        console.log(err);
      });

    /****This code is used to get make using equipment type. **********/
    this.jsonService.getJsonFileData().subscribe(res => {
      switch (str_type) {
        case "Hardness": {
          this.bln_flgShowHideControl_Make = true;
          this.bln_flgMakeMsg = false;
          this.objarr_make = res;
          this.sarr_getJsonEqpMake = this.objarr_make.HardnessMake;
          this.getMake();
          break;
        }
        case "Disintegration Tester": {
          this.bln_flgShowHideControl_Make = true;
          this.bln_flgMakeMsg = false;
          this.objarr_make = res;
          this.sarr_getJsonEqpMake = this.objarr_make.DTMake;
          this.getMake();
          break;
        }
        default: {
          this.bln_flgShowHideControl_Make = false;
          this.bln_flgMakeMsg = true;
        }
      }
    });
  }

  /************** Function Detail ************/
  //This function is used to get make From JSON File.
  /************End Function Detail ***********/
  getMake() {
    for (let i = 0; i < Object.keys(this.sarr_getJsonEqpMake).length; i++) {
      if (this.sarr_getJsonEqpMake[i].Value == 1) {
        this.sarr_getMake.push(this.sarr_getJsonEqpMake[i].Name);
      }
    }
  }

  /************** Function Detail ************/
  //This function is used to get all detail From API on selection of equipment ID.
  /************End Function Detail ***********/
  getInputDetail(str_id: any) {
    this.http
      .getMethod("otherequipment/getOtherEquipment")
      .subscribe((res: any) => {
        this.objarr_getInputData = res;
        const sarr_getAPIData = this.objarr_getInputData.result;
        this.sarr_getInputData = sarr_getAPIData.filter(
          x => x.Eqp_ID === str_id
        );
        this.initializeInputField(this.sarr_getInputData);
      });

    const str_equipmentType = this.frm_editEquipment.value.str_equipmentType;
    if (
      str_equipmentType == "Hardness" ||
      str_equipmentType == "Moisture Analyzer"
    ) {
      this.getWeightDetailFromDatabase(str_equipmentType, str_id);
    }
  }

  /************** Function Detail ************/
  //This function is used to display value in input field
  /************End Function Detail ***********/
  initializeInputField(str_inputData: any) {
    this.frm_editEquipment.patchValue({
      str_model: str_inputData[0].Eqp_Model,
      str_make: str_inputData[0].Eqp_Make,
      str_serialNo: str_inputData[0].Eqp_SerialNo,
      dt_calibrationDT: str_inputData[0].Eqp_CalibDt
    });
  }

  /************** Function Detail ************/
  //This function is used to store input data in sending variable to API
  /************End Function Detail ***********/
  getDataToSendOnSubmit(str_remark: any) {
    const str_equipmentType = this.frm_editEquipment.value.str_equipmentType;
    const str_equipmentID = this.frm_editEquipment.value.str_equipmentID;
    const str_model = this.frm_editEquipment.value.str_model;
    const str_make = this.frm_editEquipment.value.str_make;
    const str_serialNo = this.frm_editEquipment.value.str_serialNo;
    var str_newData = "",
      str_oldData = "",
      dt_calibrationDT,
      str_weights,
      str_newWeight,
      str_oldWeight;

    /***************check old data with new data ***********/
    if (str_model != this.sarr_getInputData[0].Eqp_Model) {
      str_newData = "Model:" + str_model;
      str_oldData = "Model:" + this.sarr_getInputData[0].Eqp_Model;
    }
    if (str_make != this.sarr_getInputData[0].Eqp_Make) {
      str_newData += " Make:" + str_make;
      str_oldData += " Make:" + this.sarr_getInputData[0].Eqp_Make;
    }
    if (str_serialNo != this.sarr_getInputData[0].Eqp_SerialNo) {
      str_newData += " SerialNo:" + str_serialNo;
      str_oldData += " SerialNo:" + this.sarr_getInputData[0].Eqp_SerialNo;
    }
    if (
      str_equipmentType == "Hardness" ||
      str_equipmentType == "Moisture Analyzer"
    ) {
      if (
        this.datePipe.transform(
          this.frm_editEquipment.value.dt_calibrationDT,
          "yyyy/MM/dd"
        ) != this.sarr_getInputData[0].Eqp_CalibDt
      ) {
        str_newData +=
          " Calibration Date:" +
          this.datePipe.transform(
            this.frm_editEquipment.value.dt_calibrationDT,
            "yyyy/MM/dd"
          );
        str_oldData +=
          " Calibration Date:" +
          this.datePipe.transform(
            this.sarr_getInputData[0].Eqp_CalibDt,
            "yyyy/MM/dd"
          );
      }
    }

    if (this.bln_IsChangeInWeightArray == true) {
      str_newWeight = this.sarr_selectedWeights;
      str_oldWeight = this.sarr_oldselectedWeights;
    } else {
      str_newWeight = "NA";
      str_oldWeight = "NA";
    }

    if (str_newData == "") {
      str_newData = "NA";
    }
    if (str_oldData == "") {
      str_oldData = "NA";
    }

    if (
      this.bln_isCalibration == true &&
      (this.bln_showCalibrationForHD == 1 || this.bln_showCalibrationForMA == 1)
    ) {
      if (this.sarr_selectedWeights.length > 0) {
        str_weights = this.sarr_selectedWeights;
        dt_calibrationDT = this.datePipe.transform(
          this.frm_editEquipment.value.dt_calibrationDT,
          "yyyy/MM/dd"
        );
      } else {
        str_weights = "NA";
        dt_calibrationDT = "2019-01-01";
      }
    } else {
      str_weights = "NA";
      dt_calibrationDT = "2019-01-01";
    }

    /***************End check old data with new data ***********/

    /**Audit Trail Data */
    const str_action = "Update";
    const str_userID = this.sessionStorage.retrieve("userId");
    const str_userName = this.sessionStorage.retrieve("userName");
    /**End Audit Trail Data */

    /**Activity Log */
    const str_activity = "Instrument Edited";
    /**End Activity Log */

    this.obj_submitData = {
      Eqp_Type: str_equipmentType,
      Eqp_ID: str_equipmentID,
      Eqp_Model: str_model,
      Eqp_Make: str_make,
      Eqp_SerialNo: str_serialNo,
      Eqp_Dept: "NA",
      Action: str_action,
      Remark: str_remark,
      NewData: str_newData,
      OldData: str_oldData,
      username: str_userName,
      userid: str_userID,
      activity: str_activity,
      Eqp_Weight: str_weights,
      Eqp_CalibDt: dt_calibrationDT,
      oldWeight: str_oldWeight,
      newWeight: str_newWeight
    };
    const data: Object = {};
    Object.assign(data, this.obj_submitData);
    return data;
  }

  onSubmit() {
    let formName = this.frm_editEquipment.value;

    if (
      formName.str_model.trim() == this.sarr_getInputData[0].Eqp_Model.trim() &&
      formName.str_make.trim() == this.sarr_getInputData[0].Eqp_Make.trim() &&
      formName.str_serialNo.trim() ==
        this.sarr_getInputData[0].Eqp_SerialNo.trim() &&
      this.datePipe.transform(
        this.sarr_getInputData[0].Eqp_CalibDt,
        "yyyy/MM/dd"
      ) ==
        this.datePipe.transform(
          this.frm_editEquipment.value.dt_calibrationDT,
          "yyyy/MM/dd"
        ) &&
      this.bln_IsChangeInWeightArray == false
    ) {
      swal({
        title: "No Change!",
        text: "",
        type: "error",
        allowOutsideClick: false
      });
    } else {
      swal({
        title: "Are you sure ?",
        text:
          "Do you want to edit " +
          this.frm_editEquipment.value.str_equipmentType +
          "?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No"
      }).then(
        result => {
          if (result) {
            this.bln_Loading = false;
            this.bln_isRemarkPopupOpened = true;
            const message = { message: "Edit Instrument" };
            const dialogRef = this.dialog.open(RemarkComponent, {
              data: message,
              width: "570px",
              disableClose: true
            });

            dialogRef.afterClosed().subscribe(result => {
              if (result !== undefined) {
                //remark data
                const remark = result.reason;
                const obj_dataToSend = this.getDataToSendOnSubmit(remark);
                console.log(JSON.stringify(obj_dataToSend));
                this.bln_Loading = true;
                this.http
                  .putMethod(
                    "otherequipment/updateOtherEquipment",
                    obj_dataToSend
                  )
                  .subscribe(
                    res => {
                      this.bln_Loading = false;
                      this.objarr_apiSubmitData = res;
                      if (
                        this.objarr_apiSubmitData.result ===
                        "Otherequipment Updated Successfully"
                      ) {
                        swal({
                          title: "Instrument Edited Successfully!",
                          text: "",
                          type: "success",
                          allowOutsideClick: false
                        });
                        this.dataService.setLocked(
                          this.sessionStorage.retrieve("userId"),
                          "tbl_otherequipment",
                          "Eqp_ID",
                          this.frm_editEquipment.value.str_equipmentID,
                          "locked",
                          "0"
                        );
                        this.btn_disableEdit = false;
                        this.frm_editEquipment.reset();
                        this.sessionStorage.store("EditMode", false);
                        this.bln_ifLenghtMore = false;
                        this.int_weightLength = 0;
                        this.sarr_selectedWeights = [];
                        this.bln_IsChangeInWeightArray = false;
                      } else {
                        swal({
                          title: "Can not Edit Instrument, Try again!",
                          text: "",
                          type: "error",
                          allowOutsideClick: false
                        });
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
  }

  onReset() {
    this.dataService.setLocked(
      this.sessionStorage.retrieve("userId"),
      "tbl_otherequipment",
      "Eqp_ID",
      this.frm_editEquipment.value.str_equipmentID,
      "locked",
      "0"
    );
    this.sessionStorage.store("EditMode", false);
    this.btn_disableEdit = false;
    this.frm_editEquipment.reset();
    this.bln_formDisableInvalid = false;
  }
  onEdit() {
    var str_eqpType = this.frm_editEquipment.value.str_equipmentType;
    var str_eqpId = this.frm_editEquipment.value.str_equipmentID;

    if (str_eqpType == "" || str_eqpType == null) {
      swal({
        title: "Please select Instrument Type!",
        text: "",
        type: "warning",
        allowOutsideClick: false
      });
      this.btn_disableEdit = false;
      this.sessionStorage.store("EditMode", false);
    } else if (str_eqpId == "" || str_eqpId == null) {
      swal({
        title: "Please select Instrument Code No.!",
        text: "",
        type: "warning",
        allowOutsideClick: false
      });
      this.btn_disableEdit = false;
      this.sessionStorage.store("EditMode", false);
    } else {
      this.dataService
        .setLocked(
          this.sessionStorage.retrieve("userId"),
          "tbl_otherequipment",
          "Eqp_ID",
          str_eqpId,
          "locked",
          "1"
        )
        .then(res => {
          if (res == "Already in use by other user") {
            swal({
              title: str_eqpId + " is locked from another terminal!",
              text: "",
              type: "warning",
              allowOutsideClick: false
            });
            this.btn_disableEdit = false;
            this.sessionStorage.store("EditMode", false);
          } else {
            this.btn_disableEdit = true;
            this.sessionStorage.store("EditMode", true);
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 2000
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  /*****************End Functions and Procedures***************/

  // OPENS MODAL FOR ADDING CALIBRATION DETAILS
  open2(content) {
    this.modalService.open(content, { size: "lg" }).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  // PUSH WEIGHT INTO ARRAY OF CALIBRATION WEIGTHS IF ALL BELOW CONDITIONS ARE SATISFIED
  addWeights() {
    this.bln_ifLenghtMore = false;
    if (this.StdWeight == "") {
      swal({
        title: "",
        text: "Standard Weight Cannot Be Blank!",
        type: "error",
        allowOutsideClick: false
      });
    } else if (this.NegTol == "") {
      swal({
        title: "",
        text: "Negative Tolerance Cannot Be Blank!",
        type: "error",
        allowOutsideClick: false
      });
    } else if (this.PosTol == "") {
      swal({
        title: "",
        text: "Positive Tolerance Cannot Be Blank!",
        type: "error",
        allowOutsideClick: false
      });
    } else if (this.StdWeight == "0") {
      swal({
        title: "",
        text: "Standard Weight Cannot Be zero!",
        type: "error",
        allowOutsideClick: false
      });
    } else if (this.NegTol == "0") {
      swal({
        title: "",
        text: "Negative Tolerance Cannot Be zero!",
        type: "error",
        allowOutsideClick: false
      });
    } else if (this.PosTol == "0") {
      swal({
        title: "",
        text: "Positive Tolerance Cannot Be zero!",
        type: "error",
        allowOutsideClick: false
      });
    } else if (Number(this.NegTol) > Number(this.StdWeight)) {
      swal({
        title: "",
        text: "Negative tolerance cannot be greater than Standard weight!",
        type: "error",
        allowOutsideClick: false
      });
    } else if (Number(this.PosTol) < Number(this.StdWeight)) {
      swal({
        title: "",
        text: "Positive Tolerance can not be less than Standard Weight!",
        type: "error",
        allowOutsideClick: false
      });
    } else {
      this.bln_IsChangeInWeightArray = true;
      let int_dp = this.validation.getDPValue(this.StdWeight);
      this.sarr_selectedWeights.push({
        StdWeight: this.StdWeight,
        NegTol: this.NegTol,
        PosTol: this.PosTol,
        DP: int_dp
      });

      this.StdWeight = "";
      this.NegTol = "";
      this.PosTol = "";
      this.calibrationType = "Periodic";

      this.int_weightLength = this.sarr_selectedWeights.length;

      if (this.int_weightLength > 0) {
        this.bln_ifLenghtMore = true;
      }
    }
  }

  // REMOVE PARTICULAR WEIGHT
  removeSelectedWeights(weight) {
    this.bln_IsChangeInWeightArray = true;
    var index = this.sarr_selectedWeights.indexOf(weight);
    this.sarr_selectedWeights.splice(index, 1);
    this.int_weightLength = this.sarr_selectedWeights.length;
    if (this.int_weightLength == 0) {
      this.bln_ifLenghtMore = false;
    }
  }

  // STORE THE WEIGHTS DATA
  saveWeightsData() {
    swal({
      title: "",
      text: "Weights added successfully!",
      type: "success",
      allowOutsideClick: false
    });
    // this.modalService.dismissAll();
  }
  //This function will call service which will accept only Numbers with Decimal in the Text Field
  onlyNumbersWithDecimal(event) {
    this.validation.onlyNumbersWithDecimal(event);
  }

  getWeightDetailFromDatabase(str_type: any, str_id: any) {
    this.bln_ifLenghtMore = true;
    this.int_weightLength = 0;
    this.sarr_selectedWeights = [];
    this.sarr_oldselectedWeights = [];
    this.equipmentservice
      .getCalibrationDetails(str_type, str_id)
      .then((res: any) => {
        for (let i = 0; i < Object.keys(res).length; i++) {
          this.int_weightLength = this.int_weightLength + 1;
          this.sarr_selectedWeights.push({
            StdWeight: res[i].Std,
            NegTol: res[i].NegTol,
            PosTol: res[i].PosTol,
            DP: res[i].DP
          });

          this.sarr_oldselectedWeights.push({
            StdWeight: res[i].Std,
            NegTol: res[i].NegTol,
            PosTol: res[i].PosTol,
            DP: res[i].DP
          });
        }
      });
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
