import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './add-user/add-user.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { RouterModule } from '@angular/router';
import { userRoutes } from './user.routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule, MatCardModule, MatIconModule, MatToolbarModule, MatInputModule,MatSnackBarModule } from '@angular/material';
import { NgxLoadingModule } from 'ngx-loading';
import { NgxSelectModule } from 'ngx-select-ex';
import { DataTablesModule } from 'angular-datatables';
import { ManageUserEditComponent, SnackBarEditComponent, SnackBarViewComponent } from './manage-user-edit/manage-user-edit.component';
import { AddUserLdapComponent } from './add-user-ldap/add-user-ldap.component';

@NgModule({
  entryComponents: [SnackBarEditComponent, SnackBarViewComponent],
  declarations: [AddUserComponent, ManageUserComponent, ManageUserEditComponent,SnackBarEditComponent, SnackBarViewComponent, AddUserLdapComponent, ],
  imports: [
    CommonModule,
    RouterModule.forChild(userRoutes),
    ReactiveFormsModule, FormsModule,
    MatDialogModule, MatCardModule, MatIconModule, MatToolbarModule,
    NgxLoadingModule.forRoot({}),
    NgxSelectModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule
  ]
})
export class UserModule { }
