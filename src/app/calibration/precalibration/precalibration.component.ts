import { Component, OnInit } from "@angular/core";
import { ConfigService } from "../../services/configuration/config.service";
import { ErrorHandlingService } from "../../services/error-handling/error-handling.service";
import { HttpService } from "../../services/http/http.service";
import { DatePipe } from "@angular/common";
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder
} from "@angular/forms";
import { ValidationService } from "../../services/validations/validation.service";

declare var swal: any;
@Component({
  selector: "app-precalibration",
  templateUrl: "./precalibration.component.html",
  styleUrls: ["./precalibration.component.css"]
})
export class PrecalibrationComponent implements OnInit {
  bln_loading: boolean;
  sarr_calibrationData = [];
  sarr_AreaData = [];
  sarr_cubicleNames: Array<String> = [];
  sarr_cubicleData: Array<any> = [];
  sarr_weightBoxId: Array<any> = [];
  sarr_weights: Array<any> = [];
  sarr_Standardweights: Array<any> = [];
  sarr_AllweightBoxData: Array<any> = [];
  sarr_selectedWeights: Array<any> = [];
  sarr_allBalanceData: Array<any> = [];
  sarr_allVernierData: Array<any> = [];
  sarr_weighmentData: Array<any> = [];
  sarr_calibrationType: any;
  bln_isCubliceSelected: boolean = true;
  obj_developerPanelCalibData: any;
  bln_cubicle_disabled = true;
  bln_equipment_disabled = true;
  bln_calibrationType_disabled = true;
  bln_showAddbtn: boolean = true;
  bln_showSubmitbtn: boolean;
  bln_showRefreshButton: boolean;
  bln_standardWeight: boolean;
  bln_Weights: boolean;
  interval: any;
  precalibration = new FormGroup({
    area: new FormControl(),
    cubicleName: new FormControl(),
    equipmentType: new FormControl(),
    calibrationType: new FormControl(),
    standardWeight: new FormControl(),
    weightBox: new FormControl(),
    weights: new FormControl()
  });
  standardWeight: any;
  addedsum: any;
  cublicleName: any;
  cublicleNo: any;
  selectedEquipment: any;
  selectedEquipmentID: any;
  positiveTolerance: any;
  negativeTolerance: any;
  calibrationBoxDate: any;
  calibrationBoxID: any;
  calibrationBoxValidityDate: any;
  calibrationCertificateNo: any;
  decimalPoint: any;
  repeatCount: any;
  FilteredWeight: any[];
  identificationNo: any;
  int_balDP:any;
  get area() {
    return this.precalibration.get("area");
  }
  constructor(
    private ConfigService?: ConfigService,
    private errorHandling?: ErrorHandlingService,
    private http?: HttpService,
    private fb?: FormBuilder,
    public datePipe?: DatePipe,
    private validation?: ValidationService,
  ) {
    this.getAreaList();
    this.getCalibrationBoxData();
    this.precalibration = this.fb.group({
      area: new FormControl("", Validators.required),
      cubicleName: new FormControl("", Validators.required),
      equipmentType: new FormControl("", Validators.required),
      calibrationType: new FormControl("", Validators.required),
      standardWeight: new FormControl("", Validators.required),
      weightBox: new FormControl(""),
      weights: new FormControl("")
    });
  }

  // Below function will return array List of Area
  getAreaList() {
    this.http.getMethod("precalibration/getcalibrationArea").subscribe(
      (res: any) => {
        const items = [];
        for (let i = 0; i < Object.keys(res.result).length; i++) {
          items.push(res.result[i].Area);
        }
        this.sarr_AreaData = items;
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  // Below function will send all the calibration box details
  getCalibrationBoxData() {
    this.sarr_weightBoxId = [];
    this.http.getMethod("calibrationbox/getCalibrationData").subscribe(
      (res: any) => {
        this.sarr_AllweightBoxData = res;
        const items = [];
        for (let i = 0; i < Object.keys(res).length; i++) {
          items.push(res[i].CB_ID);
        }
        // Returns Distinct WeightBox ID
        this.sarr_weightBoxId = items.filter((el, i, a) => i === a.indexOf(el));
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  // Below function will send the seleted Area name to Node Server & return Cublice Names assigned to that Area & Details about the Cubicle
  onSelectArea(area: string) {
    this.bln_cubicle_disabled = false;
    const data = { area: area };
    this.bln_isCubliceSelected = true;
    this.http.postMethod("precalibration/getcubicleNo", data).subscribe(
      (res: any) => {
        this.sarr_cubicleData = res.result;
        this.sarr_cubicleNames = [];
        for (let i = 0; i < Object.keys(res.result).length; i++) {
          this.sarr_cubicleNames.push(res.result[i].Sys_CubicName);
        }
        // Function returns value which are Not NULL, None or Blank
        function checkValues(value: string) {
          return value != "NULL" && value != "None" && value != "";
        }
        const tempArray = this.sarr_cubicleNames.filter(checkValues);
        this.sarr_cubicleNames = tempArray;
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  // This function will check values of Developer panel & equipment id as well if both return true then it will push the Equipment to Equipment Data List
  onSelectCubicle(value: string) {
    this.bln_equipment_disabled = false;
    this.ConfigService.getJsonFileData().subscribe(
      (res: any) => {
        // This below object stores Calibration values as set in Developer Panel (0 & 1)
        this.obj_developerPanelCalibData = res.EquipmentCalibration;
        const selectedCubicle = this.sarr_cubicleData.filter(
          x => x.Sys_CubicName == value
        );
        this.cublicleName = selectedCubicle[0].Sys_CubicName;
        this.cublicleNo = selectedCubicle[0].Sys_CubicNo;
        const availableEquipmentType = [];
        if (
          selectedCubicle[0].Sys_BalID != "None" &&
          selectedCubicle[0].Sys_BalID != "NULL" &&
          this.obj_developerPanelCalibData[0].Value == 1
        ) {
          availableEquipmentType.push({
            name: "Balance",
            id: selectedCubicle[0].Sys_BalID
          });
        }
        if (
          selectedCubicle[0].Sys_VernierID != "None" &&
          selectedCubicle[0].Sys_VernierID != "NULL" &&
          this.obj_developerPanelCalibData[1].Value == 1
        ) {
          availableEquipmentType.push({
            name: "Vernier",
            id: selectedCubicle[0].Sys_VernierID
          });
        }
        if (
          selectedCubicle[0].Sys_MoistID != "None" &&
          selectedCubicle[0].Sys_MoistID != "NULL" &&
          this.obj_developerPanelCalibData[2].Value == 1
        ) {
          availableEquipmentType.push({
            name: "Moisture Analyzer",
            id: selectedCubicle[0].Sys_MoistID
          });
        }
        if (
          selectedCubicle[0].Sys_HardID != "None" &&
          selectedCubicle[0].Sys_HardID != "NULL" &&
          this.obj_developerPanelCalibData[3].Value == 1
        ) {
          availableEquipmentType.push({
            name: "Hardness",
            id: selectedCubicle[0].Sys_HardID
          });
        }
        this.sarr_calibrationData = availableEquipmentType;
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
    this.bln_isCubliceSelected = true;
  }

  // This will return calibration type from Developer's Panel
  returnCalibrationType(type) {
    this.sarr_calibrationType = [];
    this.ConfigService.getJsonFileData().subscribe((res: any) => {
      const items = [];
      for (let i = 0; i < Object.keys(res[type]).length; i++) {
        if (res[type][i].Value == 1) {
          items.push(res[type][i].Name);
        }
      }
      this.sarr_calibrationType = items;
    });
  }

  onSelectEquipment(equpiment) {
    this.bln_calibrationType_disabled = false;
    this.selectedEquipment =
      equpiment.target.options[equpiment.target.selectedIndex].text;
    this.selectedEquipmentID = equpiment.target.value;
    if (this.selectedEquipment == "Balance") {
      this.returnCalibrationType("BalanceCalibrationType");
    } else if (this.selectedEquipment == "Vernier") {
      this.returnCalibrationType("VernierCalibrationType");
    } else if (this.selectedEquipment == "Moisture Analyzer") {
      this.returnCalibrationType("MoistureAnalyzerCalibrationType");
    } else if (this.selectedEquipment == "Hardness") {
      this.returnCalibrationType("HardnessCalibrationType");
    }
  }

  // This will return standard weights if calibration value of column name is == 1 for Balance
  returnStandardWeightBalance(weightData, columnName, int_dp) {
    const items = [];
    for (let i = 0; i < Object.keys(weightData).length; i++) {
      if (weightData[i][columnName] == 1) {
        items.push(parseFloat(weightData[i].Bal_StdWt).toFixed(int_dp ));
      }
    }
    this.sarr_Standardweights = items;
    this.returnWeights();
  }

  // This will return standard weights if calibration value of column name is == 1 for Vernier
  returnStandardWeightVernier(weightData, columnName) {
    const items = [];
    for (let i = 0; i < Object.keys(weightData).length; i++) {
      if (weightData[i][columnName] == 1) {
        items.push(weightData[i].Ver_StdBlock);
      }
    }
    this.sarr_Standardweights = items;
    this.returnWeights();
  }

  // Calculate & Return only those values standard weights are ready for weighment
  returnWeights() {
    const presentWeights = [];

    for (let i = 0; i < Object.keys(this.sarr_weighmentData).length; i++) {
      presentWeights.push(parseFloat(this.sarr_weighmentData[i].Standard_Weight_Block).toFixed( this.int_balDP ));
    }
    this.sarr_Standardweights = this.sarr_Standardweights.filter(
      item => presentWeights.indexOf(item) < 0
    );
  }
clearAllValues()
{
  this.bln_showAddbtn = true;
  this.bln_showSubmitbtn = false;
  this.bln_standardWeight = false;
 // this.sarr_selectedWeights = [];
  this.sarr_Standardweights = [];
  this.sarr_weights = [];
  this.identificationNo = "";
  this.getCalibrationBoxData();
}
  // This will return the repeat count of selected Calibration type
  onSelectCalibrationType(calibration_Type) {

  this.clearAllValues();

    this.getWeighmentData();
    this.bln_showRefreshButton = true;
    if (this.selectedEquipment == "Balance") {
      this.http.getMethod("balance/getBalanceDetails").subscribe(
        (res: any) => {

          this.sarr_allBalanceData = res.result;
          const selectedBalance = res.result.filter(
            x => x.Bal_ID == this.selectedEquipmentID
          );
          this.int_balDP = selectedBalance[0].Bal_DP;

          this.sarr_Standardweights = [];
          // This will loop through weights & Push into array whose calibration status is 1
          switch (calibration_Type) {
            case "Daily":
              this.returnStandardWeightBalance(
                selectedBalance[0].WtDetail,
                "Bal_Daily",
                selectedBalance[0].Bal_DP
              );
              break;
            case "Periodic":
              this.returnStandardWeightBalance(
                selectedBalance[0].WtDetail,
                "Bal_Periodic",
                selectedBalance[0].Bal_DP
              );
              break;
            case "Linerity":
              this.returnStandardWeightBalance(
                selectedBalance[0].WtDetail,
                "Bal_Linearity",
                selectedBalance[0].Bal_DP
              );
              break;
            case "Eccentricity":
              this.returnStandardWeightBalance(
                selectedBalance[0].WtDetail,
                "Bal_IsEccentricity",
                selectedBalance[0].Bal_DP
              );
              break;
            case "Uncertainty":
              this.returnStandardWeightBalance(
                selectedBalance[0].WtDetail,
                "Bal_IsUncertinity",
                selectedBalance[0].Bal_DP
              );
              break;
            case "Repetability":
              this.returnStandardWeightBalance(
                selectedBalance[0].WtDetail,
                "Bal_IsRepetability",
                selectedBalance[0].Bal_DP
              );
              break;
          }
        },
        err => {
          this.errorHandling.checkError(err.status);
          this.bln_loading = false;
        }
      );
    } else if (this.selectedEquipment == "Vernier") {
      this.sarr_Standardweights = [];
      this.http.getMethod("vernier/getVernier").subscribe(
        (res: any) => {
          this.sarr_allVernierData = res;
          const selectedVernier = res.filter(
            x => x.VernierID == this.selectedEquipmentID
          );
          if (calibration_Type == "Periodic") {
            this.returnStandardWeightVernier(
              selectedVernier[0].WtDetail,
              "Ver_blnPeriodic"
            );
          }
        },
        err => {
          this.errorHandling.checkError(err.status);
          this.bln_loading = false;
        }
      );
    }
    this.ConfigService.getJsonFileData().subscribe((res: any) => {
      switch (calibration_Type) {
        case "Daily":
          this.repeatCount = res.Balance[0].Value;
          break;
        case "Periodic":
          this.repeatCount = res.Balance[1].Value;
          break;
        case "Linerity":
          this.repeatCount = res.Balance[2].Value;
          break;
        case "Eccentricity":
          this.repeatCount = res.Balance[3].Value;
          break;
        case "Uncertainty":
          this.repeatCount = res.Balance[4].Value;
          break;
        case "Repetability":
          this.repeatCount = res.Balance[5].Value;
          break;
      }
    });
  }

  // Below function will add weights to selected weights Array
  addWeights() {
    this.standardWeight = this.precalibration.value.standardWeight;
    const weightBox = this.precalibration.value.weightBox;
    const weights = this.precalibration.value.weights;

    const str_arr = weights.split(" ");
    var dbl_weight = str_arr[0];
    var str_identificationNo = str_arr[1].substr(1).slice(0, -1); 

    if (this.standardWeight == null || this.standardWeight == "") {
      swal("Select Standard Weight", "", "error");
    } else if (weightBox == null || weightBox == undefined || weightBox == "") {
      swal("Please Select Weight Box", "", "error");
    } else if (weights == null || weights == undefined || weights == "") {
      swal("Please Select Weight", "", "error");
    } else {
      this.bln_standardWeight = true;
      this.bln_Weights = true;
      this.identificationNo = "";
      
      const weightBoxData = this.sarr_AllweightBoxData.filter(
        x => x.CB_ID == weightBox
      );
      const singleWeightData = weightBoxData.filter(x => x.CB_Wt == dbl_weight);
      const calibrationWeightUnit = singleWeightData[0].CB_unit;
      const weightDp = singleWeightData[0].CB_DP;
      const identificationNo = singleWeightData[0].CB_identificationNo;
      this.sarr_selectedWeights.push({
        weightBox: weightBox,
        weights: dbl_weight,//weights,
        identificationNo: str_identificationNo,//identificationNo,
        calibrationWeightUnit: calibrationWeightUnit,
        Dp:weightDp
      });

      const addedWeights = [];
      for (let i = 0; i < Object.keys(this.sarr_selectedWeights).length; i++) {
        addedWeights.push(parseFloat(this.sarr_selectedWeights[i].weights));
      }
    
      this.precalibration.patchValue({ weightBox: "", weights: "" });
      this.addedsum = addedWeights.reduce((a, b) => a + b, 0);

      if (parseFloat(this.addedsum) > parseFloat(this.standardWeight)) {
        swal("", "Please Select weights within range", "error");
        this.sarr_selectedWeights.splice(-1, 1);
      } else {
        if (parseFloat(this.standardWeight) == parseFloat(this.addedsum)) {
          this.bln_showAddbtn = false;
          this.bln_showSubmitbtn = true;
          this.bln_standardWeight = true;
         
        }
      }
    }
  }

  // Below function will remove the selected weight from Array
  removeSelectedWeights(weight) {
    if (this.sarr_selectedWeights.length == 1) {
      this.bln_standardWeight = false;
      this.bln_showSubmitbtn = false;
      this.bln_showAddbtn = true;
      // this.bln_Weights = false;
      var index = this.sarr_selectedWeights.indexOf(weight);
      this.sarr_selectedWeights.splice(index, 1);
    } else {
      var index = this.sarr_selectedWeights.indexOf(weight);
      this.sarr_selectedWeights.splice(index, 1);
      const addedWeights = [];
      for (let i = 0; i < Object.keys(this.sarr_selectedWeights).length; i++) {
        addedWeights.push(this.sarr_selectedWeights[i].weights);
      }
      this.precalibration.patchValue({ weightBox: "", weights: "" });
      this.addedsum = addedWeights.reduce((a, b) => a + b, 0);
      if (parseFloat(this.standardWeight) != parseFloat(this.addedsum)) {
        this.bln_showAddbtn = true;
        this.bln_showSubmitbtn = false;
      }
      if (parseFloat(this.standardWeight) == parseFloat(this.addedsum)) {
        this.bln_showAddbtn = false;
        this.bln_showSubmitbtn = true;
      }
    }
  }

  //Below function will return Negative & Positive Tolerance based on Selected Equipment Type & ID
  onSelectStandardWeight(selectedStandardWt) {

    this.sarr_selectedWeights = [];

    this.decimalPoint = this.validation.getDPValue(selectedStandardWt.toString());

    if (this.selectedEquipment == "Balance") {
      const selectedBal = this.sarr_allBalanceData.filter(
        x => x.Bal_ID == this.selectedEquipmentID
      );
      const selectedWeights = selectedBal[0].WtDetail;
      const selectedWt = selectedWeights.filter(
        x => x.Bal_StdWt == parseFloat(selectedStandardWt)
      );
      this.positiveTolerance = selectedWt[0].Bal_PosTol;
      this.negativeTolerance = selectedWt[0].Bal_NegTol;
    }
    else if (this.selectedEquipment == "Vernier") {
      const selectedVernier = this.sarr_allVernierData.filter(
        x => x.VernierID == this.selectedEquipmentID
      );
      const selectedWeights = selectedVernier[0].WtDetail;
      const selectedWt = selectedWeights.filter(
        x => x.Ver_StdBlock == selectedStandardWt
      );
      this.positiveTolerance = selectedWt[0].Ver_PosTol;
      this.negativeTolerance = selectedWt[0].Ver_NegTol;
    }
  }

  //Below function will fill the weights data as per Weight Box ID Selection
  onSelectWeightBox(weightId: string) {
    if (this.bln_standardWeight == true) {
      this.bln_Weights = false;
    }
    if (this.bln_standardWeight == false) {
      this.bln_Weights = false;
    }
    this.FilteredWeight = this.sarr_AllweightBoxData.filter(
      x => x.CB_ID == weightId
    );
    this.sarr_weights = [];
    this.calibrationBoxID = this.FilteredWeight[0].CB_ID;
    this.calibrationBoxDate = this.FilteredWeight[0].CB_CalibDt;
    this.calibrationBoxValidityDate = this.FilteredWeight[0].CB_validDt;
    this.calibrationCertificateNo = this.FilteredWeight[0].CB_CertNo;
    const items = [];
    for (let i = 0; i < Object.keys(this.FilteredWeight).length; i++) {
      items.push(parseFloat(this.FilteredWeight[i].CB_Wt).toFixed( this.FilteredWeight[i].CB_DP ) + " (" + this.FilteredWeight[i].CB_identificationNo + ")");

    }
    this.sarr_weights = items;
    // Below code calulates if the weight is already added or not
    const presentWeights = [];

    for (let i = 0; i < Object.keys(this.sarr_selectedWeights).length; i++) {
      presentWeights.push(this.sarr_selectedWeights[i].weights + " (" +  this.sarr_selectedWeights[i].identificationNo + ")");
    }
    this.sarr_weights = this.sarr_weights.filter(
      item => presentWeights.indexOf(item) < 0
    );
  }

  // On Select Weight
  onSelectWeight(weight) {
    const str_arr = weight.split(" ");
    var newString = str_arr[1].substr(1).slice(0, -1); 
    // const selectedWeight = this.FilteredWeight.filter(x => x.CB_Wt == weight);
    this.identificationNo = newString;//selectedWeight[0].CB_identificationNo;
  }

  //On Form Submit store all data in Object & Send to Node Server to save in DB
  onFormSubmit() {
    this.refresh();
    this.onSelectCalibrationType(this.precalibration.value.calibrationType);
    this.precalibration.patchValue({ weights: this.sarr_selectedWeights });
    const data: Object = {};
    const calibrationBoxDate = this.datePipe.transform(
      this.calibrationBoxDate,
      "yyyy-MM-dd"
    );
    const calibrationBoxValidityDate = this.datePipe.transform(
      this.calibrationBoxValidityDate,
      "yyyy-MM-dd"
    );
    Object.assign(
      data,
      this.precalibration.value,
      { cubicleName: this.cublicleName },
      { cublicleNo: this.cublicleNo },
      { equipmentType: this.selectedEquipment },
      { equipmentID: this.selectedEquipmentID },
      { positiveTolerance: this.positiveTolerance },
      { negativeTolerance: this.negativeTolerance },
      { calibrationBoxID: this.calibrationBoxID },
      { calibrationBoxDate: calibrationBoxDate },
      { calibrationBoxValidityDate: calibrationBoxValidityDate },
      { calibrationCertificateNo: this.calibrationCertificateNo },
      { percentageOfCapacity: 0 },
      { repeatCount: this.repeatCount },
      { decimalPoint: this.decimalPoint }
    );
 console.log(data)
    this.http.postMethod("precalibration/storePrecalibration", data).subscribe(
      (res: any) => {
        // Fetch New Data
        this.getWeighmentData();
        this.onSelectCalibrationType(this.precalibration.value.calibrationType);
        this.bln_showAddbtn = true;
        this.bln_showSubmitbtn = false;
        this.bln_standardWeight = false;
        //this.sarr_selectedWeights = [];
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }

  //This will return weightment Data for Selected Equipent & Calibration Type
  getWeighmentData() {
    const weightdata = {
      calibrationType: this.precalibration.value.calibrationType,
      equipmentId: this.selectedEquipmentID,
      type: "GET",
      standardWeight: ""
    };
    this.http
      .postMethod(
        "precalibration/handledWeighmentPrecalibrationData",
        weightdata
      )
      .subscribe(
        (res: any) => {
          this.sarr_weighmentData = [];
          this.sarr_weighmentData = res.result;
        },
        err => {
          this.errorHandling.checkError(err.status);
          this.bln_loading = false;
        }
      );
    return this.sarr_weighmentData;
  }

  // Removed Selected Weight
  removeWeightmentData(weightDetail) {
    const data = {
      calibrationType: this.precalibration.value.calibrationType,
      equipmentId: weightDetail.Equipment_ID,
      type: "REMOVE",
      standardWeight: weightDetail.Standard_Weight_Block
    };
    this.http
      .postMethod("precalibration/handledWeighmentPrecalibrationData", data)
      .subscribe(
        (res: any) => {
          // Fetch New Data
          this.getWeighmentData();
          this.onSelectCalibrationType(this.precalibration.value.calibrationType);
        },
        err => {
          this.errorHandling.checkError(err.status);
          this.bln_loading = false;
        }
      );
    return this.sarr_weighmentData;
  }

  // Below function will refresh & give us the weights cureently stored in the database
  refresh() {
    this.getWeighmentData();
  }

  ngOnInit() {}
}
