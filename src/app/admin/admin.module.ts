import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordpolicyComponent } from './passwordpolicy/passwordpolicy.component';
import { RouterModule } from '@angular/router';
import { adminRoutes } from './admin.routing';
import { NgxLoadingModule } from 'ngx-loading';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatCardModule, MatIconModule, MatToolbarModule } from '@angular/material';

@NgModule({
  declarations: [PasswordpolicyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(adminRoutes),
    NgxLoadingModule.forRoot({}),
    ReactiveFormsModule,
    MatDialogModule, MatCardModule, MatIconModule, MatToolbarModule,
  ]
})
export class AdminModule { }
