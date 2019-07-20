import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetAllParameterComponent } from './set-all-parameter/set-all-parameter.component';
import { RouterModule } from '@angular/router';
import { masterRoutes } from './master.routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule, MatCardModule, MatIconModule, MatToolbarModule } from '@angular/material';
import { NgxLoadingModule } from 'ngx-loading';
import { DTMediaComponent } from './dtmedia/dtmedia.component';

import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [SetAllParameterComponent, DTMediaComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(masterRoutes),
    ReactiveFormsModule, FormsModule,
    MatDialogModule, MatCardModule, MatIconModule, MatToolbarModule,DataTablesModule,
    NgxLoadingModule.forRoot({})
  ]
})
export class MasterModule { }
