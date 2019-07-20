import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { HttpService } from "../../../services/http/http.service";
import { ConfigService } from "../../../services/configuration/config.service";
import { RemarkComponent } from "../../../shared/remark/remark/remark.component";
import { MatDialog } from "@angular/material";
import { DataService } from "../../../services/commonData/data.service";
import { SessionStorageService } from "ngx-webstorage";
import { ErrorHandlingService } from "../../../services/error-handling/error-handling.service";
import { JsonDataService } from "../../../services/commonData/json-data.service";
import { ValidationService } from "../../../services/validations/validation.service";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { DatePipe } from "@angular/common";
import { UserService } from "../../../services/user/user.service";
declare var swal: any;
@Component({
  selector: "app-add-other-eqp",
  templateUrl: "./add-other-eqp.component.html",
  styleUrls: ["./add-other-eqp.component.css"]
})
export class AddOtherEqpComponent implements OnInit {
  /**********************Variable Declaration**********************/
  objarr_make: any; // To store objects of Model which is getting from JSON
  objarr_chkDataExistForID: any;
  obj_submitData: any;
  objarr_apiSubmitData: any;

  minDate = new Date();

  bln_flgShowHideControl_Make: boolean; // For hardness and DT show dropdown else show text box
  bln_flgMakeMsg: boolean; // for text box validation
  bln_showWarning_ID: boolean;
  bln_IDexist: boolean;
  bln_isRemarkPopupOpened: boolean;
  bln_Loading: boolean;
  bln_isCalibration: boolean = false;
  bln_ifLenghtMore: boolean = false;
  bln_showCalibrationForHD: any;
  bln_showCalibrationForMA: any;

  StdWeight: any = "";
  NegTol: any = "";
  PosTol: any = "";
  calibrationType: any = "Periodic";

  todayDate = new Date();

  sarr_getEquipmentType: Array<string> = [];
  sarr_getMake: Array<string> = [];
  sarr_getJsonEqpMake: any;
  sarr_selectedWeights: Array<any> = [];
  int_weightLength: number = 0;
  sarr_getAPIEqpID: Array<string> = []; // push eqp id in this array variable for checking exist id

  int_length: any;

  frm_addEquipment: FormGroup;

  closeResult: string;

  /**********************End Variable Declaration**********************/

  get str_equipmentType() {
    return this.frm_addEquipment.get("str_equipmentType");
  }
  get str_eqpID() {
    return this.frm_addEquipment.get("str_equipmentID");
  }
  get str_model() {
    return this.frm_addEquipment.get("str_model");
  }
  get str_make() {
    return this.frm_addEquipment.get("str_make");
  }
  get str_Serial() {
    return this.frm_addEquipment.get("str_serialNo");
  }
  get dt_calibrationDT() {
    return this.frm_addEquipment.get("dt_calibrationDT");
  }

  constructor(
    private fb: FormBuilder,
    private jsonService: ConfigService,
    private http: HttpService,
    private dialog?: MatDialog,
    private dataService?: DataService,
    private sessionStorage?: SessionStorageService,
    private errorHandling?: ErrorHandlingService,
    private jsonData?: JsonDataService,
    private validation?: ValidationService,
    private modalService?: NgbModal,
    public datePipe?: DatePipe,
    private userService?: UserService,
  ) {
    this.frm_addEquipment = this.fb.group({
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
  } //end constructor

  ngOnInit() {
    // This service will check whether the user has right to view that page or not, If not it will redirect user to Home Page
    this.userService.checkRights("Add Instruments");
    this.bln_flgShowHideControl_Make = true;
    this.bln_flgMakeMsg = false;
    this.sarr_selectedWeights = [];

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

    /*****This code is used to get equipment id from database and check that id is exist or not *****/
    this.http.getMethod("otherequipment/getOtherEquipment").subscribe(res => {
      this.objarr_chkDataExistForID = res;
      const sarr_getAPIResult = this.objarr_chkDataExistForID.result;
      for (let i = 0; i < Object.keys(sarr_getAPIResult).length; i++) {
        this.sarr_getAPIEqpID.push(sarr_getAPIResult[i].Eqp_ID);
      }
    });
  } // end ngoninit

  /*****************Functions and Procedures***************/

  /************** Function Detail ************/
  //This function is used to get make On selection of equipment type.
  /************End Function Detail ***********/
  getEquipmentModel(value: any) {
    if (value == "Hardness" || value == "Moisture Analyzer") {
      this.bln_isCalibration = true;
    } else {
      this.bln_isCalibration = false;
    }
    this.bln_IDexist = false;
    this.frm_addEquipment = this.fb.group({
      str_equipmentType: [
        value,
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
    this.sarr_getMake = [];
    this.jsonService.getJsonFileData().subscribe(res => {
      switch (value) {
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
  //This function is used to check entered equipment id with database array id
  /************End Function Detail ***********/
  onkey_checkDataExistForID(str_eqpID: any) {
    var str_eqpid = str_eqpID.target.value;
    str_eqpid = str_eqpid.toLowerCase();
    this.int_length = this.sarr_getAPIEqpID.filter(
      x => x.toLowerCase() === str_eqpid
    );
    if (this.int_length.length > 0) {
      this.bln_showWarning_ID = true;
      this.bln_IDexist = true;
    } else {
      this.bln_showWarning_ID = false;
      this.bln_IDexist = false;
    }
  }

  /************** Function Detail ************/
  //This function is used to store input data in sending variable to API
  /************End Function Detail ***********/
  getDataToSendOnSubmit(str_remark: any) {
    const str_equipmentType = this.frm_addEquipment.value.str_equipmentType;
    const str_equipmentID = this.frm_addEquipment.value.str_equipmentID;
    const str_model = this.frm_addEquipment.value.str_model;
    const str_make = this.frm_addEquipment.value.str_make;
    const str_serialNo = this.frm_addEquipment.value.str_serialNo;
    var str_newData, str_weights, dt_calibrationDT;

    if (this.sarr_selectedWeights.length > 0) {
      str_weights = this.sarr_selectedWeights;
      dt_calibrationDT = this.datePipe.transform(
        this.frm_addEquipment.value.dt_calibrationDT,
        "yyyy/MM/dd"
      );
    } else {
      str_weights = "NA";
      dt_calibrationDT = "2019-01-01";
    }

    str_newData =
      "Code No.:" +
      str_equipmentID +
      " Model:" +
      str_model +
      " Make:" +
      str_make +
      " SerialNo:" +
      str_serialNo;

    /**Audit Trail Data */
    const str_action = "Add";
    const str_userID = this.sessionStorage.retrieve("userId");
    const str_userName = this.sessionStorage.retrieve("userName");
    /**End Audit Trail Data */

    /**Activity Log */
    const str_activity = "Instrument Added";
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
      username: str_userName,
      userid: str_userID,
      activity: str_activity,
      Eqp_Weight: str_weights,
      Eqp_CalibDt: dt_calibrationDT
    };
    const data: Object = {};
    Object.assign(data, this.obj_submitData);
    return data;
  }

  onSubmit() {
    swal({
      title: "Are you sure ?",
      text:
        "Do you want to add " +
        this.frm_addEquipment.value.str_equipmentType +
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
          const message = { message: "Add Instrument" };
          const dialogRef = this.dialog.open(RemarkComponent, {
            data: message,
            width: "570px",
            disableClose: true
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
              //remark data
              const remark = result.reason;
              const obj_sendData = this.getDataToSendOnSubmit(remark);
              console.log(JSON.stringify(obj_sendData));
              this.bln_Loading = true;
              this.http
                .postMethod("otherequipment/storeOtherEquipment", obj_sendData)
                .subscribe(
                  res => {
                    this.bln_Loading = false;
                    this.objarr_apiSubmitData = res;

                    if (
                      this.objarr_apiSubmitData.result ===
                      "Otherequipment ID Already Exist"
                    ) {
                      this.bln_Loading = false;
                      swal({
                        title: "Instrument already exist!",
                        text: "",
                        type: "warning",
                        allowOutsideClick: false
                      });
                      this.frm_addEquipment.value.str_equipmentID = "";
                    } else if (
                      this.objarr_apiSubmitData.result ===
                      "Otherequipment Added Successfully"
                    ) {
                      swal({
                        title: "Instrument Added Successfully!",
                        text: "",
                        type: "success",
                        allowOutsideClick: false
                      });
                      this.frm_addEquipment.reset();
                      this.bln_ifLenghtMore = false;
                      this.int_weightLength = 0;
                      this.sarr_selectedWeights = [];
                    } else {
                      swal({
                        title: "Can not Add Instrument, Try again!",
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

  onReset() {
    this.frm_addEquipment.reset();
  }

  /*****************End Functions and Procedures***************/
} //end of class
