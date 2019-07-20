import { Routes } from '@angular/router';
import { AddTabletComponent } from './add-tablet/add-tablet.component';
import { ManageTabletComponent } from './manage-tablet/manage-tablet.component';
import { EditTabletComponent } from './edit-tablet/edit-tablet.component';

export const tabletRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'add-tablet',
      component: AddTabletComponent
    },
    {
      path: 'edit-tablet',
      component: EditTabletComponent
    },
    {
      path: 'manage-tablet',
      component: ManageTabletComponent
    }]
  }
];
