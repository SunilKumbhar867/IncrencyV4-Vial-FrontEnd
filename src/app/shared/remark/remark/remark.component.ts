import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Validators } from "@angular/forms";
import {  ElementRef, Renderer } from '@angular/core';
import { ValidationService } from "../../../services/validations/validation.service";

@Component({
  selector: "app-remark",
  templateUrl: "./remark.component.html",
  styleUrls: ["./remark.component.css"]
})
export class RemarkComponent implements OnInit {
  public _remarkForm: FormGroup;
  constructor(
    el: ElementRef,
    renderer: Renderer,
    private validation: ValidationService,
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<RemarkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    var events = 'cut copy paste';
    events.split(' ').forEach(e =>
    renderer.listen(el.nativeElement, e, (event) => {
      event.preventDefault();
      })
    );
  }
  // ***********************************************************************************************//
  onNoClick(): void {
    this.dialogRef.close();
  }
  // ***********************************************************************************************//
  ngOnInit() {
    $("textarea").on("keypress", function (e)
    {
      if (e.which === 32 && !this.value.length)
        e.preventDefault();
    });
    this._remarkForm = this._formBuilder.group({
      reason: ["", Validators.compose([Validators.required,this.validation.validateOnlyWhiteSpaceEnter])]
    });
  }
  // ***********************************************************************************************//
  //  Below function return the data from where this remark component is called                     //
  // ***********************************************************************************************//
  onSubmit() {
    if (isNaN(this.data.ID)) {
      this.dialogRef.close(this._remarkForm.value);
    } else {
      this.dialogRef.close(this._remarkForm.value);
    }
  }
  // ***********************************************************************************************//
  reset() {
    this._remarkForm.reset();
  }
  // ***********************************************************************************************//
  // ***********************************************************************************************//
  //  Below function closes the Modal Box                                                         //
  // ***********************************************************************************************//
  closeModal() {
    this.dialogRef.close();
  }
}
