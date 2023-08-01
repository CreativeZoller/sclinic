import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RECEPTION_ROUTE } from "../../../app.config";
import { MedicalManagementModule } from "./medical-management.module";
import { ReceptionMainComponent } from "./reception/components/main/reception-main.component";
import { ReceptionInitPageResolver } from "./reception/resolvers/reception-init-page.resolver";


const routes: Routes = [
    {
        path: RECEPTION_ROUTE,
        component: ReceptionMainComponent,
        resolve: {
            init: ReceptionInitPageResolver,
        },
    },
];

@NgModule({
    imports: [
        MedicalManagementModule,
        RouterModule.forChild(routes),
    ],
    exports: [
        MedicalManagementModule,
        RouterModule,
    ],
})
export class MedicalManagementRoutingModule { }
