import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MatInputModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
const routes: Routes = [
  {path: '', component: ChangePasswordComponent}
];

@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatInputModule,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({}),
  ]
})

export class ChangePasswordModule { }
