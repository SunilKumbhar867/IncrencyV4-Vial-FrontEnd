import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tabletRoutes } from './tablet.routing';
import { RouterModule } from '@angular/router';
import { ManageTabletComponent } from './manage-tablet/manage-tablet.component';
import { AddTabletComponent } from './add-tablet/add-tablet.component';
import { NgxLoadingModule } from 'ngx-loading';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MatDialogModule, MatSnackBarModule } from '@angular/material';
import { NgxSelectModule } from 'ngx-select-ex';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EditTabletComponent, SnackBarEditComponent, SnackBarViewComponent } from './edit-tablet/edit-tablet.component';
import { AddGrannualComponent } from './add-tablet/add-grannual/add-grannual.component';

@NgModule({
  entryComponents: [SnackBarEditComponent, SnackBarViewComponent],
  declarations: [ManageTabletComponent, AddTabletComponent, EditTabletComponent, SnackBarEditComponent, SnackBarViewComponent, AddGrannualComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(tabletRoutes),
    NgxLoadingModule.forRoot({}),
    DataTablesModule,
    NgbModule,
    MatCardModule,
    MatDividerModule,
    NgxDatatableModule,
    Ng2SmartTableModule,
    MatDialogModule,
    NgxSelectModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    MatSnackBarModule
  ]
})
export class TabletModule {}
