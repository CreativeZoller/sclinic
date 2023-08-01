import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../shared/shared.module";
import { JobTitleListComponent } from "./components/list/job-title-list.component";
import { JobTitleFormComponent } from "./components/form/job-title-form.component";
import { JobTitleServiceFormComponent } from "./components/job-title-service/form/job-title-service-form.component";
import { JobTitleServiceSingleSelectionListFieldComponent } from "./components/job-title-service/single-selection-list-field/job-title-service-single-selection-list-field.component";
import { JobTitleServiceListFieldComponent } from "./components/job-title-service/list-field/job-title-service-list-field.component";

@NgModule({
    declarations: [
        JobTitleListComponent,
        JobTitleFormComponent,
        JobTitleServiceListFieldComponent,
        JobTitleServiceFormComponent,
        JobTitleServiceSingleSelectionListFieldComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
    ],
    exports: [
        JobTitleListComponent,
        JobTitleFormComponent,
        JobTitleServiceListFieldComponent,
        JobTitleServiceFormComponent,
        JobTitleServiceSingleSelectionListFieldComponent,
    ],
})
export class JobTitleModule { }
