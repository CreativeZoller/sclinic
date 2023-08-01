import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CCModule } from './call-center.module';
import { CC_APPOINTMENTS_ROUTE } from 'src/app/app.config';
import { CcAppointmentsComponent } from './appointments/appointments.component';
import { PatientsInitPageResolver } from './appointments/resolvers/appointments-init-page.resolver';

const routes: Routes = [
    {
        path: CC_APPOINTMENTS_ROUTE,
        component: CcAppointmentsComponent,
        resolve: {
            init: PatientsInitPageResolver
        },
    },
];

@NgModule({
    imports: [
        CCModule,
        RouterModule.forChild(routes),
    ],
    exports: [
        CCModule,
        RouterModule,
    ],
})
export class CcRoutingModule { }