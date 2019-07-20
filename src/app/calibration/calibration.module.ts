import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { calibrationRoutes } from './calibration.routing';
import { RouterModule } from '@angular/router';
import { RecalibrationComponent } from './recalibration/recalibration.component';
import { PrecalibrationComponent } from './precalibration/precalibration.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RecalibrationComponent, PrecalibrationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(calibrationRoutes),
    NgxSelectModule,
    NgxLoadingModule.forRoot({}),
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class CalibrationModule { }
