import { Routes } from '@angular/router';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ManageUserEditComponent } from './manage-user-edit/manage-user-edit.component';
import { AddUserLdapComponent } from './add-user-ldap/add-user-ldap.component';

export const userRoutes: Routes = [
    {
        path: '',
        children: [{
            path: 'add-user',
            component: AddUserComponent
        },
        {
            path: 'manage-user',
            component: ManageUserComponent
        },
        {
            path: 'manage-user-edit',
            component: ManageUserEditComponent
        },
        {
          path: 'add-user-ldap',
          component: AddUserLdapComponent
      }]
    }
];
