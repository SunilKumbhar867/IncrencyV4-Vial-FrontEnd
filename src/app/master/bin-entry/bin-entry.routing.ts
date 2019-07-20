import { Routes } from '@angular/router';
import { AddBinEntryComponent } from './add-bin-entry/add-bin-entry.component';
import { EditBinEntryComponent } from './edit-bin-entry/edit-bin-entry.component';
import { ReleaseBinEntryComponent } from './release-bin-entry/release-bin-entry.component';

export const binEntryRoutes: Routes = [
    {
        path: '',
        children: [{
            path: 'add-bin-entry',
            component: AddBinEntryComponent
        },
        {
            path: 'edit-bin-entry',
            component: EditBinEntryComponent
        },
        {
            path: 'release-bin-entry',
            component: ReleaseBinEntryComponent
        }]
    }
];
