import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { auditTrailRoutes } from './audittrail.routing';
import { AdminChangePasswordComponent } from './admin-change-password/admin-change-password.component';
import { AuditSetAllParameterComponent } from './audit-set-all-parameter/audit-set-all-parameter.component';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import { UnauthorizedUserComponent } from './unauthorized-user/unauthorized-user.component';
import { RoleComponent } from './role/role.component';
import { UserComponent } from './user/user.component';
import { BalanceComponent } from './balance/balance.component';
import { VernierComponent } from './vernier/vernier.component';
import { BinEntryComponent } from './bin-entry/bin-entry.component';
import { CalibrationComponent } from './calibration/calibration.component';
import { AuditCubicleSettingComponent } from './audit-cubicle-setting/audit-cubicle-setting.component';
import { AuditBinSettingComponent } from './audit-bin-setting/audit-bin-setting.component';
import { ProductComponent } from './product/product.component';
import { AuditAlertSettingComponent } from './audit-alert-setting/audit-alert-setting.component';
import { AuditRecalibrationComponent } from './audit-recalibration/audit-recalibration.component';
import { AuditOtherEquipmentComponent } from './audit-other-equipment/audit-other-equipment.component';
import { CalibrationboxComponent } from './calibrationbox/calibrationbox.component';
import { NgxLoadingModule } from 'ngx-loading';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatCardModule, MatIconModule, MatToolbarModule, MatInputModule, MatSnackBarModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule } from '@angular/material';
import { NgxSelectModule } from 'ngx-select-ex';
import { DepartmentComponent } from './department/department.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MediaComponent } from './media/media.component';
import { StageComponent } from './stage/stage.component';
import { AuditAdminChangeProfileComponent } from './audit-admin-change-profile/audit-admin-change-profile.component';
import { AreaSettingComponent } from './area-setting/area-setting.component';
import { MachineComponent } from './machine/machine.component';
import { AuditPwdPolicyComponent } from './audit-pwd-policy/audit-pwd-policy.component';

@NgModule({
  declarations: [
    AdminChangePasswordComponent,
    AuditSetAllParameterComponent,
    ActivityLogComponent,
    UnauthorizedUserComponent,
    RoleComponent,
    UserComponent,
    BalanceComponent,
    VernierComponent,
    BinEntryComponent,
    CalibrationComponent,
    AuditCubicleSettingComponent,
    AuditBinSettingComponent,
    ProductComponent,
    AuditAlertSettingComponent,
    AuditRecalibrationComponent,
    AuditOtherEquipmentComponent,
    CalibrationboxComponent,
    DepartmentComponent,
    AuditAdminChangeProfileComponent,
    MediaComponent,
    StageComponent,
    AreaSettingComponent,
    MachineComponent,
    AuditPwdPolicyComponent],
  imports: [
    PdfViewerModule,
    CommonModule,
    RouterModule.forChild(auditTrailRoutes),
    NgxLoadingModule.forRoot({}),
    ReactiveFormsModule,
    MatDialogModule, MatCardModule, MatIconModule, MatToolbarModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    NgxSelectModule,
    ScrollToModule.forRoot()
  ]
})
export class AudittrailModule { }
