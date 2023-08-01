import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../shared/shared.module";
import { ExposureListComponent } from "./components/list/exposure-list.component";
import { ExposureFormComponent } from "./components/form/exposure-form.component";
import { ExposureItemListFieldComponent } from "./components/exposure-item/list-field/exposure-item-list-field.component";
import { ExposureItemFormComponent } from "./components/exposure-item/form/exposure-item-form.component";
import { ExposureItemServiceListFieldComponent } from "./components/exposure-item-service/list-field/exposure-item-service-list-field.component";
import { ExposureItemServiceFormComponent } from "./components/exposure-item-service/form/exposure-item-service-form.component";
import { ExposureItemOrServiceFormComponent } from "./components/exposure-item-or-service/form/exposure-item-or-service-form.component";


@NgModule({
    declarations: [
        ExposureListComponent,
        ExposureFormComponent,
        ExposureItemListFieldComponent,
        ExposureItemFormComponent,
        ExposureItemServiceListFieldComponent,
        ExposureItemServiceFormComponent,
        ExposureItemOrServiceFormComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
    ],
    exports: [
        ExposureListComponent,
        ExposureFormComponent,
        ExposureItemListFieldComponent,
        ExposureItemFormComponent,
        ExposureItemServiceListFieldComponent,
        ExposureItemServiceFormComponent,
        ExposureItemOrServiceFormComponent,
    ],
})
export class ExposureModule { }
