import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldErrorModule } from "../field-error/field-error.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UtilityModule } from "../../core/utility/utility.module";
import { TextFieldComponent } from "./components/text-field/text-field.component";
import { NgxMaskModule } from "ngx-mask";
import { FieldAutosizePlaceholderModule } from "../field-autosize-placeholder/field-autosize-placeholder.module";


@NgModule({
    declarations: [
        TextFieldComponent,
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
        TextFieldComponent,
    ],
})
export class TextFieldModule {

    public static forRoot(): ModuleWithProviders<TextFieldModule> {
        return {
            ngModule: TextFieldModule,
            providers: [
            ],
        };
    }
}
