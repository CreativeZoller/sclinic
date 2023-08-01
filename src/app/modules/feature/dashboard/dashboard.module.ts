import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";
import { DashboardComponent } from "../dashboard/components/dashboard.component";


@NgModule({
    declarations: [
        DashboardComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
    ],
    exports: [
        DashboardComponent,
    ],
})
export class DashboardModule { }
