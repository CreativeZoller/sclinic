import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldErrorModule } from "../field-error/field-error.module";
import { FormsModule } from "@angular/forms";
import { UtilityModule } from "../../core/utility/utility.module";
import { TimepickerFieldComponent } from "./components/timepicker-field/timepicker-field.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { InlineSVGModule } from "ng-inline-svg-2";
import { MatDateFnsModule } from "@angular/material-date-fns-adapter";
import { MatInputModule } from "@angular/material/input";
import { ResourceModule } from "../../core/resource/resource.module";


@NgModule({
    declarations: [
        TimepickerFieldComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        FieldErrorModule,
        UtilityModule,
        ResourceModule,
        NgxMatTimepickerModule,
        MatDateFnsModule,
        MatFormFieldModule,
        MatInputModule,
        InlineSVGModule,
    ],
    exports: [
        TimepickerFieldComponent,
    ],
})
export class TimepickerModule {

    public static forRoot(): ModuleWithProviders<TimepickerModule> {
        return {
            ngModule: TimepickerModule,
            providers: [
            ],
        };
    }
}
