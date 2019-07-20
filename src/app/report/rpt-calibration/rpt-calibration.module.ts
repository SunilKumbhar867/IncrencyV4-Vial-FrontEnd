import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { rptCalibratioinRoutes } from './rpt-calibration.routing';
import { RptBalanceComponent } from './rpt-balance/rpt-balance.component';
import { RptVernierComponent } from './rpt-vernier/rpt-vernier.component';
import { NgxLoadingModule } from 'ngx-loading';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule, MatCardModule, MatIconModule, MatToolbarModule,
  MatInputModule, MatSnackBarModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule
} from '@angular/material';
import { NgxSelectModule } from 'ngx-select-ex';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
//import { RptDailyNoremarkComponent } from './rpt-balance/rpt-daily-noremark/rpt-daily-noremark.component';

@NgModule({
  declarations: [RptBalanceComponent, RptVernierComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(rptCalibratioinRoutes),
    NgxLoadingModule.forRoot({}),
    ReactiveFormsModule,
    MatDialogModule, MatCardModule, MatIconModule, MatToolbarModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    NgxSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ScrollToModule.forRoot()
  ]
})
export class RptCalibrationModule { }
