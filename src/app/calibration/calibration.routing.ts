import { Routes } from '@angular/router';
import { RecalibrationComponent } from './recalibration/recalibration.component';
import { PrecalibrationComponent } from './precalibration/precalibration.component';

export const calibrationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'precalibration',
        component: PrecalibrationComponent
      },
      {
        path: 'recalibration',
        component: RecalibrationComponent
      }]
  }
];
