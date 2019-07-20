import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CubicleSettingComponent } from './cubicle-setting/cubicle-setting.component';
import { BinSettingComponent } from './bin-setting/bin-setting.component';
import { RouterModule } from '@angular/router';
import { settingRoutes } from './setting.routing';
import { NgxSelectModule } from 'ngx-select-ex';
import { CommunicationComponent } from './communication/communication.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule, MatDialogModule, MatIconModule, MatSnackBarModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule } from '@angular/material';
import { NgxLoadingModule } from 'ngx-loading';
import { DataTablesModule } from 'angular-datatables';
import { PortSettingComponent } from './area-setting/port-setting/port-setting.component';
import { CubicleFieldsComponent, SnackBarComponent } from './cubicle-setting/cubicle-fields/cubicle-fields.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AreaSettingComponent } from './area-setting/area-setting.component';
import { AlertSettingComponent } from './cubicle-setting/alert-setting/alert-setting.component';
import { ProductParametersComponent } from './cubicle-setting/cubicle-fields/product-parameters/product-parameters.component';
import { SystemSettingComponent } from './system-setting/system-setting.component';

@NgModule({
  declarations: [CubicleSettingComponent,
     BinSettingComponent, AreaSettingComponent, PortSettingComponent,
    CubicleFieldsComponent, CommunicationComponent, SnackBarComponent,
    AlertSettingComponent, ProductParametersComponent, SystemSettingComponent],

    entryComponents: [PortSettingComponent,CubicleFieldsComponent,
      SnackBarComponent, AlertSettingComponent, ProductParametersComponent],

    imports: [
    CommonModule,
    RouterModule.forChild(settingRoutes),
    NgxSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    NgxLoadingModule,
    DataTablesModule,
    NgbModule
  ]
})

export class SettingModule { }
