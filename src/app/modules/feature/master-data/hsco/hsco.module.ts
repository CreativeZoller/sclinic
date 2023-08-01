import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../shared/shared.module";
import { OccupationalHealthFormComponent } from "./components/form/occupational-health-form.component";
import { GroupedExposureItemServiceFormComponent } from "./components/grouped-exposure-item-service/form/grouped-exposure-item-service-form.component";
import { GroupedExposureItemServiceListFieldComponent } from "./components/grouped-exposure-item-service/list-field/grouped-exposure-item-service-list-field.component";
import { GroupedExposureItemFormComponent } from "./components/grouped-exposure-item/form/grouped-exposure-item-form.component";
import { GroupedExposureItemListFieldComponent } from "./components/grouped-exposure-item/list-field/grouped-exposure-item-list-field.component";
import { GroupedExposureFormComponent } from "./components/grouped-exposure/form/grouped-exposure-form.component";
import { GroupedExposureListFieldComponent } from "./components/grouped-exposure/list-field/grouped-exposure-list-field.component";
import { HSCOListComponent } from "./components/list/hsco-list.component";
import { OccupationalHealthServiceFormComponent } from "./components/occupational-health-service/form/occupational-health-service-form.component";
import { OccupationalHealthServiceListFieldComponent } from "./components/occupational-health-service/list-field/occupational-health-service-list-field.component";


@NgModule({
    declarations: [
        HSCOListComponent,
        OccupationalHealthFormComponent,
        OccupationalHealthServiceListFieldComponent,
        OccupationalHealthServiceFormComponent,
        GroupedExposureListFieldComponent,
        GroupedExposureFormComponent,
        GroupedExposureItemListFieldComponent,
        GroupedExposureItemFormComponent,
        GroupedExposureItemServiceListFieldComponent,
        GroupedExposureItemServiceFormComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
    ],
    exports: [
        HSCOListComponent,
        OccupationalHealthFormComponent,
        OccupationalHealthServiceListFieldComponent,
        OccupationalHealthServiceFormComponent,
        GroupedExposureListFieldComponent,
        GroupedExposureFormComponent,
        GroupedExposureItemListFieldComponent,
        GroupedExposureItemFormComponent,
        GroupedExposureItemServiceListFieldComponent,
        GroupedExposureItemServiceFormComponent,
    ],
})
export class HSCOModel { }
