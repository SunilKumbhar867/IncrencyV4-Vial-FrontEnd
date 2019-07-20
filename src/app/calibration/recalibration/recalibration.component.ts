import { Component, OnInit } from "@angular/core";
import { RemarkComponent } from "../../shared/remark/remark/remark.component";
import { MatDialog } from "@angular/material";
import { HttpService } from "../../services/http/http.service";
import { ErrorHandlingService } from "../../services/error-handling/error-handling.service";
import { DatePipe } from "@angular/common";
import { SessionStorageService } from "ngx-webstorage";
declare var swal: any;
@Component({
  selector: "app-recalibration",
  templateUrl: "./recalibration.component.html",
  styleUrls: ["./recalibration.component.css"]
})
export class RecalibrationComponent implements OnInit {
  bln_loading: boolean;
  bln_isPopupOpened: boolean;
  // FOR DAILY RECALIBRATION
  bln_recalibrateDaily: boolean;
  bln_showDailyCalibration: boolean;
  bln_showRoutineCalibration: boolean;
  // FOR PERIODIC CALIBRATION
  bln_recalibratePeriodic:boolean;
  bln_showDailyCalibrationPeriodic:boolean;
  bln_showRoutineCalibrationPeriodic:boolean;
  bln_showDetails: boolean;
  sarr_equipmentType = ["Balance"];
  sarr_equipmentID: Array<any> = [];
  sarr_allEquipments: Array<any> = [];
  str_selectedEquipment: String;
  todayDate = new Date();
  constructor(
    private dialog: MatDialog,
    private http: HttpService,
    private errorHandling: ErrorHandlingService,
    public datePipe: DatePipe,
    private sessionStorage?: SessionStorageService
  ) {
    this.getCalibrationData();
  }

  /// On Select of Equipment Type
  onSelectType(type) {
    this.getCalibrationData();
  }

  // On Select Particular ID check its status
  onSelectID(id) {
    this.bln_showDetails = true;
    this.str_selectedEquipment = id;
    const date = this.datePipe.transform(this.todayDate, "yyyy-MM-dd");
    const data = { id: this.str_selectedEquipment, date: date, Type: "a" };
    const selectedEquipment = this.sarr_allEquipments.filter(
      x => x.Bal_ID == id
    );
    console.log(selectedEquipment);
    this.getCalibrationData();
    this.http
      .postMethod("recalibration/getCalibrationMasterData", data)
      .subscribe(
        (res: any) => {
          console.log(res);
             // BELOW IS FOR DAILY CONDITIONS
          if (selectedEquipment[0].DailyBalRecalib == 0 && res[0].DailyPending == true) {
            this.bln_recalibrateDaily = false;
            this.bln_showDailyCalibration = false;
            this.bln_showRoutineCalibration = true;
            // if true show Recalibration Button
          } else if (selectedEquipment[0].DailyBalRecalib == 0 && res[0].DailyPending == false) {
            this.bln_recalibrateDaily = true;
            this.bln_showDailyCalibration = false;
            this.bln_showRoutineCalibration = false;
          } else if (selectedEquipment[0].DailyBalRecalib == 1 && res[0].DailyPending == false ) {
            this.bln_recalibrateDaily = false;
            this.bln_showDailyCalibration = true;
            this.bln_showRoutineCalibration = false;
          }else if(selectedEquipment[0].DailyBalRecalib == 1 && res[0].DailyPending == true) {
            this.bln_recalibrateDaily = false;
            this.bln_showDailyCalibration = true;
            this.bln_showRoutineCalibration = false;

          }else {

          }

          // BELOW IS FOR PERIODIC CONDITIONS
          if (selectedEquipment[0].PeriodicBalRecalib == 0 && res[1].PeriodicPending == true) {
            this.bln_recalibratePeriodic = false;
            this.bln_showDailyCalibrationPeriodic = false;
            this.bln_showRoutineCalibrationPeriodic = true;
            // if true show Recalibration Button
          } else if (selectedEquipment[0].PeriodicBalRecalib == 0 && res[1].PeriodicPending == false) {
            this.bln_recalibratePeriodic = true;
            this.bln_showDailyCalibrationPeriodic = false;
            this.bln_showRoutineCalibrationPeriodic = false;
          } else if (selectedEquipment[0].PeriodicBalRecalib == 1 && res[1].PeriodicPending == false ) {
            this.bln_recalibratePeriodic = false;
            this.bln_showDailyCalibrationPeriodic = true;
            this.bln_showRoutineCalibrationPeriodic = false;
          }else if(selectedEquipment[0].PeriodicBalRecalib == 1 && res[1].PeriodicPending == true) {
            this.bln_recalibratePeriodic = false;
            this.bln_showDailyCalibrationPeriodic = true;
            this.bln_showRoutineCalibrationPeriodic = false;
          }else{

          }
        },
        err => {
          this.errorHandling.checkError(err.status);
          this.bln_loading = false;
        }
      );
  }

  getCalibrationData() {
    this.bln_loading = true;
    this.http.getMethod("recalibration/getRecalibration").subscribe(
      (res: any) => {
        this.sarr_allEquipments = res.result;
        this.bln_loading = false;
        this.sarr_equipmentID = [];
        for (let i = 0; i < Object.keys(res.result).length; i++) {
          this.sarr_equipmentID.push(res.result[i].Bal_ID);
        }
      },
      err => {
        this.errorHandling.checkError(err.status);
        this.bln_loading = false;
      }
    );
  }


  recalibration(type) {
    this.bln_isPopupOpened = true;
    const message = { message: "Set Recalibration" };
    const dialogRef = this.dialog.open(RemarkComponent, {
      data: message,
      width: "570px",
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.bln_isPopupOpened = false;
      if (result !== undefined) {
        const data: Object = {};
        const act = "Add Recalibration";
        // 1 is for Daily 2 is for Periodic
        const calibType = type == "Daily" ? "1" : "2";
        const userID = this.sessionStorage.retrieve("userid");
        const userName = this.sessionStorage.retrieve("username");
        Object.assign(
          data,
          { remark: result.reason },
          { userID: userID },
          { userName: userName },
          { act: act },
          { calibType: calibType },
          { equipmentId: this.str_selectedEquipment }
        );
        console.log(data);
        this.http
          .postMethod("recalibration/recalibrationUpdateStatus", data)
          .subscribe(
            (res: any) => {
              if (res.result == "Recalibration Status Update") {
                swal("Recalibration Initiated", "", "success");
              }
              this.bln_showDetails=false;
              this.getCalibrationData();
            },
            err => {
              this.errorHandling.checkError(err.status);
              this.bln_loading = false;
            }
          );
      }
    });
  }

  ngOnInit() {}
}
