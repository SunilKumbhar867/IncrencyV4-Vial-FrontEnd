import { Routes } from '@angular/router';
import { AddCapsuleComponent } from './add-capsule/add-capsule.component';
import { ManageCapsuleComponent } from './manage-capsule/manage-capsule.component';
import { EditCapsuleComponent } from './edit-capsule/edit-capsule.component';

export const capsuleRoutes: Routes = [
    {
        path: '',
        children: [{
            path: 'add-capsule',
            component: AddCapsuleComponent
        },
        {
            path: 'manage-capsule',
            component: ManageCapsuleComponent
            }, {
                path: 'edit-capsule',
            component: EditCapsuleComponent
            }]
    }
];
