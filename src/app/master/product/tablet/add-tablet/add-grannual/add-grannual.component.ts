import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ValidationService } from "../../../../../services/validations/validation.service";
import { NgbPanelChangeEvent } from "@ng-bootstrap/ng-bootstrap";
import { AddTabletComponent } from '../add-tablet.component';

@Component({
  selector: "app-add-grannual",
  templateUrl: "./add-grannual.component.html",
  styleUrls: ["./add-grannual.component.css"]
})
export class AddGrannualComponent implements OnInit
{
  @Input() parentFormGroup: FormGroup;
  @Input() childMessage: any;
  @Output() childEvent = new EventEmitter();
  constructor(private fb: FormBuilder, private validation: ValidationService,public addTablet:AddTabletComponent) { }

  ngOnInit() { }

  onlyNumbersWithDecimal(event: any)
  {
    this.validation.onlyNumbersWithDecimal(event);
  }

  get flt_CompDryMin()
  {
    return this.parentFormGroup.get("flt_CompDryMin");
  }
  get flt_CompDryMax()
  {
    return this.parentFormGroup.get("flt_CompDryMax");
  }

  get flt_CompLubMin()
  {
    return this.parentFormGroup.get("flt_CompLubMin");
  }
  get flt_CompLubMax()
  {
    return this.parentFormGroup.get("flt_CompLubMax");
  }

  get flt_Layer1DryMin()
  {
    return this.parentFormGroup.get("flt_Layer1DryMin");
  }
  get flt_Layer1DryMax()
  {
    return this.parentFormGroup.get("flt_Layer1DryMax");
  }

  get flt_Layer1LubMin()
  {
    return this.parentFormGroup.get("flt_Layer1LubMin");
  }
  get flt_Layer1LubMax()
  {
    return this.parentFormGroup.get("flt_Layer1LubMax");
  }

  get flt_Layer2DryMin()
  {
    return this.parentFormGroup.get("flt_Layer2DryMin");
  }
  get flt_Layer2DryMax()
  {
    return this.parentFormGroup.get("flt_Layer2DryMax");
  }

  get flt_Layer2LubMin()
  {
    return this.parentFormGroup.get("flt_Layer2LubMin");
  }
  get flt_Layer2LubMax()
  {
    return this.parentFormGroup.get("flt_Layer2LubMax");
  }

  get flt_TapDenMin()
  {
    return this.parentFormGroup.get("flt_TapDenMin");
  }
  get flt_TapDenMax()
  {
    return this.parentFormGroup.get("flt_TapDenMax");
  }

  get flt_FineMin()
  {
    return this.parentFormGroup.get("flt_FineMin");
  }
  get flt_FineMax()
  {
    return this.parentFormGroup.get("flt_FineMax");
  }

  get flt_PartSizingMin()
  {
    return this.parentFormGroup.get("flt_PartSizingMin");
  }
  get flt_PartSizingMax()
  {
    return this.parentFormGroup.get("flt_PartSizingMax");
  }

  tglPnlFunc(event: NgbPanelChangeEvent)
  {
    this.childEvent.emit(event);
    // console.log(event.panelId);
  }

  checkValidParameterValues()
  {
    this.addTablet.checkValidParameterValues()
  }
}
