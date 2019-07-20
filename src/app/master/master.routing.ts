import { Routes } from "@angular/router";
import { SetAllParameterComponent } from "./set-all-parameter/set-all-parameter.component";
import { DTMediaComponent } from "./dtmedia/dtmedia.component";


export const masterRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "set-all-parameter",
        component: SetAllParameterComponent
      },
      {
        path: "media",
        component: DTMediaComponent
      },
      {
        path: "role",
        loadChildren: "./role/role.module#RoleModule"
      },
      {
        path: "user",
        loadChildren: "./user/user.module#UserModule"
      },
      {
        path: "department",
        loadChildren: "./department/department.module#DepartmentModule"
      },
      {
        path: "calibrationbox",
        loadChildren:
          "./calibrationbox/calibrationbox.module#CalibrationboxModule"
      },
      {
        path: "balance",
        loadChildren: "./balance/balance.module#BalanceModule"
      },
      {
        path: "vernier",
        loadChildren: "./vernier/vernier.module#VernierModule"
      },
      {
        path: "bin-entry",
        loadChildren: "./bin-entry/bin-entry.module#BinEntryModule"
      },
      {
        path: "product",
        loadChildren: "./product/product.module#ProductModule"
      },
      {
        path: "otherequipment",
        loadChildren:
          "./equipment-other/equipment-other.module#EquipmentOtherModule"
      },
      {
        path: "machine",
        loadChildren: "./machine/machine.module#MachineModule"
      }
    ]
  }
];
