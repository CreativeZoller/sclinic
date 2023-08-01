import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../shared/shared.module";
import { ClinicListComponent } from "./components/list/clinic-list.component";
import { ClinicFormComponent } from "./components/form/clinic-form.component";
import { ClinicBookingAreaSelectionListFieldComponent } from "./components/clinic-booking-area/selection-list-field/clinic-booking-area-selection-list-field.component";
import { ClinicOpenHoursFormFieldComponent } from "./components/clinic-open-hours/form-field/clinic-open-hours-form-field.component";
import { ClinicRoomListFieldComponent } from "./components/clinic-room/list-field/clinic-room-list-field.component";
import { ClinicRoomFormComponent } from "./components/clinic-room/form/clinic-room-form.component";
import { ClinicSelectionListFieldComponent } from "./components/selection-list-field/clinic-selection-list-field.component";
import { ClinicSelfListFieldComponent } from "./components/clinic-self/list-field/clinic-self-list-field.component";
import { ClinicSelfFormComponent } from "./components/clinic-self/form/clinic-self-form.component";
import { ClinicSpecialtyServiceTreeFieldComponent } from "./components/clinic-specialty-service/clinic-specialty-service-tree-field/clinic-specialty-service-tree-field.component";


@NgModule({
    declarations: [
        ClinicListComponent,
        ClinicFormComponent,
        ClinicBookingAreaSelectionListFieldComponent,
        ClinicOpenHoursFormFieldComponent,
        ClinicSpecialtyServiceTreeFieldComponent,
        ClinicRoomListFieldComponent,
        ClinicRoomFormComponent,
        ClinicSelectionListFieldComponent,
        ClinicSelfListFieldComponent,
        ClinicSelfFormComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
    ],
    exports: [
        ClinicListComponent,
        ClinicFormComponent,
        ClinicBookingAreaSelectionListFieldComponent,
        ClinicOpenHoursFormFieldComponent,
        ClinicSpecialtyServiceTreeFieldComponent,
        ClinicRoomListFieldComponent,
        ClinicRoomFormComponent,
        ClinicSelectionListFieldComponent,
        ClinicSelfListFieldComponent,
        ClinicSelfFormComponent,
    ],
})
export class ClinicsModule { }
