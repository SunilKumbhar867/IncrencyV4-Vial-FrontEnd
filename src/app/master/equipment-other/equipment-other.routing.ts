import { Routes } from '@angular/router';
import { AddOtherEqpComponent } from './add-other-eqp/add-other-eqp.component';
import { ViewOtherEqpComponent } from './view-other-eqp/view-other-eqp.component';
import { EditOtherEqpComponent } from './edit-other-eqp/edit-other-eqp.component';

export const equipmentOtherRoutes: Routes = [
    {
        path: '',
        children: [{
            path: 'add-othereqp',
            component: AddOtherEqpComponent
        },
        {
            path: 'edit-othereqp',
            component: EditOtherEqpComponent
        },
        {
            path: 'view-othereqp',
            component: ViewOtherEqpComponent
        }]
    }
];
