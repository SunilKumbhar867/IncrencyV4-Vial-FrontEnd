import { Routes } from "@angular/router";
import { AdminChangePasswordComponent } from "./admin-change-password/admin-change-password.component";
import { AuditSetAllParameterComponent } from "./audit-set-all-parameter/audit-set-all-parameter.component";
import { ActivityLogComponent } from "./activity-log/activity-log.component";
import { UnauthorizedUserComponent } from "./unauthorized-user/unauthorized-user.component";
import { RoleComponent } from "./role/role.component";
import { UserComponent } from "./user/user.component";
import { BalanceComponent } from "./balance/balance.component";
import { VernierComponent } from "./vernier/vernier.component";
import { BinEntryComponent } from "./bin-entry/bin-entry.component";
import { CalibrationComponent } from "./calibration/calibration.component";
import { AuditCubicleSettingComponent } from "./audit-cubicle-setting/audit-cubicle-setting.component";
import { AuditBinSettingComponent } from "./audit-bin-setting/audit-bin-setting.component";
import { AuditAlertSettingComponent } from "./audit-alert-setting/audit-alert-setting.component";
import { ProductComponent } from "./product/product.component";
import { AuditRecalibrationComponent } from "./audit-recalibration/audit-recalibration.component";
import { AuditOtherEquipmentComponent } from "./audit-other-equipment/audit-other-equipment.component";
import { CalibrationboxComponent } from "./calibrationbox/calibrationbox.component";
import { DepartmentComponent } from "./department/department.component";
import { AuditAdminChangeProfileComponent } from "./audit-admin-change-profile/audit-admin-change-profile.component";
import { MediaComponent } from './media/media.component';
import { StageComponent } from './stage/stage.component';
import { AreaSettingComponent } from "./area-setting/area-setting.component";
import { MachineComponent } from "./machine/machine.component";
import { AuditPwdPolicyComponent } from "./audit-pwd-policy/audit-pwd-policy.component";

export const auditTrailRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "change-profile",
        component: AuditAdminChangeProfileComponent
      },
      {
        path: "change-password",
        component: AdminChangePasswordComponent
      },
      {
        path: "set-all-parameter",
        component: AuditSetAllParameterComponent
      },
      {
        path: "password-policy",
        component: AuditPwdPolicyComponent
      },
      {
        path: "activity-log",
        component: ActivityLogComponent
      },
      {
        path: "unauthorized-login",
        component: UnauthorizedUserComponent
      },
      {
        path: "role",
        component: RoleComponent
      },
      {
        path: "user",
        component: UserComponent
      },
      {
        path: "department",
        component: DepartmentComponent
      },
      {
        path: "calibrationbox",
        component: CalibrationboxComponent
      },
      {
        path: "balance",
        component: BalanceComponent
      },
      {
        path: "vernier",
        component: VernierComponent
      },
      {
        path: "bin-entry",
        component: BinEntryComponent
      },
      {
        path: "product",
        component: ProductComponent
      },
      {
        path: "cubicle-setting",
        component: AuditCubicleSettingComponent
      },
      {
        path: "bin-setting",
        component: AuditBinSettingComponent
      },
      {
        path: "alert-setting",
        component: AuditAlertSettingComponent
      },
      {
        path: "calibration",
        component: CalibrationComponent
      },
      {
        path: "recalibration",
        component: AuditRecalibrationComponent
      },
      {
        path: "audit-other-equipment",
        component: AuditOtherEquipmentComponent
      },
      {
        path: "media",
        component: MediaComponent
      },
      {
        path: "stage",
        component: StageComponent
      },
      {
        path: "area-setting",
        component: AreaSettingComponent
      },

      {
        path: "machine",
        component: MachineComponent
      },
    ]
  }
];
