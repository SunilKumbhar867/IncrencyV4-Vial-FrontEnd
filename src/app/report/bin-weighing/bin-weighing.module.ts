import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { binWeighingRoutes } from './bin-weighing.routing';
import { IndividualBinComponent } from './individual-bin/individual-bin.component';
import { BinBatchSummaryComponent } from './bin-batch-summary/bin-batch-summary.component';

@NgModule({
  declarations: [IndividualBinComponent, BinBatchSummaryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(binWeighingRoutes)
  ]
})
export class BinWeighingModule { }
