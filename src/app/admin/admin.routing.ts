import { Routes } from '@angular/router';
import { PasswordpolicyComponent } from './passwordpolicy/passwordpolicy.component';

export const adminRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'pwd-policy',
      component: PasswordpolicyComponent
    }]
  }
];
