import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { capsuleRoutes } from './capsule.routing';
import { AddCapsuleComponent } from './add-capsule/add-capsule.component';
import { ManageCapsuleComponent } from './manage-capsule/manage-capsule.component';
import { NgxLoadingModule } from 'ngx-loading';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MatDialogModule, MatInputModule, MatIconModule, MatSnackBarModule } from '@angular/material';
import { NgxSelectModule } from 'ngx-select-ex';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EditCapsuleComponent, SnackBarEditComponent, SnackBarViewComponent } from './edit-capsule/edit-capsule.component';
@NgModule({
  entryComponents: [SnackBarEditComponent, SnackBarViewComponent],
  declarations: [AddCapsuleComponent, ManageCapsuleComponent, EditCapsuleComponent, SnackBarEditComponent, SnackBarViewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(capsuleRoutes),
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
    MatInputModule,
    MatIconModule,
    MatSnackBarModule
  ]
})
export class CapsuleModule { }
