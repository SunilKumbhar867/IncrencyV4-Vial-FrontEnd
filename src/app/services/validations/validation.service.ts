import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { SWITCH_TEMPLATE_REF_FACTORY__POST_R3__ } from '@angular/core/src/linker/template_ref';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  onlyNumbers(event) {
    var theEvent = event || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /[0-9]/;
    if (!regex.test(key)) {
      event.preventDefault();
    }
  }

  onlyNumbersWithDecimal(event) {
    var charCode = (event.which) ? event.which : event.keyCode
    // Avoid dot at first position & Allow only 1 decimal point ('.') ...
    if
      (
      (charCode == 46 && event.target.value.length == 0) || ((event.target.value.indexOf('.') != -1) && (charCode < 48 || charCode > 57)) || (charCode != 46 && (charCode < 48 || charCode > 57))
    ) {
      event.preventDefault();
    }
  }

  validateOnlyWhiteSpaceEnter(control: AbstractControl) {
    if(control.value)
    {
      if (control.value.trim().length == 0) {
        return { required: 'Required' };
      }
    }

    return null;
  }

  requiredField(control: AbstractControl) {
    if (control.value == null || control.value == "") {
      return { required: 'Required' };
    }

    return null;
  }

  getDPValue(value: any) {
    var int_dp = 0;

    if(value != null && value.indexOf('.') !== -1)
    {
      int_dp = value.split(".");
    }
    else
    {
      return 0;
    }

    if (int_dp[1] == undefined) {
      return 0;
    }
    else {
      return int_dp[1].length;
    }
  }

  validateZeroEntry(control: AbstractControl) {
    const isZeroEntry = null;
    if (control.value != null && control.value <= 0 && control.value.length != 0) {
      return { isZeroEntry: 'Cannot Be Zero' };
    }
    return isZeroEntry;

  }

  stdT1PosT1NegT2NegT2PosValCmpValidator(compControlName: string, paramType: string, cmpTol: string, tolType: string, cmpTolSame: string) {
    let currControl: FormControl;
    let compControl: FormControl;
    return function controlValidate(control: FormControl) {

      if (!control.parent) {
        return null;
      }

      // Initializing the validator.
      if (!currControl) {

        currControl = control;
        compControl = control.parent.get(compControlName) as FormControl;

        if (!compControl) {
          throw new Error(
            "controlValidate(): other control is not found in parent group"
          );
        }

        compControl.valueChanges.subscribe((res) => {
          currControl.updateValueAndValidity();
        });
      }

      if (
        (
          paramType == "Group" || paramType == "Individual" ||
          paramType == "Group Layer1" || paramType == "Individual Layer1" ||
          paramType == "Individual Layer2" || paramType == "Group Layer2" ||
          paramType == "Dimension"
        ) &&
        (tolType == "Positive" || tolType == "Negative") &&
        (cmpTol == "2" || cmpTol == "1") &&
        (cmpTolSame == "No")
      ) {

        if (Number(compControl.value) >= Number(currControl.value) &&
          Number(compControl.value != '') && Number(currControl.value != '') &&
          Number(compControl.value != 0) && Number(currControl.value != 0) &&
          Number(compControl.value != null) && Number(currControl.value != null)) {

          return {
            cmpMsg: "Tolerance 2 "  + tolType +" Value Cannot Be Less Than Or Equal To Tolerance 1 " + tolType + " Value"
          };

        }

        else {
          return null;
        }
      }

      if (
        (
          paramType == "Group" || paramType == "Individual" ||
          paramType == "Group Layer1" || paramType == "Individual Layer1" ||
          paramType == "Individual Layer2" || paramType == "Group Layer2" ||
          paramType == "Dimension"
        ) &&
        (tolType == "Positive" || tolType == "Negative") &&
        (cmpTol == "3") &&
        (cmpTolSame == "No")
      ) {
        if (Number(compControl.value) == Number(currControl.value))  {
          return {
            cmpMsg: "Tolerance 1 "  + tolType +" Value Cannot Be Equal To Std. Value "
          };

        }

        else {
          return null;
        }
      }

      if (
        (
          paramType == "Group" || paramType == "Individual" ||
          paramType == "Group Layer1" || paramType == "Individual Layer1" ||
          paramType == "Individual Layer2" || paramType == "Group Layer2" ||
          paramType == "Dimension"
        ) &&
        (tolType == "Positive") && (cmpTol == "1" || cmpTol == "2") && (cmpTolSame == "Yes")) {

        if (Number(compControl.value) > Number(currControl.value) &&
          Number(compControl.value != '') && Number(currControl.value != '') &&
          Number(compControl.value != 0) && Number(currControl.value != 0) &&
          Number(compControl.value != null) && Number(currControl.value != null)) {

          return {
            cmpMsg: "Tolerance " + cmpTol + " Positive Value Cannot Be Less Than Tolerance " + cmpTol + " Negative Value"
          };
        }

        else {
          return null;
        }
      }

      if (
        (
          paramType == "Group" || paramType == "Individual" ||
          paramType == "Group Layer1" || paramType == "Individual Layer1" ||
          paramType == "Individual Layer2" || paramType == "Group Layer2" ||
          paramType == "Dimension"
        ) &&
        (tolType == "Positive" || tolType == "Negative") && (cmpTol == "1" || cmpTol == "2") &&
        (cmpTolSame == "Zero")) {

        if (((Number(compControl.value) != 0) && (Number(currControl.value) == 0)) &&
          Number(compControl.value != '') && Number(currControl.value != '') &&
          Number(compControl.value != null) && Number(currControl.value != null)) {

          return {
            cmpMsg: "Cannot Be Zero"
          };
        }

        else {
          return null;
        }
      }

      if (paramType == "Hardness" || paramType == "Moisure Analyzer") {

        if (cmpTol == "2" &&
          Number(currControl.value) == 0 && Number(compControl.value) == 0 &&
          Number(compControl.value != '') && Number(currControl.value != '') &&
          Number(compControl.value != null) && Number(currControl.value != null)) {

          return {
            cmpMsg: "NLT And NMT Both Value Cannot Be Equal To Zero"
          };
        }

        if (cmpTol == "2" && Number(compControl.value) >= Number(currControl.value) &&
          Number(compControl.value != '') && Number(currControl.value != '') &&
          Number(compControl.value != 0) && Number(currControl.value != 0) &&
          Number(compControl.value != null) && Number(currControl.value != null)) {

          return {
            cmpMsg: "NLT Cannot Be Greater Than Or Equal To NMT"
          };
        }

        else {
          return null;
        }
      }

      if (paramType == "Disintegration Test") {

        compControl.valueChanges.subscribe((res) => {
          currControl.updateValueAndValidity();
        });

        let int_DTHHTime: number = 0;
        let int_DTHHTimeCoat: number = 0;

        if (control.root.get('int_DTHHTime')) {
          int_DTHHTime = control.root.get('int_DTHHTime').value;
        }
        else {
          int_DTHHTime = 0;
        }

        if (control.root.get('int_DTHHTimeCoat')) {
          int_DTHHTimeCoat = control.root.get('int_DTHHTimeCoat').value;
        }
        else {
          int_DTHHTimeCoat = 0;
        }

        if (cmpTol == "1" && compControlName == "int_DTMMTime" &&
          Number(currControl.value) == 0 && Number(compControl.value) == 0 && (int_DTHHTime == 0) &&
          Number(compControl.value != '') && Number(currControl.value != '') &&
          Number(compControl.value != null) && Number(currControl.value != null) && (int_DTHHTime != null)) {
          return {
            cmpMsg: "DT Time Value Cannot Be To Zero"
          };
        }

        if (cmpTol == "1" && compControlName == "int_DTMMTimeCoat" &&
          Number(currControl.value) == 0 && Number(compControl.value) == 0 && (int_DTHHTimeCoat == 0) &&
          Number(compControl.value != '') && Number(currControl.value != '') &&
          Number(compControl.value != null) && Number(currControl.value != null) && (int_DTHHTimeCoat != null)) {
          return {
            cmpMsg: "DT Time Value Cannot Be To Zero"
          };
        }

        if (cmpTol == "2" && Number(compControl.value) >= Number(currControl.value) &&
        Number(compControl.value != '') && Number(currControl.value != '') &&
        Number(compControl.value != 0) && Number(currControl.value != 0) &&
        Number(compControl.value != null) && Number(currControl.value != null)) {
        return {
          cmpMsg: "Min Temp Cannot Be Greater Than Or Equal To Max Temp"
        };
      }

        else {
          return null;
        }
      }

      if (paramType == "Tapped Density" || paramType == "Moisure Analyzer" || paramType == "Sieve Shaker" ||
      paramType == "LOD Compressed Dry" || paramType == "LOD Compressed Lubricated" || paramType == "LOD Layer1 Dry"
      || paramType == "LOD Layer 1 Lubricated" || paramType == "LOD Layer2 Dry" || paramType == "LOD Layer 2 Lubricated"
      || paramType == "Tap Density" || paramType == "% Fine" || paramType == "Particle Sizing") {
        if (cmpTol == "1" && Number(compControl.value) >= Number(currControl.value) &&
          Number(compControl.value != '') && Number(currControl.value != '') &&
          Number(compControl.value != 0) && Number(currControl.value != 0) &&
          Number(compControl.value != null) && Number(currControl.value != null)) {
          return {
            cmpMsg: "Tolerance 1 Cannot Be Greater Than Or Equal To Tolerance 2"
          };
        }

        else {
          return null;
        }
      }

    };
  }

  allowCharactersInInputFields(event)
  {
    var theEvent = event || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /[A-Za-z0-9\s\\+$!()@%&*^?,<>#.:/_-]/;
    if (!regex.test(key))
    {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) theEvent.preventDefault();
    }
  }
  checkForEmptyAndIndStd(compControlName) {
    let currControl: FormControl;
    let compControl: FormControl;
    return function controlValidate(control: FormControl) {
      if (!control.parent) {
        return null;
      }

      // Initializing the validator.
      if (!currControl) {

        currControl = control;
        compControl = control.parent.get(compControlName) as FormControl;

        if (!compControl) {
          throw new Error(
            "controlValidate(): other control is not found in parent group"
          );
        }

        compControl.valueChanges.subscribe((res) => {
          currControl.updateValueAndValidity();
        });
      }
        if (compControl.value < currControl.value) {
          return {
            EmptyMsg: "Std cannot be greater than Ind Std"
          };
        } else {
          return null
        }

    }
  }


}
