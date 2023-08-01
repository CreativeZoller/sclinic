import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioFieldComponent } from "./components/radio-field/radio-field.component";
import { FieldErrorModule } from "../field-error/field-error.module";
import { FormsModule } from "@angular/forms";
import { UtilityModule } from "../../core/utility/utility.module";
import { RadioFieldOptionComponent } from "./components/radio-field-option/radio-field-option.component";


@NgModule({
    declarations: [
        RadioFieldComponent,
        RadioFieldOptionComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        FieldErrorModule,
        UtilityModule,
    ],
    exports: [
        RadioFieldComponent,
        RadioFieldOptionComponent,
    ],
})
export class RadioFieldModule {

    public static forRoot(): ModuleWithProviders<RadioFieldModule> {
        return {
            ngModule: RadioFieldModule,
            providers: [
            ],
        };
    }
}
