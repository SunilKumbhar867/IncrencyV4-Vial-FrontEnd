import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddBinEntryComponent } from './add-bin-entry/add-bin-entry.component';
import { EditBinEntryComponent } from './edit-bin-entry/edit-bin-entry.component';
import { ReleaseBinEntryComponent } from './release-bin-entry/release-bin-entry.component';
import { RouterModule } from '@angular/router';
import { binEntryRoutes } from './bin-entry.routing';

@NgModule({
  declarations: [AddBinEntryComponent, EditBinEntryComponent, ReleaseBinEntryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(binEntryRoutes)
  ]
})
export class BinEntryModule { }
