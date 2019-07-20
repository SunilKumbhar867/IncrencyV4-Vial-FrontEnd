import { Routes } from '@angular/router';
import { AddmachineComponent } from './addmachine/addmachine.component';
import { EditMachineComponent } from './edit-machine/edit-machine.component';
import { ViewMachineComponent } from './view-machine/view-machine.component';


export const machineRoutes: Routes = [
    {
        path: '',
        children: [{
            path: 'add-machine',
            component: AddmachineComponent
        },
        {
            path: 'edit-machine',
            component: EditMachineComponent
        },
        {
            path: 'view-machine',
            component: ViewMachineComponent
        }]
    }
];
