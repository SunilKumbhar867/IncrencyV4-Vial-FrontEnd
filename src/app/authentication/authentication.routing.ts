import { Routes } from '@angular/router';

import { NotFoundComponent } from './404/not-found.component';
import { LockComponent } from './lock/lock.component';
import { LoginComponent } from './login/login.component';
import { LoginLdapComponent } from './login-ldap/login-ldap.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [{
      path: '404',
      component: NotFoundComponent
    }, {
      path: 'lock',
      component: LockComponent
    }, {
      path: 'login',
      component: LoginComponent
    }, {
      path: 'login-ldap',
      component: LoginLdapComponent
    }]
  }
];
