import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './404/not-found.component';
import { LockComponent } from './lock/lock.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationRoutes } from './authentication.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { NgxSelectModule } from 'ngx-select-ex';
import { MatDialogModule, MatFormFieldModule, MatButtonModule, MatInputModule } from '@angular/material';
import { LoginLdapComponent } from './login-ldap/login-ldap.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthenticationRoutes),
    ReactiveFormsModule,
    FormsModule,
    NgxLoadingModule.forRoot({}),
    NgxSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonModule
  ],
  declarations: [
    NotFoundComponent,
    LoginComponent,
    LockComponent,
    LoginLdapComponent,
  ]
})

export class AuthenticationModule {}
