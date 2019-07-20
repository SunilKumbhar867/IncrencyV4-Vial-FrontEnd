import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AddOtherEqpComponent } from "./add-other-eqp/add-other-eqp.component";
import {
  EditOtherEqpComponent,
  SnackBarComponent
} from "./edit-other-eqp/edit-other-eqp.component";
import { ViewOtherEqpComponent } from "./view-other-eqp/view-other-eqp.component";
import { RouterModule } from "@angular/router";
import { NgxSelectModule } from "ngx-select-ex";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { equipmentOtherRoutes } from "./equipment-other.routing";
import {
  MatDialogModule,
  MatCardModule,
  MatIconModule,
  MatToolbarModule,
  MatTabsModule,
  MatSnackBarModule,
  MatInputModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatNativeDateModule
} from "@angular/material";
import { NgxLoadingModule } from "ngx-loading";
import { DataTablesModule } from "angular-datatables";

@NgModule({
  declarations: [
    AddOtherEqpComponent,
    EditOtherEqpComponent,
    ViewOtherEqpComponent,
    SnackBarComponent
  ],
  entryComponents: [SnackBarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(equipmentOtherRoutes),
    NgxSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatCardModule,
    MatTabsModule,
    NgxLoadingModule,
    DataTablesModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule
  ]
})
export class EquipmentOtherModule {}
