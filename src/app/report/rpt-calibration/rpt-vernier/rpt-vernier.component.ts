import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder
} from "@angular/forms";
import { DatePipe } from "@angular/common";
@Component({
  selector: "app-rpt-vernier",
  templateUrl: "./rpt-vernier.component.html",
  styleUrls: ["./rpt-vernier.component.css"]
})
export class RptVernierComponent implements OnInit {
  sarr_reportType = ["Complete", "Failure"];
  sarr_calibrationType = ["Daily", "Periodic"];
  todayDate = new Date();
  vernierCalibration: FormGroup;

  constructor(private fb: FormBuilder, public datePipe: DatePipe) {
    this.vernierCalibration = this.fb.group({
      reportType: new FormControl("", Validators.required),
      date: new FormControl("", Validators.required),
      balanceCode: new FormControl("", Validators.required),
      printNo: new FormControl("1", Validators.required),
      reportSerialNo: new FormControl("")
    });
    const todayMonth = this.datePipe.transform(this.todayDate, "yyyy-MM");
    this.vernierCalibration.patchValue({
      date: todayMonth
    });
  }

  onFormSubmit() {
    console.log(this.vernierCalibration.value);
  }

  ngOnInit() {}
}
