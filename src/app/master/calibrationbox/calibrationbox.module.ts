import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddBoxComponent } from './add-box/add-box.component';
import { EditBoxComponent, SnackBarComponent } from './edit-box/edit-box.component';
import { RouterModule } from '@angular/router';
import { calibrationBoxRoutes } from './calibrationbox.routing';
import { NgxSelectModule } from 'ngx-select-ex';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule, MatDialogModule, MatIconModule, MatSnackBarModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule } from '@angular/material';
import { NgxLoadingModule } from 'ngx-loading';
import { DataTablesModule } from 'angular-datatables';
import { Viewbox1Component } from './viewbox1/viewbox1.component';
@NgModule({
  declarations: [AddBoxComponent, EditBoxComponent, Viewbox1Component,SnackBarComponent],
  entryComponents: [SnackBarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(calibrationBoxRoutes),
    NgxSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    NgxLoadingModule,
    DataTablesModule
  ]
})
export class CalibrationboxModule { }
