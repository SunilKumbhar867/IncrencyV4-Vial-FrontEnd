import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { balanceRoutes } from './balance.routing';
import { AddBalanceComponent } from './add-balance/add-balance.component';
import { EditBalanceComponent, SnackBarComponent } from './edit-balance/edit-balance.component';
import { ViewBalanceComponent } from './view-balance/view-balance.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule, MatCardModule, MatIconModule, MatToolbarModule, MatInputModule, MatSnackBarModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule } from '@angular/material';
import { NgxLoadingModule } from 'ngx-loading';
import { NgxSelectModule } from 'ngx-select-ex';
import { DataTablesModule } from 'angular-datatables';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

@NgModule({
  declarations: [AddBalanceComponent, EditBalanceComponent, ViewBalanceComponent,SnackBarComponent],
  entryComponents: [SnackBarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(balanceRoutes),
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
    MatSnackBarModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    ScrollToModule.forRoot()
  ]
})
export class BalanceModule { }
