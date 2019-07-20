import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { JsonDataService } from "../../../services/commonData/json-data.service";
import { HttpService } from "../../../services/http/http.service";
import { ValidationService } from "../../../services/validations/validation.service";
import { SessionStorageService } from "ngx-webstorage";
import { DataService } from "../../../services/commonData/data.service";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ErrorHandlingService } from "../../../services/error-handling/error-handling.service";
import { RemarkComponent } from "../../../shared/remark/remark/remark.component";
import { DatePipe } from "@angular/common";
import { UserService } from "../../../services/user/user.service";

declare var swal: any;

@Component({
  selector: "app-edit-box",
  templateUrl: "./edit-box.component.html",
  styleUrls: ["./edit-box.component.css"]
})
export class EditBoxComponent implements OnInit {
  sarr_CalibBoxType: Array<string> = [];
  sarr_getAPIIdentification: Array<string> = [];
  sarr_stdIdenfication: Array<string> = [];
  sarr_stdVal: Array<string> = [];
  sarr_OldstdVal: Array<string> = [];
  sarr_stdWeightTableData: Array<string> = [];
  sarr_getInputData: Array<string> = [];
  sarr_getAPIID: Array<string> = [];
  sarr_units: Array<string> = [];

  str_IDLabel: string = "";
  str_StdLabel: string = "";
  oldCertification: string = "";
  oldvalidUpto: string = "";
  oldcalibDate: string = "";
  str_newData: string = "";
  str_oldData: string = "";

  frm_editCalibBox: FormGroup;

  int_length: any;
  minDate = new Date();
  int_cntWeight: number = 0;
  int_IdentificationNo: number;
  int_OldcntWeight: number = 0;

  btn_disableEdit: boolean;
  bln_disableAddButton: boolean = false; //if weight is > 30 then disable add button
  bln_IdentificationExist: boolean = false;
  bln_IdentificationExistTable: boolean = false;
  bln_Loading: boolean;
  bln_isRemarkPopupOpened: boolean;
  bln_showHideField: boolean = false;

  obj_submitData: any;
  objarr_apiSubmitData: any;

  get str_BoxType() {
    return this.frm_editCalibBox.get("str_BoxType");
  }
  get str_BoxID() {
    return this.frm_editCalibBox.get("str_BoxID");
  }
  get str_certificate() {
    return this.frm_editCalibBox.get("str_certificate");
  }
  get dt_validUpto() {
    return this.frm_editCalibBox.get("dt_validUpto");
  }
  get dt_calibDate() {
    return this.frm_editCalibBox.get("dt_calibDate");
  }
  get str_unit() {
    return this.frm_editCalibBox.get("str_unit");
  }
  get str_stdValue() {
    return this.frm_editCalibBox.get("str_stdValue");
  }
  get str_Identification() {
    return this.frm_editCalibBox.get("str_Identification");
  }

  constructor(
    private fb: FormBuilder,
    private validation: ValidationService,
    private jsonData?: JsonDataService,
    private http?: HttpService,
    private sessionStorage?: SessionStorageService,
    private dataService?: DataService,
    private snackBar?: MatSnackBar,
    private dialog?: MatDialog,
    private errorHandling?: ErrorHandlingService,
    public datePipe?: DatePipe,
    private userService?: UserService,
  ) {}

  ngOnInit() {
    // This service will check whether the user has right to view that page or not, If not it will redirect user to Home Page
    this.userService.checkRights("Edit Calibration Box");
    this.btn_disableEdit = false;
    this.initializeField("");
    this.jsonData
      .getValueFromJSON()
      .then((res: any) => {
        const str_calibTypes = res.CalibrationBox.filter(x => x.Value == 1);
        str_calibTypes.forEach(element => {
          this.sarr_CalibBoxType.push(element.Name);
        });
        this.int_IdentificationNo = res.Balance[7].Value;
      })
      .catch(err => {
        console.log(err);
      });
  }

  onlyNumberDecimal(event: any) {
    this.validation.onlyNumbersWithDecimal(event);
  }

  initializeField(str_type: string) {
    this.int_cntWeight = 0;
    if (this.int_IdentificationNo == 0) {
      var str_idNo = "NA";
    } else {
      var str_idNo = "";
    }
    this.frm_editCalibBox = this.fb.group({
      str_BoxType: [str_type],
      str_BoxID: [""],
      str_certificate: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],
      dt_validUpto: [""],
      dt_calibDate: [""],
      str_stdValue: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateZeroEntry
        ])
      ],
      str_unit: ["", this.validation.requiredField],
      str_Identification: [str_idNo, this.validation.requiredField]
    });
  }

  getBoxType(event: any) {
    this.initializeField(event);
    this.str_IDLabel = event;
    this.sarr_stdVal = [];
    this.int_cntWeight = 0;
    if (event == "Weight Box") {
      this.str_StdLabel = "Weight";
      this.sarr_units = ["kg", "g", "mg"];
      this.frm_editCalibBox.patchValue({
        str_unit: "g"
      });
    } else {
      this.str_StdLabel = "Block";
      this.sarr_units = ["mm"];
      this.frm_editCalibBox.patchValue({
        str_unit: "mm"
      });
    }
    /*****This code is used to get  id from database and check that id is exist or not *****/
    this.http
      .getMethod("calibrationbox/getCalibration")
      .subscribe((res: any) => {
        this.sarr_getAPIID = [];
        for (let i = 0; i < Object.keys(res).length; i++) {
          if (res[i].CB_Type == event) {
            this.int_length = this.sarr_getAPIID.filter(
              x => x === res[i].CB_ID
            );
            if (this.int_length.length == 0) {
              this.sarr_getAPIID.push(res[i].CB_ID);
            }
          }
          this.sarr_getAPIIdentification.push(res[i].CB_identificationNo);
        }
      });
    this.bln_showHideField = true;
  }

  getDetail(str_boxid: any) {
    var str_objWeight,
      str_objUnit,
      str_newObjData,
      int_objDP,
      str_objIdentification;
    this.int_cntWeight = 0;
    this.sarr_getInputData = [];
    this.sarr_stdIdenfication = [];
    this.sarr_stdVal = [];
    this.sarr_OldstdVal = [];

    this.http
      .getMethod("calibrationbox/getCalibration")
      .subscribe((res: any) => {
        for (let i = 0; i < Object.keys(res).length; i++) {
          if (res[i].CB_ID == str_boxid.trim()) {
            this.int_cntWeight = this.int_cntWeight + 1;
            this.sarr_getInputData.push(res[i]);

            /** For Weight table create object/array */
            str_objWeight = { weight: res[i].CB_Wt };
            str_objUnit = { unit: res[i].CB_unit };
            int_objDP = { Dp: res[i].CB_DP };
            str_newObjData = {};

            if (this.int_IdentificationNo != 0) {
              str_objIdentification = {
                identification: res[i].CB_identificationNo
              };
              Object.assign(
                str_newObjData,
                str_objWeight,
                str_objUnit,
                int_objDP,
                str_objIdentification
              );
              this.sarr_stdIdenfication.push(res[i].CB_identificationNo); //To avoid identification number
            } else {
              Object.assign(
                str_newObjData,
                str_objWeight,
                str_objUnit,
                int_objDP
              );
            }

            this.sarr_stdVal.push(str_newObjData);
            this.sarr_OldstdVal.push(str_newObjData); //for audit trail
          }
        }
        this.int_OldcntWeight = this.int_cntWeight;
        this.initializeInputField(this.sarr_getInputData);
      });
  }

  initializeInputField(str_data: any) {
    this.frm_editCalibBox.patchValue({
      str_certificate: str_data[0].CB_CertNo,
      dt_validUpto: str_data[0].CB_validDt,
      dt_calibDate: str_data[0].CB_CalibDt
    });

    this.oldCertification = str_data[0].CB_CertNo.trim();
    this.oldvalidUpto = this.datePipe.transform(
      str_data[0].CB_validDt,
      "yyyy/MM/dd"
    );
    this.oldcalibDate = this.datePipe.transform(
      str_data[0].CB_CalibDt,
      "yyyy/MM/dd"
    );
  }

  checkDataExistForIdentification(str_idenificationNo: any)
  {
    var str_idenificationNo = str_idenificationNo.target.value;

    str_idenificationNo = str_idenificationNo.toLowerCase();
    if(str_idenificationNo == "na")
    {
      this.bln_IdentificationExistTable = false;
      this.bln_IdentificationExist = false;
    }
    else
    {
      this.int_length = this.sarr_getAPIIdentification.filter(x => x.toLowerCase() === str_idenificationNo);
      if (this.int_length.length > 0)
      {
        //check id exist in db
        this.bln_IdentificationExist = true;
      }
      else
      {
        this.bln_IdentificationExist = false;
        //check exist in data table
        this.int_length = this.sarr_stdIdenfication.filter(x => x.toLowerCase() === str_idenificationNo);
        if (this.int_length.length > 0)
        {
          this.bln_IdentificationExistTable = true;
        }
        else
        {
          this.bln_IdentificationExistTable = false;
        }
      }
    }

  }

  onAdd(weight, unit, identification) {
    this.int_cntWeight = this.int_cntWeight + 1;
    var str_objWeight,
      str_objUnit,
      str_newObjData,
      int_objDP,
      str_objIdentification;
    this.bln_disableAddButton = false;
    let int_dp = this.validation.getDPValue(weight);

    str_objWeight = { weight: weight };
    str_objUnit = { unit: unit };
    int_objDP = { Dp: int_dp };
    str_newObjData = {};
    if (this.int_IdentificationNo != 0) {
      str_objIdentification = { identification: identification };
      Object.assign(
        str_newObjData,
        str_objWeight,
        str_objUnit,
        int_objDP,
        str_objIdentification
      );
      this.sarr_stdIdenfication.push(identification); //To avoid identification number
    } else {
      Object.assign(str_newObjData, str_objWeight, str_objUnit, int_objDP);
    }

    this.sarr_stdVal.push(str_newObjData);

    if (this.int_IdentificationNo == 0) {
      this.frm_editCalibBox.patchValue({
        str_Identification: "NA"
      });
    } else {
      this.str_Identification.reset();
    }
    this.str_stdValue.reset();
  }
  onRemoveValues(index: number) {
    swal({
      title: "Are you sure ?",
      text: "Do you want to remove " + this.str_StdLabel.toLowerCase() + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    }).then(
      result => {
        if (result) {
          this.sarr_stdIdenfication.splice(index,1);
          this.int_cntWeight = this.int_cntWeight - 1;
          this.sarr_stdVal.splice(index, 1);
        }
      },
      function(dismiss) {}
    );
  }

  getDataToSendOnSubmit(str_remark: any) {
    const str_BoxType = this.frm_editCalibBox.value.str_BoxType;
    const str_BoxID = this.frm_editCalibBox.value.str_BoxID;
    const str_certificate = this.frm_editCalibBox.value.str_certificate.trim();
    const dt_validUpto = this.datePipe.transform(
      this.frm_editCalibBox.value.dt_validUpto,
      "yyyy/MM/dd"
    );
    const dt_calibDate = this.datePipe.transform(
      this.frm_editCalibBox.value.dt_calibDate,
      "yyyy/MM/dd"
    );
    var str_oldWeight;
    var str_newWeight;
    /***************check old data with new data ***********/
    if (str_certificate != this.oldCertification) {
      this.str_newData = "Certificate:" + str_certificate;
      this.str_oldData = "Certificate:" + this.oldCertification;
    }
    if (dt_validUpto != this.oldvalidUpto) {
      this.str_newData += " Valid Upto:" + dt_validUpto;
      this.str_oldData += " Valid Upto:" + this.oldvalidUpto;
    }
    if (dt_calibDate != this.oldcalibDate) {
      this.str_newData += " Last Calibration Date:" + dt_calibDate;
      this.str_oldData += " Last Calibration Date:" + this.oldcalibDate;
    }

    if (this.int_OldcntWeight != this.int_cntWeight) {
      str_oldWeight = this.sarr_OldstdVal;
      str_newWeight = this.sarr_stdVal;
    } else {
      str_oldWeight = "NA";
      str_newWeight = "NA";
    }

    if (this.str_newData == "") {
      this.str_newData = "NA";
    }
    if (this.str_oldData == "") {
      this.str_oldData = "NA";
    }

    /***************End check old data with new data ***********/

    /**Audit Trail Data */
    const str_action = "Update";
    const str_userID = this.sessionStorage.retrieve("userId");
    const str_userName = this.sessionStorage.retrieve("userName");
    /**End Audit Trail Data */

    /**Activity Log */
    const str_activity = this.str_StdLabel + " Box Edited";
    /**End Activity Log */

    this.obj_submitData = {
      CB_Type: str_BoxType,
      CB_ID: str_BoxID,
      CB_CertNo: str_certificate,
      CB_validDt: dt_validUpto,
      CB_CalibDt: dt_calibDate,
      Action: str_action,
      Remark: str_remark,
      ACB_oldValue: this.str_oldData,
      ACB_newValue: this.str_newData,
      username: str_userName,
      userid: str_userID,
      activity: str_activity,
      CB_Wt: this.sarr_stdVal,
      ACB_OldWeight: str_oldWeight,
      ACB_NewWeight: str_newWeight
    };
    const data: Object = {};
    Object.assign(data, this.obj_submitData);
    return data;
  }

  onSubmit() {
    let formName = this.frm_editCalibBox.value;
    if (
      formName.str_certificate.trim() == this.oldCertification.trim() &&
      this.datePipe.transform(formName.dt_validUpto.trim(), "yyyy/MM/dd") ==
        this.oldvalidUpto.trim() &&
      this.datePipe.transform(formName.dt_calibDate.trim(), "yyyy/MM/dd") ==
        this.oldcalibDate.trim() &&
      this.int_OldcntWeight == this.int_cntWeight
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
          "Do you want to edit " + this.frm_editCalibBox.value.str_BoxID + "?",
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
            const message = { message: "Edit Calibration Box" };
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
                //console.log(JSON.stringify(obj_sendData));
                this.bln_Loading = true;
                this.http
                  .putMethod("calibrationbox/updateCalibration", obj_sendData)
                  .subscribe(
                    res => {
                      this.bln_Loading = false;
                      this.objarr_apiSubmitData = res;

                      if (
                        this.objarr_apiSubmitData.result ===
                        "Calibration Edited Successfully"
                      ) {
                        swal({
                          title:
                            this.str_StdLabel + " Box Edited Successfully!",
                          text: "",
                          type: "success",
                          allowOutsideClick: false
                        });
                        this.onReset();
                        this.dataService.setLocked(
                          this.sessionStorage.retrieve("userId"),
                          "tbl_calibrationbox",
                          "CB_ID",
                          this.frm_editCalibBox.value.str_BoxID,
                          "locked",
                          "0"
                        );
                      } else {
                        swal({
                          title:
                            "Can not Edit " +
                            this.str_StdLabel +
                            " Box, Try again!",
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
      "tbl_calibrationbox",
      "CB_ID",
      this.frm_editCalibBox.value.str_BoxID,
      "locked",
      "0"
    );
    this.sessionStorage.store("EditMode", false);
    this.btn_disableEdit = false;
    this.frm_editCalibBox.reset();
    this.int_cntWeight = 0;
    this.int_OldcntWeight = 0;
    this.bln_showHideField = false;
    this.sarr_stdVal = [];
    this.sarr_stdIdenfication = [];
    this.sarr_OldstdVal = [];
  }
  onEdit() {
    const str_BoxId = this.frm_editCalibBox.value.str_BoxID;
    if (str_BoxId == "" || str_BoxId == null) {
      swal({
        title: "Please select " + this.str_StdLabel.toLowerCase() + " Box ID!",
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
          "tbl_calibrationbox",
          "CB_ID",
          this.frm_editCalibBox.value.str_BoxID,
          "locked",
          "1"
        )
        .then(res => {
          if (res == "Already in use by other user") {
            swal({
              title:
                this.frm_editCalibBox.value.str_BoxID +
                " is locked from another terminal!",
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
