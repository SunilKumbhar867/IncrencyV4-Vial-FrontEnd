import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RemarkComponent } from "../../../shared/remark/remark/remark.component";
import { SessionStorageService } from "ngx-webstorage";
import { MatDialog } from "@angular/material";
import { DataTableDirective } from 'angular-datatables';
import { HttpService } from '../../../services/http/http.service';
import { ErrorHandlingService } from "../../../services/error-handling/error-handling.service";
import { ValidationService } from '../../../services/validations/validation.service';
import { UserService } from '../../../services/user/user.service';

declare var swal: any;
@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.css']
})
export class AddDepartmentComponent implements OnInit {

  // View child for datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  deptForm: FormGroup;

  obj_GetDepartments : any;
  sarr_Departments = [];
  bln_ShowWarning: boolean = false;
  str_getDeptName: string;
  sarr_DeptList: Array<string> = [];
  obj_GetDepartmentRes : any;

  bln_Submitted = false;
  bln_IsPopupOpened = true;

  public bln_Loading = false;

  str_RemarkHeadingMsg : string;

  constructor
  (
    private http: HttpService,
    private fb: FormBuilder,
    private dialog?: MatDialog,
    private sessionStorage?: SessionStorageService,
    private errorHandling?: ErrorHandlingService,
    private validation?: ValidationService,
    private userService?: UserService,
  )

  {
    this.deptForm = this.fb.group({
      str_DeptName : ['', Validators.compose([this.validation.requiredField,this.validation.validateOnlyWhiteSpaceEnter])],
    });
  }

  get str_DeptName() { return this.deptForm.get('str_DeptName'); }

  ngOnInit() {
       // This service will check whether the user has right to view that page or not, If not it will redirect user to Home Page
       this.userService.checkRights("Add Department");
    this.fetchAllDepartments();

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10
    };
  }

  fetchAllDepartments(){
    this.http.getMethod("department/getDepartments").subscribe(json_Response => {
      this.obj_GetDepartments = json_Response;
      this.sarr_Departments = this.obj_GetDepartments.result;
      if (this.dtElement.dtInstance === undefined) {
        this.dtTrigger.next();
      } else {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      }
    },
    err => {
      this.errorHandling.checkError(err.status);
      this.bln_Loading = false;
    });
  }

  checkDuplDept(event: any) {
    this.str_getDeptName = event.target.value.trim();

    for (let i = 0; i < Object.keys(this.sarr_Departments).length; i++) {
      this.sarr_DeptList.push(this.sarr_Departments[i].department_name.toLowerCase().trim());
    }

    if(this.sarr_DeptList.indexOf(this.str_getDeptName.toLowerCase().trim()) !== -1) {
      swal
      ({
          title: "Department Already Exist",
          text: "",
          type: "warning",
          allowOutsideClick: false,
      },);
      this.fetchAllDepartments();
    }
    else
    {
      this.bln_ShowWarning = false;
    }
  }

  public onFormSubmit() {

    const obj_DeptData: Object = {};

    this.bln_Loading = false;

    const deptName = this.deptForm.value.str_DeptName.trim();

    swal({
      title: 'Are You Sure?',
      text: "Do You Want To Add Department Name " + deptName + " ?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result == true) {
        this.bln_IsPopupOpened = true;
        const message = { message : 'Add Department' };
        const dialogRef = this.dialog.open(RemarkComponent, {
          data: message,
          width: '570px',
          disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {

        const data: Object = {};

        if (result !== undefined) {
            const userId = this.sessionStorage.retrieve("userId").trim();
            const userName = this.sessionStorage.retrieve("userName").trim();
            const action = 'Add';
            const remark = result.reason.trim();

            Object.assign
            (data,
              { department: deptName },
              { loggedUserId: userId },
              { loggedUserName: userName },
              { action: action },
              { remark: remark }
            );
            this.bln_Loading = true;

            this.http.postMethod('department/addDepartment', data).subscribe((res) => {

              this.bln_Loading = false;
              this.obj_GetDepartmentRes = res;
              if (this.obj_GetDepartmentRes.result === 'Department Already Exist') {
                swal('Department Already Exist', '', 'warning');
                this.deptForm.reset();
                this.fetchAllDepartments();
              } else if (this.obj_GetDepartmentRes.result === 'Department Added Successfully') {
                swal('Department Added Successfully', '', 'success');
                this.deptForm.reset();
                this.fetchAllDepartments();
              } else {
                swal('Can not Add Department, Try again', '', 'error');
              }
            },
            err => {
              this.errorHandling.checkError(err.status);
              this.bln_Loading = false;
            });
          }
        });
      }
    }, function (dismiss) { })
  }

  reset() {
    this.deptForm.reset()
    this.bln_ShowWarning = false;
  }

}
