import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../services/http/http.service';
import { ValidationService } from '../../services/validations/validation.service';
import { SessionStorageService } from 'ngx-webstorage';
import { ErrorHandlingService } from '../../services/error-handling/error-handling.service';
import { MatDialog } from '@angular/material';
import { RemarkComponent } from '../../shared/remark/remark/remark.component';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from "rxjs";
import { UserService } from '../../services/user/user.service';
declare var swal: any;

@Component({
  selector: 'app-dtmedia',
  templateUrl: './dtmedia.component.html',
  styleUrls: ['./dtmedia.component.css']
})
export class DTMediaComponent implements OnInit {
   // View child for datatables
 @ViewChild(DataTableDirective)
 dtElement: DataTableDirective;
 dtOptions: DataTables.Settings = {};
 dtTrigger: Subject<any> = new Subject();

  bln_IDexist:boolean;
  bln_isRemarkPopupOpened: boolean;
  bln_Loading: boolean;

  obj_submitData:any;
  objarr_apiSubmitData:any;

  sarr_mediaData: Array<string> = [];

  int_length:any;

  frm_media: FormGroup;

  get str_media()
  {
    return this.frm_media.get('str_media');
  }
  constructor(private fb: FormBuilder,private http ?: HttpService,
    private validation?: ValidationService,
    private sessionStorage?: SessionStorageService,
    private errorHandling?: ErrorHandlingService,private dialog?: MatDialog,
    private userService?: UserService,) { }

  ngOnInit() {
     // This service will check whether the user has right to view that page or not, If not it will redirect user to Home Page
     this.userService.checkRights("Media");
    this.bln_IDexist = false;
    this.frm_media = this.fb.group({
      str_media: ['',Validators.compose([this.validation.requiredField,this.validation.validateOnlyWhiteSpaceEnter])]
    })

    this.getMediaData();

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10
    };
  }

  getMediaData()
  {
    this.sarr_mediaData = [];
    this.http.getMethod('media/getMedia').subscribe((res:any)=>{
      res.forEach(element => {
        this.sarr_mediaData.push(element.Media);
      });

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
  }

  onkey_checkDataExist(str_Media:any)
  {
    var str_Media = str_Media.target.value;
    str_Media = str_Media.toLowerCase();
    this.int_length = this.sarr_mediaData.filter(x => x.toLowerCase() === str_Media);
    if (this.int_length.length > 0) {
      this.bln_IDexist = true;
    }
    else
    {
      this.bln_IDexist = false;
    }
  }

  dataTableReset()
  {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) =>
    {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  getDataToSendOnSubmit(str_remark:any)
  {
    const str_media = this.frm_media.value.str_media;

     /**Audit Trail Data */
     const str_action = "Add";
     const str_userID = this.sessionStorage.retrieve("userId");
     const str_userName = this.sessionStorage.retrieve("userName");
     /**End Audit Trail Data */

      /**Activity Log */
      const str_activity = "Media Added";
      /**End Activity Log */

     this.obj_submitData =
     {
       "Media": str_media,
       "Action": str_action,
       "Remark": str_remark,
       "username": str_userName,
       "userid": str_userID,
       "activity": str_activity
     };
     const data:Object={};
     Object.assign(data,this.obj_submitData);
     return data;
  }

  onSubmit()
  {
    swal({
      title: 'Are you sure ?',
      text: "Do you want to add " + this.frm_media.value.str_media + "?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) =>
    {
      if (result)
      {
        this.bln_Loading = false;
        this.bln_isRemarkPopupOpened = true;
        const message = { message : 'Media'  };
        const dialogRef = this.dialog.open(RemarkComponent, {
          data: message,
          width: '570px',
          disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result !== undefined) //remark data
          {
            const remark = result.reason;
            const obj_sendData = this.getDataToSendOnSubmit(remark);
            this.bln_Loading = true;
            this.http.postMethod('media/storeMedia', obj_sendData).subscribe(res=>{
            this.bln_Loading = false;
            this.objarr_apiSubmitData = res;

            if (this.objarr_apiSubmitData.result === 'Media already exist')
            {
              this.bln_Loading = false;
              swal({
                title: "Media already exist!",
                text: "",
                type: "warning",
                allowOutsideClick: false,
                },);
              this.frm_media.value.str_media = '';
            }
            else if (this.objarr_apiSubmitData.result === 'Media Added Successfully') {
              swal({
                title: "Media Added Successfully!",
                text: "",
                type: "success",
                allowOutsideClick: false,
                },);

              this.onReset();
              this.getMediaData();
              this.dataTableReset();
            }
            else
            {
              swal({
                title: "Can not Add Media, Try again!",
                text: "",
                type: "error",
                allowOutsideClick: false,
                },);
            }
            },
            err => {
              this.errorHandling.checkError(err.status);
              this.bln_Loading = false;
            });
          }
        });
      }
    }, function (dismiss) { });
  }
  onReset()
  {
    this.frm_media.reset();
    this.bln_IDexist=false;
  }
}
