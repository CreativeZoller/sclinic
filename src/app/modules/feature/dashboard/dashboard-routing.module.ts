import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardModule } from "./dashboard.module";
import { DashboardComponent } from "./components/dashboard.component";


const routes: Routes = [
    {
        path: "",
        component: DashboardComponent,
    },
];

@NgModule({
    imports: [
        DashboardModule,
        RouterModule.forChild(routes),
    ],
    exports: [
        DashboardModule,
        RouterModule,
    ],
})
export class DashboardRoutingModule { }
