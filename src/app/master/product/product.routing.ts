import { Routes } from '@angular/router';

export const productRoutes: Routes = [
  {
    path: '',
    children: [
    {
      path: 'tablet',
      loadChildren: './tablet/tablet.module#TabletModule'
    },
    {
      path: 'capsule',
      loadChildren: './capsule/capsule.module#CapsuleModule'
    },
    {
      path: 'vial',
      loadChildren: './vial/vial.module#VialModule'
    }
  ]
  }
];
