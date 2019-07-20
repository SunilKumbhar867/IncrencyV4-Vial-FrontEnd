import { NgModule,Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { deptRoutes } from './department.routing';
import { AddDepartmentComponent } from './add-department/add-department.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatDialogModule, MatCardModule, MatIconModule, MatToolbarModule, MatSnackBarModule } from '@angular/material';
import { NgxLoadingModule } from 'ngx-loading';
import { EditDepartmentComponent, SnackBarComponent } from './edit-department/edit-department.component';

@NgModule({
  declarations: [AddDepartmentComponent, EditDepartmentComponent, SnackBarComponent],
  entryComponents: [SnackBarComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DataTablesModule,
    MatDialogModule, MatCardModule, MatIconModule, MatToolbarModule,
    NgxLoadingModule.forRoot({}),
    RouterModule.forChild(deptRoutes),
    FormsModule,
    MatSnackBarModule
  ]
})
export class DepartmentModule { }
