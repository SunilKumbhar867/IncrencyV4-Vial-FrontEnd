import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { vialRoutes } from './vial.routing';
import { AddVialComponent } from './add-vial/add-vial.component';
import { EditVialComponent } from './edit-vial/edit-vial.component';
import { ManageVialComponent } from './manage-vial/manage-vial.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddVialComponent,EditVialComponent,ManageVialComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(vialRoutes),
    ReactiveFormsModule,
    FormsModule

  ]
})
export class VialModule { }
