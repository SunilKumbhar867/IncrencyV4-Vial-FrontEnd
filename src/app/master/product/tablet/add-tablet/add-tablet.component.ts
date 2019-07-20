import { Component, OnInit, Output } from "@angular/core";
import { DataService } from "../../../../services/commonData/data.service";
import { JsonDataService } from "../../../../services/commonData/json-data.service";
import
{
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
  FormControl
} from "@angular/forms";
import { ValidationService } from "../../../../services/validations/validation.service";
import { MatDialog } from "@angular/material";
import { RemarkComponent } from "../../../../shared/remark/remark/remark.component";
import { SessionStorageService } from "ngx-webstorage";
import { HttpService } from "../../../../services/http/http.service";
import
{
  NgbPanelChangeEvent,
  NgbTabChangeEvent
} from "@ng-bootstrap/ng-bootstrap";
import { ErrorHandlingService } from "../../../../services/error-handling/error-handling.service";
import { UserService } from "../../../../services/user/user.service";

declare var swal: any;

@Component({
  selector: "app-add-tablet",
  templateUrl: "./add-tablet.component.html",
  styleUrls: ["./add-tablet.component.css"]
})
export class AddTabletComponent implements OnInit
{
  // Variables declares for Nomecaltures of Product BFG Code & Product Name
  str_LblBFGCode: string = "";
  str_LblProductName: string = "";

  str_TxtBFGCode: string = "";
  str_TxtPrdName: string = "";
  str_TxtPrdVerNo: string = "";
  str_TxtVerNo: string = "";

  // Variable declare for Unit of Individual Parameter
  str_IndUnit: string = "";

  // Variable declare for Batch Filed Visibility
  str_BatchSizeVisibility: any = "";

  // Variable declare for Bin Weighing Checkbox Visibility
  str_BinWeighingVisibility: any = "";

  // Variable declare for Units Showing
  sarr_getUnitList: Array<any> = [];
  sarr_getHrdUnitFromJson: Array<any> = [];

  // Variable declare for storing Selected According Name
  sarr_getSelectedParamAccName: Array<any> = [];

  sarr_getSelCompressParamAccName: Array<any> = [];

  sarr_getSelCoatParamAccName: Array<any> = [];

  // Variable declare for textfiled enabled/disabled of Product BFG Code, Product Version & Version
  bln_disableTextFld_BFG: boolean = true;
  bln_disableTextFld_PrdVersion: boolean = true;
  bln_disableTextFld_Version: boolean = true;

  // Variable declare for textfiled enabled/disabled of Product BFG Code, Product Version & Version
  bln_disTxtFldsIfIndT1Zero: boolean = false;
  bln_disTxtFldsIfGrpT1Zero: boolean = false;

  bln_disTxtFldsIfThkT1Zero: boolean = false;
  bln_disTxtFldsIfBrdT1Zero: boolean = false;
  bln_disTxtFldsIfLenT1Zero: boolean = false;
  bln_disTxtFldsIfDiaT1Zero: boolean = false;

  bln_disTxtFldsIfIndL1T1Zero: boolean = false;
  bln_disTxtFldsIfGrpL1T1Zero: boolean = false;

  bln_disTxtFldsIfIndL2T1Zero: boolean = false;
  bln_disTxtFldsIfGrpL2T1Zero: boolean = false;

  bln_disTxtFldsIfIndCoatT1Zero: boolean = false;
  bln_disTxtFldsIfGrpCoatT1Zero: boolean = false;

  bln_disTxtFldsIfThkCoatT1Zero: boolean = false;
  bln_disTxtFldsIfBrdCoatT1Zero: boolean = false;
  bln_disTxtFldsIfLenCoatT1Zero: boolean = false;
  bln_disTxtFldsIfDiaCoatT1Zero: boolean = false;

  // Variable declare for accordion checked/uncheked Value of Layers Parameters
  bln_selAccIndLay1Param: boolean = false;
  bln_selAccGrpLay1Param: boolean = false;

  bln_selAccIndLay2Param: boolean = false;
  bln_selAccGrpLay2Param: boolean = false;

  bln_biLayerLabel: boolean = false;
  bln_triLayerLabel: boolean = false;
  bln_ChkTypeCompressedProduct: boolean = true;
  bln_isCompressed: boolean = true;
  // Variable declare for setting boolen values if all Valid Parameters Entered
  bln_accParamValid: boolean = false;

  // Variable declare for storing Graph Types
  sarr_GraphType = ["Standard", "Average"];

  // Variable declare for storing Limit Types
  sarr_LimitType = ["Actual", "Percentage"];

  // Variable declare for Batch Units
  sarr_getBatchUnit = ["Lakh", "Million", "Thousand"];
  sarr_nominalNomenclature = ["Standard", "Target"];
  // Variable declare for showing Loader
  public bln_Loading = false;

  // Variable declare for Modal Pop Up according to condition
  bln_IsPopupOpened = true;

  // Variable declare for showing/hinding Layer's According Parameter boolean flag
  bln_ChkTypeBiLayPrd = false;
  bln_ChkTypeTriLayPrd = false;
  bln_ChkTypeCoatPrd = false;
  bln_ChkTypeGrannualPrd = false;
  bln_ChkTypeCoated = false;
  // Variable declare for storing Product Added API response
  obj_GetPrdAddRes: any;

  activeIds: string[] = [];

  obj_PrdDetails: any;
  sarr_PrdDetails: Array<string> = [];

  bln_hideChkTxtFld_BFG: boolean = false;
  bln_hideChkTxtFld_PrdVer: boolean = false;
  bln_hideChkTxtFld_Ver: boolean = false;

  addTabletForm: FormGroup;
  auditObject: any;

  sarr_BFGID: Array<string> = [];
  sarr_prdName: Array<string> = [];
  sarr_prdVersion: Array<string> = [];
  sarr_version: Array<string> = [];

  constructor(
    private dataService?: DataService,
    private jsonService?: JsonDataService,
    private fb?: FormBuilder,
    private validation?: ValidationService,
    private dialog?: MatDialog,
    private sessionStorage?: SessionStorageService,
    private errorHandling?: ErrorHandlingService,
    private http?: HttpService,
    private userService?: UserService
  )
  {
    // This service will check whether the user has right to view that page or not, If not it will redirect user to Home Page
    this.userService.checkRights("Add Product");
    this.addTabletForm = this.fb.group({
      str_BFGCode: [
        "NA",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      str_Prd: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      str_PV: [
        "NA",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      str_V: [
        "NA",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      flt_BatchSize: [
        "0",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      str_BatchUnit: [
        "Lakh",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      nominalNomenclature: [
        "",
        Validators.compose([this.validation.requiredField])
      ],

      biLayerLabel: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      triLayerLabel: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],
      bln_TypeCompressed: [true],
      bln_TypeCoatPrd: [false],

      bln_TypeGrannualPrd: [false],

      bln_TypeBiLayPrd: [false],

      bln_TypeTriLayPrd: [false],

      bln_IsBinWeiging: [false],

      flt_IndStd: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      flt_IndT1Neg: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      flt_IndT1Pos: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_IndT1Neg",
            "Individual",
            "1",
            "Positive",
            "Zero"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_IndT1Neg",
            "Individual",
            "1",
            "Positive",
            "Yes"
          )
        ])
      ],

      flt_IndT2Neg: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_IndT1Neg",
            "Individual",
            "2",
            "Negative",
            "No"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_IndStd",
            "Individual",
            "3",
            "Positive",
            "No"
          )
        ])
      ],

      flt_IndT2Pos: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_IndT1Pos",
            "Individual",
            "2",
            "Positive",
            "No"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_IndT2Neg",
            "Individual",
            "2",
            "Positive",
            "Yes"
          )
        ])
      ],

      str_IndLimitOn: ["Actual", Validators.compose([Validators.required])],

      str_IndGraphOn: ["Standard", Validators.compose([Validators.required])],

      int_IndNMTTabCnt: [
        "",
        Validators.compose([this.validation.requiredField])
      ],

      flt_GrpStd: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      flt_GrpT1Neg: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      flt_GrpT1Pos: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_GrpT1Neg",
            "Group",
            "1",
            "Positive",
            "Zero"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_GrpT1Neg",
            "Group",
            "1",
            "Positive",
            "Yes"
          )
        ])
      ],

      flt_GrpT2Neg: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_GrpT1Neg",
            "Group",
            "2",
            "Negative",
            "No"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_GrpStd",
            "Group",
            "3",
            "Negative",
            "No"
          )
        ])
      ],

      flt_GrpT2Pos: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_GrpT1Pos",
            "Group",
            "2",
            "Positive",
            "No"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_GrpT2Neg",
            "Group",
            "2",
            "Positive",
            "Yes"
          )
        ])
      ],

      str_GrpLimitOn: ["Actual", Validators.compose([Validators.required])],

      str_GrpGraphOn: ["Standard", Validators.compose([Validators.required])],

      int_GrpNMTTabCnt: [
        "",
        Validators.compose([this.validation.requiredField])
      ],

      flt_ThkStd: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      flt_ThkT1Neg: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      flt_ThkT1Pos: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_ThkT1Neg",
            "Dimension",
            "1",
            "Positive",
            "Zero"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_ThkT1Neg",
            "Dimension",
            "1",
            "Positive",
            "Yes"
          )
        ])
      ],

      flt_ThkT2Neg: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_ThkT1Neg",
            "Dimension",
            "2",
            "Negative",
            "No"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_ThkStd",
            "Dimension",
            "3",
            "Negative",
            "No"
          )
        ])
      ],

      flt_ThkT2Pos: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_ThkT1Pos",
            "Dimension",
            "2",
            "Positive",
            "No"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_ThkT2Neg",
            "Dimension",
            "2",
            "Positive",
            "Yes"
          )
        ])
      ],

      int_ThkNMTTabCnt: [
        "",
        Validators.compose([this.validation.requiredField])
      ],

      flt_BrdStd: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      flt_BrdT1Neg: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      flt_BrdT1Pos: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_BrdT1Neg",
            "Dimension",
            "1",
            "Positive",
            "Zero"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_BrdT1Neg",
            "Dimension",
            "1",
            "Positive",
            "Yes"
          )
        ])
      ],

      flt_BrdT2Neg: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_BrdT1Neg",
            "Dimension",
            "2",
            "Negative",
            "No"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_BrdStd",
            "Dimension",
            "3",
            "Negative",
            "No"
          )
        ])
      ],

      flt_BrdT2Pos: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_BrdT1Pos",
            "Dimension",
            "2",
            "Positive",
            "No"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_BrdT2Neg",
            "Dimension",
            "2",
            "Positive",
            "Yes"
          )
        ])
      ],

      int_BrdNMTTabCnt: [
        "",
        Validators.compose([this.validation.requiredField])
      ],

      flt_LenStd: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      flt_LenT1Neg: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      flt_LenT1Pos: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_LenT1Neg",
            "Dimension",
            "1",
            "Positive",
            "Zero"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_LenT1Neg",
            "Dimension",
            "1",
            "Positive",
            "Yes"
          )
        ])
      ],

      flt_LenT2Neg: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_LenT1Neg",
            "Dimension",
            "2",
            "Negative",
            "No"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_LenStd",
            "Dimension",
            "3",
            "Negative",
            "No"
          )
        ])
      ],

      flt_LenT2Pos: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_LenT1Pos",
            "Dimension",
            "2",
            "Positive",
            "No"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_LenT2Neg",
            "Dimension",
            "2",
            "Positive",
            "Yes"
          )
        ])
      ],

      int_LenNMTTabCnt: [
        "",
        Validators.compose([this.validation.requiredField])
      ],

      flt_DiaStd: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      flt_DiaT1Neg: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      flt_DiaT1Pos: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_DiaT1Neg",
            "Dimension",
            "1",
            "Positive",
            "Zero"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_DiaT1Neg",
            "Dimension",
            "1",
            "Positive",
            "Yes"
          )
        ])
      ],

      flt_DiaT2Neg: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_DiaT1Neg",
            "Dimension",
            "2",
            "Negative",
            "No"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_DiaStd",
            "Dimension",
            "3",
            "Negative",
            "No"
          )
        ])
      ],

      flt_DiaT2Pos: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_DiaT1Pos",
            "Dimension",
            "2",
            "Positive",
            "No"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_DiaT2Neg",
            "Dimension",
            "2",
            "Positive",
            "Yes"
          )
        ])
      ],

      int_DiaNMTTabCnt: [
        "",
        Validators.compose([this.validation.requiredField])
      ],

      flt_HrdStd: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      flt_HrdT1: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      flt_HrdT2: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_HrdT1",
            "Hardness",
            "2",
            "Positive",
            "No"
          )
        ])
      ],

      str_HrdUnit: ["Kp", Validators.compose([Validators.required])],

      str_HrdGraphOn: ["Standard", Validators.compose([Validators.required])],

      flt_FriNMT: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      int_FriSetCnt: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      int_FriSetRPM: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      int_DTHHTime: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      int_DTMMTime: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      int_DTSSTime: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "int_DTMMTime",
            "Disintegration Test",
            "1",
            "Positive",
            "No"
          )
        ])
      ],

      flt_DTMinTemp: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      flt_DTMaxTemp: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_DTMinTemp",
            "Disintegration Test",
            "2",
            "Positive",
            "No"
          )
        ])
      ],

      flt_TDT1: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      flt_TDT2: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_TDT1",
            "Tapped Density",
            "1",
            "Positive",
            "No"
          )
        ])
      ],

      flt_MAT1: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      flt_MAT2: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_MAT1",
            "Moisure Analyzer",
            "2",
            "Positive",
            "No"
          )
        ])
      ],

      flt_SST1: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      flt_SST2: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_SST1",
            "Sieve Shaker",
            "1",
            "Positive",
            "No"
          )
        ])
      ],

      flt_IndL1Std: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      flt_IndL1T1Neg: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      flt_IndL1T1Pos: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_IndL1T1Neg",
            "Individual Layer1",
            "1",
            "Positive",
            "Zero"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_IndL1T1Neg",
            "Individual Layer1",
            "1",
            "Positive",
            "Yes"
          )
        ])
      ],

      flt_IndL1T2Neg: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_IndL1T1Neg",
            "Individual Layer1",
            "2",
            "Negative",
            "No"
          )
        ])
      ],

      flt_IndL1T2Pos: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_IndL1T1Pos",
            "Individual Layer1",
            "2",
            "Positive",
            "No"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_IndL1T2Neg",
            "Individual Layer1",
            "2",
            "Positive",
            "Yes"
          )
        ])
      ],

      str_IndL1LimitOn: ["Actual", Validators.compose([Validators.required])],

      str_IndL1GraphOn: ["Standard", Validators.compose([Validators.required])],

      int_IndL1NMTTabCount: [
        "",
        Validators.compose([this.validation.requiredField])
      ],

      flt_GrpL1Std: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      flt_GrpL1T1Neg: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      flt_GrpL1T1Pos: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_GrpL1T1Neg",
            "Group Layer1",
            "1",
            "Positive",
            "Zero"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_GrpL1T1Neg",
            "Group Layer1",
            "1",
            "Positive",
            "Yes"
          )
        ])
      ],

      flt_GrpL1T2Neg: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_GrpL1T1Neg",
            "Group Layer1",
            "2",
            "Negative",
            "No"
          )
        ])
      ],

      flt_GrpL1T2Pos: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_GrpL1T1Pos",
            "Group Layer1",
            "2",
            "Positive",
            "No"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_GrpL1T2Neg",
            "Group Layer1",
            "2",
            "Positive",
            "Yes"
          )
        ])
      ],

      str_GrpL1LimitOn: ["Actual", Validators.compose([Validators.required])],

      str_GrpL1GraphOn: ["Standard", Validators.compose([Validators.required])],

      int_GrpL1NMTTabCount: [
        "",
        Validators.compose([this.validation.requiredField])
      ],

      flt_IndL2Std: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      flt_IndL2T1Neg: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      flt_IndL2T1Pos: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_IndL2T1Neg",
            "Individual Layer2",
            "1",
            "Positive",
            "Zero"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_IndL2T1Neg",
            "Individual Layer2",
            "1",
            "Positive",
            "Yes"
          )
        ])
      ],

      flt_IndL2T2Neg: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_IndL2T1Neg",
            "Individual Layer2",
            "2",
            "Negative",
            "No"
          )
        ])
      ],

      flt_IndL2T2Pos: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_GrpL1T1Pos",
            "Individual Layer2",
            "2",
            "Positive",
            "No"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_GrpL1T2Neg",
            "Individual Layer2",
            "2",
            "Positive",
            "Yes"
          )
        ])
      ],

      str_IndL2LimitOn: ["Actual", Validators.compose([Validators.required])],

      str_IndL2GraphOn: ["Standard", Validators.compose([Validators.required])],

      int_IndL2NMTTabCount: [
        "",
        Validators.compose([this.validation.requiredField])
      ],

      flt_GrpL2Std: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      flt_GrpL2T1Neg: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      flt_GrpL2T1Pos: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_GrpL2T1Neg",
            "Group Layer2",
            "1",
            "Positive",
            "Zero"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_GrpL2T1Neg",
            "Group Layer2",
            "1",
            "Positive",
            "Yes"
          )
        ])
      ],

      flt_GrpL2T2Neg: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_GrpL2T1Neg",
            "Group Layer2",
            "2",
            "Negative",
            "No"
          )
        ])
      ],

      flt_GrpL2T2Pos: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_GrpL2T1Pos",
            "Group Layer2",
            "2",
            "Positive",
            "No"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_GrpL2T2Neg",
            "Group Layer2",
            "2",
            "Positive",
            "Yes"
          )
        ])
      ],

      str_GrpL2LimitOn: ["Actual", Validators.compose([Validators.required])],

      str_GrpL2GraphOn: ["Standard", Validators.compose([Validators.required])],

      int_GrpL2NMTTabCount: [
        "",
        Validators.compose([this.validation.requiredField])
      ],

      flt_IndStdCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      flt_IndT1NegCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      flt_IndT1PosCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_IndT1NegCoat",
            "Individual",
            "1",
            "Positive",
            "Zero"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_IndT1NegCoat",
            "Individual",
            "1",
            "Positive",
            "Yes"
          )
        ])
      ],

      flt_IndT2NegCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_IndT1NegCoat",
            "Individual",
            "2",
            "Negative",
            "No"
          )
        ])
      ],

      flt_IndT2PosCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_IndT1PosCoat",
            "Individual",
            "2",
            "Positive",
            "No"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_IndT2NegCoat",
            "Individual",
            "2",
            "Positive",
            "Yes"
          )
        ])
      ],

      str_IndLimitOnCoat: ["Actual", Validators.compose([Validators.required])],

      str_IndGraphOnCoat: [
        "Standard",
        Validators.compose([Validators.required])
      ],

      int_IndNMTTabCntCoat: [
        "",
        Validators.compose([this.validation.requiredField])
      ],

      flt_GrpStdCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      flt_GrpT1NegCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      flt_GrpT1PosCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_GrpT1NegCoat",
            "Group",
            "1",
            "Positive",
            "Zero"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_GrpT1NegCoat",
            "Group",
            "1",
            "Positive",
            "Yes"
          )
        ])
      ],

      flt_GrpT2NegCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_GrpT1NegCoat",
            "Group",
            "2",
            "Negative",
            "No"
          )
        ])
      ],

      flt_GrpT2PosCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_GrpT1PosCoat",
            "Group",
            "2",
            "Positive",
            "No"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_GrpT2NegCoat",
            "Group",
            "2",
            "Positive",
            "Yes"
          )
        ])
      ],

      str_GrpLimitOnCoat: ["Actual", Validators.compose([Validators.required])],

      str_GrpGraphOnCoat: [
        "Standard",
        Validators.compose([Validators.required])
      ],

      int_GrpNMTTabCntCoat: [
        "",
        Validators.compose([this.validation.requiredField])
      ],

      flt_ThkStdCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      flt_ThkT1NegCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      flt_ThkT1PosCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_ThkT1NegCoat",
            "Dimension",
            "1",
            "Positive",
            "Zero"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_ThkT1NegCoat",
            "Dimension",
            "1",
            "Positive",
            "Yes"
          )
        ])
      ],

      flt_ThkT2NegCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_ThkT1NegCoat",
            "Dimension",
            "2",
            "Negative",
            "No"
          )
        ])
      ],

      flt_ThkT2PosCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_ThkT1PosCoat",
            "Dimension",
            "2",
            "Positive",
            "No"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_ThkT2NegCoat",
            "Dimension",
            "2",
            "Positive",
            "Yes"
          )
        ])
      ],

      int_ThkNMTTabCntCoat: [
        "",
        Validators.compose([this.validation.requiredField])
      ],

      flt_BrdStdCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      flt_BrdT1NegCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      flt_BrdT1PosCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_BrdT1NegCoat",
            "Dimension",
            "1",
            "Positive",
            "Zero"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_BrdT1NegCoat",
            "Dimension",
            "1",
            "Positive",
            "Yes"
          )
        ])
      ],

      flt_BrdT2NegCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_BrdT1NegCoat",
            "Dimension",
            "2",
            "Negative",
            "No"
          )
        ])
      ],

      flt_BrdT2PosCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_BrdT1PosCoat",
            "Dimension",
            "2",
            "Positive",
            "No"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_BrdT2NegCoat",
            "Dimension",
            "2",
            "Positive",
            "Yes"
          )
        ])
      ],

      int_BrdNMTTabCntCoat: [
        "",
        Validators.compose([this.validation.requiredField])
      ],

      flt_LenStdCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      flt_LenT1NegCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      flt_LenT1PosCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_LenT1NegCoat",
            "Dimension",
            "1",
            "Positive",
            "Zero"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_LenT1NegCoat",
            "Dimension",
            "1",
            "Positive",
            "Yes"
          )
        ])
      ],

      flt_LenT2NegCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_LenT1NegCoat",
            "Dimension",
            "2",
            "Negative",
            "No"
          )
        ])
      ],

      flt_LenT2PosCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_LenT1PosCoat",
            "Dimension",
            "2",
            "Positive",
            "No"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_LenT2NegCoat",
            "Dimension",
            "2",
            "Positive",
            "Yes"
          )
        ])
      ],

      int_LenNMTTabCntCoat: [
        "",
        Validators.compose([this.validation.requiredField])
      ],

      flt_DiaStdCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      flt_DiaT1NegCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      flt_DiaT1PosCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_DiaT1NegCoat",
            "Dimension",
            "1",
            "Positive",
            "Zero"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_DiaT1NegCoat",
            "Dimension",
            "1",
            "Positive",
            "Yes"
          )
        ])
      ],

      flt_DiaT2NegCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_DiaT1NegCoat",
            "Dimension",
            "2",
            "Negative",
            "No"
          )
        ])
      ],

      flt_DiaT2PosCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_DiaT1PosCoat",
            "Dimension",
            "2",
            "Positive",
            "No"
          ),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_DiaT2NegCoat",
            "Dimension",
            "2",
            "Positive",
            "Yes"
          )
        ])
      ],

      int_DiaNMTTabCntCoat: [
        "",
        Validators.compose([this.validation.requiredField])
      ],

      flt_HrdStdCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      flt_HrdT1Coat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      flt_HrdT2Coat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_HrdT1Coat",
            "Hardness",
            "2",
            "Positive",
            "Yes"
          )
        ])
      ],

      str_HrdUnitCoat: ["Kp", Validators.compose([Validators.required])],

      str_HrdGraphOnCoat: [
        "Standard",
        Validators.compose([Validators.required])
      ],

      flt_FriNMTCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      int_FriSetCntCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      int_FriSetRPMCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      int_DTHHTimeCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      int_DTMMTimeCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])
      ],

      int_DTSSTimeCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "int_DTMMTimeCoat",
            "Disintegration Test",
            "1",
            "Positive",
            "Yes"
          )
        ])
      ],
      flt_DTMinTempCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])
      ],

      flt_DTMaxTempCoat: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_DTMinTempCoat",
            "Disintegration Test",
            "2",
            "Positive",
            "No"
          )
        ])
      ],

      /***Grannual */
      flt_CompDryMin: ["", Validators.compose([this.validation.requiredField])],

      flt_CompDryMax: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_CompDryMin",
            "LOD Compressed Dry",
            "1",
            "Positive",
            "No"
          )
        ])
      ],

      flt_CompLubMin: ["", Validators.compose([this.validation.requiredField])],

      flt_CompLubMax: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_CompLubMin",
            "LOD Compressed Lubricated",
            "1",
            "Positive",
            "No"
          )
        ])
      ],

      flt_Layer1DryMin: [
        "",
        Validators.compose([this.validation.requiredField])
      ],

      flt_Layer1DryMax: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_Layer1DryMin",
            "LOD Layer1 Dry",
            "1",
            "Positive",
            "No"
          )
        ])
      ],

      flt_Layer1LubMin: [
        "",
        Validators.compose([this.validation.requiredField])
      ],

      flt_Layer1LubMax: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_Layer1LubMin",
            "LOD Layer 1 Lubricated",
            "1",
            "Positive",
            "No"
          )
        ])
      ],

      flt_Layer2DryMin: [
        "",
        Validators.compose([this.validation.requiredField])
      ],

      flt_Layer2DryMax: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_Layer2DryMin",
            "LOD Layer2 Dry",
            "1",
            "Positive",
            "No"
          )
        ])
      ],

      flt_Layer2LubMin: [
        "",
        Validators.compose([this.validation.requiredField])
      ],

      flt_Layer2LubMax: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_Layer2LubMin",
            "LOD Layer 2 Lubricated",
            "1",
            "Positive",
            "No"
          )
        ])
      ],

      flt_TapDenMin: ["", Validators.compose([this.validation.requiredField])],

      flt_TapDenMax: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_TapDenMin",
            "Tap Density",
            "1",
            "Positive",
            "No"
          )
        ])
      ],

      flt_FineMin: ["", Validators.compose([this.validation.requiredField])],

      flt_FineMax: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_FineMin",
            "% Fine",
            "1",
            "Positive",
            "No"
          )
        ])
      ],

      flt_PartSizingMin: [
        "",
        Validators.compose([this.validation.requiredField])
      ],

      flt_PartSizingMax: [
        "",
        Validators.compose([
          this.validation.requiredField,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator(
            "flt_PartSizingMin",
            "Particle Sizing",
            "1",
            "Positive",
            "No"
          )
        ])
      ]
      /***End Of Grannual */
    });

    this.addTabletForm.controls.str_IndGraphOn.valueChanges.subscribe(x =>
      this.addTabletForm.controls.flt_IndT1Neg.updateValueAndValidity()
    );

    this.addTabletForm.controls.str_IndGraphOn.valueChanges.subscribe(x =>
      this.addTabletForm.controls.flt_IndT1Pos.updateValueAndValidity()
    );

    this.addTabletForm.controls.int_DTHHTime.valueChanges.subscribe(x =>
      this.addTabletForm.controls.int_DTSSTime.updateValueAndValidity()
    );

    this.addTabletForm.controls.int_DTHHTimeCoat.valueChanges.subscribe(x =>
      this.addTabletForm.controls.int_DTSSTimeCoat.updateValueAndValidity()
    );
  }

  get str_BFGCode()
  {
    return this.addTabletForm.get("str_BFGCode");
  }
  get str_Prd()
  {
    return this.addTabletForm.get("str_Prd");
  }
  get str_PV()
  {
    return this.addTabletForm.get("str_PV");
  }
  get str_V()
  {
    return this.addTabletForm.get("str_V");
  }

  get flt_BatchSize()
  {
    return this.addTabletForm.get("flt_BatchSize");
  }
  get str_BatchUnit()
  {
    return this.addTabletForm.get("str_BatchUnit");
  }

  get nominalNomenclature()
  {
    return this.addTabletForm.get("nominalNomenclature");
  }

  get biLayerLabel()
  {
    return this.addTabletForm.get("biLayerLabel");
  }

  get triLayerLabel()
  {
    return this.addTabletForm.get("triLayerLabel");
  }

  get bln_TypeCoatPrd()
  {
    return this.addTabletForm.get("bln_TypeCoatPrd");
  }

  get bln_TypeCompressed()
  {
    return this.addTabletForm.get("bln_TypeCompressed");
  }

  get bln_TypeBiLayPrd()
  {
    return this.addTabletForm.get("bln_TypeBiLayPrd");
  }
  get bln_TypeTriLayPrd()
  {
    return this.addTabletForm.get("bln_TypeTriLayPrd");
  }
  get bln_TypeGrannualPrd()
  {
    return this.addTabletForm.get("bln_TypeGrannualPrd");
  }

  get bln_Tolerance1()
  {
    return this.addTabletForm.get("bln_Tolerance1");
  }
  get bln_Tolerance2()
  {
    return this.addTabletForm.get("bln_Tolerance2");
  }

  get bln_IsBinWeiging()
  {
    return this.addTabletForm.get("bln_IsBinWeiging");
  }

  get flt_IndStd()
  {
    return this.addTabletForm.get("flt_IndStd");
  }
  get flt_IndT1Neg()
  {
    return this.addTabletForm.get("flt_IndT1Neg");
  }
  get flt_IndT1Pos()
  {
    return this.addTabletForm.get("flt_IndT1Pos");
  }
  get flt_IndT2Neg()
  {
    return this.addTabletForm.get("flt_IndT2Neg");
  }
  get flt_IndT2Pos()
  {
    return this.addTabletForm.get("flt_IndT2Pos");
  }
  get str_IndGraphOn()
  {
    return this.addTabletForm.get("str_IndGraphOn");
  }
  get str_IndLimitOn()
  {
    return this.addTabletForm.get("str_IndLimitOn");
  }
  get int_IndNMTTabCnt()
  {
    return this.addTabletForm.get("int_IndNMTTabCnt");
  }

  get flt_GrpStd()
  {
    return this.addTabletForm.get("flt_GrpStd");
  }
  get flt_GrpT1Pos()
  {
    return this.addTabletForm.get("flt_GrpT1Pos");
  }
  get flt_GrpT1Neg()
  {
    return this.addTabletForm.get("flt_GrpT1Neg");
  }
  get flt_GrpT2Neg()
  {
    return this.addTabletForm.get("flt_GrpT2Neg");
  }
  get flt_GrpT2Pos()
  {
    return this.addTabletForm.get("flt_GrpT2Pos");
  }
  get str_GrpGraphOn()
  {
    return this.addTabletForm.get("str_GrpGraphOn");
  }
  get str_GrpLimitOn()
  {
    return this.addTabletForm.get("str_GrpLimitOn");
  }
  get int_GrpNMTTabCnt()
  {
    return this.addTabletForm.get("int_GrpNMTTabCnt");
  }

  get flt_ThkStd()
  {
    return this.addTabletForm.get("flt_ThkStd");
  }
  get flt_ThkT1Pos()
  {
    return this.addTabletForm.get("flt_ThkT1Pos");
  }
  get flt_ThkT1Neg()
  {
    return this.addTabletForm.get("flt_ThkT1Neg");
  }
  get flt_ThkT2Neg()
  {
    return this.addTabletForm.get("flt_ThkT2Neg");
  }
  get flt_ThkT2Pos()
  {
    return this.addTabletForm.get("flt_ThkT2Pos");
  }
  get int_ThkNMTTabCnt()
  {
    return this.addTabletForm.get("int_ThkNMTTabCnt");
  }

  get flt_BrdStd()
  {
    return this.addTabletForm.get("flt_BrdStd");
  }
  get flt_BrdT1Pos()
  {
    return this.addTabletForm.get("flt_BrdT1Pos");
  }
  get flt_BrdT1Neg()
  {
    return this.addTabletForm.get("flt_BrdT1Neg");
  }
  get flt_BrdT2Neg()
  {
    return this.addTabletForm.get("flt_BrdT2Neg");
  }
  get flt_BrdT2Pos()
  {
    return this.addTabletForm.get("flt_BrdT2Pos");
  }
  get int_BrdNMTTabCnt()
  {
    return this.addTabletForm.get("int_BrdNMTTabCnt");
  }

  get flt_DTMinTemp()
  {
    return this.addTabletForm.get("flt_DTMinTemp");
  }

  get flt_DTMaxTemp()
  {
    return this.addTabletForm.get("flt_DTMaxTemp");
  }

  get flt_LenStd()
  {
    return this.addTabletForm.get("flt_LenStd");
  }
  get flt_LenT1Pos()
  {
    return this.addTabletForm.get("flt_LenT1Pos");
  }
  get flt_LenT1Neg()
  {
    return this.addTabletForm.get("flt_LenT1Neg");
  }
  get flt_LenT2Neg()
  {
    return this.addTabletForm.get("flt_LenT2Neg");
  }
  get flt_LenT2Pos()
  {
    return this.addTabletForm.get("flt_LenT2Pos");
  }
  get int_LenNMTTabCnt()
  {
    return this.addTabletForm.get("int_LenNMTTabCnt");
  }

  get flt_DiaStd()
  {
    return this.addTabletForm.get("flt_DiaStd");
  }
  get flt_DiaT1Neg()
  {
    return this.addTabletForm.get("flt_DiaT1Neg");
  }
  get flt_DiaT1Pos()
  {
    return this.addTabletForm.get("flt_DiaT1Pos");
  }
  get flt_DiaT2Neg()
  {
    return this.addTabletForm.get("flt_DiaT2Neg");
  }
  get flt_DiaT2Pos()
  {
    return this.addTabletForm.get("flt_DiaT2Pos");
  }
  get int_DiaNMTTabCnt()
  {
    return this.addTabletForm.get("int_DiaNMTTabCnt");
  }

  get flt_HrdStd()
  {
    return this.addTabletForm.get("flt_HrdStd");
  }
  get flt_HrdT1()
  {
    return this.addTabletForm.get("flt_HrdT1");
  }
  get flt_HrdT2()
  {
    return this.addTabletForm.get("flt_HrdT2");
  }
  get str_HrdUnit()
  {
    return this.addTabletForm.get("str_HrdUnit");
  }
  get str_HrdGraphOn()
  {
    return this.addTabletForm.get("str_HrdGraphOn");
  }

  get flt_FriNMT()
  {
    return this.addTabletForm.get("flt_FriNMT");
  }
  get int_FriSetCnt()
  {
    return this.addTabletForm.get("int_FriSetCnt");
  }
  get int_FriSetRPM()
  {
    return this.addTabletForm.get("int_FriSetRPM");
  }

  get int_DTHHTime()
  {
    return this.addTabletForm.get("int_DTHHTime");
  }
  get int_DTMMTime()
  {
    return this.addTabletForm.get("int_DTMMTime");
  }
  get int_DTSSTime()
  {
    return this.addTabletForm.get("int_DTSSTime");
  }

  get flt_TDT1()
  {
    return this.addTabletForm.get("flt_TDT1");
  }
  get flt_TDT2()
  {
    return this.addTabletForm.get("flt_TDT2");
  }

  get flt_MAT1()
  {
    return this.addTabletForm.get("flt_MAT1");
  }
  get flt_MAT2()
  {
    return this.addTabletForm.get("flt_MAT2");
  }

  get flt_SST1()
  {
    return this.addTabletForm.get("flt_SST1");
  }
  get flt_SST2()
  {
    return this.addTabletForm.get("flt_SST2");
  }

  get flt_IndL1Std()
  {
    return this.addTabletForm.get("flt_IndL1Std");
  }
  get flt_IndL1T1Neg()
  {
    return this.addTabletForm.get("flt_IndL1T1Neg");
  }
  get flt_IndL1T1Pos()
  {
    return this.addTabletForm.get("flt_IndL1T1Pos");
  }
  get flt_IndL1T2Neg()
  {
    return this.addTabletForm.get("flt_IndL1T2Neg");
  }
  get flt_IndL1T2Pos()
  {
    return this.addTabletForm.get("flt_IndL1T2Pos");
  }
  get str_IndL1GraphOn()
  {
    return this.addTabletForm.get("str_IndL1GraphOn");
  }
  get str_IndL1LimitOn()
  {
    return this.addTabletForm.get("str_IndL1LimitOn");
  }
  get int_IndL1NMTTabCount()
  {
    return this.addTabletForm.get("int_IndL1NMTTabCount");
  }

  get flt_GrpL1Std()
  {
    return this.addTabletForm.get("flt_GrpL1Std");
  }
  get flt_GrpL1T1Neg()
  {
    return this.addTabletForm.get("flt_GrpL1T1Neg");
  }
  get flt_GrpL1T1Pos()
  {
    return this.addTabletForm.get("flt_GrpL1T1Pos");
  }
  get flt_GrpL1T2Neg()
  {
    return this.addTabletForm.get("flt_GrpL1T2Neg");
  }
  get flt_GrpL1T2Pos()
  {
    return this.addTabletForm.get("flt_GrpL1T2Pos");
  }
  get str_GrpL1GraphOn()
  {
    return this.addTabletForm.get("str_GrpL1GraphOn");
  }
  get str_GrpL1LimitOn()
  {
    return this.addTabletForm.get("str_GrpL1LimitOn");
  }
  get int_GrpL1NMTTabCount()
  {
    return this.addTabletForm.get("int_GrpL1NMTTabCount");
  }

  get flt_IndL2Std()
  {
    return this.addTabletForm.get("flt_IndL2Std");
  }
  get flt_IndL2T1Neg()
  {
    return this.addTabletForm.get("flt_IndL2T1Neg");
  }
  get flt_IndL2T1Pos()
  {
    return this.addTabletForm.get("flt_IndL2T1Pos");
  }
  get flt_IndL2T2Neg()
  {
    return this.addTabletForm.get("flt_IndL2T2Neg");
  }
  get flt_IndL2T2Pos()
  {
    return this.addTabletForm.get("flt_IndL2T2Pos");
  }
  get str_IndL2GraphOn()
  {
    return this.addTabletForm.get("str_IndL2GraphOn");
  }
  get str_IndL2LimitOn()
  {
    return this.addTabletForm.get("str_IndL2LimitOn");
  }
  get int_IndL2NMTTabCount()
  {
    return this.addTabletForm.get("int_IndL2NMTTabCount");
  }

  get flt_GrpL2Std()
  {
    return this.addTabletForm.get("flt_GrpL2Std");
  }
  get flt_GrpL2T1Neg()
  {
    return this.addTabletForm.get("flt_GrpL2T1Neg");
  }
  get flt_GrpL2T1Pos()
  {
    return this.addTabletForm.get("flt_GrpL2T1Pos");
  }
  get flt_GrpL2T2Neg()
  {
    return this.addTabletForm.get("flt_GrpL2T2Neg");
  }
  get flt_GrpL2T2Pos()
  {
    return this.addTabletForm.get("flt_GrpL2T2Pos");
  }
  get str_GrpL2GraphOn()
  {
    return this.addTabletForm.get("str_GrpL2GraphOn");
  }
  get str_GrpL2LimitOn()
  {
    return this.addTabletForm.get("str_GrpL2LimitOn");
  }
  get int_GrpL2NMTTabCount()
  {
    return this.addTabletForm.get("int_GrpL2NMTTabCount");
  }

  get flt_IndStdCoat()
  {
    return this.addTabletForm.get("flt_IndStdCoat");
  }
  get flt_IndT1NegCoat()
  {
    return this.addTabletForm.get("flt_IndT1NegCoat");
  }
  get flt_IndT1PosCoat()
  {
    return this.addTabletForm.get("flt_IndT1PosCoat");
  }
  get flt_IndT2NegCoat()
  {
    return this.addTabletForm.get("flt_IndT2NegCoat");
  }
  get flt_IndT2PosCoat()
  {
    return this.addTabletForm.get("flt_IndT2PosCoat");
  }
  get str_IndGraphOnCoat()
  {
    return this.addTabletForm.get("str_IndGraphOnCoat");
  }
  get str_IndLimitOnCoat()
  {
    return this.addTabletForm.get("str_IndLimitOnCoat");
  }
  get int_IndNMTTabCntCoat()
  {
    return this.addTabletForm.get("int_IndNMTTabCntCoat");
  }

  get flt_GrpStdCoat()
  {
    return this.addTabletForm.get("flt_GrpStdCoat");
  }
  get flt_GrpT1PosCoat()
  {
    return this.addTabletForm.get("flt_GrpT1PosCoat");
  }
  get flt_GrpT1NegCoat()
  {
    return this.addTabletForm.get("flt_GrpT1NegCoat");
  }
  get flt_GrpT2NegCoat()
  {
    return this.addTabletForm.get("flt_GrpT2NegCoat");
  }
  get flt_GrpT2PosCoat()
  {
    return this.addTabletForm.get("flt_GrpT2PosCoat");
  }
  get str_GrpGraphOnCoat()
  {
    return this.addTabletForm.get("str_GrpGraphOnCoat");
  }
  get str_GrpLimitOnCoat()
  {
    return this.addTabletForm.get("str_GrpLimitOnCoat");
  }
  get int_GrpNMTTabCntCoat()
  {
    return this.addTabletForm.get("int_GrpNMTTabCntCoat");
  }

  get flt_ThkStdCoat()
  {
    return this.addTabletForm.get("flt_ThkStdCoat");
  }
  get flt_ThkT1PosCoat()
  {
    return this.addTabletForm.get("flt_ThkT1PosCoat");
  }
  get flt_ThkT1NegCoat()
  {
    return this.addTabletForm.get("flt_ThkT1NegCoat");
  }
  get flt_ThkT2NegCoat()
  {
    return this.addTabletForm.get("flt_ThkT2NegCoat");
  }
  get flt_ThkT2PosCoat()
  {
    return this.addTabletForm.get("flt_ThkT2PosCoat");
  }
  get int_ThkNMTTabCntCoat()
  {
    return this.addTabletForm.get("int_ThkNMTTabCntCoat");
  }

  get flt_BrdStdCoat()
  {
    return this.addTabletForm.get("flt_BrdStdCoat");
  }
  get flt_BrdT1PosCoat()
  {
    return this.addTabletForm.get("flt_BrdT1PosCoat");
  }
  get flt_BrdT1NegCoat()
  {
    return this.addTabletForm.get("flt_BrdT1NegCoat");
  }
  get flt_BrdT2NegCoat()
  {
    return this.addTabletForm.get("flt_BrdT2NegCoat");
  }
  get flt_BrdT2PosCoat()
  {
    return this.addTabletForm.get("flt_BrdT2PosCoat");
  }
  get int_BrdNMTTabCntCoat()
  {
    return this.addTabletForm.get("int_BrdNMTTabCntCoat");
  }

  get flt_LenStdCoat()
  {
    return this.addTabletForm.get("flt_LenStdCoat");
  }
  get flt_LenT1PosCoat()
  {
    return this.addTabletForm.get("flt_LenT1PosCoat");
  }
  get flt_LenT1NegCoat()
  {
    return this.addTabletForm.get("flt_LenT1NegCoat");
  }
  get flt_LenT2NegCoat()
  {
    return this.addTabletForm.get("flt_LenT2NegCoat");
  }
  get flt_LenT2PosCoat()
  {
    return this.addTabletForm.get("flt_LenT2PosCoat");
  }
  get int_LenNMTTabCntCoat()
  {
    return this.addTabletForm.get("int_LenNMTTabCntCoat");
  }

  get flt_DiaStdCoat()
  {
    return this.addTabletForm.get("flt_DiaStdCoat");
  }
  get flt_DiaT1NegCoat()
  {
    return this.addTabletForm.get("flt_DiaT1NegCoat");
  }
  get flt_DiaT1PosCoat()
  {
    return this.addTabletForm.get("flt_DiaT1PosCoat");
  }
  get flt_DiaT2NegCoat()
  {
    return this.addTabletForm.get("flt_DiaT2NegCoat");
  }
  get flt_DiaT2PosCoat()
  {
    return this.addTabletForm.get("flt_DiaT2PosCoat");
  }
  get int_DiaNMTTabCntCoat()
  {
    return this.addTabletForm.get("int_DiaNMTTabCntCoat");
  }

  get flt_HrdStdCoat()
  {
    return this.addTabletForm.get("flt_HrdStdCoat");
  }
  get flt_HrdT1Coat()
  {
    return this.addTabletForm.get("flt_HrdT1Coat");
  }
  get flt_HrdT2Coat()
  {
    return this.addTabletForm.get("flt_HrdT2Coat");
  }
  get str_HrdUnitCoat()
  {
    return this.addTabletForm.get("str_HrdUnitCoat");
  }
  get str_HrdGraphOnCoat()
  {
    return this.addTabletForm.get("str_HrdGraphOnCoat");
  }

  get flt_FriNMTCoat()
  {
    return this.addTabletForm.get("flt_FriNMTCoat");
  }
  get int_FriSetCntCoat()
  {
    return this.addTabletForm.get("int_FriSetCntCoat");
  }
  get int_FriSetRPMCoat()
  {
    return this.addTabletForm.get("int_FriSetRPMCoat");
  }

  get int_DTHHTimeCoat()
  {
    return this.addTabletForm.get("int_DTHHTimeCoat");
  }
  get int_DTMMTimeCoat()
  {
    return this.addTabletForm.get("int_DTMMTimeCoat");
  }
  get int_DTSSTimeCoat()
  {
    return this.addTabletForm.get("int_DTSSTimeCoat");
  }
  get flt_DTMinTempCoat()
  {
    return this.addTabletForm.get("flt_DTMinTempCoat");
  }
  get flt_DTMaxTempCoat()
  {
    return this.addTabletForm.get("flt_DTMaxTempCoat");
  }

  get flt_CompDryMin()
  {
    return this.addTabletForm.get("flt_CompDryMin");
  }
  get flt_CompDryMax()
  {
    return this.addTabletForm.get("flt_CompDryMax");
  }

  get flt_CompLubMin()
  {
    return this.addTabletForm.get("flt_CompLubMin");
  }
  get flt_CompLubMax()
  {
    return this.addTabletForm.get("flt_CompLubMax");
  }

  get flt_Layer1DryMin()
  {
    return this.addTabletForm.get("flt_Layer1DryMin");
  }
  get flt_Layer1DryMax()
  {
    return this.addTabletForm.get("flt_Layer1DryMax");
  }

  get flt_Layer1LubMin()
  {
    return this.addTabletForm.get("flt_Layer1LubMin");
  }
  get flt_Layer1LubMax()
  {
    return this.addTabletForm.get("flt_Layer1LubMax");
  }

  get flt_Layer2DryMin()
  {
    return this.addTabletForm.get("flt_Layer2DryMin");
  }
  get flt_Layer2DryMax()
  {
    return this.addTabletForm.get("flt_Layer2DryMax");
  }

  get flt_Layer2LubMin()
  {
    return this.addTabletForm.get("flt_Layer2LubMin");
  }
  get flt_Layer2LubMax()
  {
    return this.addTabletForm.get("flt_Layer2LubMax");
  }

  get flt_TapDenMin()
  {
    return this.addTabletForm.get("flt_TapDenMin");
  }
  get flt_TapDenMax()
  {
    return this.addTabletForm.get("flt_TapDenMax");
  }

  get flt_FineMin()
  {
    return this.addTabletForm.get("flt_FineMin");
  }
  get flt_FineMax()
  {
    return this.addTabletForm.get("flt_FineMax");
  }

  get flt_PartSizingMin()
  {
    return this.addTabletForm.get("flt_PartSizingMin");
  }
  get flt_PartSizingMax()
  {
    return this.addTabletForm.get("flt_PartSizingMax");
  }

  ngOnInit()
  {
    this.dataService
      .getNomenclatureDetails()
      .then(res =>
      {
        this.initializeInputField(res[0]);
      })
      .catch(err =>
      {
        this.errorHandling.checkError(err.status);
      });

    this.fetchPrdCombination()
      .then(res =>
      {
        this.initializePrdInputField(res);
      })
      .catch(err =>
      {
        this.errorHandling.checkError(err.status);
      });

    this.jsonService
      .getValueFromJSON()
      .then((res: any) =>
      {
        this.str_IndUnit = res.Tablet[2].Value;

        this.str_BatchSizeVisibility = res.Master[3].Value;

        if (this.str_BatchSizeVisibility == "0")
        {
          this.addTabletForm.patchValue({
            flt_BatchSize: ""
          });
        }

        this.str_BinWeighingVisibility = res.Bin[1].Value;

        this.sarr_getHrdUnitFromJson = this.getUnits("H");
      })
      .catch(err =>
      {
        console.log(err);
      });

    this.http.getMethod("product/getProduct").subscribe((data: any) =>
    {
      data.forEach(element =>
      {
        this.sarr_BFGID.push(element.ProductId);
        this.sarr_prdName.push(element.ProductName);
        this.sarr_prdVersion.push(element.ProductVersion);
        this.sarr_version.push(element.Version);
      });
    });
  }

  /************** Function Detail ************/
  //This function is used to display value in input field
  /************End Function Detail ***********/
  initializeInputField(str_inputData: any)
  {
    this.str_LblBFGCode = str_inputData.BFGCode;
    this.str_LblProductName = str_inputData.ProductName;
  }

  /************** Function Detail ************/
  //This function is used to display product checkbox & its Labels value
  /************End Function Detail ***********/
  initializePrdInputField(str_inputData: any)
  {
    this.str_TxtBFGCode = str_inputData.ProductId;
    this.str_TxtPrdVerNo = str_inputData.ProductVersion;
    this.str_TxtVerNo = str_inputData.Version;
    this.str_TxtPrdName = str_inputData.ProductName;

    if (this.str_TxtBFGCode == "" || this.str_TxtBFGCode == null)
    {
      this.bln_hideChkTxtFld_BFG = false;

      this.addTabletForm.patchValue({
        str_BFGCode: "NA"
      });

      this.bln_disableTextFld_BFG = true;
    } else if (this.str_TxtBFGCode == "NA")
    {
      this.bln_hideChkTxtFld_BFG = true;

      this.addTabletForm.patchValue({
        str_BFGCode: "NA"
      });

      this.bln_disableTextFld_BFG = true;
    } else if (this.str_TxtBFGCode != "NA")
    {
      this.bln_hideChkTxtFld_BFG = true;

      this.addTabletForm.patchValue({
        str_BFGCode: ""
      });

      this.bln_disableTextFld_BFG = false;
    }

    if (this.str_TxtPrdVerNo == "" || this.str_TxtPrdVerNo == null)
    {
      this.bln_hideChkTxtFld_PrdVer = false;

      this.addTabletForm.patchValue({
        str_PV: "NA"
      });

      this.bln_disableTextFld_PrdVersion = true;
    } else if (this.str_TxtPrdVerNo == "NA")
    {
      this.bln_hideChkTxtFld_PrdVer = true;

      this.addTabletForm.patchValue({
        str_PV: "NA"
      });

      this.bln_disableTextFld_PrdVersion = true;
    } else if (this.str_TxtPrdVerNo != "NA")
    {
      this.bln_hideChkTxtFld_PrdVer = true;

      this.addTabletForm.patchValue({
        str_PV: ""
      });

      this.bln_disableTextFld_PrdVersion = false;
    }

    if (this.str_TxtVerNo == "" || this.str_TxtVerNo == null)
    {
      this.bln_hideChkTxtFld_Ver = false;

      this.addTabletForm.patchValue({
        str_V: "NA"
      });

      this.bln_disableTextFld_Version = true;
    } else if (this.str_TxtVerNo == "NA")
    {
      this.bln_hideChkTxtFld_Ver = true;

      this.addTabletForm.patchValue({
        str_V: "NA"
      });

      this.bln_disableTextFld_Version = true;
    } else if (this.str_TxtVerNo != "NA")
    {
      this.bln_hideChkTxtFld_Ver = true;

      this.addTabletForm.patchValue({
        str_V: ""
      });

      this.bln_disableTextFld_Version = false;
    }
  }

  fetchPrdCombination()
  {
    return new Promise((resolve, reject) =>
    {
      this.http.getMethod("product/checkPrdCombination/1").subscribe(
        res =>
        {
          this.obj_PrdDetails = res;
          resolve(this.obj_PrdDetails);
        },
        err =>
        {
          reject("Error occured");
        }
      );
    });
  }

  openSelAcc()
  {
    this.activeIds = this.sarr_getSelectedParamAccName.map(p => p);
  }

  checkValidParameterValues()
  {
    var int_cntCompression = this.sarr_getSelCompressParamAccName.length;
    var int_cntCoating = this.sarr_getSelCoatParamAccName.length;

    if(this.addTabletForm.value.bln_TypeCoatPrd == true && this.addTabletForm.value.bln_TypeCompressed == true)
    {
       if(int_cntCompression > 0 && int_cntCoating > 0)
       {
        this.commonFunctionForButton();
       }
       else
       {
        this.bln_accParamValid = false;
       }
    }
    else if(this.addTabletForm.value.bln_TypeCompressed == true)
    {
      if(this.addTabletForm.value.bln_TypeCoatPrd == false)
      {
        if(int_cntCompression > 0)
        {
          this.commonFunctionForButton();
        }
        else
        {
          this.bln_accParamValid = false;
        }
      }
    }
    else
    {
      this.bln_accParamValid = false;
    }
  }

  commonFunctionForButton()
  {
    this.sarr_getSelectedParamAccName.forEach(element =>
      {
        var objLimits = this.getParameterLimits(element);
        if (
          this.str_BFGCode.value != "" &&
          this.str_Prd.value != "" &&
          this.str_PV.value != "" &&
          this.str_V.value != "" &&
          this.addTabletForm.value.nominalNomenclature != "" &&
          ((this.str_BatchSizeVisibility == "0" &&
            this.flt_BatchSize.valid == true) ||
            this.str_BatchSizeVisibility == "1") &&
          this.validateInputsValues(objLimits) == true &&
          this.validateBilayerOption() == true &&
          this.validateTriLayerOption() == true
        )
        {
          this.bln_accParamValid = true;
        } else
        {
          this.bln_accParamValid = false;
        }
      });
  }

  validateInputsValues(objLimits): boolean
  {
    if (
      objLimits.Std == true &&
      objLimits.T1Neg == true &&
      objLimits.T1Pos == true &&
      objLimits.T2Neg == true &&
      objLimits.T2Pos == true &&
      objLimits.SetNMTTabCount == true
    )
    {
      return true;
    } else
    {
      return false;
    }
  }

  validateBilayerOption(): boolean
  {
    /**
     *  bilayer checked then only check the validation for the bilayer related fields else return only True to escape the validation
     */
    if (this.bln_ChkTypeBiLayPrd == true)
    {
      if (
        (this.bln_selAccIndLay1Param == true ||
          this.bln_selAccGrpLay1Param == true) &&
        this.addTabletForm.value.biLayerLabel != ""
      )
      {
        return true;
      } else
      {
        return false;
      }
    } else
    {
      return true;
    }
  }

  validateTriLayerOption(): boolean
  {
    if (this.bln_ChkTypeTriLayPrd == true)
    {
      if (
        (this.bln_selAccIndLay2Param == true ||
          this.bln_selAccGrpLay2Param == true) &&
        this.addTabletForm.value.biLayerLabel != "" &&
        this.addTabletForm.value.triLayerLabel != ""
      )
      {
        return true;
      } else
      {
        return false;
      }
    } else
    {
      return true;
    }
  }

  disabledTextFld(event: any)
  {
    switch (event.target.value)
    {
      case "chkBFGCode":
        if (event.target.checked == true)
        {
          this.bln_disableTextFld_BFG = false;

          this.addTabletForm.patchValue({
            str_BFGCode: ""
          });

          this.checkValidParameterValues();
        } else
        {
          this.bln_disableTextFld_BFG = true;

          this.addTabletForm.patchValue({
            str_BFGCode: "NA"
          });

          this.checkValidParameterValues();
        }

        break;

      case "chkPrdVersion":
        if (event.target.checked == true)
        {
          this.bln_disableTextFld_PrdVersion = false;

          this.addTabletForm.patchValue({
            str_PV: ""
          });

          this.checkValidParameterValues();
        } else
        {
          this.bln_disableTextFld_PrdVersion = true;

          this.addTabletForm.patchValue({
            str_PV: "NA"
          });

          this.checkValidParameterValues();
        }

        break;

      case "chkVersion":
        if (event.target.checked == true)
        {
          this.bln_disableTextFld_Version = false;

          this.addTabletForm.patchValue({
            str_V: ""
          });

          this.checkValidParameterValues();
        } else
        {
          this.bln_disableTextFld_Version = true;

          this.addTabletForm.patchValue({
            str_V: "NA"
          });

          this.checkValidParameterValues();
        }

        break;

      default:
        this.bln_disableTextFld_BFG = true;
        this.bln_disableTextFld_PrdVersion = false;
        this.bln_disableTextFld_Version = false;

        this.checkValidParameterValues();

        break;
    }
  }

  toggleBiLayVisibility(e)
  {
    if (e.target.checked)
    {
      this.bln_ChkTypeBiLayPrd = e.target.checked;
      this.bln_biLayerLabel = true;
    } else
    {
      this.addTabletForm.patchValue({ biLayerLabel: "" });
      this.bln_biLayerLabel = false;
      this.bln_ChkTypeBiLayPrd = e.target.checked;
      this.bln_selAccIndLay1Param = false;
      this.bln_selAccGrpLay1Param = false;
      this.addTabletForm.patchValue({
        flt_IndL1Std: "",
        flt_IndL1T1Neg: "",
        flt_IndL1T1Pos: "",
        flt_IndL1T2Neg: "",
        flt_IndL1T2Pos: "",
        int_IndL1NMTTabCount: "",
        flt_GrpL1Std: "",
        flt_GrpL1T1Neg: "",
        flt_GrpL1T1Pos: "",
        flt_GrpL1T2Neg: "",
        flt_GrpL1T2Pos: "",
        int_GrpL1NMTTabCount: "",
      });
    }
  }

  toggleTriLayVisibility(e)
  {
    this.bln_ChkTypeTriLayPrd = e.target.checked;
    this.bln_ChkTypeBiLayPrd = e.target.checked;
    if (e.target.checked)
    {
      this.bln_biLayerLabel = true;
      this.bln_triLayerLabel = true;
      this.bln_ChkTypeTriLayPrd = e.target.checked;
      this.bln_ChkTypeBiLayPrd = e.target.checked;
      this.bln_TypeBiLayPrd.setValue(true);
    } else
    {
      this.bln_triLayerLabel = false;
      this.bln_biLayerLabel = false;
      this.addTabletForm.patchValue({ biLayerLabel: "" });
      this.addTabletForm.patchValue({ triLayerLabel: "" });
      this.bln_ChkTypeTriLayPrd = e.target.checked;
      this.bln_ChkTypeBiLayPrd = e.target.checked;
      this.bln_TypeBiLayPrd.setValue(false);
      this.bln_selAccIndLay2Param = false;
      this.bln_selAccGrpLay2Param = false;
      this.addTabletForm.patchValue({
        flt_IndL2Std: "",
        flt_IndL2T1Neg: "",
        flt_IndL2T1Pos: "",
        flt_IndL2T2Neg: "",
        flt_IndL2T2Pos: "",
        int_IndL2NMTTabCount: "",
        flt_GrpL2Std: "",
        flt_GrpL2T1Neg: "",
        flt_GrpL2T1Pos: "",
        flt_GrpL2T2Neg: "",
        flt_GrpL2T2Pos: "",
        int_GrpL2NMTTabCount: "",
      })
    }
  }

  toggleCoatVisibility(e)
  {
    this.bln_ChkTypeCoatPrd = e.target.checked;
    if (e.target.checked)
    {
      this.bln_TypeCompressed.setValue(true);
      this.bln_ChkTypeCompressedProduct = true;
      this.bln_isCompressed = true;
      this.bln_ChkTypeCoated = true;
    } else
    {
      this.bln_TypeCoatPrd.setValue(false);
      this.bln_ChkTypeCoated = false;
      this.addTabletForm.patchValue({
        flt_IndStdCoat: "",
        flt_IndT1NegCoat: "",
        flt_IndT1PosCoat: "",
        flt_IndT2NegCoat: "",
        flt_IndT2PosCoat: "",
        int_IndNMTTabCntCoat: "",
        flt_GrpStdCoat: "",
        flt_GrpT1NegCoat: "",
        flt_GrpT1PosCoat: "",
        flt_GrpT2NegCoat: "",
        flt_GrpT2PosCoat: "",
        int_GrpNMTTabCntCoat: "",
        flt_ThkStdCoat: "",
        flt_ThkT1NegCoat: "",
        flt_ThkT1PosCoat: "",
        flt_ThkT2NegCoat: "",
        flt_ThkT2PosCoat: "",
        int_ThkNMTTabCntCoat: "",
        flt_BrdStdCoat: "",
        flt_BrdT1NegCoat: "",
        flt_BrdT1PosCoat: "",
        flt_BrdT2NegCoat: "",
        flt_BrdT2PosCoat: "",
        int_BrdNMTTabCntCoat: "",
        flt_LenStdCoat: "",
        flt_LenT1NegCoat: "",
        flt_LenT1PosCoat: "",
        flt_LenT2NegCoat: "",
        flt_LenT2PosCoat: "",
        int_LenNMTTabCntCoat: "",
        flt_DiaStdCoat: "",
        flt_DiaT1NegCoat: "",
        flt_DiaT1PosCoat: "",
        flt_DiaT2NegCoat: "",
        flt_DiaT2PosCoat: "",
        int_DiaNMTTabCntCoat: "",
        flt_HrdStdCoat: "",
        flt_HrdT1Coat: "",
        flt_HrdT2Coat: "",
        str_HrdUnitCoat: "",
        str_HrdGraphOnCoat: "",
        int_DTHHTimeCoat: "",
        int_DTMMTimeCoat: "",
        int_DTSSTimeCoat: "",
        flt_DTMinTempCoat: "",
        flt_DTMaxTempCoat: "",
      });
    }
  }

  toggleGrannualVisibility(e)
  {
    this.bln_ChkTypeGrannualPrd = e.target.checked;
    if (e.target.checked)
    {
      this.bln_TypeGrannualPrd.setValue(true);
    } else
    {
      this.bln_TypeGrannualPrd.setValue(false);
      this.addTabletForm.patchValue({
        flt_CompDryMin: "",
        flt_CompDryMax: "",
        flt_CompLubMin: "",
        flt_CompLubMax: "",
        flt_Layer1DryMin: "",
        flt_Layer1DryMax: "",
        flt_Layer1LubMin: "",
        flt_Layer1LubMax: "",
        flt_Layer2DryMin: "",
        flt_Layer2DryMax: "",
        flt_Layer2LubMin: "",
        flt_Layer2LubMax: "",
        flt_TapDenMin: "",
        flt_TapDenMax: "",
        flt_FineMin: "",
        flt_FineMax: "",
        flt_PartSizingMin: "",
        flt_PartSizingMax: "",
      })
    }
  }

  toggleCompressedVisibility(e)
  {
    this.bln_ChkTypeCompressedProduct = e.target.checked;
    if (e.target.checked)
    {
      this.bln_TypeCompressed.setValue(true);
      this.bln_isCompressed = true;
    } else
    {
      this.bln_TypeCompressed.setValue(false);
      this.bln_isCompressed = false;
      this.bln_biLayerLabel = false;
      this.bln_triLayerLabel = false;
      this.addTabletForm.patchValue({
        flt_IndStd: "",
        flt_IndT1Neg: "",
        flt_IndT1Pos: "",
        flt_IndT2Neg: "",
        flt_IndT2Pos: "",
        int_IndNMTTabCnt: "",
        flt_GrpStd: "",
        flt_GrpT1Neg: "",
        flt_GrpT1Pos: "",
        flt_GrpT2Neg: "",
        flt_GrpT2Pos: "",
        int_GrpNMTTabCnt: "",
        flt_ThkStd: "",
        flt_ThkT1Neg: "",
        flt_ThkT1Pos: "",
        flt_ThkT2Neg: "",
        flt_ThkT2Pos: "",
        int_ThkNMTTabCnt: "",
        flt_BrdStd: "",
        flt_BrdT1Neg: "",
        flt_BrdT1Pos: "",
        flt_BrdT2Neg: "",
        flt_BrdT2Pos: "",
        int_BrdNMTTabCnt: "",
        flt_LenStd: "",
        flt_LenT1Neg: "",
        flt_LenT1Pos: "",
        flt_LenT2Neg: "",
        flt_LenT2Pos: "",
        int_LenNMTTabCnt: "",
        flt_DiaStd: "",
        flt_DiaT1Neg: "",
        flt_DiaT1Pos: "",
        flt_DiaT2Neg: "",
        flt_DiaT2Pos: "",
        int_DiaNMTTabCnt: "",
        flt_HrdStd: "",
        flt_HrdT1: "",
        flt_HrdT2: "",
        flt_FriNMT: "",
        int_FriSetCnt: "",
        int_FriSetRPM: "",
        int_DTHHTime: "",
        int_DTMMTime: "",
        int_DTSSTime: "",
        flt_DTMinTemp: "",
        flt_DTMaxTemp: "",
        flt_TDT1: "",
        flt_TDT2: "",
        flt_MAT1: "",
        flt_MAT2: "",
        flt_SST1: "",
        flt_SST2: "",
      });
    }
  }

  onlyNumbersWithDecimal(event: any)
  {
    this.validation.onlyNumbersWithDecimal(event);
  }

  onlyNumbers(event: any)
  {
    this.validation.onlyNumbers(event);
  }

  setZeroOnT1PosAndDis(ctlName)
  {
    switch (ctlName)
    {
      case "flt_IndT1Neg":
        var flt_IndT1Neg = this.addTabletForm.value.flt_IndT1Neg;

        if (flt_IndT1Neg == "0")
        {
          this.bln_disTxtFldsIfIndT1Zero = true;

          this.addTabletForm.patchValue({
            flt_IndT1Pos: "0"
          });

          this.addTabletForm.patchValue({
            int_IndNMTTabCnt: "0"
          });
        } else
        {
          this.bln_disTxtFldsIfIndT1Zero = false;

          this.addTabletForm.patchValue({
            flt_IndT1Pos: ""
          });

          this.addTabletForm.patchValue({
            int_IndNMTTabCnt: ""
          });
        }

        break;

      case "flt_GrpT1Neg":
        var flt_GrpT1Neg = this.addTabletForm.value.flt_GrpT1Neg;

        if (flt_GrpT1Neg == "0")
        {
          this.bln_disTxtFldsIfGrpT1Zero = true;

          this.addTabletForm.patchValue({
            flt_GrpT1Pos: "0"
          });

          this.addTabletForm.patchValue({
            int_GrpNMTTabCnt: "0"
          });
        } else
        {
          this.bln_disTxtFldsIfGrpT1Zero = false;

          this.addTabletForm.patchValue({
            flt_GrpT1Pos: ""
          });

          this.addTabletForm.patchValue({
            int_GrpNMTTabCnt: ""
          });
        }

        break;

      case "flt_ThkT1Neg":
        var flt_ThkT1Neg = this.addTabletForm.value.flt_ThkT1Neg;

        if (flt_ThkT1Neg == "0")
        {
          this.bln_disTxtFldsIfThkT1Zero = true;

          this.addTabletForm.patchValue({
            flt_ThkT1Pos: "0"
          });

          this.addTabletForm.patchValue({
            int_ThkNMTTabCnt: "0"
          });
        } else
        {
          this.bln_disTxtFldsIfThkT1Zero = false;

          this.addTabletForm.patchValue({
            flt_ThkT1Pos: ""
          });

          this.addTabletForm.patchValue({
            int_ThkNMTTabCnt: ""
          });
        }

        break;

      case "flt_BrdT1Neg":
        var flt_BrdT1Neg = this.addTabletForm.value.flt_BrdT1Neg;

        if (flt_BrdT1Neg == "0")
        {
          this.bln_disTxtFldsIfBrdT1Zero = true;

          this.addTabletForm.patchValue({
            flt_BrdT1Pos: "0"
          });

          this.addTabletForm.patchValue({
            int_BrdNMTTabCnt: "0"
          });
        } else
        {
          this.bln_disTxtFldsIfBrdT1Zero = false;

          this.addTabletForm.patchValue({
            flt_BrdT1Pos: ""
          });

          this.addTabletForm.patchValue({
            int_BrdNMTTabCnt: ""
          });
        }

        break;

      case "flt_LenT1Neg":
        var flt_LenT1Neg = this.addTabletForm.value.flt_LenT1Neg;

        if (flt_LenT1Neg == "0")
        {
          this.bln_disTxtFldsIfLenT1Zero = true;

          this.addTabletForm.patchValue({
            flt_LenT1Pos: "0"
          });

          this.addTabletForm.patchValue({
            int_LenNMTTabCnt: "0"
          });
        } else
        {
          this.bln_disTxtFldsIfLenT1Zero = false;

          this.addTabletForm.patchValue({
            flt_LenT1Pos: ""
          });

          this.addTabletForm.patchValue({
            int_LenNMTTabCnt: ""
          });
        }

        break;

      case "flt_DiaT1Neg":
        var flt_DiaT1Neg = this.addTabletForm.value.flt_DiaT1Neg;

        if (flt_DiaT1Neg == "0")
        {
          this.bln_disTxtFldsIfDiaT1Zero = true;

          this.addTabletForm.patchValue({
            flt_DiaT1Pos: "0"
          });

          this.addTabletForm.patchValue({
            int_DiaNMTTabCnt: "0"
          });
        } else
        {
          this.bln_disTxtFldsIfDiaT1Zero = false;

          this.addTabletForm.patchValue({
            flt_DiaT1Pos: ""
          });

          this.addTabletForm.patchValue({
            int_DiaNMTTabCnt: ""
          });
        }

        break;

      case "flt_IndL1T1Neg":
        var flt_IndL1T1Neg = this.addTabletForm.value.flt_IndL1T1Neg;

        if (flt_IndL1T1Neg == "0")
        {
          this.bln_disTxtFldsIfIndL1T1Zero = true;

          this.addTabletForm.patchValue({
            flt_IndL1T1Pos: "0"
          });

          this.addTabletForm.patchValue({
            int_IndL1NMTTabCount: "0"
          });
        } else
        {
          this.bln_disTxtFldsIfIndL1T1Zero = false;

          this.addTabletForm.patchValue({
            flt_IndL1T1Pos: ""
          });

          this.addTabletForm.patchValue({
            int_IndL1NMTTabCount: ""
          });
        }

        break;

      case "flt_GrpL1T1Neg":
        var flt_GrpL1T1Neg = this.addTabletForm.value.flt_GrpL1T1Neg;

        if (flt_GrpL1T1Neg == "0")
        {
          this.bln_disTxtFldsIfGrpL1T1Zero = true;

          this.addTabletForm.patchValue({
            flt_GrpL1T1Pos: "0"
          });

          this.addTabletForm.patchValue({
            int_GrpL1NMTTabCount: "0"
          });
        } else
        {
          this.bln_disTxtFldsIfGrpL1T1Zero = false;

          this.addTabletForm.patchValue({
            flt_GrpL1T1Pos: ""
          });

          this.addTabletForm.patchValue({
            int_GrpL1NMTTabCount: ""
          });
        }

        break;

      case "flt_IndL2T1Neg":
        var flt_IndL2T1Neg = this.addTabletForm.value.flt_IndL2T1Neg;

        if (flt_IndL2T1Neg == "0")
        {
          this.bln_disTxtFldsIfIndL2T1Zero = true;

          this.addTabletForm.patchValue({
            flt_IndL2T1Pos: "0"
          });

          this.addTabletForm.patchValue({
            int_IndL2NMTTabCount: "0"
          });
        } else
        {
          this.bln_disTxtFldsIfIndL2T1Zero = false;

          this.addTabletForm.patchValue({
            flt_IndL2T1Pos: ""
          });

          this.addTabletForm.patchValue({
            int_IndL2NMTTabCount: ""
          });
        }

        break;

      case "flt_GrpL2T1Neg":
        var flt_GrpL2T1Neg = this.addTabletForm.value.flt_GrpL2T1Neg;

        if (flt_GrpL2T1Neg == "0")
        {
          this.bln_disTxtFldsIfGrpL2T1Zero = true;

          this.addTabletForm.patchValue({
            flt_GrpL2T1Pos: "0"
          });

          this.addTabletForm.patchValue({
            int_GrpL2NMTTabCount: "0"
          });
        } else
        {
          this.bln_disTxtFldsIfGrpL2T1Zero = false;

          this.addTabletForm.patchValue({
            flt_GrpL2T1Pos: ""
          });

          this.addTabletForm.patchValue({
            int_GrpL2NMTTabCount: ""
          });
        }

        break;

      case "flt_IndT1NegCoat":
        var flt_IndT1NegCoat = this.addTabletForm.value.flt_IndT1NegCoat;

        if (flt_IndT1NegCoat == "0")
        {
          this.bln_disTxtFldsIfIndCoatT1Zero = true;

          this.addTabletForm.patchValue({
            flt_IndT1PosCoat: "0"
          });

          this.addTabletForm.patchValue({
            int_IndNMTTabCntCoat: "0"
          });
        } else
        {
          this.bln_disTxtFldsIfIndCoatT1Zero = false;

          this.addTabletForm.patchValue({
            flt_IndT1PosCoat: ""
          });

          this.addTabletForm.patchValue({
            int_IndNMTTabCntCoat: ""
          });
        }

        break;

      case "flt_GrpT1NegCoat":
        var flt_GrpT1NegCoat = this.addTabletForm.value.flt_GrpT1NegCoat;

        if (flt_GrpT1NegCoat == "0")
        {
          this.bln_disTxtFldsIfGrpCoatT1Zero = true;

          this.addTabletForm.patchValue({
            flt_GrpT1PosCoat: "0"
          });

          this.addTabletForm.patchValue({
            int_GrpNMTTabCntCoat: "0"
          });
        } else
        {
          this.bln_disTxtFldsIfGrpCoatT1Zero = false;

          this.addTabletForm.patchValue({
            flt_GrpT1PosCoat: ""
          });

          this.addTabletForm.patchValue({
            int_GrpNMTTabCntCoat: ""
          });
        }

        break;

      case "flt_ThkT1NegCoat":
        var flt_ThkT1NegCoat = this.addTabletForm.value.flt_ThkT1NegCoat;

        if (flt_ThkT1NegCoat == "0")
        {
          this.bln_disTxtFldsIfThkCoatT1Zero = true;

          this.addTabletForm.patchValue({
            flt_ThkT1PosCoat: "0"
          });

          this.addTabletForm.patchValue({
            int_ThkNMTTabCntCoat: "0"
          });
        } else
        {
          this.bln_disTxtFldsIfThkCoatT1Zero = false;

          this.addTabletForm.patchValue({
            flt_ThkT1PosCoat: ""
          });

          this.addTabletForm.patchValue({
            int_ThkNMTTabCntCoat: ""
          });
        }

        break;

      case "flt_BrdT1NegCoat":
        var flt_BrdT1NegCoat = this.addTabletForm.value.flt_BrdT1NegCoat;

        if (flt_BrdT1NegCoat == "0")
        {
          this.bln_disTxtFldsIfBrdCoatT1Zero = true;

          this.addTabletForm.patchValue({
            flt_BrdT1PosCoat: "0"
          });

          this.addTabletForm.patchValue({
            int_BrdNMTTabCntCoat: "0"
          });
        } else
        {
          this.bln_disTxtFldsIfBrdCoatT1Zero = false;

          this.addTabletForm.patchValue({
            flt_BrdT1PosCoat: ""
          });

          this.addTabletForm.patchValue({
            int_BrdNMTTabCntCoat: ""
          });
        }

        break;

      case "flt_LenT1NegCoat":
        var flt_LenT1NegCoat = this.addTabletForm.value.flt_LenT1NegCoat;

        if (flt_LenT1NegCoat == "0")
        {
          this.bln_disTxtFldsIfLenCoatT1Zero = true;

          this.addTabletForm.patchValue({
            flt_LenT1PosCoat: "0"
          });

          this.addTabletForm.patchValue({
            int_LenNMTTabCntCoat: "0"
          });
        } else
        {
          this.bln_disTxtFldsIfLenCoatT1Zero = false;

          this.addTabletForm.patchValue({
            flt_LenT1PosCoat: ""
          });

          this.addTabletForm.patchValue({
            int_LenNMTTabCntCoat: ""
          });
        }

        break;

      case "flt_DiaT1NegCoat":
        var flt_DiaT1NegCoat = this.addTabletForm.value.flt_DiaT1NegCoat;

        if (flt_DiaT1NegCoat == "0")
        {
          this.bln_disTxtFldsIfDiaCoatT1Zero = true;

          this.addTabletForm.patchValue({
            flt_DiaT1PosCoat: "0"
          });

          this.addTabletForm.patchValue({
            int_DiaNMTTabCntCoat: "0"
          });
        } else
        {
          this.bln_disTxtFldsIfDiaCoatT1Zero = false;

          this.addTabletForm.patchValue({
            flt_DiaT1PosCoat: ""
          });

          this.addTabletForm.patchValue({
            int_DiaNMTTabCntCoat: ""
          });
        }

        break;

      default:
        break;
    }
  }

  dtTimeOnblur()
  {
    var dtHHTime = this.addTabletForm.value.int_DTHHTime;
    var dtMMTime = this.addTabletForm.value.int_DTMMTime;
    var dtSSTime = this.addTabletForm.value.int_DTSSTime;

    if (dtHHTime > 23)
    {
      this.addTabletForm.patchValue({
        int_DTHHTime: "23"
      });
    }

    if (dtMMTime > 59)
    {
      this.addTabletForm.patchValue({
        int_DTMMTime: "59"
      });
    }

    if (dtSSTime > 59)
    {
      this.addTabletForm.patchValue({
        int_DTSSTime: "59"
      });
    }
  }

  dtCoatTimeOnblur()
  {
    var dtHHTimeCoat = this.addTabletForm.value.int_DTHHTimeCoat;
    var dtMMTimeCoat = this.addTabletForm.value.int_DTMMTimeCoat;
    var dtSSTimeCoat = this.addTabletForm.value.int_DTSSTimeCoat;

    if (dtHHTimeCoat > 23)
    {
      this.addTabletForm.patchValue({
        int_DTHHTimeCoat: "23"
      });
    }

    if (dtMMTimeCoat > 59)
    {
      this.addTabletForm.patchValue({
        int_DTMMTimeCoat: "59"
      });
    }

    if (dtSSTimeCoat > 59)
    {
      this.addTabletForm.patchValue({
        int_DTSSTimeCoat: "59"
      });
    }
  }

  getParameterLimits(strPanelName): Object
  {
    let limits = {};

    switch (strPanelName)
    {
      case "Individual":
        limits = {
          Std: this.flt_IndStd.valid,
          T1Neg: this.flt_IndT1Neg.valid,
          T1Pos: this.flt_IndT1Pos.valid,
          T2Neg: this.flt_IndT2Neg.valid,
          T2Pos: this.flt_IndT2Pos.valid,
          SetNMTTabCount: this.int_IndNMTTabCnt.valid
        };

        break;

      case "Group":
        limits = {
          Std: this.flt_GrpStd.valid,
          T1Neg: this.flt_GrpT1Neg.valid,
          T1Pos: this.flt_GrpT1Pos.valid,
          T2Neg: this.flt_GrpT2Neg.valid,
          T2Pos: this.flt_GrpT2Pos.valid,
          SetNMTTabCount: this.int_GrpNMTTabCnt.valid
        };

        break;

      case "Thickness":
        limits = {
          Std: this.flt_ThkStd.valid,
          T1Neg: this.flt_ThkT1Neg.valid,
          T1Pos: this.flt_ThkT1Pos.valid,
          T2Neg: this.flt_ThkT2Neg.valid,
          T2Pos: this.flt_ThkT2Pos.valid,
          SetNMTTabCount: this.int_ThkNMTTabCnt.valid
        };

        break;

      case "Breadth":
        limits = {
          Std: this.flt_BrdStd.valid,
          T1Neg: this.flt_BrdT1Neg.valid,
          T1Pos: this.flt_BrdT1Pos.valid,
          T2Neg: this.flt_BrdT2Neg.valid,
          T2Pos: this.flt_BrdT2Pos.valid,
          SetNMTTabCount: this.int_BrdNMTTabCnt.valid
        };

        break;

      case "Length":
        limits = {
          Std: this.flt_LenStd.valid,
          T1Neg: this.flt_LenT1Neg.valid,
          T1Pos: this.flt_LenT1Pos.valid,
          T2Neg: this.flt_LenT2Neg.valid,
          T2Pos: this.flt_LenT2Pos.valid,
          SetNMTTabCount: this.int_LenNMTTabCnt.valid
        };

        break;

      case "Diameter":
        limits = {
          Std: this.flt_DiaStd.valid,
          T1Neg: this.flt_DiaT1Neg.valid,
          T1Pos: this.flt_DiaT1Pos.valid,
          T2Neg: this.flt_DiaT2Neg.valid,
          T2Pos: this.flt_DiaT2Pos.valid,
          SetNMTTabCount: this.int_DiaNMTTabCnt.valid
        };

        break;

      case "Hardness":
        limits = {
          Std: this.flt_HrdStd.valid,
          T1Neg: this.flt_HrdT1.valid,
          T1Pos: this.flt_HrdT2.valid,
          T2Neg: true,
          T2Pos: true,
          SetNMTTabCount: true
        };

        break;

      case "Friability":
        limits = {
          Std: this.flt_FriNMT.valid,
          T1Neg: this.int_FriSetCnt.valid,
          T1Pos: this.int_FriSetRPM.valid,
          T2Neg: true,
          T2Pos: true,
          SetNMTTabCount: true
        };

        break;

      case "Disintegration":
        limits = {
          Std: this.int_DTHHTime.valid,
          T1Neg: this.int_DTMMTime.valid,
          T1Pos: this.int_DTSSTime.valid,
          T2Neg: this.flt_DTMinTemp.valid,
          T2Pos: this.flt_DTMaxTemp.valid,
          SetNMTTabCount: true
        };

        break;

      case "Tapped Density":
        limits = {
          Std: true,
          T1Neg: this.flt_TDT1.valid,
          T1Pos: this.flt_TDT2.valid,
          T2Neg: true,
          T2Pos: true,
          SetNMTTabCount: true
        };
        break;

      case "LOD":
        limits = {
          Std: true,
          T1Neg: this.flt_MAT1.valid,
          T1Pos: this.flt_MAT2.valid,
          T2Neg: true,
          T2Pos: true,
          SetNMTTabCount: true
        };

        break;

      case "%Fine":
        limits = {
          Std: true,
          T1Neg: this.flt_SST1.valid,
          T1Pos: this.flt_SST2.valid,
          T2Neg: true,
          T2Pos: true,
          SetNMTTabCount: true
        };

        break;

      case "Individual Layer-1":
        limits = {
          Std: this.flt_IndL1Std.valid,
          T1Neg: this.flt_IndL1T1Neg.valid,
          T1Pos: this.flt_IndL1T1Pos.valid,
          T2Neg: this.flt_IndL1T2Neg.valid,
          T2Pos: this.flt_IndL1T2Pos.valid,
          SetNMTTabCount: this.int_IndL1NMTTabCount.valid
        };

        break;

      case "Group Layer-1":
        limits = {
          Std: this.flt_GrpL1Std.valid,
          T1Neg: this.flt_GrpL1T1Neg.valid,
          T1Pos: this.flt_GrpL1T1Pos.valid,
          T2Neg: this.flt_GrpL1T2Neg.valid,
          T2Pos: this.flt_GrpL1T2Pos.valid,
          SetNMTTabCount: this.int_GrpL1NMTTabCount.valid
        };

        break;

      case "Individual Layer-2":
        limits = {
          Std: this.flt_IndL2Std.valid,
          T1Neg: this.flt_IndL2T1Neg.valid,
          T1Pos: this.flt_IndL2T1Pos.valid,
          T2Neg: this.flt_IndL2T2Neg.valid,
          T2Pos: this.flt_IndL2T2Pos.valid,
          SetNMTTabCount: this.int_IndL2NMTTabCount.valid
        };

        break;

      case "Group Layer-2":
        limits = {
          Std: this.flt_GrpL2Std.valid,
          T1Neg: this.flt_GrpL2T1Neg.valid,
          T1Pos: this.flt_GrpL2T1Pos.valid,
          T2Neg: this.flt_GrpL2T2Neg.valid,
          T2Pos: this.flt_GrpL2T2Pos.valid,
          SetNMTTabCount: this.int_GrpL2NMTTabCount.valid
        };

        break;

      case "Individual Coat":
        limits = {
          Std: this.flt_IndStdCoat.valid,
          T1Neg: this.flt_IndT1NegCoat.valid,
          T1Pos: this.flt_IndT1PosCoat.valid,
          T2Neg: this.flt_IndT2NegCoat.valid,
          T2Pos: this.flt_IndT2PosCoat.valid,
          SetNMTTabCount: this.int_IndNMTTabCntCoat.valid
        };

        break;

      case "Group Coat":
        limits = {
          Std: this.flt_GrpStdCoat.valid,
          T1Neg: this.flt_GrpT1NegCoat.valid,
          T1Pos: this.flt_GrpT1PosCoat.valid,
          T2Neg: this.flt_GrpT2NegCoat.valid,
          T2Pos: this.flt_GrpT2PosCoat.valid,
          SetNMTTabCount: this.int_GrpNMTTabCntCoat.valid
        };

        break;

      case "Thickness Coat":
        limits = {
          Std: this.flt_ThkStdCoat.valid,
          T1Neg: this.flt_ThkT1NegCoat.valid,
          T1Pos: this.flt_ThkT1PosCoat.valid,
          T2Neg: this.flt_ThkT2NegCoat.valid,
          T2Pos: this.flt_ThkT2PosCoat.valid,
          SetNMTTabCount: this.int_ThkNMTTabCntCoat.valid
        };

        break;

      case "Breadth Coat":
        limits = {
          Std: this.flt_BrdStdCoat.valid,
          T1Neg: this.flt_BrdT1NegCoat.valid,
          T1Pos: this.flt_BrdT1PosCoat.valid,
          T2Neg: this.flt_BrdT2NegCoat.valid,
          T2Pos: this.flt_BrdT2PosCoat.valid,
          SetNMTTabCount: this.int_BrdNMTTabCntCoat.valid
        };

        break;

      case "Length Coat":
        limits = {
          Std: this.flt_LenStdCoat.valid,
          T1Neg: this.flt_LenT1NegCoat.valid,
          T1Pos: this.flt_LenT1PosCoat.valid,
          T2Neg: this.flt_LenT2NegCoat.valid,
          T2Pos: this.flt_LenT2PosCoat.valid,
          SetNMTTabCount: this.int_LenNMTTabCntCoat.valid
        };

        break;

      case "Diameter Coat":
        limits = {
          Std: this.flt_DiaStdCoat.valid,
          T1Neg: this.flt_DiaT1NegCoat.valid,
          T1Pos: this.flt_DiaT1PosCoat.valid,
          T2Neg: this.flt_DiaT2NegCoat.valid,
          T2Pos: this.flt_DiaT2PosCoat.valid,
          SetNMTTabCount: this.int_DiaNMTTabCntCoat.valid
        };

        break;

      case "Hardness Coat":
        limits = {
          Std: this.flt_HrdStdCoat.valid,
          T1Neg: this.flt_HrdT1Coat.valid,
          T1Pos: this.flt_HrdT2Coat.valid,
          T2Neg: true,
          T2Pos: true,
          SetNMTTabCount: true
        };

        break;

      case "Friability Coat":
        limits = {
          Std: this.flt_FriNMTCoat.valid,
          T1Neg: this.int_FriSetCntCoat.valid,
          T1Pos: this.int_FriSetRPMCoat.valid,
          T2Neg: true,
          T2Pos: true,
          SetNMTTabCount: true
        };

        break;

      case "Disintegration Coat":
        limits = {
          Std: this.int_DTHHTimeCoat.valid,
          T1Neg: this.int_DTMMTimeCoat.valid,
          T1Pos: this.int_DTSSTimeCoat.valid,
          T2Neg: this.flt_DTMinTempCoat.valid,
          T2Pos: this.flt_DTMaxTempCoat.valid,
          SetNMTTabCount: true
        };

        break;

      case "LOD Compressed Dry":
        limits = {
          Std: true,
          T1Neg: this.flt_CompDryMin.valid,
          T1Pos: this.flt_CompDryMax.valid,
          T2Neg: true,
          T2Pos: true,
          SetNMTTabCount: true
        };
        break;

      case "LOD Compressed Lubricated":
        limits = {
          Std: true,
          T1Neg: this.flt_CompLubMin.valid,
          T1Pos: this.flt_CompLubMax.valid,
          T2Neg: true,
          T2Pos: true,
          SetNMTTabCount: true
        };
        break;

      case "LOD Layer1 Dry":
        limits = {
          Std: true,
          T1Neg: this.flt_Layer1DryMin.valid,
          T1Pos: this.flt_Layer1DryMax.valid,
          T2Neg: true,
          T2Pos: true,
          SetNMTTabCount: true
        };
        break;

      case "LOD Layer 1 Lubricated":
        limits = {
          Std: true,
          T1Neg: this.flt_Layer1LubMin.valid,
          T1Pos: this.flt_Layer1LubMax.valid,
          T2Neg: true,
          T2Pos: true,
          SetNMTTabCount: true
        };
        break;

      case "LOD Layer2 Dry":
        limits = {
          Std: true,
          T1Neg: this.flt_Layer2DryMin.valid,
          T1Pos: this.flt_Layer2DryMax.valid,
          T2Neg: true,
          T2Pos: true,
          SetNMTTabCount: true
        };
        break;

      case "LOD Layer 2 Lubricated":
        limits = {
          Std: true,
          T1Neg: this.flt_Layer2LubMin.valid,
          T1Pos: this.flt_Layer2LubMax.valid,
          T2Neg: true,
          T2Pos: true,
          SetNMTTabCount: true
        };
        break;

      case "Tap Density":
        limits = {
          Std: true,
          T1Neg: this.flt_TapDenMin.valid,
          T1Pos: this.flt_TapDenMax.valid,
          T2Neg: true,
          T2Pos: true,
          SetNMTTabCount: true
        };
        break;

      case "% Fine":
        limits = {
          Std: true,
          T1Neg: this.flt_FineMin.valid,
          T1Pos: this.flt_FineMax.valid,
          T2Neg: true,
          T2Pos: true,
          SetNMTTabCount: true
        };
        break;

      case "Particle Sizing":
        limits = {
          Std: true,
          T1Neg: this.flt_PartSizingMin.valid,
          T1Pos: this.flt_PartSizingMax.valid,
          T2Neg: true,
          T2Pos: true,
          SetNMTTabCount: true
        };
        break;
    }
    return limits;
  }

  onSubmit()
  {
    const bln_BFG = this.sarr_BFGID.includes(this.addTabletForm.value.str_BFGCode);
    const bln_name = this.sarr_prdName.includes(this.addTabletForm.value.str_Prd);
    const bln_pversion = this.sarr_prdVersion.includes(this.addTabletForm.value.str_PV);
    const bln_version = this.sarr_version.includes(this.addTabletForm.value.str_V);

    if (bln_BFG == true && bln_name == true && bln_pversion == true && bln_version == true)
    {
      swal({
        title: "This product detail is already exist",
        text: "",
        type: "error",
        allowOutsideClick: false,
      });
    }
    else
    {
      this.bln_Loading = false;
      swal({
        title: "Are You Sure?",
        text: "Do You Want To Add ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        allowOutsideClick: false
      }).then(
        result =>
        {
          if (result == true)
          {
            this.bln_IsPopupOpened = true;
            const message = { message: "Add Product" };
            const dialogRef = this.dialog.open(RemarkComponent, {
              data: message,
              width: "570px",
              disableClose: true
            });
            dialogRef.afterClosed().subscribe(result =>
            {
              const data: Object = {};

              if (result !== undefined)
              {
                const userId = this.sessionStorage.retrieve("userId").trim();
                const userName = this.sessionStorage.retrieve("userName").trim();
                const action = "Add Product";
                const remark = result.reason.trim();

                let int_prdType = "1";

                let str_ThkGraphOn = "Standard";
                let str_BrdGraphOn = "Standard";
                let str_LenGraphOn = "Standard";
                let str_DiaGraphOn = "Standard";

                let int_IndDp = this.validation.getDPValue(
                  this.addTabletForm.value.flt_IndStd
                );
                let int_GrpDp = this.validation.getDPValue(
                  this.addTabletForm.value.flt_GrpStd
                );

                let int_ThkDp = this.validation.getDPValue(
                  this.addTabletForm.value.flt_ThkStd
                );
                let int_BrdDp = this.validation.getDPValue(
                  this.addTabletForm.value.flt_BrdStd
                );
                let int_LenDp = this.validation.getDPValue(
                  this.addTabletForm.value.flt_LenStd
                );
                let int_DiaDp = this.validation.getDPValue(
                  this.addTabletForm.value.flt_DiaStd
                );

                let int_FriDp = this.validation.getDPValue(
                  this.addTabletForm.value.flt_FriNMT
                );

                let int_HardDp;
                (this.addTabletForm.value.str_HrdUnit == "N") ? int_HardDp = 0 : int_HardDp = 1;

                let int_DTDp = this.validation.getDPValue(
                  this.addTabletForm.value.flt_DTMinTemp
                );

                let int_TDDp = this.validation.getDPValue(
                  this.addTabletForm.value.flt_TDT1
                );
                let int_MADp = this.validation.getDPValue(
                  this.addTabletForm.value.flt_MAT1
                );
                let int_SSDp = this.validation.getDPValue(
                  this.addTabletForm.value.flt_SST1
                );

                let int_IndL1Dp = this.validation.getDPValue(
                  this.addTabletForm.value.flt_IndL1Std
                );
                let int_GrpL1Dp = this.validation.getDPValue(
                  this.addTabletForm.value.flt_GrpL1Std
                );

                let int_IndL2Dp = this.validation.getDPValue(
                  this.addTabletForm.value.flt_IndL2Std
                );
                let int_GrpL2Dp = this.validation.getDPValue(
                  this.addTabletForm.value.flt_GrpL2Std
                );

                let int_IndCoatDp = this.validation.getDPValue(
                  this.addTabletForm.value.flt_IndStdCoat
                );
                let int_GrpCoatDp = this.validation.getDPValue(
                  this.addTabletForm.value.flt_GrpStdCoat
                );

                let int_ThkCoatDp = this.validation.getDPValue(
                  this.addTabletForm.value.flt_ThkStdCoat
                );
                let int_BrdCoatDp = this.validation.getDPValue(
                  this.addTabletForm.value.flt_BrdStdCoat
                );
                let int_LenCoatDp = this.validation.getDPValue(
                  this.addTabletForm.value.flt_LenStdCoat
                );
                let int_DiaCoatDp = this.validation.getDPValue(
                  this.addTabletForm.value.flt_DiaStdCoat
                );

                let int_FriCoatDp = this.validation.getDPValue(
                  this.addTabletForm.value.flt_FriNMTCoat
                );

                let int_DTDpCoat = this.validation.getDPValue(
                  this.addTabletForm.value.flt_DTMinTempCoat
                );

                let int_HardDpCoat;
                (this.addTabletForm.value.str_HrdUnitCoat == "N") ? int_HardDpCoat = 0 : int_HardDpCoat = 1;

                Object.assign(
                  data,
                  this.addTabletForm.value,

                  //{ int_prdType: int_prdType },

                  { str_ThkGraphOn: str_ThkGraphOn },
                  { str_BrdGraphOn: str_BrdGraphOn },
                  { str_LenGraphOn: str_LenGraphOn },
                  { str_DiaGraphOn: str_DiaGraphOn },

                  { int_IndDP: int_IndDp },
                  { int_Grpdp: int_GrpDp },

                  { int_Thkdp: int_ThkDp },
                  { int_Brddp: int_BrdDp },
                  { int_LenDp: int_LenDp },
                  { int_DiaDp: int_DiaDp },

                  { int_HardDp: int_HardDp},
                  { int_FriDp: int_FriDp },
                  { int_DTDp: int_DTDp },

                  { int_TDDp: int_TDDp },
                  { int_MADp: int_MADp },
                  { int_SSDp: int_SSDp },

                  { int_IndL1Dp: int_IndL1Dp },
                  { int_GrpL1Dp: int_GrpL1Dp },

                  { int_IndL2Dp: int_IndL2Dp },
                  { int_GrpL2Dp: int_GrpL2Dp },

                  { int_IndCoatDp: int_IndCoatDp },
                  { int_GrpCoatDp: int_GrpCoatDp },

                  { int_ThkCoatDp: int_ThkCoatDp },
                  { int_BrdCoatDp: int_BrdCoatDp },
                  { int_LenCoatDp: int_LenCoatDp },
                  { int_DiaCoatDp: int_DiaCoatDp },

                  { int_FriCoatDp: int_FriCoatDp },
                  { int_DTDpCoat: int_DTDpCoat },
                  { int_HardDpCoat: int_HardDpCoat },

                  { loggedUserId: userId },
                  { loggedUserName: userName },
                  { action: action },
                  { remark: remark }
                );
                const data1: Object = {};
                Object.assign(data1, { newData: data });
                console.log(JSON.stringify(data1));
                this.http.postMethod('product/validateNewProduct', data1).subscribe((res: any) =>
                {
                  this.auditObject = res;
                  Object.assign(data, { auditObject: this.auditObject })
                  //console.log(JSON.stringify(data));
                  this.bln_Loading = true;
                  this.http.postMethod("product/save", data).subscribe(
                    res =>
                    {
                      this.bln_Loading = false;
                      this.obj_GetPrdAddRes = res;
                      if (
                        this.obj_GetPrdAddRes[0].result ===
                        "Product Details already exist"
                      )
                      {
                        swal({
                          title: "Product Already Exist",
                          text: "",
                          type: "warning",
                          allowOutsideClick: false
                        });
                        this.addTabletForm.reset();
                        this.reiniDefValAftFrmSub();
                      } else if (
                        this.obj_GetPrdAddRes[0].result ===
                        "Product Added Successfully" ||
                        this.obj_GetPrdAddRes[0].result ===
                        "ProductCoated Added Successfully" ||
                        this.obj_GetPrdAddRes[0].result ===
                        "ProductGranulation Added Successfully"
                      )
                      {
                        swal({
                          title: "Product Added Successfully",
                          text: "",
                          type: "success",
                          allowOutsideClick: false
                        });
                        this.bln_ChkTypeCoated = false;
                        this.addTabletForm.reset();

                        this.reiniDefValAftFrmSub();
                      } else
                      {
                        swal({
                          title: "Can not Add Product, Try again",
                          text: "",
                          type: "error",
                          allowOutsideClick: false
                        });
                      }
                      this.bln_ChkTypeCoated = false;
                    }
                  );
                }
                );

              }
            });
          }
        },
        function (dismiss) { }
      );
    }
  }

  tglPnlFunc(event: NgbPanelChangeEvent)
  {
    if (event.panelId == "Individual")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelCompressParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Individual"),
          1
        );
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Individual"),
          1
        );
        this.checkValidParameterValues();

        this.reset(
          this.flt_IndStd,
          this.flt_IndT1Neg,
          this.flt_IndT1Pos,
          this.flt_IndT2Neg,
          this.flt_IndT2Pos,
          this.int_IndNMTTabCnt
        );
      } else
      {
        this.sarr_getSelCompressParamAccName.push("Individual");
        this.sarr_getSelectedParamAccName.push("Individual");

        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Group")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelCompressParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Group"),
          1
        );
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Group"),
          1
        );
        this.checkValidParameterValues();

        this.reset(
          this.flt_GrpStd,
          this.flt_GrpT1Neg,
          this.flt_GrpT1Pos,
          this.flt_GrpT2Neg,
          this.flt_GrpT2Pos,
          this.int_GrpNMTTabCnt
        );
      } else
      {
        this.sarr_getSelCompressParamAccName.push("Group");
        this.sarr_getSelectedParamAccName.push("Group");

        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Thickness")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelCompressParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Thickness"),
          1
        );
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Thickness"),
          1
        );
        this.checkValidParameterValues();

        this.reset(
          this.flt_ThkStd,
          this.flt_ThkT1Neg,
          this.flt_ThkT1Pos,
          this.flt_ThkT2Neg,
          this.flt_ThkT2Pos,
          this.int_ThkNMTTabCnt
        );
      } else
      {
        this.sarr_getSelCompressParamAccName.push("Thickness");
        this.sarr_getSelectedParamAccName.push("Thickness");
        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Breadth")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelCompressParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Breadth"),
          1
        );
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Breadth"),
          1
        );
        this.checkValidParameterValues();

        this.reset(
          this.flt_BrdStd,
          this.flt_BrdT1Neg,
          this.flt_BrdT1Pos,
          this.flt_BrdT2Neg,
          this.flt_BrdT2Pos,
          this.int_BrdNMTTabCnt
        );
      } else
      {
        this.sarr_getSelCompressParamAccName.push("Breadth");
        this.sarr_getSelectedParamAccName.push("Breadth");
        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Length")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelCompressParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Length"),
          1
        );
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Length"),
          1
        );
        this.checkValidParameterValues();

        this.reset(
          this.flt_LenStd,
          this.flt_LenT1Neg,
          this.flt_LenT1Pos,
          this.flt_LenT2Neg,
          this.flt_LenT2Pos,
          this.int_LenNMTTabCnt
        );
      } else
      {
        this.sarr_getSelCompressParamAccName.push("Length");
        this.sarr_getSelectedParamAccName.push("Length");
        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Diameter")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelCompressParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Diameter"),
          1
        );
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Diameter"),
          1
        );
        this.checkValidParameterValues();

        this.reset(
          this.flt_DiaStd,
          this.flt_DiaT1Neg,
          this.flt_DiaT1Pos,
          this.flt_DiaT2Neg,
          this.flt_DiaT2Pos,
          this.int_DiaNMTTabCnt
        );
      } else
      {
        this.sarr_getSelCompressParamAccName.push("Diameter");
        this.sarr_getSelectedParamAccName.push("Diameter");
        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Hardness")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelCompressParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Hardness"),
          1
        );
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Hardness"),
          1
        );
        this.checkValidParameterValues();

        this.flt_HrdStd.reset();
        this.flt_HrdT1.reset();
        this.flt_HrdT2.reset();
      } else
      {
        this.sarr_getSelCompressParamAccName.push("Hardness");
        this.sarr_getSelectedParamAccName.push("Hardness");
        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Friability")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelCompressParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Friability"),
          1
        );
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Friability"),
          1
        );
        this.checkValidParameterValues();

        this.flt_FriNMT.reset();
        this.int_FriSetCnt.reset();
        this.int_FriSetRPM.reset();
      } else
      {
        this.sarr_getSelCompressParamAccName.push("Friability");
        this.sarr_getSelectedParamAccName.push("Friability");
        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Disintegration")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelCompressParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Disintegration"),
          1
        );
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Disintegration"),
          1
        );
        this.checkValidParameterValues();

        this.int_DTHHTime.reset();
        this.int_DTMMTime.reset();
        this.int_DTSSTime.reset();
        this.flt_DTMinTemp.reset();
        this.flt_DTMaxTemp.reset();
      } else
      {
        this.sarr_getSelCompressParamAccName.push("Disintegration");
        this.sarr_getSelectedParamAccName.push("Disintegration");
        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Tapped Density")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelCompressParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Tapped Density"),
          1
        );
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Tapped Density"),
          1
        );
        this.checkValidParameterValues();

        this.flt_TDT1.reset();
        this.flt_TDT2.reset();
      } else
      {
        this.sarr_getSelCompressParamAccName.push("Tapped Density");
        this.sarr_getSelectedParamAccName.push("Tapped Density");
        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "LOD")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelCompressParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("LOD"),
          1
        );
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("LOD"),
          1
        );
        this.checkValidParameterValues();

        this.flt_MAT1.reset();
        this.flt_MAT2.reset();
      } else
      {
        this.sarr_getSelCompressParamAccName.push("LOD");
        this.sarr_getSelectedParamAccName.push("LOD");
        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "%Fine")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelCompressParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("%Fine"),
          1
        );
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("%Fine"),
          1
        );
        this.checkValidParameterValues();

        this.flt_SST1.reset();
        this.flt_SST2.reset();
      } else
      {
        this.sarr_getSelCompressParamAccName.push("%Fine");
        this.sarr_getSelectedParamAccName.push("%Fine");
        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Individual Layer-1")
    {
      if (event.nextState == false)
      {
        this.bln_selAccIndLay1Param = false;

        this.sarr_getSelCompressParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Individual Layer-1"),
          1
        );
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Individual Layer-1"),
          1
        );
        this.checkValidParameterValues();

        this.reset(
          this.flt_IndL1Std,
          this.flt_IndL1T1Neg,
          this.flt_IndL1T1Pos,
          this.flt_IndL1T2Neg,
          this.flt_IndL1T2Pos,
          this.int_IndL1NMTTabCount
        );
      } else
      {
        this.bln_selAccIndLay1Param = true;

        this.sarr_getSelCompressParamAccName.push("Individual Layer-1");
        this.sarr_getSelectedParamAccName.push("Individual Layer-1");
        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Group Layer-1")
    {
      if (event.nextState == false)
      {
        this.bln_selAccGrpLay1Param = false;

        this.sarr_getSelCompressParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Group Layer-1"),
          1
        );
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Group Layer-1"),
          1
        );
        this.checkValidParameterValues();

        this.reset(
          this.flt_GrpL1Std,
          this.flt_GrpL1T1Neg,
          this.flt_GrpL1T1Pos,
          this.flt_GrpL1T2Neg,
          this.flt_GrpL1T2Pos,
          this.int_GrpL1NMTTabCount
        );
      } else
      {
        this.bln_selAccGrpLay1Param = true;

        this.sarr_getSelCompressParamAccName.push("Group Layer-1");
        this.sarr_getSelectedParamAccName.push("Group Layer-1");
        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Individual Layer-2")
    {
      if (event.nextState == false)
      {
        this.bln_selAccIndLay2Param = false;

        this.sarr_getSelCompressParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Individual Layer-2"),
          1
        );
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Individual Layer-2"),
          1
        );
        this.checkValidParameterValues();

        this.reset(
          this.flt_IndL2Std,
          this.flt_IndL2T1Neg,
          this.flt_IndL2T1Pos,
          this.flt_IndL2T2Neg,
          this.flt_IndL2T2Pos,
          this.int_IndL2NMTTabCount
        );
      } else
      {
        this.bln_selAccIndLay2Param = true;

        this.sarr_getSelCompressParamAccName.push("Individual Layer-2");
        this.sarr_getSelectedParamAccName.push("Individual Layer-2");
        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Group Layer-2")
    {
      if (event.nextState == false)
      {
        this.bln_selAccGrpLay2Param = false;

        this.sarr_getSelCompressParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Group Layer-2"),
          1
        );
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Group Layer-2"),
          1
        );
        this.checkValidParameterValues();

        this.reset(
          this.flt_GrpL2Std,
          this.flt_GrpL2T1Neg,
          this.flt_GrpL2T1Pos,
          this.flt_GrpL2T2Neg,
          this.flt_GrpL2T2Pos,
          this.int_GrpL2NMTTabCount
        );
      } else
      {
        this.bln_selAccGrpLay2Param = true;

        this.sarr_getSelCompressParamAccName.push("Group Layer-2");
        this.sarr_getSelectedParamAccName.push("Group Layer-2");
        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Individual Coat")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Individual Coat"),
          1
        );

        this.sarr_getSelCoatParamAccName.splice(
          this.sarr_getSelCoatParamAccName.indexOf("Individual Coat"),
          1
        );

        this.checkValidParameterValues();

        this.reset(
          this.flt_IndStdCoat,
          this.flt_IndT1NegCoat,
          this.flt_IndT1PosCoat,
          this.flt_IndT2NegCoat,
          this.flt_IndT2PosCoat,
          this.int_IndNMTTabCntCoat
        );
      } else
      {
        this.sarr_getSelectedParamAccName.push("Individual Coat");
        this.sarr_getSelCoatParamAccName.push("Individual Coat");

        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Group Coat")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Group Coat"),
          1
        );

        this.sarr_getSelCoatParamAccName.splice(
          this.sarr_getSelCoatParamAccName.indexOf("Group Coat"),
          1
        );

        this.checkValidParameterValues();

        this.reset(
          this.flt_GrpStdCoat,
          this.flt_GrpT1NegCoat,
          this.flt_GrpT1PosCoat,
          this.flt_GrpT2NegCoat,
          this.flt_GrpT2PosCoat,
          this.int_GrpNMTTabCntCoat
        );
      } else
      {
        this.sarr_getSelectedParamAccName.push("Group Coat");
        this.sarr_getSelCoatParamAccName.push("Group Coat");

        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Thickness Coat")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Thickness Coat"),
          1
        );

        this.sarr_getSelCoatParamAccName.splice(
          this.sarr_getSelCoatParamAccName.indexOf("Thickness Coat"),
          1
        );
        this.checkValidParameterValues();

        this.reset(
          this.flt_ThkStdCoat,
          this.flt_ThkT1NegCoat,
          this.flt_ThkT1PosCoat,
          this.flt_ThkT2NegCoat,
          this.flt_ThkT2PosCoat,
          this.int_ThkNMTTabCntCoat
        );
      } else
      {
        this.sarr_getSelectedParamAccName.push("Thickness Coat");
        this.sarr_getSelCoatParamAccName.push("Thickness Coat");

        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Breadth Coat")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Breadth Coat"),
          1
        );

        this.sarr_getSelCoatParamAccName.splice(
          this.sarr_getSelCoatParamAccName.indexOf("Breadth Coat"),
          1
        );

        this.checkValidParameterValues();

        this.reset(
          this.flt_BrdStdCoat,
          this.flt_BrdT1NegCoat,
          this.flt_BrdT1PosCoat,
          this.flt_BrdT2NegCoat,
          this.flt_BrdT2PosCoat,
          this.int_BrdNMTTabCntCoat
        );
      } else
      {
        this.sarr_getSelectedParamAccName.push("Breadth Coat");
        this.sarr_getSelCoatParamAccName.push("Breadth Coat");

        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Length Coat")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Length Coat"),
          1
        );

        this.sarr_getSelCoatParamAccName.splice(
          this.sarr_getSelCoatParamAccName.indexOf("Length Coat"),
          1
        );

        this.checkValidParameterValues();

        this.reset(
          this.flt_LenStdCoat,
          this.flt_LenT1NegCoat,
          this.flt_LenT1PosCoat,
          this.flt_LenT2NegCoat,
          this.flt_LenT2PosCoat,
          this.int_LenNMTTabCntCoat
        );
      } else
      {
        this.sarr_getSelectedParamAccName.push("Length Coat");
        this.sarr_getSelCoatParamAccName.push("Length Coat");

        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Diameter Coat")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Diameter Coat"),
          1
        );

        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelCoatParamAccName.indexOf("Diameter Coat"),
          1
        );

        this.checkValidParameterValues();

        this.reset(
          this.flt_DiaStdCoat,
          this.flt_DiaT1NegCoat,
          this.flt_DiaT1PosCoat,
          this.flt_DiaT2NegCoat,
          this.flt_DiaT2PosCoat,
          this.int_DiaNMTTabCntCoat
        );
      } else
      {
        this.sarr_getSelectedParamAccName.push("Diameter Coat");
        this.sarr_getSelCoatParamAccName.push("Diameter Coat");

        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Hardness Coat")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Hardness Coat"),
          1
        );

        this.sarr_getSelCoatParamAccName.splice(
          this.sarr_getSelCoatParamAccName.indexOf("Hardness Coat"),
          1
        );

        this.checkValidParameterValues();

        this.flt_HrdStdCoat.reset();
        this.flt_HrdT1Coat.reset();
        this.flt_HrdT2Coat.reset();

        this.addTabletForm.patchValue({
          str_HrdUnitCoat: this.sarr_getHrdUnitFromJson
        });

        this.addTabletForm.patchValue({
          str_HrdGraphOnCoat: ["Standard", "Average"]
        });
      } else
      {
        this.sarr_getSelectedParamAccName.push("Hardness Coat");
        this.sarr_getSelCoatParamAccName.push("Hardness Coat");

        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Friability Coat")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Friability Coat"),
          1
        );

        this.sarr_getSelCoatParamAccName.splice(
          this.sarr_getSelCoatParamAccName.indexOf("Friability Coat"),
          1
        );

        this.checkValidParameterValues();

        this.flt_FriNMTCoat.reset();
        this.int_FriSetCntCoat.reset();
        this.int_FriSetRPMCoat.reset();
      } else
      {
        this.sarr_getSelectedParamAccName.push("Friability Coat");
        this.sarr_getSelCoatParamAccName.push("Friability Coat");

        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Disintegration Coat")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Disintegration Coat"),
          1
        );

        this.sarr_getSelCoatParamAccName.splice(
          this.sarr_getSelCoatParamAccName.indexOf("Disintegration Coat"),
          1
        );

        this.checkValidParameterValues();

        this.int_DTHHTimeCoat.reset();
        this.int_DTMMTimeCoat.reset();
        this.int_DTSSTimeCoat.reset();
        this.flt_DTMinTempCoat.reset();
        this.flt_DTMaxTempCoat.reset();
      } else
      {
        this.sarr_getSelectedParamAccName.push("Disintegration Coat");
        this.sarr_getSelCoatParamAccName.push("Disintegration Coat");

        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "LOD Compressed Dry")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("LOD Compressed Dry"),
          1
        );

        // this.sarr_getSelCoatParamAccName.splice(
        //   this.sarr_getSelCoatParamAccName.indexOf("LOD Compressed Dry"),
        //   1
        // );

        this.checkValidParameterValues();
        this.flt_CompDryMin.reset();
        this.flt_CompDryMax.reset();
      } else
      {
        this.sarr_getSelectedParamAccName.push("LOD Compressed Dry");
        // this.sarr_getSelCoatParamAccName.push("LOD Compressed Dry");

        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "LOD Compressed Lubricated")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf(
            "LOD Compressed Lubricated"
          ),
          1
        );

        // this.sarr_getSelCoatParamAccName.splice(
        //   this.sarr_getSelCoatParamAccName.indexOf(
        //     "LOD Compressed Lubricated"
        //   ),
        //   1
        // );

        this.checkValidParameterValues();
        this.flt_CompLubMin.reset();
        this.flt_CompLubMax.reset();
      } else
      {
        this.sarr_getSelectedParamAccName.push("LOD Compressed Lubricated");
        // this.sarr_getSelCoatParamAccName.push("LOD Compressed Lubricated");

        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "LOD Layer1 Dry")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("LOD Layer1 Dry"),
          1
        );

        // this.sarr_getSelCoatParamAccName.splice(
        //   this.sarr_getSelCoatParamAccName.indexOf("LOD Layer1 Dry"),
        //   1
        // );

        this.checkValidParameterValues();
        this.flt_Layer1DryMin.reset();
        this.flt_Layer1DryMax.reset();
      } else
      {
        this.sarr_getSelectedParamAccName.push("LOD Layer1 Dry");
        // this.sarr_getSelCoatParamAccName.push("LOD Layer1 Dry");

        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "LOD Layer 1 Lubricated")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("LOD Layer 1 Lubricated"),
          1
        );

        // this.sarr_getSelCoatParamAccName.splice(
        //   this.sarr_getSelCoatParamAccName.indexOf("LOD Layer 1 Lubricated"),
        //   1
        // );

        this.checkValidParameterValues();
        this.flt_Layer1LubMin.reset();
        this.flt_Layer1LubMax.reset();
      } else
      {
        this.sarr_getSelectedParamAccName.push("LOD Layer 1 Lubricated");
        // this.sarr_getSelCoatParamAccName.push("LOD Layer 1 Lubricated");

        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "LOD Layer2 Dry")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("LOD Layer2 Dry"),
          1
        );

        // this.sarr_getSelCoatParamAccName.splice(
        //   this.sarr_getSelCoatParamAccName.indexOf("LOD Layer2 Dry"),
        //   1
        // );

        this.checkValidParameterValues();
        this.flt_Layer2DryMin.reset();
        this.flt_Layer2DryMax.reset();
      } else
      {
        this.sarr_getSelectedParamAccName.push("LOD Layer2 Dry");
        // this.sarr_getSelCoatParamAccName.push("LOD Layer2 Dry");

        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "LOD Layer 2 Lubricated")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("LOD Layer 2 Lubricated"),
          1
        );
        this.checkValidParameterValues();
        this.flt_Layer2LubMin.reset();
        this.flt_Layer2LubMax.reset();
      } else
      {
        this.sarr_getSelectedParamAccName.push("LOD Layer 2 Lubricated");
        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Tap Density")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Tap Density"),
          1
        );
        this.checkValidParameterValues();
        this.flt_TapDenMin.reset();
        this.flt_TapDenMax.reset();
      } else
      {
        this.sarr_getSelectedParamAccName.push("Tap Density");
        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "% Fine")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("% Fine"),
          1
        );
        this.checkValidParameterValues();
        this.flt_FineMin.reset();
        this.flt_FineMax.reset();
      } else
      {
        this.sarr_getSelectedParamAccName.push("% Fine");
        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Particle Sizing")
    {
      if (event.nextState == false)
      {
        this.sarr_getSelectedParamAccName.splice(
          this.sarr_getSelectedParamAccName.indexOf("Particle Sizing"),
          1
        );
        this.checkValidParameterValues();
        this.flt_PartSizingMin.reset();
        this.flt_PartSizingMax.reset();
      } else
      {
        this.sarr_getSelectedParamAccName.push("Particle Sizing");
        this.checkValidParameterValues();
      }
    }
  }

  getUnits(menu: string)
  {
    this.jsonService
      .getValueFromJSON()
      .then((res: any) =>
      {
        const sarr_getUnitResult = res.Unit;
        for (let i = 0; i < Object.keys(sarr_getUnitResult).length; i++)
        {
          if (
            sarr_getUnitResult[i].Value === 1 &&
            sarr_getUnitResult[i].menu === menu
          )
          {
            this.sarr_getUnitList.push(sarr_getUnitResult[i].Name);
          }
        }
      })
      .catch(err =>
      {
        console.log(err);
      });

    return this.sarr_getUnitList;
  }

  reset(
    std: AbstractControl,
    t1Pos: AbstractControl,
    t1Neg: AbstractControl,
    t2Pos: AbstractControl,
    t2Neg: AbstractControl,
    setNMTTabCount: AbstractControl
  )
  {
    std.reset();

    t1Pos.reset();
    t1Neg.reset();

    t2Pos.reset();
    t2Neg.reset();

    setNMTTabCount.reset();
  }

  reiniDefValAftFrmSub()
  {
    this.fetchPrdCombination()
      .then(res =>
      {
        this.initializePrdInputField(res);
      })
      .catch(err =>
      {
        this.errorHandling.checkError(err.status);
      });

    this.activeIds = [];
    this.sarr_getSelectedParamAccName = [];

    this.checkValidParameterValues();

    this.resetDrpDown();

    this.bln_ChkTypeTriLayPrd = false;
    this.bln_ChkTypeBiLayPrd = false;
    this.bln_ChkTypeCoatPrd = false;
    this.bln_ChkTypeGrannualPrd = false;
    this.bln_TypeBiLayPrd.setValue(false);
    this.bln_TypeTriLayPrd.setValue(false);
    this.bln_TypeCoatPrd.setValue(false);
    this.bln_TypeGrannualPrd.setValue(false);
    this.bln_IsBinWeiging.setValue(false);
  }

  resetForm()
  {
    this.addTabletForm.reset();
    this.resetDrpDown();
  }

  resetDrpDown()
  {
    this.addTabletForm.patchValue({
      str_BatchUnit: "Lakh",
      str_IndLimitOn: "Actual",
      str_IndGraphOn: "Standard",
      str_GrpLimitOn: "Actual",
      str_GrpGraphOn: "Standard",
      str_IndL1LimitOn: "Actual",
      str_IndL1GraphOn: "Standard",
      str_GrpL1LimitOn: "Actual",
      str_GrpL1GraphOn: "Standard",
      str_IndL2LimitOn: "Actual",
      str_IndL2GraphOn: "Standard",
      str_GrpL2LimitOn: "Actual",
      str_GrpL2GraphOn: "Standard",
      str_IndLimitOnCoat: "Actual",
      str_IndGraphOnCoat: "Standard",
      str_GrpLimitOnCoat: "Actual",
      str_GrpGraphOnCoat: "Standard",
      str_HrdGraphOn: "Standard",
      str_HrdUnit: "Kp",
      str_HrdGraphOnCoat: "Standard",
      str_HrdUnitCoat: "Kp"
    });
  }
}
