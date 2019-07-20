import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpService } from '../../services/http/http.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalComponent } from '../../shared/modal/modal.component';
import { SessionStorageService } from 'ngx-webstorage';
declare var swal: any;

@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.css']
})
export class UserStatusComponent implements OnInit {

  public frm_userStatus: FormGroup;
  // sarr_status = ['Active','Locked','Permanently Disabled','Temporarily Disabled','Auto Disabled'];
  sarr_status = ['Active','Temporarily Disabled'];
  bln_show: boolean;
  bln_loading: boolean;
  pdfSrc: string;
  Url: any;
  toolbar: string;
  str_path: String;

  constructor(private fb: FormBuilder,private http?: HttpService,
    private modalService?: NgbModal,private sanitizer?: DomSanitizer,
    private sessionStorage?: SessionStorageService){}

  ngOnInit()
  {
    this.frm_userStatus = this.fb.group({
      str_status: ['Active']
    })
  }
  cmbStatus_hidegrid()
  {
    this.bln_show = false;
  }
  onSubmit()
  {
    const str_reportName = "RepoUserStatus";
    var int_status;
    const data: Object = {};
    const ObjectData: Object = {};
    const str_status1 = this.frm_userStatus.value.str_status;
    const userID = this.sessionStorage.retrieve("userid");
    const userName = this.sessionStorage.retrieve("username");

    (str_status1 == "Active") ? int_status="0" : (str_status1 == "Locked") ? int_status="6" : (str_status1 == "Permanently Disabled") ? int_status="2" : (str_status1 == "Temporarily Disabled") ? int_status="1" : (str_status1 == "Auto Disabled") ? int_status="4" : "0";

    Object.assign(
      ObjectData,
      {
        str_status1:str_status1,
        str_status: int_status
      }
    );

    this.http.postMethod("user/tempUserStatus",ObjectData).subscribe((res:any) =>{

      if(res.status == "success")
      {
        Object.assign(
          ObjectData,
          { UserId: userID },
          { UserName: userName },
          { HmiId: res.data}
        );
        Object.assign(data, { data: ObjectData }, { FileName: str_reportName });
        this.bln_loading = true;
        this.http
          .postMethod("report/GenerateReport", data)
          .subscribe((res: any) => {
            this.toolbar = "#toolbar=0&navpanes=0";
            const rand = Math.random();
            this.str_path = res.filepath;
            this.pdfSrc = res.filepath + "?v=" + rand + this.toolbar;
            this.Url = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);
            this.bln_loading = false;
            this.bln_show = true;
          });
      }
    });

  }

  btnPrint_showPrintList()
  {
    const modalRef = this.modalService.open(ModalComponent);
      modalRef.componentInstance.path = this.str_path.slice(26);
  }
}
