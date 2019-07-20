import { Routes } from '@angular/router';
import { AddDepartmentComponent } from './add-department/add-department.component';
import { EditDepartmentComponent } from './edit-department/edit-department.component';

export const deptRoutes: Routes = [
    {
        path: '',
        children: [{
            path: 'add-dept',
            component: AddDepartmentComponent
        },
        {
            path: 'edit-dept',
            component: EditDepartmentComponent
        }]
    }
];
