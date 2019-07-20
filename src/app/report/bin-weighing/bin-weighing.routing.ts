import { Routes } from '@angular/router';
import { IndividualBinComponent } from './individual-bin/individual-bin.component';
import { BinBatchSummaryComponent } from './bin-batch-summary/bin-batch-summary.component';

export const binWeighingRoutes: Routes = [
    {
        path: '',
        children: [{
            path: 'individual-bin',
            component: IndividualBinComponent
        },
        {
            path: 'bin-summary',
            component: BinBatchSummaryComponent
        }]
    }
];
