import { Routes } from '@angular/router';
import { RptBalanceComponent } from './rpt-balance/rpt-balance.component';
import { RptVernierComponent } from './rpt-vernier/rpt-vernier.component';

export const rptCalibratioinRoutes: Routes = [
    {
        path: '',
        children: [{
            path: 'balance',
            component: RptBalanceComponent
        },
        {
            path: 'vernier',
            component: RptVernierComponent
        }]
    }
];
