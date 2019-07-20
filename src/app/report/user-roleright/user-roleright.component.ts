import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpService } from '../../services/http/http.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalComponent } from '../../shared/modal/modal.component';
import { SessionStorageService } from 'ngx-webstorage';
declare var swal: any;

@Component({
  selector: 'app-user-roleright',
  templateUrl: './user-roleright.component.html',
  styleUrls: ['./user-roleright.component.css']
})
export class UserRolerightComponent implements OnInit {
  frm_roleLog: FormGroup;
  sarr_Role: Array<String> = [];
  bln_show: boolean;
  bln_loading: boolean;
  pdfSrc: string;
  Url: any;
  toolbar: string;
  str_path: String;

  constructor(private fb: FormBuilder,private http?: HttpService,
    private modalService?: NgbModal,private sanitizer?: DomSanitizer,
    private sessionStorage?: SessionStorageService) { }

  ngOnInit()
  {
    this.frm_roleLog = this.fb.group({
      str_Role: ['All']
    });

    //get Role from api
    this.sarr_Role = [];
    this.http.getMethod('role/getRoleName').subscribe((res:any)=>{
      this.sarr_Role.push("All");
      res.result.forEach(element => {
        this.sarr_Role.push(element.role_name);
      });

    });
  }

  cmbRole_hideGrid()
  {
    this.bln_show = false;
  }

  onSubmit()
  {
    const str_reportName = "RepoRoleRight";
    const data: Object = {};
    const ObjectData: Object = {};
    const str_role = this.frm_roleLog.value.str_Role;
    const userID = this.sessionStorage.retrieve("userid");
    const userName = this.sessionStorage.retrieve("username");
    // const IP = this.sessionStorage.retrieve("userIP");
    // const int_ip = IP.split(".");

    Object.assign(
      ObjectData,
      {
        str_role:str_role
      }
    );

    this.http.postMethod("role/storeTempRole",ObjectData).subscribe((res:any) =>{

      if(res[0].status == "success")
      {
        Object.assign(
          ObjectData,
           { HmiId: res[0].data },
          { str_role: str_role },
          { UserId: userID },
          { UserName: userName }
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
