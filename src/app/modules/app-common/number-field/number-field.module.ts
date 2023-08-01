import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldErrorModule } from "../field-error/field-error.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UtilityModule } from "../../core/utility/utility.module";
import { NumberFieldComponent } from "./components/number-field/number-field.component";
import { NgxMaskModule } from "ngx-mask";
import { FieldAutosizePlaceholderModule } from "../field-autosize-placeholder/field-autosize-placeholder.module";



@NgModule({
    declarations: [
        NumberFieldComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FieldErrorModule,
        UtilityModule,
        NgxMaskModule,
        FieldAutosizePlaceholderModule,
    ],
    exports: [
        NumberFieldComponent,
    ],
})
export class NumberFieldModule {

    public static forRoot(): ModuleWithProviders<NumberFieldModule> {
        return {
            ngModule: NumberFieldModule,
            providers: [
            ],
        };
    }
}
