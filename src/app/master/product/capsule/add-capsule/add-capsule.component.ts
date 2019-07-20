import { Component, OnInit, Output } from '@angular/core';
import { DataService } from '../../../../services/commonData/data.service';
import { JsonDataService } from '../../../../services/commonData/json-data.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, FormControl } from '@angular/forms';
import { ValidationService } from '../../../../services/validations/validation.service';
import { MatDialog } from '@angular/material';
import { RemarkComponent } from '../../../../shared/remark/remark/remark.component';
import { SessionStorageService } from 'ngx-webstorage';
import { HttpService } from '../../../../services/http/http.service';
import { NgbPanelChangeEvent, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ErrorHandlingService } from "../../../../services/error-handling/error-handling.service";
declare var swal: any;
@Component({
  selector: 'app-add-capsule',
  templateUrl: './add-capsule.component.html',
  styleUrls: ['./add-capsule.component.css']
})
export class AddCapsuleComponent implements OnInit {
  // Variables declares for Nomecaltures of Product BFG Code & Product Name
  str_LblBFGCode: string = '';
  str_LblProductName: string = '';
  bln_IndiDisabled = false;
  str_TxtBFGCode: string = '';
  str_TxtPrdName: string = '';
  str_TxtPrdVerNo: string = '';
  str_TxtVerNo: string = '';

  // Variable declare for Unit of Individual Parameter
  str_IndUnit: string = '';

  // Variable declare for Batch Filed Visibility
  str_BatchSizeVisibility: string = '';

  // Variable declare for Bin Weighing Checkbox Visibility
  str_BinWeighingVisibility: string = '';

  // Variable declare for Units Showing
  sarr_getUnitList: Array<any> = [];
  sarr_getHrdUnitFromJson: Array<any> = [];

  // Variable declare for storing Selected According Name
  sarr_getSelectedParamAccName: Array<any> = [];

  sarr_getSelCompressParamAccName: Array<any> = [];

  // Variable declare for textfiled enabled/disabled of Product BFG Code, Product Version & Version
  bln_disableTextFld_BFG: boolean = true;
  bln_disableTextFld_PrdVersion: boolean = true;
  bln_disableTextFld_Version: boolean = true;

  // Variable declare for textfiled enabled/disabled of Product BFG Code, Product Version & Version
  bln_disTxtFldsIfIndT1Zero: boolean = false;
  bln_disTxtFldsIfGrpT1Zero: boolean = false;

  bln_disTxtFldsIfNetT1Zero: boolean = false;
  bln_disTxtFldsIfEmptyT1Zero: boolean = false;
  bln_disTxtFldsIfBrdT1Zero: boolean = false;
  bln_disTxtFldsIfLenT1Zero: boolean = false;
  bln_disTxtFldsIfDiaT1Zero: boolean = false;

  // Variable declare for setting boolen values if all Valid Parameters Entered
  bln_accParamValid: boolean = false;

  // Variable declare for storing Graph Types
  sarr_GraphType = ["Standard", "Average"];

  // Variable declare for storing Limit Types
  sarr_LimitType = ["Actual", "Percenatge"];

  // Variable declare for Batch Units
  sarr_getBatchUnit = ["Lakh", "Million", "Thousand"];

  // Variable declare for showing Loader
  public bln_Loading = false;

  // Variable declare for Modal Pop Up according to condition
  bln_IsPopupOpened = true;

  // Variable declare for showing/hinding Layer's According Parameter boolean flag
  bln_ChkTypeBiLayPrd = false;
  bln_ChkTypeTriLayPrd = false;
  bln_ChkTypeCoatPrd = false;

  // Variable declare for storing Product Added API response
  obj_GetPrdAddRes: any;

  activeIds: string[] = [];

  obj_PrdDetails: any;
  sarr_PrdDetails: Array<string> = [];

  bln_hideChkTxtFld_BFG: boolean = false;
  bln_hideChkTxtFld_PrdVer: boolean = false;
  bln_hideChkTxtFld_Ver: boolean = false;

  addCapsuleForm: FormGroup;

  constructor
    (
      private dataService?: DataService,
      private jsonService?: JsonDataService,
      private fb?: FormBuilder,
      private validation?: ValidationService,
      private dialog?: MatDialog,
      private sessionStorage?: SessionStorageService,
      private errorHandling?: ErrorHandlingService,
      private http?: HttpService
    ) {

    this.addCapsuleForm = this.fb.group({
      str_BFGCode:
        ['NA',
          Validators.compose([
            this.validation.requiredField,
            this.validation.validateOnlyWhiteSpaceEnter
          ])],

      str_Prd:
        ['',
          Validators.compose([
            this.validation.requiredField,
            this.validation.validateOnlyWhiteSpaceEnter
          ])],

      str_PV:
        ['NA',
          Validators.compose([
            this.validation.requiredField,
            this.validation.validateOnlyWhiteSpaceEnter
          ])],

      str_V:
        ['NA',
          Validators.compose([
            this.validation.requiredField,
            this.validation.validateOnlyWhiteSpaceEnter
          ])],

      flt_BatchSize:
        ['NA',
          Validators.compose([
            this.validation.requiredField,
            this.validation.validateOnlyWhiteSpaceEnter,
            this.validation.validateZeroEntry
          ])],

      str_BatchUnit:
        ['Lakh',
          Validators.compose([
            this.validation.requiredField,
            this.validation.validateOnlyWhiteSpaceEnter
          ])],

      bln_IsBinWeiging:
        [false],

      flt_IndStd:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])],

      flt_IndT1Neg:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
        ])],

      flt_IndT1Pos:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_IndT1Neg", "Individual", "1", "Positive", "Zero"),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_IndT1Neg", "Individual", "1", "Positive", "Yes")
        ])],

      flt_IndT2Neg:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_IndT1Neg", "Individual", "2", "Negative", "No")
        ])],

      flt_IndT2Pos:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_IndT1Pos", "Individual", "2", "Positive", "No"),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_IndT2Neg", "Individual", "2", "Positive", "Yes"),
        ])],

      str_IndLimitOn:
        ['Actual', Validators.compose([Validators.required
        ])],

      str_IndGraphOn:
        ['Standard', Validators.compose([Validators.required
        ])],

      int_IndNMTTabCnt:
        ['', Validators.compose([
          this.validation.requiredField
        ])],

      flt_GrpStd:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])],

      flt_GrpT1Neg:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])],

      flt_GrpT1Pos:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_GrpT1Neg", "Group", "1", "Positive", "Zero"),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_GrpT1Neg", "Group", "1", "Positive", "Yes")
        ])],

      flt_GrpT2Neg:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_GrpT1Neg", "Group", "2", "Negative", "No")
        ])],

      flt_GrpT2Pos:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_GrpT1Pos", "Group", "2", "Positive", "No"),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_GrpT2Neg", "Group", "2", "Positive", "Yes"),
        ])],

      str_GrpLimitOn:
        ['Actual', Validators.compose([Validators.required
        ])],

      str_GrpGraphOn:
        ['Standard', Validators.compose([Validators.required
        ])],

      int_GrpNMTTabCnt:
        ['', Validators.compose([
          this.validation.requiredField
        ])],

      flt_DiffNet:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])],

      flt_DiffNetT1Neg:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])],

      flt_DiffNetT1Pos:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_DiffNetT1Neg", "Dimension", "1", "Positive", "Zero"),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_DiffNetT1Neg", "Dimension", "1", "Positive", "Yes")
        ])],

      flt_DiffNetT2Neg:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_DiffNetT1Neg", "Dimension", "2", "Negative", "No")
        ])],

      flt_DiffNetT2Pos:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_DiffNetT1Pos", "Dimension", "2", "Positive", "No"),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_DiffNetT2Neg", "Dimension", "2", "Positive", "Yes"),
        ])],

      flt_DiffNetLimitOn:
        ['Actual', Validators.compose([Validators.required
        ])],

      flt_DiffNetGraphOn:
        ['Standard', Validators.compose([Validators.required
        ])],

      flt_DiffNetNMTCnt:
        ['', Validators.compose([
          this.validation.requiredField
        ])],
      flt_Emptystd:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.checkForEmptyAndIndStd('flt_IndStd')
        ])],

      flt_EmptyT1Neg:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])],

      flt_EmptyT1Pos:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_EmptyT1Neg", "Dimension", "1", "Positive", "Zero"),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_EmptyT1Neg", "Dimension", "1", "Positive", "Yes")
        ])],

      flt_EmptyT2Neg:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_EmptyT1Neg", "Dimension", "2", "Negative", "No")
        ])],

      flt_EmptyT2Pos:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_EmptyT1Pos", "Dimension", "2", "Positive", "No"),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_EmptyT2Neg", "Dimension", "2", "Positive", "Yes"),
        ])],

      flt_EmptyLimitOn:
        ['Actual', Validators.compose([Validators.required
        ])],

      flt_EmptyGraphOn:
        ['Standard', Validators.compose([Validators.required
        ])],

      flt_EmptyNMTCnt:
        ['', Validators.compose([
          this.validation.requiredField
        ])],
      flt_LenStd:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])],

      flt_LenT1Neg:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])],

      flt_LenT1Pos:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_LenT1Neg", "Dimension", "1", "Positive", "Zero"),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_LenT1Neg", "Dimension", "1", "Positive", "Yes")
        ])],

      flt_LenT2Neg:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_LenT1Neg", "Dimension", "2", "Negative", "No")
        ])],

      flt_LenT2Pos:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_LenT1Pos", "Dimension", "2", "Positive", "No"),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_LenT2Neg", "Dimension", "2", "Positive", "Yes"),
        ])],

      int_LenNMTTabCnt:
        ['', Validators.compose([
          this.validation.requiredField
        ])],

      flt_DiaStd:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry
        ])],

      flt_DiaT1Neg:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter
        ])],

      flt_DiaT1Pos:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_DiaT1Neg", "Dimension", "1", "Positive", "Zero"),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_DiaT1Neg", "Dimension", "1", "Positive", "Yes")
        ])],

      flt_DiaT2Neg:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_DiaT1Neg", "Dimension", "2", "Negative", "No")
        ])],

      flt_DiaT2Pos:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.validateZeroEntry,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_DiaT1Pos", "Dimension", "2", "Positive", "No"),
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("flt_DiaT2Neg", "Dimension", "2", "Positive", "Yes"),
        ])],

      int_DiaNMTTabCnt:
        ['', Validators.compose([
          this.validation.requiredField
        ])],
      int_DTHHTime:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
        ])],

      int_DTMMTime:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
        ])],

      int_DTSSTime:
        ['', Validators.compose([
          this.validation.requiredField,
          this.validation.validateOnlyWhiteSpaceEnter,
          this.validation.stdT1PosT1NegT2NegT2PosValCmpValidator("int_DTMMTime", "Disintegration Test", "1", "Positive", "No"),
        ])],
    });

    this.addCapsuleForm.controls.str_IndGraphOn.valueChanges
      .subscribe(
        x => this.addCapsuleForm.controls.flt_IndT1Neg.updateValueAndValidity()
      )

    this.addCapsuleForm.controls.str_IndGraphOn.valueChanges
      .subscribe(
        x => this.addCapsuleForm.controls.flt_IndT1Pos.updateValueAndValidity()
      )

    this.addCapsuleForm.controls.int_DTHHTime.valueChanges
      .subscribe(
        x => this.addCapsuleForm.controls.int_DTSSTime.updateValueAndValidity()
      )
  }

  get str_BFGCode() { return this.addCapsuleForm.get('str_BFGCode'); }
  get str_Prd() { return this.addCapsuleForm.get('str_Prd'); }
  get str_PV() { return this.addCapsuleForm.get('str_PV'); }
  get str_V() { return this.addCapsuleForm.get('str_V'); }

  get flt_BatchSize() { return this.addCapsuleForm.get('flt_BatchSize'); }
  get str_BatchUnit() { return this.addCapsuleForm.get('str_BatchUnit'); }
  get bln_Tolerance1() { return this.addCapsuleForm.get('bln_Tolerance1'); }
  get bln_Tolerance2() { return this.addCapsuleForm.get('bln_Tolerance2'); }

  get bln_IsBinWeiging() { return this.addCapsuleForm.get('bln_IsBinWeiging'); }

  get flt_IndStd() { return this.addCapsuleForm.get('flt_IndStd'); }
  get flt_IndT1Neg() { return this.addCapsuleForm.get('flt_IndT1Neg'); }
  get flt_IndT1Pos() { return this.addCapsuleForm.get('flt_IndT1Pos'); }
  get flt_IndT2Neg() { return this.addCapsuleForm.get('flt_IndT2Neg'); }
  get flt_IndT2Pos() { return this.addCapsuleForm.get('flt_IndT2Pos'); }
  get str_IndGraphOn() { return this.addCapsuleForm.get('str_IndGraphOn'); }
  get str_IndLimitOn() { return this.addCapsuleForm.get('str_IndLimitOn'); }
  get int_IndNMTTabCnt() { return this.addCapsuleForm.get('int_IndNMTTabCnt'); }

  get flt_GrpStd() { return this.addCapsuleForm.get('flt_GrpStd'); }
  get flt_GrpT1Pos() { return this.addCapsuleForm.get('flt_GrpT1Pos'); }
  get flt_GrpT1Neg() { return this.addCapsuleForm.get('flt_GrpT1Neg'); }
  get flt_GrpT2Neg() { return this.addCapsuleForm.get('flt_GrpT2Neg'); }
  get flt_GrpT2Pos() { return this.addCapsuleForm.get('flt_GrpT2Pos'); }
  get str_GrpGraphOn() { return this.addCapsuleForm.get('str_GrpGraphOn'); }
  get str_GrpLimitOn() { return this.addCapsuleForm.get('str_GrpLimitOn'); }
  get int_GrpNMTTabCnt() { return this.addCapsuleForm.get('int_GrpNMTTabCnt'); }

  get flt_Emptystd() { return this.addCapsuleForm.get('flt_Emptystd'); }
  get flt_EmptyT1Neg() { return this.addCapsuleForm.get('flt_EmptyT1Neg'); }
  get flt_EmptyT1Pos() { return this.addCapsuleForm.get('flt_EmptyT1Pos'); }
  get flt_EmptyT2Neg() { return this.addCapsuleForm.get('flt_EmptyT2Neg'); }
  get flt_EmptyT2Pos() { return this.addCapsuleForm.get('flt_EmptyT2Pos'); }
  get flt_EmptyLimitOn() { return this.addCapsuleForm.get('flt_EmptyLimitOn'); }
  get flt_EmptyGraphOn() { return this.addCapsuleForm.get('flt_EmptyGraphOn'); }
  get flt_EmptyNMTCnt() { return this.addCapsuleForm.get('flt_EmptyNMTCnt'); }

  get flt_DiffNet() { return this.addCapsuleForm.get('flt_DiffNet'); }
  get flt_DiffNetT1Pos() { return this.addCapsuleForm.get('flt_DiffNetT1Pos'); }
  get flt_DiffNetT1Neg() { return this.addCapsuleForm.get('flt_DiffNetT1Neg'); }
  get flt_DiffNetT2Neg() { return this.addCapsuleForm.get('flt_DiffNetT2Neg'); }
  get flt_DiffNetT2Pos() { return this.addCapsuleForm.get('flt_DiffNetT2Pos'); }
  get flt_DiffNetLimitOn() { return this.addCapsuleForm.get('flt_DiffNetLimitOn'); }
  get flt_DiffNetGraphOn() { return this.addCapsuleForm.get('flt_DiffNetGraphOn'); }
  get flt_DiffNetNMTCnt() { return this.addCapsuleForm.get('flt_DiffNetNMTCnt'); }

  get flt_LenStd() { return this.addCapsuleForm.get('flt_LenStd'); }
  get flt_LenT1Pos() { return this.addCapsuleForm.get('flt_LenT1Pos'); }
  get flt_LenT1Neg() { return this.addCapsuleForm.get('flt_LenT1Neg'); }
  get flt_LenT2Neg() { return this.addCapsuleForm.get('flt_LenT2Neg'); }
  get flt_LenT2Pos() { return this.addCapsuleForm.get('flt_LenT2Pos'); }
  get int_LenNMTTabCnt() { return this.addCapsuleForm.get('int_LenNMTTabCnt'); }

  get flt_DiaStd() { return this.addCapsuleForm.get('flt_DiaStd'); }
  get flt_DiaT1Neg() { return this.addCapsuleForm.get('flt_DiaT1Neg'); }
  get flt_DiaT1Pos() { return this.addCapsuleForm.get('flt_DiaT1Pos'); }
  get flt_DiaT2Neg() { return this.addCapsuleForm.get('flt_DiaT2Neg'); }
  get flt_DiaT2Pos() { return this.addCapsuleForm.get('flt_DiaT2Pos'); }
  get int_DiaNMTTabCnt() { return this.addCapsuleForm.get('int_DiaNMTTabCnt'); }

  get int_DTHHTime() { return this.addCapsuleForm.get('int_DTHHTime'); }
  get int_DTMMTime() { return this.addCapsuleForm.get('int_DTMMTime'); }
  get int_DTSSTime() { return this.addCapsuleForm.get('int_DTSSTime'); }

  ngOnInit() {
    this.dataService.getNomenclatureDetails().then(res => {
      this.initializeInputField(res[0]);
    }).catch(err => {
      this.errorHandling.checkError(err.status);
    });

    this.fetchPrdCombination().then(res => {
      this.initializePrdInputField(res);
    }).catch(err => {
      this.errorHandling.checkError(err.status);
    });

    this.jsonService.getValueFromJSON().then((res: any) => {
      this.str_IndUnit = res.Tablet[2].Value;

      this.str_BatchSizeVisibility = res.Master[3].Value;

      if (this.str_BatchSizeVisibility == "0") {
        this.addCapsuleForm.patchValue({
          flt_BatchSize: ""
        })
      }

      this.str_BinWeighingVisibility = res.Bin[1].Value;

      this.sarr_getHrdUnitFromJson = this.getUnits("H");

    }).catch(err => {
      console.log(err)
    });
  }

  /************** Function Detail ************/
  //This function is used to display value in input field
  /************End Function Detail ***********/
  initializeInputField(str_inputData: any) {
    this.str_LblBFGCode = (str_inputData.BFGCode);
    this.str_LblProductName = (str_inputData.ProductName);
  }

  /************** Function Detail ************/
  //This function is used to display product checkbox & its Labels value
  /************End Function Detail ***********/
  initializePrdInputField(str_inputData: any) {

    this.str_TxtBFGCode = (str_inputData.ProductId);
    this.str_TxtPrdVerNo = (str_inputData.ProductVersion);
    this.str_TxtVerNo = (str_inputData.Version);

    if (this.str_TxtBFGCode == "" || this.str_TxtBFGCode == null) {
      this.bln_hideChkTxtFld_BFG = false;

      this.addCapsuleForm.patchValue({
        str_BFGCode: "NA"
      })

      this.bln_disableTextFld_BFG = true;
    }
    else if (this.str_TxtBFGCode == "NA") {
      this.bln_hideChkTxtFld_BFG = true;

      this.addCapsuleForm.patchValue({
        str_BFGCode: "NA"
      })

      this.bln_disableTextFld_BFG = true;
    }
    else if (this.str_TxtBFGCode != "NA") {
      this.bln_hideChkTxtFld_BFG = true;

      this.addCapsuleForm.patchValue({
        str_BFGCode: ""
      })

      this.bln_disableTextFld_BFG = false;
    }

    if (this.str_TxtPrdVerNo == "" || this.str_TxtPrdVerNo == null) {
      this.bln_hideChkTxtFld_PrdVer = false;

      this.addCapsuleForm.patchValue({
        str_PV: "NA"
      })

      this.bln_disableTextFld_PrdVersion = true;
    }
    else if (this.str_TxtPrdVerNo == "NA") {
      this.bln_hideChkTxtFld_PrdVer = true;

      this.addCapsuleForm.patchValue({
        str_PV: "NA"
      })

      this.bln_disableTextFld_PrdVersion = true;
    }
    else if (this.str_TxtPrdVerNo != "NA") {
      this.bln_hideChkTxtFld_PrdVer = true;

      this.addCapsuleForm.patchValue({
        str_PV: ""
      })

      this.bln_disableTextFld_PrdVersion = false;
    }

    if (this.str_TxtVerNo == "" || this.str_TxtVerNo == null) {
      this.bln_hideChkTxtFld_Ver = false;

      this.addCapsuleForm.patchValue({
        str_V: "NA"
      })

      this.bln_disableTextFld_Version = true;
    }
    else if (this.str_TxtVerNo == "NA") {
      this.bln_hideChkTxtFld_Ver = true;

      this.addCapsuleForm.patchValue({
        str_V: "NA"
      })

      this.bln_disableTextFld_Version = true;
    }
    else if (this.str_TxtVerNo != "NA") {
      this.bln_hideChkTxtFld_Ver = true;

      this.addCapsuleForm.patchValue({
        str_V: ""
      })

      this.bln_disableTextFld_Version = false;
    }
  }

  fetchPrdCombination() {
    return new Promise((resolve, reject) => {

      this.http.getMethod('product/checkPrdCombination/2').subscribe(res => {
        this.obj_PrdDetails = res;
        resolve(this.obj_PrdDetails);
      }, err => {
        reject('Error occured')
      })
    })
  }

  openSelAcc() {
    this.activeIds = this.sarr_getSelectedParamAccName.map(p => p);
  }

  checkValidParameterValues() {

    if (this.sarr_getSelectedParamAccName.length == 0) {
      this.bln_accParamValid = false;
    }

    this.sarr_getSelectedParamAccName.forEach(element => {

      var objLimits;
      objLimits = this.getParameterLimits(element);

      if ((this.str_BFGCode.value != "") && (this.str_Prd.value != "") &&
        (this.str_PV.value != "") && (this.str_V.value != "") &&
        ((this.str_BatchSizeVisibility == '0' && this.flt_BatchSize.valid != false) ||
          (this.str_BatchSizeVisibility == '1')) && (
          objLimits.Std != false &&
          objLimits.T1Neg != false && objLimits.T1Pos != false &&
          objLimits.T2Neg != false && objLimits.T2Pos != false &&
          objLimits.SetNMTTabCount != false)
        && (this.sarr_getSelCompressParamAccName.length != 0)
      ) {
        this.bln_accParamValid = true;
      }
      else {
        this.bln_accParamValid = false;
      }
    });
  }

  disabledTextFld(event: any) {

    switch (event.target.value) {

      case "chkBFGCode":

        if (event.target.checked == true) {

          this.bln_disableTextFld_BFG = false;

          this.addCapsuleForm.patchValue({
            str_BFGCode: ""
          })

          this.checkValidParameterValues();
        }
        else {

          this.bln_disableTextFld_BFG = true;

          this.addCapsuleForm.patchValue({
            str_BFGCode: "NA"
          })

          this.checkValidParameterValues();
        }

        break;

      case "chkPrdVersion":

        if (event.target.checked == true) {

          this.bln_disableTextFld_PrdVersion = false;

          this.addCapsuleForm.patchValue({
            str_PV: ""
          })

          this.checkValidParameterValues();

        }
        else {

          this.bln_disableTextFld_PrdVersion = true;

          this.addCapsuleForm.patchValue({
            str_PV: "NA"
          })

          this.checkValidParameterValues();

        }

        break;

      case "chkVersion":

        if (event.target.checked == true) {

          this.bln_disableTextFld_Version = false;

          this.addCapsuleForm.patchValue({
            str_V: ""
          })

          this.checkValidParameterValues();

        }
        else {

          this.bln_disableTextFld_Version = true;

          this.addCapsuleForm.patchValue({
            str_V: "NA"
          })

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

  onlyNumbersWithDecimal(event: any) {
    this.validation.onlyNumbersWithDecimal(event);
  }

  onlyNumbers(event: any) {
    this.validation.onlyNumbers(event);
  }

  setZeroOnT1PosAndDis(ctlName) {

    switch (ctlName) {

      case "flt_IndT1Neg":

        var flt_IndT1Neg = this.addCapsuleForm.value.flt_IndT1Neg;

        if (flt_IndT1Neg == "0") {

          this.bln_disTxtFldsIfIndT1Zero = true;

          this.addCapsuleForm.patchValue({
            flt_IndT1Pos: "0"
          })

          this.addCapsuleForm.patchValue({
            int_IndNMTTabCnt: "0"
          })
        }
        else {
          this.bln_disTxtFldsIfIndT1Zero = false;

          this.addCapsuleForm.patchValue({
            flt_IndT1Pos: ""
          })

          this.addCapsuleForm.patchValue({
            int_IndNMTTabCnt: ""
          })
        }

        break;

      case "flt_GrpT1Neg":

        var flt_GrpT1Neg = this.addCapsuleForm.value.flt_GrpT1Neg;

        if (flt_GrpT1Neg == "0") {

          this.bln_disTxtFldsIfGrpT1Zero = true;

          this.addCapsuleForm.patchValue({
            flt_GrpT1Pos: "0"
          })

          this.addCapsuleForm.patchValue({
            int_GrpNMTTabCnt: "0"
          })
        }
        else {
          this.bln_disTxtFldsIfGrpT1Zero = false;

          this.addCapsuleForm.patchValue({
            flt_GrpT1Pos: ""
          })

          this.addCapsuleForm.patchValue({
            int_GrpNMTTabCnt: ""
          })
        }

        break;

      case "flt_DiffNetT1Neg":

        var flt_DiffNetT1Neg = this.addCapsuleForm.value.flt_DiffNetT1Neg;

        if (flt_DiffNetT1Neg == "0") {

          this.bln_disTxtFldsIfNetT1Zero = true;

          this.addCapsuleForm.patchValue({
            flt_DiffNetT1Pos: "0"
          })

          this.addCapsuleForm.patchValue({
            flt_DiffNetNMTCnt: "0"
          })
        }
        else {
          this.bln_disTxtFldsIfNetT1Zero = false;

          this.addCapsuleForm.patchValue({
            flt_DiffNetT1Pos: ""
          })

          this.addCapsuleForm.patchValue({
            flt_DiffNetNMTCnt: ""
          })
        }

        break;
      case "flt_EmptyT1Neg":

        var flt_EmptyT1Neg = this.addCapsuleForm.value.flt_EmptyT1Neg;

        if (flt_EmptyT1Neg == "0") {

          this.bln_disTxtFldsIfEmptyT1Zero = true;

          this.addCapsuleForm.patchValue({
            flt_EmptyT1Pos: "0"
          })

          this.addCapsuleForm.patchValue({
            flt_EmptyNMTCnt: "0"
          })
        }
        else {
          this.bln_disTxtFldsIfEmptyT1Zero = false;

          this.addCapsuleForm.patchValue({
            flt_EmptyT1Pos: ""
          })

          this.addCapsuleForm.patchValue({
            flt_EmptyNMTCnt: ""
          })
        }

        break;

      case "flt_LenT1Neg":

        var flt_LenT1Neg = this.addCapsuleForm.value.flt_LenT1Neg;

        if (flt_LenT1Neg == "0") {

          this.bln_disTxtFldsIfLenT1Zero = true;

          this.addCapsuleForm.patchValue({
            flt_LenT1Pos: "0"
          })

          this.addCapsuleForm.patchValue({
            int_LenNMTTabCnt: "0"
          })
        }
        else {
          this.bln_disTxtFldsIfLenT1Zero = false;

          this.addCapsuleForm.patchValue({
            flt_LenT1Pos: ""
          })

          this.addCapsuleForm.patchValue({
            int_LenNMTTabCnt: ""
          })
        }

        break;

      case "flt_DiaT1Neg":

        var flt_DiaT1Neg = this.addCapsuleForm.value.flt_DiaT1Neg;

        if (flt_DiaT1Neg == "0") {

          this.bln_disTxtFldsIfDiaT1Zero = true;

          this.addCapsuleForm.patchValue({
            flt_DiaT1Pos: "0"
          })

          this.addCapsuleForm.patchValue({
            int_DiaNMTTabCnt: "0"
          })
        }
        else {
          this.bln_disTxtFldsIfDiaT1Zero = false;

          this.addCapsuleForm.patchValue({
            flt_DiaT1Pos: ""
          })

          this.addCapsuleForm.patchValue({
            int_DiaNMTTabCnt: ""
          })
        }

        break;
      default:
        break;
    }
  }

  dtTimeOnblur() {
    var dtHHTime = this.addCapsuleForm.value.int_DTHHTime;
    var dtMMTime = this.addCapsuleForm.value.int_DTMMTime;
    var dtSSTime = this.addCapsuleForm.value.int_DTSSTime;

    if (dtHHTime > 23) {
      this.addCapsuleForm.patchValue({
        int_DTHHTime: "23"
      })
    }

    if (dtMMTime > 59) {
      this.addCapsuleForm.patchValue({
        int_DTMMTime: "59"
      })
    }

    if (dtSSTime > 59) {
      this.addCapsuleForm.patchValue({
        int_DTSSTime: "59"
      })
    }
  }
  getParameterLimits(strPanelName): Object {

    let limits = {};

    switch (strPanelName) {

      case 'Individual':

        limits = {

          Std: this.flt_IndStd.valid,
          T1Neg: this.flt_IndT1Neg.valid,
          T1Pos: this.flt_IndT1Pos.valid,
          T2Neg: this.flt_IndT2Neg.valid,
          T2Pos: this.flt_IndT2Pos.valid,
          SetNMTTabCount: this.int_IndNMTTabCnt.valid

        }

        break;

      case 'Group':

        limits = {

          Std: this.flt_GrpStd.valid,
          T1Neg: this.flt_GrpT1Neg.valid,
          T1Pos: this.flt_GrpT1Pos.valid,
          T2Neg: this.flt_GrpT2Neg.valid,
          T2Pos: this.flt_GrpT2Pos.valid,
          SetNMTTabCount: this.int_GrpNMTTabCnt.valid

        }

        break;

      case 'Net':

        limits = {

          Std: this.flt_DiffNet.valid,
          T1Neg: this.flt_DiffNetT1Neg.valid,
          T1Pos: this.flt_DiffNetT1Pos.valid,
          T2Neg: this.flt_DiffNetT2Neg.valid,
          T2Pos: this.flt_DiffNetT2Pos.valid,
          SetNMTTabCount: this.flt_DiffNetNMTCnt.valid

        }

        break;
      case 'Empty':

        limits = {

          Std: this.flt_Emptystd.valid,
          T1Neg: this.flt_EmptyT1Neg.valid,
          T1Pos: this.flt_EmptyT1Pos.valid,
          T2Neg: this.flt_EmptyT2Neg.valid,
          T2Pos: this.flt_EmptyT2Pos.valid,
          SetNMTTabCount: this.flt_EmptyNMTCnt.valid

        }

        break;
      case 'Length':

        limits = {

          Std: this.flt_LenStd.valid,
          T1Neg: this.flt_LenT1Neg.valid,
          T1Pos: this.flt_LenT1Pos.valid,
          T2Neg: this.flt_LenT2Neg.valid,
          T2Pos: this.flt_LenT2Pos.valid,
          SetNMTTabCount: this.int_LenNMTTabCnt.valid

        }

        break;

      case 'Diameter':

        limits = {

          Std: this.flt_DiaStd.valid,
          T1Neg: this.flt_DiaT1Neg.valid,
          T1Pos: this.flt_DiaT1Pos.valid,
          T2Neg: this.flt_DiaT2Neg.valid,
          T2Pos: this.flt_DiaT2Pos.valid,
          SetNMTTabCount: this.int_DiaNMTTabCnt.valid

        }

        break;

      case 'Disintegration':

        limits = {

          Std: this.int_DTHHTime.valid,
          T1Neg: this.int_DTMMTime.valid,
          T1Pos: this.int_DTSSTime.valid

        }
        break;
    }
    return limits;
  }
  calculateNetValue(e) {
    let indStd;
    let flt_emptyStd;
    let flt_netStd;
    if (this.addCapsuleForm.value.flt_IndStd == '') {
      indStd = 0;
    } else {
      indStd = this.addCapsuleForm.value.flt_IndStd;
    }

    if (this.addCapsuleForm.value.flt_Emptystd == '') {
      flt_emptyStd = 0;
    } else {
      flt_emptyStd = this.addCapsuleForm.value.flt_Emptystd;
    }
    flt_netStd = indStd - flt_emptyStd;
    flt_netStd = flt_netStd.toString()
    this.addCapsuleForm.patchValue({
      flt_DiffNet: flt_netStd
    })
  }
  onSubmit() {
// console.log(this.addCapsuleForm.value)
    const obj_DeptData: Object = {};

    this.bln_Loading = false;

    swal({
      title: 'Are You Sure?',
      text: "Do You Want To Save ?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      allowOutsideClick: false
    }).then((result) => {
      if (result == true) {
        this.bln_IsPopupOpened = true;
        const message = { message: 'Add Product' };
        const dialogRef = this.dialog.open(RemarkComponent, {
          data: message,
          width: '570px',
          disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {

          const data: Object = {};

          if (result !== undefined) {
            const userId = this.sessionStorage.retrieve("userId").trim();
            const userName = this.sessionStorage.retrieve("userName").trim();
            const action = 'Add Product';
            const remark = result.reason.trim();

          //  let str_ThkGraphOn = "Standard";
            let str_LenGraphOn = "Standard";
            let str_DiaGraphOn = "Standard";
            let int_IndDp = this.validation.getDPValue(this.addCapsuleForm.value.flt_IndStd);
            let int_GrpDp = this.validation.getDPValue(this.addCapsuleForm.value.flt_GrpStd);
            let int_NetDp = this.validation.getDPValue(this.addCapsuleForm.value.flt_DiffNet);
            let int_EmptyDp = this.validation.getDPValue(this.addCapsuleForm.value.flt_Emptystd);
            let int_LenDp = this.validation.getDPValue(this.addCapsuleForm.value.flt_LenStd);
            let int_DiaDp = this.validation.getDPValue(this.addCapsuleForm.value.flt_DiaStd);
            let int_prdType = "2";
            Object.assign
              (data,
                this.addCapsuleForm.value,
                { str_LenGraphOn: str_LenGraphOn },
                { str_DiaGraphOn: str_DiaGraphOn },
                { int_prdType: int_prdType},
                { int_IndDP: int_IndDp },
                { int_Grpdp: int_GrpDp },
                { int_NetDp: int_NetDp },
                { int_LenDp: int_LenDp },
                { int_DiaDp: int_DiaDp },
                { int_EmptyDp: int_EmptyDp },
                { loggedUserId: userId },
                { loggedUserName: userName },
                { action: action },
                { bln_TypeCoatPrd: false },
                { remark: remark }
              );
            this.bln_Loading = true;
            console.log(JSON.stringify(data));

            this.http.postMethod('product/saveCapsule', data).subscribe((res) => {
             // console.log("res", res);
              this.bln_Loading = false;
              this.obj_GetPrdAddRes = res;
              if (this.obj_GetPrdAddRes[0].result === 'Product Details already exist') {
                swal
                  ({
                    title: "Product Already Exist",
                    text: "",
                    type: "warning",
                    allowOutsideClick: false,
                  });
                this.addCapsuleForm.reset();

                this.reiniDefValAftFrmSub();

              } else if (this.obj_GetPrdAddRes[0].result === 'Product Added Successfully') {
                swal
                  ({
                    title: "Product Added Successfully",
                    text: "",
                    type: "success",
                    allowOutsideClick: false,
                  });

                this.addCapsuleForm.reset();

                this.reiniDefValAftFrmSub();
              } else {
                swal
                  ({
                    title: "Can not Add Product, Try again",
                    text: "",
                    type: "error",
                    allowOutsideClick: false,
                  });
              }
            },
              err => {
                this.errorHandling.checkError(err.status);
                this.bln_Loading = false;
              });
          }
        });
      }
    }, function (dismiss) { })
  }

  tglPnlFunc(event: NgbPanelChangeEvent) {

    if (event.panelId == "Individual") {
      if (!this.bln_IndiDisabled) {
        if (event.nextState == false) {

          this.sarr_getSelCompressParamAccName.splice(this.sarr_getSelectedParamAccName.indexOf("Individual"), 1);
          this.sarr_getSelectedParamAccName.splice(this.sarr_getSelectedParamAccName.indexOf("Individual"), 1);
          this.checkValidParameterValues();

          this.reset(this.flt_IndStd, this.flt_IndT1Neg, this.flt_IndT1Pos, this.flt_IndT2Neg,
            this.flt_IndT2Pos, this.int_IndNMTTabCnt);
        }
        else {
          this.sarr_getSelCompressParamAccName.push("Individual");
          this.sarr_getSelectedParamAccName.push("Individual");

          this.checkValidParameterValues();
        }
    }
    }

    if (event.panelId == "Group") {

      if (event.nextState == false) {

        this.sarr_getSelCompressParamAccName.splice(this.sarr_getSelectedParamAccName.indexOf("Group"), 1);
        this.sarr_getSelectedParamAccName.splice(this.sarr_getSelectedParamAccName.indexOf("Group"), 1);
        this.checkValidParameterValues();

        this.reset(this.flt_GrpStd, this.flt_GrpT1Neg, this.flt_GrpT1Pos, this.flt_GrpT2Neg,
          this.flt_GrpT2Pos, this.int_GrpNMTTabCnt);
      }
      else {
        this.sarr_getSelCompressParamAccName.push("Group");
        this.sarr_getSelectedParamAccName.push("Group");

        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Net") {

      if (event.nextState == false) {
        this.bln_IndiDisabled = false;
        this.sarr_getSelCompressParamAccName.splice(this.sarr_getSelectedParamAccName.indexOf("Net"), 1);
        this.sarr_getSelectedParamAccName.splice(this.sarr_getSelectedParamAccName.indexOf("Net"), 1);
        if (this.sarr_getSelectedParamAccName.includes('Empty')) {
          this.sarr_getSelCompressParamAccName.splice(this.sarr_getSelectedParamAccName.indexOf("Empty"), 1);
          this.sarr_getSelectedParamAccName.splice(this.sarr_getSelectedParamAccName.indexOf("Empty"), 1);
        }
        this.checkValidParameterValues();

        this.reset(this.flt_DiffNet, this.flt_DiffNetT1Neg, this.flt_DiffNetT1Pos, this.flt_DiffNetT2Neg,
          this.flt_DiffNetT2Pos, this.int_IndNMTTabCnt);
      }
      else {
        this.bln_IndiDisabled = true;
        this.sarr_getSelCompressParamAccName.push("Net");
        this.sarr_getSelectedParamAccName.push("Net");
        if (!this.sarr_getSelectedParamAccName.includes('Individual')) {
          this.sarr_getSelCompressParamAccName.push("Individual");
          this.sarr_getSelectedParamAccName.push("Individual");
        }
        if (!this.sarr_getSelectedParamAccName.includes('Empty')) {
          this.sarr_getSelCompressParamAccName.push("Empty");
          this.sarr_getSelectedParamAccName.push("Empty");
        }
        this.checkValidParameterValues();
      }
    }
    if (event.panelId == "Empty") {

      if (event.nextState == false) {
        this.bln_IndiDisabled = false;
        this.sarr_getSelCompressParamAccName.splice(this.sarr_getSelectedParamAccName.indexOf("Empty"), 1);
        this.sarr_getSelectedParamAccName.splice(this.sarr_getSelectedParamAccName.indexOf("Empty"), 1);
        if (this.sarr_getSelectedParamAccName.includes('Net')) {
          this.sarr_getSelCompressParamAccName.splice(this.sarr_getSelectedParamAccName.indexOf("Net"), 1);
          this.sarr_getSelectedParamAccName.splice(this.sarr_getSelectedParamAccName.indexOf("Net"), 1);
        }
        this.checkValidParameterValues();

        this.reset(this.flt_Emptystd, this.flt_EmptyT1Neg, this.flt_EmptyT1Pos, this.flt_EmptyT2Neg,
          this.flt_EmptyT2Pos, this.flt_EmptyNMTCnt);
      }
      else {
        this.bln_IndiDisabled = true;
        this.sarr_getSelCompressParamAccName.push("Empty");
        this.sarr_getSelectedParamAccName.push("Empty");
        if (!this.sarr_getSelectedParamAccName.includes('Individual')) {
          this.sarr_getSelCompressParamAccName.push("Individual");
          this.sarr_getSelectedParamAccName.push("Individual");
        }
        if (!this.sarr_getSelectedParamAccName.includes('Net')) {
          this.sarr_getSelCompressParamAccName.push("Net");
          this.sarr_getSelectedParamAccName.push("Net");
        }
        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Length") {

      if (event.nextState == false) {

        this.sarr_getSelCompressParamAccName.splice(this.sarr_getSelectedParamAccName.indexOf("Length"), 1);
        this.sarr_getSelectedParamAccName.splice(this.sarr_getSelectedParamAccName.indexOf("Length"), 1);
        this.checkValidParameterValues();

        this.reset(this.flt_LenStd, this.flt_LenT1Neg, this.flt_LenT1Pos, this.flt_LenT2Neg,
          this.flt_LenT2Pos, this.int_LenNMTTabCnt);
      }
      else {
        this.sarr_getSelCompressParamAccName.push("Length");
        this.sarr_getSelectedParamAccName.push("Length");
        this.checkValidParameterValues();
      }
    }

    if (event.panelId == "Diameter") {

      if (event.nextState == false) {
        this.sarr_getSelCompressParamAccName.splice(this.sarr_getSelectedParamAccName.indexOf("Diameter"), 1);
        this.sarr_getSelectedParamAccName.splice(this.sarr_getSelectedParamAccName.indexOf("Diameter"), 1);
        this.checkValidParameterValues();

        this.reset(this.flt_DiaStd, this.flt_DiaT1Neg, this.flt_DiaT1Pos, this.flt_DiaT2Neg,
          this.flt_DiaT2Pos, this.int_DiaNMTTabCnt);
      }
      else {
        this.sarr_getSelCompressParamAccName.push("Diameter");
        this.sarr_getSelectedParamAccName.push("Diameter");
        this.checkValidParameterValues();
      }

    }
    if (event.panelId == "Disintegration") {
      if (event.nextState == false) {
        this.sarr_getSelCompressParamAccName.splice(this.sarr_getSelectedParamAccName.indexOf("Disintegration"), 1);
        this.sarr_getSelectedParamAccName.splice(this.sarr_getSelectedParamAccName.indexOf("Disintegration"), 1);
        this.checkValidParameterValues();

        this.int_DTHHTime.reset();
        this.int_DTMMTime.reset();
        this.int_DTSSTime.reset();

      }
      else {
        this.sarr_getSelCompressParamAccName.push("Disintegration");
        this.sarr_getSelectedParamAccName.push("Disintegration");
        this.checkValidParameterValues();
      }
    }
  }

  getUnits(menu: string) {
    this.jsonService.getValueFromJSON().then((res: any) => {
      const sarr_getUnitResult = res.Unit;
      for (let i = 0; i < Object.keys(sarr_getUnitResult).length; i++) {
        if ((sarr_getUnitResult[i].Value === 1) && (sarr_getUnitResult[i].menu === menu)) {
          this.sarr_getUnitList.push(sarr_getUnitResult[i].Name);
        }
      }
    }).catch(err => {
      console.log(err)
    });

    return this.sarr_getUnitList;
  }

  reset(std: AbstractControl, t1Pos: AbstractControl, t1Neg: AbstractControl, t2Pos: AbstractControl,
    t2Neg: AbstractControl, setNMTTabCount: AbstractControl) {

    std.reset();

    t1Pos.reset();
    t1Neg.reset();

    t2Pos.reset();
    t2Neg.reset();

    setNMTTabCount.reset();

  }

  reiniDefValAftFrmSub() {
    this.fetchPrdCombination().then(res => {
      this.initializePrdInputField(res);
    }).catch(err => {
      this.errorHandling.checkError(err.status);
    });

    this.activeIds = [];
    this.sarr_getSelectedParamAccName = [];

    this.checkValidParameterValues();

    this.resetDrpDown();

    this.bln_IsBinWeiging.setValue(false);
  }

  resetDrpDown() {
    this.addCapsuleForm.patchValue({
      str_BatchUnit: 'Lakh'
    })

    this.addCapsuleForm.patchValue({
      str_IndLimitOn: 'Actual'
    })

    this.addCapsuleForm.patchValue({
      str_IndGraphOn: 'Standard'
    })

    this.addCapsuleForm.patchValue({
      str_GrpLimitOn: 'Actual'
    })

    this.addCapsuleForm.patchValue({
      str_GrpGraphOn: 'Standard'
    })

    this.addCapsuleForm.patchValue({
      str_IndL1LimitOn: 'Actual'
    })

    this.addCapsuleForm.patchValue({
      str_IndL1GraphOn: 'Standard'
    })

    this.addCapsuleForm.patchValue({
      str_GrpL1LimitOn: 'Actual'
    })

    this.addCapsuleForm.patchValue({
      str_GrpL1GraphOn: 'Standard'
    })

    this.addCapsuleForm.patchValue({
      str_IndL2LimitOn: 'Actual'
    })

    this.addCapsuleForm.patchValue({
      str_IndL2GraphOn: 'Standard'
    })

    this.addCapsuleForm.patchValue({
      str_GrpL2LimitOn: 'Actual'
    })

    this.addCapsuleForm.patchValue({
      str_GrpL2GraphOn: 'Standard'
    })

    this.addCapsuleForm.patchValue({
      str_IndLimitOnCoat: 'Actual'
    })

    this.addCapsuleForm.patchValue({
      str_IndGraphOnCoat: 'Standard'
    })

    this.addCapsuleForm.patchValue({
      str_GrpLimitOnCoat: 'Actual'
    })

    this.addCapsuleForm.patchValue({
      str_GrpGraphOnCoat: 'Standard'
    })

    this.addCapsuleForm.patchValue({
      str_HrdGraphOn: 'Standard'
    })

    this.addCapsuleForm.patchValue({
      str_HrdUnit: 'Kp'
    })

    this.addCapsuleForm.patchValue({
      str_HrdGraphOnCoat: 'Standard'
    })

    this.addCapsuleForm.patchValue({
      str_HrdUnitCoat: 'Kp'
    })
  }
}
