import { Component, OnInit, Output, OnDestroy } from '@angular/core';
import { DataService } from '../../../../services/commonData/data.service';
import { JsonDataService } from '../../../../services/commonData/json-data.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, FormControl } from '@angular/forms';
import { ValidationService } from '../../../../services/validations/validation.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { RemarkComponent } from '../../../../shared/remark/remark/remark.component';
import { SessionStorageService } from 'ngx-webstorage';
import { HttpService } from '../../../../services/http/http.service';
import { NgbPanelChangeEvent, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ErrorHandlingService } from "../../../../services/error-handling/error-handling.service";
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { reject } from 'q';
declare var swal: any;

@Component({
  selector: 'app-edit-capsule',
  templateUrl: './edit-capsule.component.html',
  styleUrls: ['./edit-capsule.component.css']
})
export class EditCapsuleComponent implements OnInit, OnDestroy {
  // Variables declares for Nomecaltures of Product BFG Code & Product Name
  masterData: any;
  detailData: any;

  str_LblBFGCode: string = '';
  str_LblProductName: string = '';
  bln_IndiDisabled = false;
  str_TxtBFGCode: string = '';
  str_TxtPrdName: string = '';
  str_TxtPrdVerNo: string = '';
  str_TxtVerNo: string = '';
  // variables declaration for disabling instrumet related parameters
  bln_BalanceParam: boolean;
  bln_VernierParam: boolean;
  bln_DTParams: boolean;
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
  sarr_LimitType = ["Actual", "percentage"];

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
  param: Subscription;
  // Variable declare for storing Product Added API response
  obj_GetPrdAddRes: any;
  bln_CapsuleLocked: Number;
  activeIds: string[] = [];

  obj_PrdDetails: any;
  sarr_PrdDetails: Array<string> = [];

  bln_hideChkTxtFld_BFG: boolean = false;
  bln_hideChkTxtFld_PrdVer: boolean = false;
  bln_hideChkTxtFld_Ver: boolean = false;

  editCapsuleForm: FormGroup;
  ViewMode: boolean;
  arrCond: Array<object>;
  constructor
    (
      private dataService?: DataService,
      private jsonService?: JsonDataService,
      private fb?: FormBuilder,
      private validation?: ValidationService,
      private dialog?: MatDialog,
      private sessionStorage?: SessionStorageService,
      private errorHandling?: ErrorHandlingService,
      private http?: HttpService,
      private route?: ActivatedRoute,
    private router?: Router,
    public snackBar?: MatSnackBar,
    ) {
    this.param = this.route
      .queryParams
      .subscribe(params => {
        // getting master data from previous page
        this.masterData = params;
        // Setting Edit Lock for specific capsule
        console.log('MasterData', this.masterData);
        this.arrCond = [
          {str_colName: 'ProductId', value: params.ProductId },
          { str_colName:'ProductName' , value: params.ProductName },
          { str_colName:'Version' ,value: params.Version },
          { str_colName:'ProductVersion', value: params.ProductVersion },
        ]
        // getting capsule details from database
        this.http.getMethod(`product/getCapsuleDetails/${params.ProductId}/${params.ProductName}/${params.ProductVersion}/${params.Version}`).subscribe((res:any) => {
          this.detailData = res;
         // console.log('MasterData', this.masterData);
          console.log('detailsData', this.detailData);
          this.bln_CapsuleLocked = this.detailData[0].locked.data[0];
          const userId = this.sessionStorage.retrieve("userId").trim();
          this.dataService.MultiCondiLocked(userId, 'tbl_product_capsule', this.arrCond, 'locked', 1).then((result:any) => {
            if (result.result == 'being edited') {
              this.ViewMode = true;
              this.snackBar.openFromComponent(SnackBarViewComponent, {
                duration: 2000,
              });
              swal('', 'This Product is being edited from another terminal', 'warning');
            } else {
              this.ViewMode = false;
              this.snackBar.openFromComponent(SnackBarEditComponent, {
                duration: 2000,
              });
              this.sessionStorage.store('EditMode', true);
            }
          }).catch((err) => {

          });


          this.initForm(); // function call for form initialization

        }, err => {
            // handeling error mechanism
          this.errorHandling.checkError(err.status);
          this.bln_Loading = false;
        })
      });
    //************************************************************************************ */
    /*
     if any weigment is done so user can be restricted from editing the value related to
     that instrument
     */
    let data = JSON.stringify({
      ProductId: this.masterData.ProductId, ProductName: this.masterData.ProductName,
      ProductVersion: this.masterData.ProductVersion, Version: this.masterData.Version
    });
    console.log(data);
    this.http.postMethod('product/checkForCapMasterEntry', data).subscribe((res:any)=> {
      if (res.status === 'success') {
        this.bln_BalanceParam = res.result[0].Balance;
        this.bln_VernierParam = res.result[1].Vernier;
        this.bln_DTParams = res.result[2].DT;
      }

    }, err => { })
    //********************************************************************************* */
    // Form declaration with validation begins
    this.editCapsuleForm = this.fb.group({
      str_BFGCode:
        ['',
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
        ['',
          Validators.compose([
            this.validation.requiredField,
            this.validation.validateOnlyWhiteSpaceEnter
          ])],

      str_V:
        ['',
          Validators.compose([
            this.validation.requiredField,
            this.validation.validateOnlyWhiteSpaceEnter
          ])],

      flt_BatchSize:
        ['',
          Validators.compose([
            this.validation.requiredField,
            this.validation.validateOnlyWhiteSpaceEnter,
            this.validation.validateZeroEntry
          ])],

      str_BatchUnit:
        ['',
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
// Form declaration with validation ends here

    this.editCapsuleForm.controls.str_IndGraphOn.valueChanges
      .subscribe(
        x => this.editCapsuleForm.controls.flt_IndT1Neg.updateValueAndValidity()
      )

    this.editCapsuleForm.controls.str_IndGraphOn.valueChanges
      .subscribe(
        x => this.editCapsuleForm.controls.flt_IndT1Pos.updateValueAndValidity()
      )

    this.editCapsuleForm.controls.int_DTHHTime.valueChanges
      .subscribe(
        x => this.editCapsuleForm.controls.int_DTSSTime.updateValueAndValidity()
    )
  }
//******************************************************************************** */
  // form getters starts
  get str_BFGCode() { return this.editCapsuleForm.get('str_BFGCode'); }
  get str_Prd() { return this.editCapsuleForm.get('str_Prd'); }
  get str_PV() { return this.editCapsuleForm.get('str_PV'); }
  get str_V() { return this.editCapsuleForm.get('str_V'); }

  get flt_BatchSize() { return this.editCapsuleForm.get('flt_BatchSize'); }
  get str_BatchUnit() { return this.editCapsuleForm.get('str_BatchUnit'); }
  get bln_Tolerance1() { return this.editCapsuleForm.get('bln_Tolerance1'); }
  get bln_Tolerance2() { return this.editCapsuleForm.get('bln_Tolerance2'); }

  get bln_IsBinWeiging() { return this.editCapsuleForm.get('bln_IsBinWeiging'); }

  get flt_IndStd() { return this.editCapsuleForm.get('flt_IndStd'); }
  get flt_IndT1Neg() { return this.editCapsuleForm.get('flt_IndT1Neg'); }
  get flt_IndT1Pos() { return this.editCapsuleForm.get('flt_IndT1Pos'); }
  get flt_IndT2Neg() { return this.editCapsuleForm.get('flt_IndT2Neg'); }
  get flt_IndT2Pos() { return this.editCapsuleForm.get('flt_IndT2Pos'); }
  get str_IndGraphOn() { return this.editCapsuleForm.get('str_IndGraphOn'); }
  get str_IndLimitOn() { return this.editCapsuleForm.get('str_IndLimitOn'); }
  get int_IndNMTTabCnt() { return this.editCapsuleForm.get('int_IndNMTTabCnt'); }

  get flt_GrpStd() { return this.editCapsuleForm.get('flt_GrpStd'); }
  get flt_GrpT1Pos() { return this.editCapsuleForm.get('flt_GrpT1Pos'); }
  get flt_GrpT1Neg() { return this.editCapsuleForm.get('flt_GrpT1Neg'); }
  get flt_GrpT2Neg() { return this.editCapsuleForm.get('flt_GrpT2Neg'); }
  get flt_GrpT2Pos() { return this.editCapsuleForm.get('flt_GrpT2Pos'); }
  get str_GrpGraphOn() { return this.editCapsuleForm.get('str_GrpGraphOn'); }
  get str_GrpLimitOn() { return this.editCapsuleForm.get('str_GrpLimitOn'); }
  get int_GrpNMTTabCnt() { return this.editCapsuleForm.get('int_GrpNMTTabCnt'); }

  get flt_Emptystd() { return this.editCapsuleForm.get('flt_Emptystd'); }
  get flt_EmptyT1Neg() { return this.editCapsuleForm.get('flt_EmptyT1Neg'); }
  get flt_EmptyT1Pos() { return this.editCapsuleForm.get('flt_EmptyT1Pos'); }
  get flt_EmptyT2Neg() { return this.editCapsuleForm.get('flt_EmptyT2Neg'); }
  get flt_EmptyT2Pos() { return this.editCapsuleForm.get('flt_EmptyT2Pos'); }
  get flt_EmptyLimitOn() { return this.editCapsuleForm.get('flt_EmptyLimitOn'); }
  get flt_EmptyGraphOn() { return this.editCapsuleForm.get('flt_EmptyGraphOn'); }
  get flt_EmptyNMTCnt() { return this.editCapsuleForm.get('flt_EmptyNMTCnt'); }

  get flt_DiffNet() { return this.editCapsuleForm.get('flt_DiffNet'); }
  get flt_DiffNetT1Pos() { return this.editCapsuleForm.get('flt_DiffNetT1Pos'); }
  get flt_DiffNetT1Neg() { return this.editCapsuleForm.get('flt_DiffNetT1Neg'); }
  get flt_DiffNetT2Neg() { return this.editCapsuleForm.get('flt_DiffNetT2Neg'); }
  get flt_DiffNetT2Pos() { return this.editCapsuleForm.get('flt_DiffNetT2Pos'); }
  get flt_DiffNetLimitOn() { return this.editCapsuleForm.get('flt_DiffNetLimitOn'); }
  get flt_DiffNetGraphOn() { return this.editCapsuleForm.get('flt_DiffNetGraphOn'); }
  get flt_DiffNetNMTCnt() { return this.editCapsuleForm.get('flt_DiffNetNMTCnt'); }

  get flt_LenStd() { return this.editCapsuleForm.get('flt_LenStd'); }
  get flt_LenT1Pos() { return this.editCapsuleForm.get('flt_LenT1Pos'); }
  get flt_LenT1Neg() { return this.editCapsuleForm.get('flt_LenT1Neg'); }
  get flt_LenT2Neg() { return this.editCapsuleForm.get('flt_LenT2Neg'); }
  get flt_LenT2Pos() { return this.editCapsuleForm.get('flt_LenT2Pos'); }
  get int_LenNMTTabCnt() { return this.editCapsuleForm.get('int_LenNMTTabCnt'); }

  get flt_DiaStd() { return this.editCapsuleForm.get('flt_DiaStd'); }
  get flt_DiaT1Neg() { return this.editCapsuleForm.get('flt_DiaT1Neg'); }
  get flt_DiaT1Pos() { return this.editCapsuleForm.get('flt_DiaT1Pos'); }
  get flt_DiaT2Neg() { return this.editCapsuleForm.get('flt_DiaT2Neg'); }
  get flt_DiaT2Pos() { return this.editCapsuleForm.get('flt_DiaT2Pos'); }
  get int_DiaNMTTabCnt() { return this.editCapsuleForm.get('int_DiaNMTTabCnt'); }

  get int_DTHHTime() { return this.editCapsuleForm.get('int_DTHHTime'); }
  get int_DTMMTime() { return this.editCapsuleForm.get('int_DTMMTime'); }
  get int_DTSSTime() { return this.editCapsuleForm.get('int_DTSSTime'); }
 // form getters ends
  ngOnInit() {
    this.dataService.getNomenclatureDetails().then(res => {
      this.initializeInputField(res);
    }).catch(err => {
      this.errorHandling.checkError(err.status);
    });

    this.jsonService.getValueFromJSON().then((res: any) => {
      this.str_IndUnit = res.Tablet[2].Value;

      this.str_BatchSizeVisibility = res.Master[3].Value;

      if (this.str_BatchSizeVisibility == "0") {
        this.editCapsuleForm.patchValue({
          flt_BatchSize: this.masterData.BatchSize
        })
      }

      this.str_BinWeighingVisibility = res.Bin[1].Value;

      this.sarr_getHrdUnitFromJson = this.getUnits("H");

    }).catch(err => {
      console.log(err)
    });
  }
  /**
   *
   * This function is used to display value in input field
   * @param str_inputData
   * @usageNotes
   *
   * ### Dyanamic name for `ProductId` and `ProductCode`
   *
   */

  initializeInputField(str_inputData: any) {
    this.str_LblBFGCode = (str_inputData.BFGCode);
    this.str_LblProductName = (str_inputData.ProductName);
  }

/**
 * this function initialized the form as older values
 * @param noParameters
 */
  initForm() {
    this.editCapsuleForm.patchValue({
      str_BFGCode: this.masterData.ProductId,
      str_Prd: this.masterData.ProductName,
      str_PV: this.masterData.ProductVersion,
      str_V: this.masterData.Version,
      flt_BatchSize: this.masterData.BatchSize,
      str_BatchUnit: this.masterData.BatchUnit
    })
   // Individual
    if (this.detailData[0].Param1_Nom != 99999) {
      this.sarr_getSelectedParamAccName.push('Individual');
      this.openSelAcc();
      this.sarr_getSelCompressParamAccName.push('Individual');
      let Param1_LimitOn;
      let Param1_IsOnStd;
      if (this.detailData[0].Param1_LimitOn.data[0] == 0) {
        Param1_LimitOn = 'Actual'
      } else {
        Param1_LimitOn = 'percentage'
      }
      if (this.detailData[0].Param1_IsOnStd.data[0] == 0) {
        Param1_IsOnStd = 'Standard'
      } else {
        Param1_IsOnStd = 'Average'
      }
      this.editCapsuleForm.patchValue({
        flt_IndStd: this.detailData[0].Param1_Nom.toString(),
        flt_IndT1Neg: this.detailData[0].Param1_T1Neg.toString(),
        flt_IndT1Pos: this.detailData[0].Param1_T1Pos.toString(),
        flt_IndT2Neg: this.detailData[0].Param1_T2Neg.toString(),
        flt_IndT2Pos: this.detailData[0].Param1_T2Pos.toString(),
        int_IndNMTTabCnt: this.detailData[0].Param1_NMTTab.toString(),
        str_IndLimitOn: Param1_LimitOn,
        str_IndGraphOn: Param1_IsOnStd
      })
    }
    // Group
    if ((this.detailData[0].Param2_Nom != 99999)) {
      this.sarr_getSelectedParamAccName.push('Group');
      this.openSelAcc();
      this.sarr_getSelCompressParamAccName.push('Group');
      let Param2_LimitOn;
      let Param2_IsOnStd;
      if (this.detailData[0].Param2_LimitOn.data[0] == 0) {
        Param2_LimitOn = 'Actual'
      } else {
        Param2_LimitOn = 'percentage'
      }
      if (this.detailData[0].Param2_IsOnStd.data[0] == 0) {
        Param2_IsOnStd = 'Standard'
      } else {
        Param2_IsOnStd = 'Average'
      }
      this.editCapsuleForm.patchValue({
        flt_GrpStd: this.detailData[0].Param2_Nom.toString(),
        flt_GrpT1Neg: this.detailData[0].Param2_T1Neg.toString(),
        flt_GrpT1Pos: this.detailData[0].Param2_T1Pos.toString(),
        flt_GrpT2Neg: this.detailData[0].Param2_T2Neg.toString(),
        flt_GrpT2Pos: this.detailData[0].Param2_T2Pos.toString(),
        int_GrpNMTTabCnt: this.detailData[0].Param2_NMTTab.toString(),
        str_GrpLimitOn: Param2_LimitOn,
        str_GrpGraphOn: Param2_IsOnStd
      })
    }
    // Differential
    if ((this.detailData[0].Param3_Nom != 99999)) {
      this.sarr_getSelectedParamAccName.push('Net');
      this.openSelAcc();
      this.sarr_getSelCompressParamAccName.push('Group');
      let Param3_LimitOn;
      let Param3_IsOnStd;
      if (this.detailData[0].Param3_LimitOn.data[0] == 0) {
        Param3_LimitOn = 'Actual'
      } else {
        Param3_LimitOn = 'percentage'
      }
      if (this.detailData[0].Param3_IsOnStd.data[0] == 0) {
        Param3_IsOnStd = 'Standard'
      } else {
        Param3_IsOnStd = 'Average'
      }
      this.editCapsuleForm.patchValue({
        flt_DiffNet: this.detailData[0].Param3_Nom.toString(),
        flt_DiffNetT1Neg: this.detailData[0].Param3_T1Neg.toString(),
        flt_DiffNetT1Pos: this.detailData[0].Param3_T1Pos.toString(),
        flt_DiffNetT2Neg: this.detailData[0].Param3_T2Neg.toString(),
        flt_DiffNetT2Pos: this.detailData[0].Param3_T2Pos.toString(),
        flt_DiffNetNMTCnt: this.detailData[0].Param3_NMTTab.toString(),
        flt_DiffNetLimitOn: Param3_LimitOn,
        flt_DiffNetGraphOn: Param3_IsOnStd
      })
    }
    // Empty
    if ((this.detailData[0].Param0_Nom != 99999)) {
      this.sarr_getSelectedParamAccName.push('Empty');
      this.openSelAcc();
      this.sarr_getSelCompressParamAccName.push('Empty');
      let Param0_LimitOn;
      let Param0_IsOnStd;
      if (this.detailData[0].Param0_LimitOn.data[0] == 0) {
        Param0_LimitOn = 'Actual'
      } else {
        Param0_LimitOn = 'percentage'
      }
      if (this.detailData[0].Param0_IsOnStd.data[0] == 0) {
        Param0_IsOnStd = 'Standard'
      } else {
        Param0_IsOnStd = 'Average'
      }
      this.editCapsuleForm.patchValue({
        flt_Emptystd: this.detailData[0].Param0_Nom.toString(),
        flt_EmptyT1Neg: this.detailData[0].Param0_T1Neg.toString(),
        flt_EmptyT1Pos: this.detailData[0].Param0_T1Pos.toString(),
        flt_EmptyT2Neg: this.detailData[0].Param0_T2Neg.toString(),
        flt_EmptyT2Pos: this.detailData[0].Param0_T2Pos.toString(),
        flt_EmptyNMTCnt: this.detailData[0].Param0_NMTTab.toString(),
        flt_EmptyLimitOn: Param0_LimitOn,
        flt_EmptyGraphOn: Param0_IsOnStd
      })
    }
    // Diameter
    if ((this.detailData[0].Param4_Nom != 99999)) {
      this.sarr_getSelectedParamAccName.push('Diameter');
      this.openSelAcc();
      this.sarr_getSelCompressParamAccName.push('Diameter');
      let Param4_LimitOn;
      let Param4_IsOnStd;
      if (this.detailData[0].Param4_LimitOn.data[0] == 0) {
        Param4_LimitOn = 'Actual'
      } else {
        Param4_LimitOn = 'percentage'
      }
      if (this.detailData[0].Param4_IsOnStd.data[0] == 0) {
        Param4_IsOnStd = 'Standard'
      } else {
        Param4_IsOnStd = 'Average'
      }
      this.editCapsuleForm.patchValue({
        flt_DiaStd: this.detailData[0].Param4_Nom.toString(),
        flt_DiaT1Neg: this.detailData[0].Param4_T1Neg.toString(),
        flt_DiaT1Pos: this.detailData[0].Param4_T1Pos.toString(),
        flt_DiaT2Neg: this.detailData[0].Param4_T2Neg.toString(),
        flt_DiaT2Pos: this.detailData[0].Param4_T2Pos.toString(),
        int_DiaNMTTabCnt: this.detailData[0].Param4_NMTTab.toString(),
      })
    }
    // Lenght
    if ((this.detailData[0].Param5_Nom != 99999)) {
      this.sarr_getSelectedParamAccName.push('Length');
      this.sarr_getSelCompressParamAccName.push('Length');
      this.openSelAcc();
      let Param5_LimitOn;
      let Param5_IsOnStd;
      if (this.detailData[0].Param5_LimitOn.data[0] == 0) {
        Param5_LimitOn = 'Actual'
      } else {
        Param5_LimitOn = 'percentage'
      }
      if (this.detailData[0].Param5_IsOnStd.data[0] == 0) {
        Param5_IsOnStd = 'Standard'
      } else {
        Param5_IsOnStd = 'Average'
      }
      this.editCapsuleForm.patchValue({
        flt_LenStd: this.detailData[0].Param5_Nom.toString(),
        flt_LenT1Neg: this.detailData[0].Param5_T1Neg.toString(),
        flt_LenT1Pos: this.detailData[0].Param5_T1Pos.toString(),
        flt_LenT2Neg: this.detailData[0].Param5_T2Neg.toString(),
        flt_LenT2Pos: this.detailData[0].Param5_T2Pos.toString(),
        int_LenNMTTabCnt: this.detailData[0].Param5_NMTTab.toString(),
      })
    }
    // DT
    if ((this.detailData[0].Param6_Nom != "null:null:null")) {
      this.sarr_getSelectedParamAccName.push('Disintegration');
      this.openSelAcc();
      this.sarr_getSelCompressParamAccName.push('Disintegration');
      let int_DTHHTime = this.detailData[0].Param6_Nom.split(':')[0];
      let int_DTMMTime = this.detailData[0].Param6_Nom.split(':')[1];
      let int_DTSSTime = this.detailData[0].Param6_Nom.split(':')[2];
      this.editCapsuleForm.patchValue({
        int_DTHHTime: int_DTHHTime.toString(),
        int_DTMMTime: int_DTMMTime.toString(),
        int_DTSSTime: int_DTSSTime.toString()
      })
    }
    this.checkValidParameterValues()
 }
  // fetchPrdCombination() {
  //   return new Promise((resolve, reject) => {

  //     this.http.getMethod('product/checkPrdCombination/2').subscribe(res => {
  //       this.obj_PrdDetails = res;
  //       resolve(this.obj_PrdDetails);
  //     }, err => {
  //       reject('Error occured')
  //     })
  //   })
  // }

  openSelAcc() {
    this.activeIds = this.sarr_getSelectedParamAccName.map(p => p);
  }
/**
 * This function used to validate the form
 * @param noPramaters
 */
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

  onlyNumbersWithDecimal(event: any) {
    this.validation.onlyNumbersWithDecimal(event);
  }

  onlyNumbers(event: any) {
    this.validation.onlyNumbers(event);
  }

  setZeroOnT1PosAndDis(ctlName) {

    switch (ctlName) {

      case "flt_IndT1Neg":

        var flt_IndT1Neg = this.editCapsuleForm.value.flt_IndT1Neg;

        if (flt_IndT1Neg == "0") {

          this.bln_disTxtFldsIfIndT1Zero = true;

          this.editCapsuleForm.patchValue({
            flt_IndT1Pos: "0"
          })

          this.editCapsuleForm.patchValue({
            int_IndNMTTabCnt: "0"
          })
        }
        else {
          this.bln_disTxtFldsIfIndT1Zero = false;

          this.editCapsuleForm.patchValue({
            flt_IndT1Pos: ""
          })

          this.editCapsuleForm.patchValue({
            int_IndNMTTabCnt: ""
          })
        }

        break;

      case "flt_GrpT1Neg":

        var flt_GrpT1Neg = this.editCapsuleForm.value.flt_GrpT1Neg;

        if (flt_GrpT1Neg == "0") {

          this.bln_disTxtFldsIfGrpT1Zero = true;

          this.editCapsuleForm.patchValue({
            flt_GrpT1Pos: "0"
          })

          this.editCapsuleForm.patchValue({
            int_GrpNMTTabCnt: "0"
          })
        }
        else {
          this.bln_disTxtFldsIfGrpT1Zero = false;

          this.editCapsuleForm.patchValue({
            flt_GrpT1Pos: ""
          })

          this.editCapsuleForm.patchValue({
            int_GrpNMTTabCnt: ""
          })
        }

        break;

      case "flt_DiffNetT1Neg":

        var flt_DiffNetT1Neg = this.editCapsuleForm.value.flt_DiffNetT1Neg;

        if (flt_DiffNetT1Neg == "0") {

          this.bln_disTxtFldsIfNetT1Zero = true;

          this.editCapsuleForm.patchValue({
            flt_DiffNetT1Pos: "0"
          })

          this.editCapsuleForm.patchValue({
            flt_DiffNetNMTCnt: "0"
          })
        }
        else {
          this.bln_disTxtFldsIfNetT1Zero = false;

          this.editCapsuleForm.patchValue({
            flt_DiffNetT1Pos: ""
          })

          this.editCapsuleForm.patchValue({
            flt_DiffNetNMTCnt: ""
          })
        }

        break;
      case "flt_EmptyT1Neg":

        var flt_EmptyT1Neg = this.editCapsuleForm.value.flt_EmptyT1Neg;

        if (flt_EmptyT1Neg == "0") {

          this.bln_disTxtFldsIfEmptyT1Zero = true;

          this.editCapsuleForm.patchValue({
            flt_EmptyT1Pos: "0"
          })

          this.editCapsuleForm.patchValue({
            flt_EmptyNMTCnt: "0"
          })
        }
        else {
          this.bln_disTxtFldsIfEmptyT1Zero = false;

          this.editCapsuleForm.patchValue({
            flt_EmptyT1Pos: ""
          })

          this.editCapsuleForm.patchValue({
            flt_EmptyNMTCnt: ""
          })
        }

        break;

      case "flt_LenT1Neg":

        var flt_LenT1Neg = this.editCapsuleForm.value.flt_LenT1Neg;

        if (flt_LenT1Neg == "0") {

          this.bln_disTxtFldsIfLenT1Zero = true;

          this.editCapsuleForm.patchValue({
            flt_LenT1Pos: "0"
          })

          this.editCapsuleForm.patchValue({
            int_LenNMTTabCnt: "0"
          })
        }
        else {
          this.bln_disTxtFldsIfLenT1Zero = false;

          this.editCapsuleForm.patchValue({
            flt_LenT1Pos: ""
          })

          this.editCapsuleForm.patchValue({
            int_LenNMTTabCnt: ""
          })
        }

        break;

      case "flt_DiaT1Neg":

        var flt_DiaT1Neg = this.editCapsuleForm.value.flt_DiaT1Neg;

        if (flt_DiaT1Neg == "0") {

          this.bln_disTxtFldsIfDiaT1Zero = true;

          this.editCapsuleForm.patchValue({
            flt_DiaT1Pos: "0"
          })

          this.editCapsuleForm.patchValue({
            int_DiaNMTTabCnt: "0"
          })
        }
        else {
          this.bln_disTxtFldsIfDiaT1Zero = false;

          this.editCapsuleForm.patchValue({
            flt_DiaT1Pos: ""
          })

          this.editCapsuleForm.patchValue({
            int_DiaNMTTabCnt: ""
          })
        }

        break;
      default:
        break;
    }
  }

  dtTimeOnblur() {
    var dtHHTime = this.editCapsuleForm.value.int_DTHHTime;
    var dtMMTime = this.editCapsuleForm.value.int_DTMMTime;
    var dtSSTime = this.editCapsuleForm.value.int_DTSSTime;

    if (dtHHTime > 23) {
      this.editCapsuleForm.patchValue({
        int_DTHHTime: "23"
      })
    }

    if (dtMMTime > 59) {
      this.editCapsuleForm.patchValue({
        int_DTMMTime: "59"
      })
    }

    if (dtSSTime > 59) {
      this.editCapsuleForm.patchValue({
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
    if (this.editCapsuleForm.value.flt_IndStd == '') {
      indStd = 0;
    } else {
      indStd = this.editCapsuleForm.value.flt_IndStd;
    }

    if (this.editCapsuleForm.value.flt_Emptystd == '') {
      flt_emptyStd = 0;
    } else {
      flt_emptyStd = this.editCapsuleForm.value.flt_Emptystd;
    }
    flt_netStd = indStd - flt_emptyStd;
    flt_netStd = flt_netStd.toString()
    this.editCapsuleForm.patchValue({
      flt_DiffNet: flt_netStd
    })
  }
  onSubmit() {
    // console.log(this.editCapsuleForm.value)
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
          this.checkForValueChanges(this.editCapsuleForm.value).then(returnAuditObj => {
          const data: Object = {};
          if (result !== undefined) {
            const userId = this.sessionStorage.retrieve("userId").trim();
            const userName = this.sessionStorage.retrieve("userName").trim();
            const action = 'Edit Capsule Product';
            const remark = result.reason.trim();

            //  let str_ThkGraphOn = "Standard";
            let str_LenGraphOn = "Standard";
            let str_DiaGraphOn = "Standard";
            let int_IndDp = this.validation.getDPValue(this.editCapsuleForm.value.flt_IndStd);
            let int_GrpDp = this.validation.getDPValue(this.editCapsuleForm.value.flt_GrpStd);
            let int_NetDp = this.validation.getDPValue(this.editCapsuleForm.value.flt_DiffNet);
            let int_EmptyDp = this.validation.getDPValue(this.editCapsuleForm.value.flt_Emptystd);
            let int_LenDp = this.validation.getDPValue(this.editCapsuleForm.value.flt_LenStd);
            let int_DiaDp = this.validation.getDPValue(this.editCapsuleForm.value.flt_DiaStd);
            let int_prdType = "2";
            Object.assign
              (data,
                this.editCapsuleForm.value,
                { str_LenGraphOn: str_LenGraphOn },
                { str_DiaGraphOn: str_DiaGraphOn },
                { int_prdType: int_prdType },
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
                { remark: remark },
                returnAuditObj
              );
           // this.bln_Loading = true;
          //  console.log('as',JSON.stringify(data));

            this.http.putMethod('product/updateCapsule', data).subscribe((res) => {
              // console.log("res", res);
              this.bln_Loading = false;
              this.obj_GetPrdAddRes = res;
              if (this.obj_GetPrdAddRes[0].result === 'Product Updated Successfully') {
                swal
                  ({
                    title: "Product Updated Successfully",
                    text: "",
                    type: "success",
                    allowOutsideClick: false,
                  });
                this.editCapsuleForm.reset();
              }  else {
                swal
                  ({
                    title: "Can not Edit Product, Try again",
                    text: "",
                    type: "error",
                    allowOutsideClick: false,
                  });
              }
              const userId = this.sessionStorage.retrieve("userId").trim();
              this.dataService.MultiCondiLocked(userId, 'tbl_product_capsule', this.arrCond, 'locked', 0)
              this.router.navigate(['/master/product/capsule/manage-capsule'])
            },
              err => {
                this.errorHandling.checkError(err.status);
                this.bln_Loading = false;
              });
          }
          }).catch(err => { console.log(err) })
        });
      }
    }, function (dismiss) { })
  }
  /**
   * This function is for making Audit object
   * @param objVal A object which holds the values enter in form.
   * As in database we have `99999` values for `""` so that for comparison
   * function first convert `99999` to `""` using for loop
   * * `checks for all parameters for capsule`
   */
  checkForValueChanges(objVal) {
    return new Promise((resolve, reject) => {
      console.log(objVal)
      var detailData = this.detailData[0];
      for (var key in detailData) {
        if (detailData.hasOwnProperty(key)) {
          if (detailData[key] == 99999) {
            detailData[key] = "";
          }
        }
      }
      let AuditObj = {}
      // Indivisual
      if (detailData.Param1_Nom != objVal.flt_IndStd) {
        Object.assign(AuditObj, { OldParam1_Nom: detailData.Param1_Nom, NewParam1_Nom: objVal.flt_IndStd })
      } else {
        Object.assign(AuditObj, { OldParam1_Nom: detailData.Param1_Nom, NewParam1_Nom: objVal.flt_IndStd })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param1_T1Neg != objVal.flt_IndT1Neg) {
        Object.assign(AuditObj, { OldParam1_T1Neg: detailData.Param1_T1Neg, NewParam1_T1Neg: objVal.flt_IndT1Neg })
      } else {
        Object.assign(AuditObj, { OldParam1_T1Neg: detailData.Param1_T1Neg, NewParam1_T1Neg: objVal.flt_IndT1Neg })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param1_T1Pos != objVal.flt_IndT1Pos) {
        Object.assign(AuditObj, { OldParam1_T1Pos: detailData.Param1_T1Pos, NewParam1_T1Pos: objVal.flt_IndT1Pos })
      } else {
        Object.assign(AuditObj, { OldParam1_T1Pos: detailData.Param1_T1Pos, NewParam1_T1Pos: objVal.flt_IndT1Pos })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param1_T2Neg != objVal.flt_IndT2Neg) {
        Object.assign(AuditObj, { OldParam1_T2Neg: detailData.Param1_T2Neg, NewParam1_T2Neg: objVal.flt_IndT2Neg })
      } else {
        Object.assign(AuditObj, { OldParam1_T2Neg: detailData.Param1_T2Neg, NewParam1_T2Neg: objVal.flt_IndT2Neg })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param1_T2Pos != objVal.flt_IndT2Pos) {
        Object.assign(AuditObj, { OldParam1_T2Pos: detailData.Param1_T2Pos, NewParam1_T2Pos: objVal.flt_IndT2Pos })
      } else {
        Object.assign(AuditObj, { OldParam1_T2Pos: detailData.Param1_T2Pos, NewParam1_T2Pos: objVal.flt_IndT2Pos })
      }
      //-------------------------------------------------------------------------------//
      let indLimitOn, indRepOn;
      if (objVal.str_IndLimitOn == "Actual") {
        indLimitOn = 0;
      } else {
        indLimitOn = 1;
      }
      if (objVal.str_IndGraphOn == "Standard") {
        indRepOn = 0;
      } else {
        indRepOn = 1;
      }
      if (detailData.Param1_LimitOn.data[0] != indLimitOn) {
        Object.assign(AuditObj, { OldParam1_LimitOn: detailData.Param1_LimitOn.data[0], NewParam1_LimitOn: indLimitOn })
      } else {
        Object.assign(AuditObj, { OldParam1_LimitOn: detailData.Param1_LimitOn.data[0], NewParam1_LimitOn: indLimitOn })
      }
      //-------------------------------------------------------------------------------//
      // if (detailData.Param1_NMTTab != objVal.int_IndNMTTabCnt) {
      //   Object.assign(AuditObj, { OldParam1_NMTTab: detailData.Param1_NMTTab, NewParam1_NMTTab: objVal.int_IndNMTTabCnt })
      // } else {
      //   Object.assign(AuditObj, { OldParam1_NMTTab: detailData.Param1_NMTTab, NewParam1_NMTTab: objVal.int_IndNMTTabCnt })
      // }
      //-------------------------------------------------------------------------------//
      if (detailData.Param1_IsOnStd.data[0] != indRepOn) {
        Object.assign(AuditObj, { OldParam1_IsOnStd: detailData.Param1_IsOnStd.data[0], NewParam1_IsOnStd: indRepOn })
      } else {
        Object.assign(AuditObj, { OldParam1_IsOnStd: detailData.Param1_IsOnStd.data[0], NewParam1_IsOnStd: indRepOn })
      }
      //-------------------------------------------------------------------------------//
      // Group
      if (detailData.Param2_Nom != objVal.flt_GrpStd) {
        Object.assign(AuditObj, { OldParam2_Nom: detailData.Param2_Nom, NewParam2_Nom: objVal.flt_GrpStd })
      } else {
        Object.assign(AuditObj, { OldParam2_Nom: detailData.Param2_Nom, NewParam2_Nom: objVal.flt_GrpStd })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param2_T1Neg != objVal.flt_GrpT1Neg) {
        Object.assign(AuditObj, { OldParam2_T1Neg: detailData.Param2_T1Neg, NewParam2_T1Neg: objVal.flt_GrpT1Neg })
      } else {
        Object.assign(AuditObj, { OldParam2_T1Neg: detailData.Param2_T1Neg, NewParam2_T1Neg: objVal.flt_GrpT1Neg })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param2_T1Pos != objVal.flt_GrpT1Pos) {
        Object.assign(AuditObj, { OldParam2_T1Pos: detailData.Param2_T1Pos, NewParam2_T1Pos: objVal.flt_GrpT1Pos })
      } else {
        Object.assign(AuditObj, { OldParam2_T1Pos: detailData.Param2_T1Pos, NewParam2_T1Pos: objVal.flt_GrpT1Pos })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param2_T2Neg != objVal.flt_GrpT2Neg) {
        Object.assign(AuditObj, { OldParam2_T2Neg: detailData.Param2_T2Neg, NewParam2_T2Neg: objVal.flt_GrpT2Neg })
      } else {
        Object.assign(AuditObj, { OldParam2_T2Neg: detailData.Param2_T2Neg, NewParam2_T2Neg: objVal.flt_GrpT2Neg })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param2_T2Pos != objVal.flt_GrpT2Pos) {
        Object.assign(AuditObj, { OldParam2_T2Pos: detailData.Param2_T2Pos, NewParam2_T2Pos: objVal.flt_GrpT2Pos })
      } else {
        Object.assign(AuditObj, { OldParam2_T2Pos: detailData.Param2_T2Pos, NewParam2_T2Pos: objVal.flt_GrpT2Pos })
      }
      //-------------------------------------------------------------------------------//
      let GrpLimitOn, GrpRepOn;
      if (objVal.str_GrpLimitOn == "Actual") {
        GrpLimitOn = 0;
      } else {
        GrpLimitOn = 1;
      }
      if (objVal.str_GrpGraphOn == "Standard") {
        GrpRepOn = 0;
      } else {
        GrpRepOn = 1;
      }
      if (detailData.Param2_LimitOn.data[0] != GrpLimitOn) {
        Object.assign(AuditObj, { OldParam2_LimitOn: detailData.Param2_LimitOn.data[0], NewParam2_LimitOn: GrpLimitOn })
      } else {
        Object.assign(AuditObj, { OldParam2_LimitOn: detailData.Param2_LimitOn.data[0], NewParam2_LimitOn: GrpLimitOn })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param2_IsOnStd.data[0] != GrpRepOn) {
        Object.assign(AuditObj, { OldParam2_IsOnStd: detailData.Param2_IsOnStd.data[0], NewParam2_IsOnStd: GrpRepOn })
      } else {
        Object.assign(AuditObj, { OldParam2_IsOnStd: detailData.Param2_IsOnStd.data[0], NewParam2_IsOnStd: GrpRepOn })
      }
      //-------------------------------------------------------------------------------//
      // if (detailData.Param2_NMTTab != objVal.int_GrpNMTTabCnt) {
      //   Object.assign(AuditObj, { OldParam2_NMTTab: detailData.Param2_NMTTab, NewParam2_NMTTab: objVal.int_GrpNMTTabCnt })
      // } else {
      //   Object.assign(AuditObj, { OldParam2_NMTTab: detailData.Param2_NMTTab, NewParam2_NMTTab: objVal.int_GrpNMTTabCnt })
      // }
      //-------------------------------------------------------------------------------//
      //-------------------------------------------------------------------------------//
      // Differential
      if (detailData.Param3_Nom != objVal.flt_DiffNetStd) {
        Object.assign(AuditObj, { OldParam3_Nom: detailData.Param3_Nom, NewParam3_Nom: objVal.flt_DiffNet })
      } else {
        Object.assign(AuditObj, { OldParam3_Nom: detailData.Param3_Nom, NewParam3_Nom: objVal.flt_DiffNet })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param3_T1Neg != objVal.flt_DiffNetT1Neg) {
        Object.assign(AuditObj, { OldParam3_T1Neg: detailData.Param3_T1Neg, NewParam3_T1Neg: objVal.flt_DiffNetT1Neg })
      } else {
        Object.assign(AuditObj, { OldParam3_T1Neg: detailData.Param3_T1Neg, NewParam3_T1Neg: objVal.flt_DiffNetT1Neg })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param3_T1Pos != objVal.flt_DiffNetT1Pos) {
        Object.assign(AuditObj, { OldParam3_T1Pos: detailData.Param3_T1Pos, NewParam3_T1Pos: objVal.flt_DiffNetT1Pos })
      } else {
        Object.assign(AuditObj, { OldParam3_T1Pos: detailData.Param3_T1Pos, NewParam3_T1Pos: objVal.flt_DiffNetT1Pos })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param3_T2Neg != objVal.flt_DiffNetT2Neg) {
        Object.assign(AuditObj, { OldParam3_T2Neg: detailData.Param3_T2Neg, NewParam3_T2Neg: objVal.flt_DiffNetT2Neg })
      } else {
        Object.assign(AuditObj, { OldParam3_T2Neg: detailData.Param3_T2Neg, NewParam3_T2Neg: objVal.flt_DiffNetT2Neg })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param3_T2Pos != objVal.flt_DiffNetT2Pos) {
        Object.assign(AuditObj, { OldParam3_T2Pos: detailData.Param3_T2Pos, NewParam3_T2Pos: objVal.flt_DiffNetT2Pos })
      } else {
        Object.assign(AuditObj, { OldParam3_T2Pos: detailData.Param3_T2Pos, NewParam3_T2Pos: objVal.flt_DiffNetT2Pos })
      }
      //-------------------------------------------------------------------------------//
      let DiffLimitOn, DiffRepOn;
      if (objVal.flt_DiffNetLimitOn == "Actual") {
        DiffLimitOn = 0;
      } else {
        DiffLimitOn = 1;
      }
      if (objVal.flt_DiffNetGraphOn == "Standard") {
        DiffRepOn = 0;
      } else {
        DiffRepOn = 1;
      }
      if (detailData.Param3_LimitOn.data[0] != DiffLimitOn) {
        Object.assign(AuditObj, { OldParam3_LimitOn: detailData.Param3_LimitOn.data[0], NewParam3_LimitOn: DiffLimitOn })
      } else {
        Object.assign(AuditObj, { OldParam3_LimitOn: detailData.Param3_LimitOn.data[0], NewParam3_LimitOn: DiffLimitOn })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param3_IsOnStd.data[0] != DiffRepOn) {
        Object.assign(AuditObj, { OldParam3_IsOnStd: detailData.Param3_IsOnStd.data[0], NewParam3_IsOnStd: DiffRepOn })
      } else {
        Object.assign(AuditObj, { OldParam3_IsOnStd: detailData.Param3_IsOnStd.data[0], NewParam3_IsOnStd: DiffRepOn })
      }
      //-------------------------------------------------------------------------------//
      // if (detailData.Param3_NMTTab != objVal.flt_DiffNetNMTCnt) {
      //   Object.assign(AuditObj, { OldParam3_NMTTab: detailData.Param3_NMTTab, NewParam3_NMTTab: objVal.flt_DiffNetNMTCnt })
      // } else {
      //   Object.assign(AuditObj, { OldParam3_NMTTab: detailData.Param3_NMTTab, NewParam3_NMTTab: objVal.flt_DiffNetNMTCnt })
      // }
      //-------------------------------------------------------------------------------//
      // Diameter
      if (detailData.Param4_Nom != objVal.flt_DiaStd) {
        Object.assign(AuditObj, { OldParam4_Nom: detailData.Param4_Nom, NewParam4_Nom: objVal.flt_DiaStd })
      } else {
        Object.assign(AuditObj, { OldParam4_Nom: detailData.Param4_Nom, NewParam4_Nom: objVal.flt_DiaStd })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param4_T1Neg != objVal.flt_DiaT1Neg) {
        Object.assign(AuditObj, { OldParam4_T1Neg: detailData.Param4_T1Neg, NewParam4_T1Neg: objVal.flt_DiaT1Neg })
      } else {
        Object.assign(AuditObj, { OldParam4_T1Neg: detailData.Param4_T1Neg, NewParam4_T1Neg: objVal.flt_DiaT1Neg })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param4_T1Pos != objVal.flt_DiaT1Pos) {
        Object.assign(AuditObj, { OldParam4_T1Pos: detailData.Param4_T1Pos, NewParam4_T1Pos: objVal.flt_DiaT1Pos })
      } else {
        Object.assign(AuditObj, { OldParam4_T1Pos: detailData.Param4_T1Pos, NewParam4_T1Pos: objVal.flt_DiaT1Pos })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param4_T2Neg != objVal.flt_DiaT2Neg) {
        Object.assign(AuditObj, { OldParam4_T2Neg: detailData.Param4_T2Neg, NewParam4_T2Neg: objVal.flt_DiaT2Neg })
      } else {
        Object.assign(AuditObj, { OldParam4_T2Neg: detailData.Param4_T2Neg, NewParam4_T2Neg: objVal.flt_DiaT2Neg })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param4_T2Pos != objVal.flt_DiaT2Pos) {
        Object.assign(AuditObj, { OldParam4_T2Pos: detailData.Param4_T2Pos, NewParam4_T2Pos: objVal.flt_DiaT2Pos })
      } else {
        Object.assign(AuditObj, { OldParam4_T2Pos: detailData.Param4_T2Pos, NewParam4_T2Pos: objVal.flt_DiaT2Pos })
      }
      //-------------------------------------------------------------------------------//
      // if (detailData.Param4_NMTTab != objVal.int_DiaNMTTabCnt) {
      //   Object.assign(AuditObj, { OldParam4_NMTTab: detailData.Param4_NMTTab, NewParam4_NMTTab: objVal.int_DiaNMTTabCnt })
      // } else {
      //   Object.assign(AuditObj, { OldParam4_NMTTab: detailData.Param4_NMTTab, NewParam4_NMTTab: objVal.int_DiaNMTTabCnt })
      // }
      //-------------------------------------------------------------------------------//
      // let DiameterLimitOn, DiameterRepOn;
      // if (objVal.str_DiaLimitOn == "Actual") {
      //   DiameterLimitOn = 0;
      // } else {
      //   DiameterLimitOn = 1;
      // }
      // if (objVal.str_DiaGraphOn == "Standard") {
      //   DiameterRepOn = 0;
      // } else {
      //   DiameterRepOn = 1;
      // }
      // if (detailData.Param4_LimitOn.data[0] != DiameterLimitOn) {
      //   Object.assign(AuditObj, { OldParam4_LimitOn: detailData.Param4_LimitOn.data[0], NewParam4_LimitOn: DiameterLimitOn })
      // } else {
      //   Object.assign(AuditObj, { OldParam4_LimitOn: detailData.Param4_LimitOn.data[0], NewParam4_LimitOn: DiameterLimitOn })
      // }
      // //-------------------------------------------------------------------------------//
      // if (detailData.Param4_IsOnStd.data[0] != DiameterRepOn) {
      //   Object.assign(AuditObj, { OldParam4_IsOnStd: detailData.Param4_IsOnStd.data[0], NewParam4_IsOnStd: DiameterRepOn })
      // } else {
      //   Object.assign(AuditObj, { OldParam4_IsOnStd: detailData.Param4_IsOnStd.data[0], NewParam4_IsOnStd: DiameterRepOn })
      // }
      //-------------------------------------------------------------------------------//
      // Length
      if (detailData.Param5_Nom != objVal.flt_LenStd) {
        Object.assign(AuditObj, { OldParam5_Nom: detailData.Param5_Nom, NewParam5_Nom: objVal.flt_LenStd })
      } else {
        Object.assign(AuditObj, { OldParam5_Nom: detailData.Param5_Nom, NewParam5_Nom: objVal.flt_LenStd })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param5_T1Neg != objVal.flt_LenT1Neg) {
        Object.assign(AuditObj, { OldParam5_T1Neg: detailData.Param5_T1Neg, NewParam5_T1Neg: objVal.flt_LenT1Neg })
      } else {
        Object.assign(AuditObj, { OldParam5_T1Neg: detailData.Param5_T1Neg, NewParam5_T1Neg: objVal.flt_LenT1Neg })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param5_T1Pos != objVal.flt_LenT1Pos) {
        Object.assign(AuditObj, { OldParam5_T1Pos: detailData.Param5_T1Pos, NewParam5_T1Pos: objVal.flt_LenT1Pos })
      } else {
        Object.assign(AuditObj, { OldParam5_T1Pos: detailData.Param5_T1Pos, NewParam5_T1Pos: objVal.flt_LenT1Pos })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param5_T2Neg != objVal.flt_LenT2Neg) {
        Object.assign(AuditObj, { OldParam5_T2Neg: detailData.Param5_T2Neg, NewParam5_T2Neg: objVal.flt_LenT2Neg })
      } else {
        Object.assign(AuditObj, { OldParam5_T2Neg: detailData.Param5_T2Neg, NewParam5_T2Neg: objVal.flt_LenT2Neg })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param5_T2Pos != objVal.flt_LenT2Pos) {
        Object.assign(AuditObj, { OldParam5_T2Pos: detailData.Param5_T2Pos, NewParam5_T2Pos: objVal.flt_LenT2Pos })
      } else {
        Object.assign(AuditObj, { OldParam5_T2Pos: detailData.Param5_T2Pos, NewParam5_T2Pos: objVal.flt_LenT2Pos })
      }
      //-------------------------------------------------------------------------------//
      //-------------------------------------------------------------------------------//
      // if (detailData.Param5_NMTTab != objVal.int_LenNMTTabCnt) {
      //   Object.assign(AuditObj, { OldParam5_NMTTab: detailData.Param5_NMTTab, NewParam5_NMTTab: objVal.int_LenNMTTabCnt })
      // } else {
      //   Object.assign(AuditObj, { OldParam5_NMTTab: detailData.Param5_NMTTab, NewParam5_NMTTab: objVal.int_LenNMTTabCnt })
      // }
      //-------------------------------------------------------------------------------//
      // let LenLimitOn, LenRepOn;
      // if (objVal.str_DiaLimitOn == "Actual") {
      //   LenLimitOn = 0;
      // } else {
      //   LenLimitOn = 1;
      // }
      // if (objVal.str_DiaGraphOn == "Standard") {
      //   LenRepOn = 0;
      // } else {
      //   LenRepOn = 1;
      // }
      // if (detailData.Param5_LimitOn.data[0] != LenLimitOn) {
      //   Object.assign(AuditObj, { OldParam5_LimitOn: detailData.Param5_LimitOn.data[0], NewParam5_LimitOn: LenLimitOn })
      // } else {
      //   Object.assign(AuditObj, { OldParam5_LimitOn: detailData.Param5_LimitOn.data[0], NewParam5_LimitOn: LenLimitOn })
      // }
      // //-------------------------------------------------------------------------------//
      // if (detailData.Param5_IsOnStd.data[0] != LenRepOn) {
      //   Object.assign(AuditObj, { OldParam5_IsOnStd: detailData.Param5_IsOnStd.data[0], NewParam5_IsOnStd: LenRepOn })
      // } else {
      //   Object.assign(AuditObj, { OldParam5_IsOnStd: detailData.Param5_IsOnStd.data[0], NewParam5_IsOnStd: LenRepOn })
      // }
      //-------------------------------------------------------------------------------//
      //Empty
      if (detailData.Param0_Nom != objVal.flt_EmptyStd) {
        Object.assign(AuditObj, { OldParam0_Nom: detailData.Param0_Nom, NewParam0_Nom: objVal.flt_Emptystd })
      } else {
        Object.assign(AuditObj, { OldParam0_Nom: detailData.Param0_Nom, NewParam0_Nom: objVal.flt_Emptystd })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param0_T1Neg != objVal.flt_EmptyT1Neg) {
        Object.assign(AuditObj, { OldParam0_T1Neg: detailData.Param0_T1Neg, NewParam0_T1Neg: objVal.flt_EmptyT1Neg })
      } else {
        Object.assign(AuditObj, { OldParam0_T1Neg: detailData.Param0_T1Neg, NewParam0_T1Neg: objVal.flt_EmptyT1Neg })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param0_T1Pos != objVal.flt_EmptyT1Pos) {
        Object.assign(AuditObj, { OldParam0_T1Pos: detailData.Param0_T1Pos, NewParam0_T1Pos: objVal.flt_EmptyT1Pos })
      } else {
        Object.assign(AuditObj, { OldParam0_T1Pos: detailData.Param0_T1Pos, NewParam0_T1Pos: objVal.flt_EmptyT1Pos })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param0_T2Neg != objVal.flt_EmptyT2Neg) {
        Object.assign(AuditObj, { OldParam0_T2Neg: detailData.Param0_T2Neg, NewParam0_T2Neg: objVal.flt_EmptyT2Neg })
      } else {
        Object.assign(AuditObj, { OldParam0_T2Neg: detailData.Param0_T2Neg, NewParam0_T2Neg: objVal.flt_EmptyT2Neg })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param0_T2Pos != objVal.flt_EmptyT2Pos) {
        Object.assign(AuditObj, { OldParam0_T2Pos: detailData.Param0_T2Pos, NewParam0_T2Pos: objVal.flt_EmptyT2Pos })
      } else {
        Object.assign(AuditObj, { OldParam0_T2Pos: detailData.Param0_T2Pos, NewParam0_T2Pos: objVal.flt_EmptyT2Pos })
      }
      //-------------------------------------------------------------------------------//
      let EmptyLimitOn, EmptyRepOn;
      if (objVal.ftl_EmptyLimitOn == "Actual") {
        EmptyLimitOn = 0;
      } else {
        EmptyLimitOn = 1;
      }
      if (objVal.flt_EmptyGraphOn == "Standard") {
        EmptyRepOn = 0;
      } else {
        EmptyRepOn = 1;
      }
      if (detailData.Param0_LimitOn.data[0] != EmptyLimitOn) {
        Object.assign(AuditObj, { OldParam0_LimitOn: detailData.Param0_LimitOn.data[0], NewParam0_LimitOn: EmptyLimitOn })
      } else {
        Object.assign(AuditObj, { OldParam0_LimitOn: detailData.Param0_LimitOn.data[0], NewParam0_LimitOn: EmptyLimitOn })
      }
      //-------------------------------------------------------------------------------//
      if (detailData.Param0_IsOnStd.data[0] != EmptyRepOn) {
        Object.assign(AuditObj, { OldParam0_IsOnStd: detailData.Param0_IsOnStd.data[0], NewParam0_IsOnStd: EmptyRepOn })
      } else {
        Object.assign(AuditObj, { OldParam0_IsOnStd: detailData.Param0_IsOnStd.data[0], NewParam0_IsOnStd: EmptyRepOn })
      }
      //-------------------------------------------------------------------------------//
      // if (detailData.Param0_NMTTab != objVal.flt_EmptyNMTCnt) {
      //   Object.assign(AuditObj, { OldParam0_NMTTab: detailData.Param0_NMTTab, NewParam0_NMTTab: objVal.flt_EmptyNMTCnt })
      // } else {
      //   Object.assign(AuditObj, { OldParam0_NMTTab: detailData.Param0_NMTTab, NewParam0_NMTTab: objVal.flt_EmptyNMTCnt })
      // }
       //-------------------------------------------------------------------------------//
      //DT
      var hh = detailData.Param6_Nom.split(':')[0];
      console.log(typeof (hh));
      if (hh === "null") {
        hh = "";
      }

      var mm = detailData.Param6_Nom.split(':')[1];
      if (mm == null) {
        mm = "";
      }
      var ss = detailData.Param6_Nom.split(':')[2];
      if (ss == null) {
        ss = "";
      }
      console.log(hh)
      if ((hh != objVal.int_DTHHTime) || (mm != objVal.int_DTMMTime) || (ss != objVal.int_DTSSTime)) {
        Object.assign(AuditObj, { OldParam6_DTTime: detailData.Param6_Nom, NewParam6_DTTime: `${objVal.int_DTHHTime}:${objVal.int_DTMMTime}:${objVal.int_DTSSTime}` })
      } else {
        Object.assign(AuditObj, { OldParam6_DTTime: detailData.Param6_Nom, NewParam6_DTTime: detailData.Param6_Nom })
      }
      resolve(AuditObj)
    })
  }
  /**
   * Function enable the accordian and also check for valid parametes
   * @param event holds event for that specific accordian
   */
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
//**********************************************************8 */
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
//*****************************************************************88 */
  reset(std: AbstractControl, t1Pos: AbstractControl, t1Neg: AbstractControl, t2Pos: AbstractControl,
    t2Neg: AbstractControl, setNMTTabCount: AbstractControl) {

    std.reset();

    t1Pos.reset();
    t1Neg.reset();

    t2Pos.reset();
    t2Neg.reset();

    setNMTTabCount.reset();

  }

  // reiniDefValAftFrmSub() {
  //   this.fetchPrdCombination().then(res => {
  //     this.initializePrdInputField(res);
  //   }).catch(err => {
  //     this.errorHandling.checkError(err.status);
  //   });

  //   this.activeIds = [];
  //   this.sarr_getSelectedParamAccName = [];

  //   this.checkValidParameterValues();

  //   this.resetDrpDown();

  //   this.bln_IsBinWeiging.setValue(false);
  // }

  resetDrpDown() {
    this.editCapsuleForm.patchValue({
      str_BatchUnit: 'Lakh'
    })

    this.editCapsuleForm.patchValue({
      str_IndLimitOn: 'Actual'
    })

    this.editCapsuleForm.patchValue({
      str_IndGraphOn: 'Standard'
    })

    this.editCapsuleForm.patchValue({
      str_GrpLimitOn: 'Actual'
    })

    this.editCapsuleForm.patchValue({
      str_GrpGraphOn: 'Standard'
    })

    this.editCapsuleForm.patchValue({
      str_IndL1LimitOn: 'Actual'
    })

    this.editCapsuleForm.patchValue({
      str_IndL1GraphOn: 'Standard'
    })

    this.editCapsuleForm.patchValue({
      str_GrpL1LimitOn: 'Actual'
    })

    this.editCapsuleForm.patchValue({
      str_GrpL1GraphOn: 'Standard'
    })

    this.editCapsuleForm.patchValue({
      str_IndL2LimitOn: 'Actual'
    })

    this.editCapsuleForm.patchValue({
      str_IndL2GraphOn: 'Standard'
    })

    this.editCapsuleForm.patchValue({
      str_GrpL2LimitOn: 'Actual'
    })

    this.editCapsuleForm.patchValue({
      str_GrpL2GraphOn: 'Standard'
    })

    this.editCapsuleForm.patchValue({
      str_IndLimitOnCoat: 'Actual'
    })

    this.editCapsuleForm.patchValue({
      str_IndGraphOnCoat: 'Standard'
    })

    this.editCapsuleForm.patchValue({
      str_GrpLimitOnCoat: 'Actual'
    })

    this.editCapsuleForm.patchValue({
      str_GrpGraphOnCoat: 'Standard'
    })

    this.editCapsuleForm.patchValue({
      str_HrdGraphOn: 'Standard'
    })

    this.editCapsuleForm.patchValue({
      str_HrdUnit: 'Kp'
    })

    this.editCapsuleForm.patchValue({
      str_HrdGraphOnCoat: 'Standard'
    })

    this.editCapsuleForm.patchValue({
      str_HrdUnitCoat: 'Kp'
    })
  }
  Cancel() {
    const userId = this.sessionStorage.retrieve("userId").trim();
    this.dataService.MultiCondiLocked(userId, 'tbl_product_capsule', this.arrCond, 'locked', 0)
    this.router.navigate(['/master/product/capsule/manage-capsule'])
  }
  goBack() {
    this.router.navigate(['/master/product/capsule/manage-capsule'])
  }
  ngOnDestroy() {
    this.param.unsubscribe();
    this.sessionStorage.store('EditMode', false);
  }
}
@Component({
  selector: 'app-snackbar',
  template: `<p style="text-align:center">Edit Mode Enabled</p>`,
  styles: [`.example-pizza-party { color: hotpink; }`],
})
export class SnackBarEditComponent { }

@Component({
  selector: 'app-snackbar',
  template: `<p style="text-align:center">View Mode Enabled</p>`,
  styles: [`.example-pizza-party { color: hotpink; }`],
})
export class SnackBarViewComponent { }
