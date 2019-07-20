import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from "rxjs";
import { JsonDataService } from '../../../services/commonData/json-data.service';
import { HttpService } from '../../../services/http/http.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-viewbox1',
  templateUrl: './viewbox1.component.html',
  styleUrls: ['./viewbox1.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class Viewbox1Component implements OnInit {

   // View child for datatables
 @ViewChild(DataTableDirective)
 dtElement: DataTableDirective;
 dtOptions: DataTables.Settings = {};
 dtTrigger: Subject<any> = new Subject();

  sarr_CalibBoxType: Array<string> = [];
  sarr_CalibID: Array<string> = [];
  sarr_stdTableData: Array<string> = [];
  sarr_stdWeightTableData: Array<string> = [];
  bln_showTable: boolean =false;
  str_IDLabel: string = '';
  str_StdLabel: string = '';
  str_StdID: string = '';
  obj_getAllAPIData: any;
  int_length: any;
  closeResult: string;
  int_countWeight: number = 0;
  int_IdentificationNo: number;

  constructor(private jsonData ?: JsonDataService,private http?: HttpService,
    private modalService ?: NgbModal) {
   }

  ngOnInit() {
    this.jsonData.getValueFromJSON().then((res: any) => {
      const str_calibTypes = res.CalibrationBox.filter(x => x.Value == 1);
      str_calibTypes.forEach((element)=>{
        this.sarr_CalibBoxType.push(element.Name);
      })
      this.int_IdentificationNo = res.Balance[7].Value;
    }).catch(err => {
      console.log(err)
    });

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10
    };
  }

  getBoxType(event:any)
  {
    this.str_IDLabel = event;
    this.sarr_CalibID = [];
    this.http.getMethod('calibrationbox/getCalibration').subscribe((res:any)=>{
      this.obj_getAllAPIData = res;
      this.sarr_stdTableData = [];
      for (let i = 0; i < Object.keys(this.obj_getAllAPIData).length; i++)
      {
        if(this.obj_getAllAPIData[i].CB_Type == event)
        {
          this.int_length = this.sarr_CalibID.filter(x => x === this.obj_getAllAPIData[i].CB_ID);
          if (this.int_length.length == 0) {
            this.sarr_stdTableData.push(this.obj_getAllAPIData[i]);
            this.sarr_CalibID.push(this.obj_getAllAPIData[i].CB_ID);
          }

        }
      }
    if (this.dtElement.dtInstance === undefined)
    {
      this.dtTrigger.next();
    } else
    {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) =>
      {
        // Destroy the table first
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    }
     })

    if(event == "Weight Box")
    {
      this.str_StdLabel = 'Weight';
    }
    else
    {
      this.str_StdLabel = 'Block';
    }

    this.bln_showTable = true;
  }

  open2(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  getWeightDetail(strid: any)
  {
    this.str_StdID = strid.CB_ID.trim();
    this.int_countWeight = 0;
    this.sarr_stdWeightTableData = [];
    for (let i = 0; i < Object.keys(this.obj_getAllAPIData).length; i++)
      {
        if(this.obj_getAllAPIData[i].CB_ID == strid.CB_ID.trim())
        {
          this.int_countWeight = this.int_countWeight + 1;
          this.sarr_stdWeightTableData.push(this.obj_getAllAPIData[i]);
        }
      }
  }
}
