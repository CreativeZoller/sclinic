import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldErrorModule } from "../field-error/field-error.module";
import { FormsModule } from "@angular/forms";
import { UtilityModule } from "../../core/utility/utility.module";
import { DatepickerFieldComponent } from "./components/datepicker-field/datepicker-field.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { InlineSVGModule } from "ng-inline-svg-2";
import { MatDateFnsModule } from "@angular/material-date-fns-adapter";
import { MatInputModule } from "@angular/material/input";


@NgModule({
    declarations: [
        DatepickerFieldComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        FieldErrorModule,
        UtilityModule,
        MatDatepickerModule,
        MatDateFnsModule,
        MatFormFieldModule,
        MatInputModule,
        InlineSVGModule,
    ],
    exports: [
        DatepickerFieldComponent,
    ],
})
export class DatepickerModule {

    public static forRoot(): ModuleWithProviders<DatepickerModule> {
        return {
            ngModule: DatepickerModule,
            providers: [
            ],
        };
    }
}
