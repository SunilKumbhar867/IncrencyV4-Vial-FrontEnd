import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRoleComponent } from './add-role/add-role.component';
import { EditRoleComponent, SnackBarComponent } from './edit-role/edit-role.component';
import { RouterModule } from '@angular/router';
import { roleRoutes } from './role.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { NgxSelectModule } from 'ngx-select-ex';
import { MatSnackBarModule, MatDialogModule } from '@angular/material';

@NgModule({
    declarations: [AddRoleComponent, EditRoleComponent,SnackBarComponent],
  entryComponents: [SnackBarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(roleRoutes),
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({}),
    NgxSelectModule,
    MatSnackBarModule,
    MatDialogModule,
  ]
})
export class RoleModule { }
