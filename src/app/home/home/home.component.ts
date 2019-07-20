import { Component, OnInit } from "@angular/core";
import { TimerService } from "../../services/timer/timer.service";
import { HttpService } from "../../services/http/http.service";
declare var swal: any;
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})

export class HomeComponent implements OnInit
{

  constructor(public TimerService: TimerService, public http: HttpService)
  {

  }

  ngOnInit()
  {
    this.http.getMethod('parameter/getAllParameters').subscribe((res: any) =>
    {
      const timeOutPeriod = res.result[0].tbl_config_TimeoutPeriod;
      this.TimerService.startCheck(timeOutPeriod);
    });
  }
}
