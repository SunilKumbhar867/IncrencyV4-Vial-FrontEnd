import { Routes } from '@angular/router';
import { AddVialComponent } from './add-vial/add-vial.component';
import { EditVialComponent } from './edit-vial/edit-vial.component';
import { ManageVialComponent } from './manage-vial/manage-vial.component';
export const vialRoutes: Routes = [{
    path: '',
    children: [{
        path: 'add-vial',
        component: AddVialComponent
    },
    {
        path: 'edit-vial',
        component: EditVialComponent
    },
    {
        path: 'manage-vial',
        component: ManageVialComponent
    }] 
}];