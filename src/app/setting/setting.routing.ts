import { Routes } from "@angular/router";
import { CubicleSettingComponent } from "./cubicle-setting/cubicle-setting.component";
import { BinSettingComponent } from "./bin-setting/bin-setting.component";
import { AreaSettingComponent } from './area-setting/area-setting.component';
import { CommunicationComponent } from "./communication/communication.component";
import { SystemSettingComponent } from "./system-setting/system-setting.component";

export const settingRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "cubicle-setting",
        component: CubicleSettingComponent
      },
      {
        path: "bin-setting",
        component: BinSettingComponent
      },
      {
        path: "area-setting",
        component: AreaSettingComponent
      },
      {
        path: "communication",
        component: CommunicationComponent
      },
      {
        path: "system-setting",
        component: SystemSettingComponent
      }
    ]
  }
];
