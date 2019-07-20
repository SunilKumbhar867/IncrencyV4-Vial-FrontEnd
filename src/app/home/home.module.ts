import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { homeRoutes } from './home.routing';
import { DataTablesModule } from 'angular-datatables';
import { MatDialogModule, MatCardModule, MatIconModule, MatToolbarModule } from '@angular/material';
@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(homeRoutes),
    DataTablesModule,
    MatDialogModule, MatCardModule, MatIconModule, MatToolbarModule
  ]
})
export class HomeModule { }
