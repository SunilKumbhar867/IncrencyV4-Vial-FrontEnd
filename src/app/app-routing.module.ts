import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { AuthGuard } from "../app/auth.gaurd";
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { AdminChangeProfileComponent } from './admin-change-profile/admin-change-profile.component';


export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/authentication/login', pathMatch: 'full' },
      //{ path: '', redirectTo: '/authentication/login-ldap', pathMatch: 'full' },
      { path: 'home', loadChildren: './home/home.module#HomeModule', canActivate: [AuthGuard] },
      { path: 'admin', loadChildren: './admin/admin.module#AdminModule', canActivate: [AuthGuard] },
      { path: 'master', loadChildren: './master/master.module#MasterModule', canActivate: [AuthGuard] },
      { path: 'setting', loadChildren: './setting/setting.module#SettingModule', canActivate: [AuthGuard] },
      { path: 'calibration', loadChildren: './calibration/calibration.module#CalibrationModule', canActivate: [AuthGuard] },
      { path: 'audit-trail', loadChildren: './audittrail/audittrail.module#AudittrailModule', canActivate: [AuthGuard] },
      { path: 'report', loadChildren: './report/report.module#ReportModule', canActivate: [AuthGuard] },
      { path: 'view-profile', component: ViewProfileComponent, canActivate: [AuthGuard] },
      { path: 'admin-change-profile', component: AdminChangeProfileComponent, canActivate: [AuthGuard] }

    ]
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: './authentication/authentication.module#AuthenticationModule'
      },
      {
        path: 'changePassword',
        loadChildren: './change-password/change-password.module#ChangePasswordModule',
        canActivate: [AuthGuard]
      },
    ]
  },
  {
    path: '**',
    redirectTo: '404'
  }];
routes.push
@NgModule({
  imports: [RouterModule.forRoot(routes), NgbModule.forRoot()],
  exports: [RouterModule]
})
export class AppRoutingModule
{

}

