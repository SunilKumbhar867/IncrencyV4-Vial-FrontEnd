import { Routes } from '@angular/router';
import { AddVernierComponent } from './add-vernier/add-vernier.component';
import { EditVernierComponent } from './edit-vernier/edit-vernier.component';
import { ViewVernierComponent } from './view-vernier/view-vernier.component';
import { ViewVernierNocalibComponent } from './view-vernier-nocalib/view-vernier-nocalib.component';
import { AddVernierNocalibComponent } from './add-vernier-nocalib/add-vernier-nocalib.component';
import { EditVernierNocalibComponent } from './edit-vernier-nocalib/edit-vernier-nocalib.component';

export const vernierRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'add-vernier',
      component: AddVernierComponent
    },
    {
      path: 'add-vernier-nocalib',
      component: AddVernierNocalibComponent
    },
    {
      path: 'edit-vernier',
      component: EditVernierComponent
    },
    {
      path: 'edit-vernier-nocalib',
      component: EditVernierNocalibComponent
    },
    {
      path: 'view-vernier',
      component: ViewVernierComponent
    },
    {
      path: 'view-vernier-nocalib',
      component: ViewVernierNocalibComponent
    }]
  }
];
