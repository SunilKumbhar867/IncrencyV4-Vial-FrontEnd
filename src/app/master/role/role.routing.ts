import { Routes } from '@angular/router';
import { AddRoleComponent } from './add-role/add-role.component';
import { EditRoleComponent } from './edit-role/edit-role.component';

export const roleRoutes: Routes = [
    {
        path: '',
        children: [{
            path: 'add-role',
            component: AddRoleComponent
        },
        {
            path: 'edit-role',
            component: EditRoleComponent
        }]
    }
];
