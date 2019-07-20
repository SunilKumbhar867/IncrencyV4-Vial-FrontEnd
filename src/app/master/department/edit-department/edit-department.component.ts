import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from "rxjs";
import { HttpService } from '../../../services/http/http.service';
import { ErrorHandlingService } from '../../../services/error-handling/error-handling.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RemarkComponent } from "../../../shared/remark/remark/remark.component";
import { SessionStorageService } from "ngx-webstorage";
import { MatDialog, MatSnackBar } from '@angular/material';
import { ValidationService } from '../../../services/validations/validation.service';
import { DataService } from '../../../services/commonData/data.service';
import { UserService } from '../../../services/user/user.service';

declare var swal: any;

@Component({
  selector: 'app-edit-department',
  templateUrl: './edit-department.component.html',
  styleUrls: ['./edit-department.component.css']
})
export class EditDepartmentComponent implements OnInit, OnDestroy
{


  // View child for datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  deptForm: FormGroup;

  obj_GetDepartments: any;
  sarr_Departments = [];

  str_getDeptName: string;

  sarr_DeptList: Array<string> = [];

  frmEditDept: FormGroup;

  public bln_Loading = false;

  bln_disabledBtn: boolean = false;

  bln_IsPopupOpened = true;

  str_editDeptName: string;
  str_editDeptID: Number;

  bln_editDept: boolean = true;

  bln_editMode: boolean = false;

  bln_rgtEditDept: boolean = false;
  selectedDepartment: string;

  obj_GetDepartmentRes: any;

  bln_ShowBlankMsg: boolean = false;
  int_var: any;

  constructor
    (
      private http: HttpService,
      private errorHandling?: ErrorHandlingService,
      private fb?: FormBuilder,
      private dialog?: MatDialog,
      private sessionStorage?: SessionStorageService,
      public snackBar?: MatSnackBar,
      private validation?: ValidationService,
      private dataService ?: DataService,
      private userService?: UserService,
  )
  {

    this.frmEditDept = this.fb.group({
      str_DeptId: ['', [Validators.required]],
      str_DeptName: ['', Validators.compose([this.validation.requiredField,this.validation.validateOnlyWhiteSpaceEnter])],
    });

    const LoggeInUSerRights = this.sessionStorage.retrieve("rightsarray");

    if (LoggeInUSerRights.find(k => k === 'Edit Department') !== undefined)
    {
      this.bln_rgtEditDept = true;
    } else
    {
      this.bln_rgtEditDept = false;
    }
  }

  appInitializeForm(dept_name, dept_id)
  {

    this.frmEditDept = this.fb.group({
      str_DeptId: [dept_id, [Validators.required]],
      str_DeptName: [dept_name, Validators.compose([this.validation.requiredField,this.validation.validateOnlyWhiteSpaceEnter])],
    });
  }

  get str_DeptName() { return this.frmEditDept.get('str_DeptName'); }
  get str_DeptId() { return this.frmEditDept.get('str_DeptId'); }

  fetchAllDepartments()
  {
    this.http.getMethod("department/getDepartments").subscribe(json_Response =>
    {
      this.obj_GetDepartments = json_Response;
      this.sarr_Departments = this.obj_GetDepartments.result;

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
    },
      err =>
      {
        this.errorHandling.checkError(err.status);
        this.bln_Loading = false;
      });
  }

  ngOnInit()
  {
       // This service will check whether the user has right to view that page or not, If not it will redirect user to Home Page
       this.userService.checkRights("Edit Department");
    this.fetchAllDepartments();

    this.dtOptions =
      {
        pagingType: "full_numbers",
        pageLength: 10
      };

    this.int_var = setInterval(() =>
    {
      this.getDeptData();
    }, 1000);
  }

  ngOnDestroy()
  {
    clearInterval(this.int_var);
  }

  checkDuplDept(event: any)
  {
    this.str_getDeptName = event.target.value.trim();
    for (let i = 0; i < Object.keys(this.sarr_Departments).length; i++)
    {
      this.sarr_DeptList.push(this.sarr_Departments[i].department_name.toLowerCase().trim());
    }

    if (this.sarr_DeptList.indexOf(this.str_getDeptName.toLowerCase().trim()) !== -1)
    {
      swal
        ({
          title: "Department Already Exist",
          text: "",
          type: "warning",
          allowOutsideClick: false,
        });
      this.str_getDeptName = event.target.value.trim();
      //this.fetchAllDepartments();
    }
    else
    {
      this.bln_ShowBlankMsg = false;
    }
  }

  getDeptData()
  {
    this.http.getMethod('department/getDepartments').subscribe((json_Response: any) =>
    {
      this.obj_GetDepartments = json_Response;
    }, err =>
      {
        this.errorHandling.checkError(err.status);
        this.bln_Loading = false;
      });
    return this.obj_GetDepartments;
  }

  onSaveBtnClick()
  {
    const deptName = this.frmEditDept.value.str_DeptName.trim();

    if (deptName == this.str_editDeptName)
    {
      swal({
        title: "No Change",
        text: "",
        type: "warning",
        allowOutsideClick: false,
      });
    }
    else
    {
      swal
        ({
          title: 'Are You Sure?',
          text: 'Do You Want To Edit Department Name ' + deptName + ' ?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#DD6B55',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          allowOutsideClick: false
        }).then((result) =>
        {
          if (result === true)
          {
            this.bln_IsPopupOpened = true;
            const message = { message: 'Edit Department' };
            const dialogRef = this.dialog.open(RemarkComponent,
              {
                data: message,
                width: '570px',
              });

            dialogRef.afterClosed().subscribe(result =>
            {
              this.bln_IsPopupOpened = false;
              const data: Object = {};
              if (result !== undefined)
              {
                const deptId = this.frmEditDept.value.str_DeptId;
                const loggeduserid = this.sessionStorage.retrieve('userid').trim();
                const loggedusername = this.sessionStorage.retrieve('username').trim();
                const action = 'Edit';
                const remark = result.reason.trim();

                Object.assign
                  (
                    data,
                    { deptId: deptId },
                    { deptName: deptName },
                    { loggeduserid: loggeduserid },
                    { loggedusername: loggedusername },
                    { remark: remark },
                    { action: action },
                  );

                this.bln_Loading = true;
                this.http.putMethod('department/editDepartment', data).subscribe((editDeptRes: any) =>
                {
                  this.bln_Loading = false;

                  this.obj_GetDepartmentRes = editDeptRes;

                  if (this.obj_GetDepartmentRes.result === 'Department Already Exist')
                  {
                    swal({
                      title: "Department Already Exist",
                      text: "",
                      type: "warning",
                      allowOutsideClick: false,
                    });
                    this.frmEditDept.reset();
                    this.fetchAllDepartments();
                  }
                  else if (this.obj_GetDepartmentRes.result === 'Department Updated Successfully')
                  {
                    swal({
                      title: "Department Updated Successfully",
                      text: "",
                      type: "success",
                      allowOutsideClick: false,
                    });
                    //this.frmEditDept.reset();
                    this.fetchAllDepartments();
                    this.str_editDeptName = "";
                    this.bln_rgtEditDept = true;
                    this.bln_editDept = true;
                    this.bln_editMode = false;
                    this.sessionStorage.store('EditMode', false);
                    console.log(deptId);
                    this.dataService.setLocked(this.sessionStorage.retrieve("userId"), "tbl_department", "department_id",
                    deptId, "locked", "0");
                  }
                  else
                  {
                    swal({
                      title: "Can not Update Department, Try again",
                      text: "",
                      type: "error",
                      allowOutsideClick: false,
                    });
                  }
                },
                  err =>
                  {
                    this.errorHandling.checkError(err.status);
                    this.bln_Loading = false;
                  });
              }
            });
          }
        }, function (dismiss) { });
    }
  }

  reset(departments)
  {
    this.str_editDeptName = "";
    this.bln_disabledBtn = false;
    this.bln_editMode = false;
    this.sessionStorage.store('EditMode', false);
    this.dataService.setLocked(this.sessionStorage.retrieve("userId"), "tbl_department", "department_id",
    departments.department_id, "locked", "0");
    this.bln_rgtEditDept = true;
    this.bln_editDept = true;
    this.fetchAllDepartments();
  }

  editDept(departments)
  {
    this.str_editDeptName = departments.department_name.trim();
    this.str_editDeptID = departments.department_id;

    this.appInitializeForm(this.str_editDeptName, this.str_editDeptID);

    this.bln_editDept = false;
    this.bln_editMode = true;

    const temp = this.obj_GetDepartments.result.find(k => k.department_id === this.str_editDeptID);

    if (temp.locked.data[0] === 1)
    {
      swal({
        title: "This Department Is Being Edited From Another Terminal",
        text: "",
        type: "warning",
        allowOutsideClick: false,
      });
      this.sessionStorage.store('EditMode', false);
      this.frmEditDept.reset();
      this.str_editDeptName = "";
      this.bln_disabledBtn = false;
      this.bln_editMode = false;
      this.bln_rgtEditDept = true;
      this.bln_editDept = true;
    }
    else
    {
      this.dataService.setLocked(this.sessionStorage.retrieve("userId"), "tbl_department", "department_id",
      this.str_editDeptID, "locked", "1").then(res => {
      }).catch(err => {
        console.log(err)
     });
      this.sessionStorage.store('EditMode', true);
      this.bln_editDept = false;

      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 2000,
      });
    }
  }


}
@Component({
  selector: 'app-snackbar',
  template: `<p style="text-align:center">Edit Mode Enabled</p>`,
  styles: [`.example-pizza-party { color: hotpink; }`],
})
export class SnackBarComponent { }
