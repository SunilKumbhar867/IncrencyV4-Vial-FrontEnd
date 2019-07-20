import { Routes } from "@angular/router";
import { TabletComponent } from "./tablet/tablet.component";
import { CapsuleComponent } from "./capsule/capsule.component";
import { BatchSummaryComponent } from "./batch-summary/batch-summary.component";
import { ProductSummaryComponent } from "./product-summary/product-summary.component";
import { InstrumentUsageComponent } from "./instrument-usage/instrument-usage.component";
import { UserStatusComponent } from './user-status/user-status.component';
import { UserRolerightComponent } from './user-roleright/user-roleright.component';

export const reportRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "tablet",
        component: TabletComponent
      },
      {
        path: "capsule",
        component: CapsuleComponent
      },
      {
        path: "batch-summary",
        component: BatchSummaryComponent
      },
      {
        path: "product-summary",
        component: ProductSummaryComponent
      },
      {
        path: "instrument-usage",
        component: InstrumentUsageComponent
      },
      {
        path: "user-status",
        component: UserStatusComponent
      },
      {
        path: "role-log",
        component: UserRolerightComponent
      },
      {
        path: "rpt-calibration",
        loadChildren:
          "./rpt-calibration/rpt-calibration.module#RptCalibrationModule"
      },
      {
        path: "bin-weighing",
        loadChildren: "./bin-weighing/bin-weighing.module#BinWeighingModule"
      }
    ]
  }
];
