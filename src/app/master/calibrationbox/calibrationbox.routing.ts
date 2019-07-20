import {  Routes } from '@angular/router';
import { AddBoxComponent } from './add-box/add-box.component';
import { EditBoxComponent } from './edit-box/edit-box.component';
import { Viewbox1Component } from './viewbox1/viewbox1.component';

export const calibrationBoxRoutes : Routes=[
    {
        path:'',
        children:[
            {
                path: 'add-box',
                component: AddBoxComponent
            },
            {
                path: 'edit-box',
                component: EditBoxComponent
            },
            {
                path: 'viewbox',
                component: Viewbox1Component
            }
        ]

    }
]
