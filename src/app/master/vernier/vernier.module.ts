import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddVernierComponent } from './add-vernier/add-vernier.component';
import { EditVernierComponent, SnackBarComponent } from './edit-vernier/edit-vernier.component';
import { ViewVernierComponent } from './view-vernier/view-vernier.component';
import { RouterModule } from '@angular/router';
import { vernierRoutes } from './vernier.routing';
import { NgxLoadingModule } from 'ngx-loading';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxSelectModule } from 'ngx-select-ex';
import { DataTablesModule } from 'angular-datatables';
import { MatInputModule, MatDialogModule, MatIconModule, MatSnackBarModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule } from '@angular/material';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { ViewVernierNocalibComponent } from './view-vernier-nocalib/view-vernier-nocalib.component';
import { AddVernierNocalibComponent } from './add-vernier-nocalib/add-vernier-nocalib.component';
import { EditVernierNocalibComponent, SnackBarComponentNoCalib } from './edit-vernier-nocalib/edit-vernier-nocalib.component';

@NgModule({
  declarations: [AddVernierComponent, EditVernierComponent, ViewVernierComponent,SnackBarComponent, ViewVernierNocalibComponent, AddVernierNocalibComponent, EditVernierNocalibComponent,SnackBarComponentNoCalib],
  entryComponents: [SnackBarComponent,SnackBarComponentNoCalib],
  imports: [
    CommonModule,
    RouterModule.forChild(vernierRoutes),
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({}),
    NgxSelectModule,
    DataTablesModule,
    FormsModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    ScrollToModule.forRoot()
  ]
})
export class VernierModule { }
