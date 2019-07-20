import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabletComponent } from './tablet/tablet.component';
import { CapsuleComponent } from './capsule/capsule.component';
import { BatchSummaryComponent } from './batch-summary/batch-summary.component';
import { ProductSummaryComponent } from './product-summary/product-summary.component';
import { RouterModule } from '@angular/router';
import { reportRoutes } from './report.routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule, MatCardModule, MatIconModule, MatToolbarModule, MatInputModule, MatSnackBarModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule } from '@angular/material';
import { NgxLoadingModule } from 'ngx-loading';
import { NgxSelectModule } from 'ngx-select-ex';
import { DataTablesModule } from 'angular-datatables';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { HttpClientModule } from '@angular/common/http';
import { InstrumentUsageComponent } from './instrument-usage/instrument-usage.component';
import { UserStatusComponent } from './user-status/user-status.component';
import { UserRolerightComponent } from './user-roleright/user-roleright.component';
import { ModalComponent } from '../shared/modal/modal.component';
import { MessageService } from '../services/PrintService/print.service';

@NgModule({
  declarations: [
    TabletComponent,
    CapsuleComponent,
    BatchSummaryComponent,
    ProductSummaryComponent,
    InstrumentUsageComponent,
    UserStatusComponent,
    UserRolerightComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(reportRoutes),
    ReactiveFormsModule, FormsModule,
    MatDialogModule, MatCardModule, MatIconModule, MatToolbarModule, DataTablesModule, NgxSelectModule,
    NgxLoadingModule.forRoot({}),
    MatSnackBarModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    HttpClientModule,
    ScrollToModule.forRoot(),
  ],
   schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ReportModule { }
