import { Routes } from '@angular/router';
import { AddBalanceComponent } from './add-balance/add-balance.component';
import { ViewBalanceComponent } from './view-balance/view-balance.component';
import { EditBalanceComponent } from './edit-balance/edit-balance.component';

export const balanceRoutes: Routes = [
    {
        path: '',
        children: [{
            path: 'add-balance',
            component: AddBalanceComponent
        },
        {
            path: 'edit-balance',
            component: EditBalanceComponent
        },
        {
            path: 'view-balance',
            component: ViewBalanceComponent
        }]
    }
];
