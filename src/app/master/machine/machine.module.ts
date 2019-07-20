import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { machineRoutes } from './machine.routing';
import { AddmachineComponent } from './addmachine/addmachine.component';
import { EditMachineComponent } from './edit-machine/edit-machine.component';
import { ViewMachineComponent } from './view-machine/view-machine.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule, MatIconModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import { NgxLoadingModule } from 'ngx-loading';
import { DataTablesModule } from 'angular-datatables';
@NgModule({
  declarations: [AddmachineComponent,EditMachineComponent,ViewMachineComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(machineRoutes),
    NgxSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule, MatCardModule, MatIconModule,
    NgxLoadingModule,
    DataTablesModule
  ]
})
export class MachineModule { }
