import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldErrorModule } from "../field-error/field-error.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UtilityModule } from "../../core/utility/utility.module";
import { TextAreaFieldComponent } from "./components/text-area-field/text-area-field.component";
import { NgxMaskModule } from "ngx-mask";
import { FieldAutosizePlaceholderModule } from "../field-autosize-placeholder/field-autosize-placeholder.module";


@NgModule({
    declarations: [
        TextAreaFieldComponent,
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
        TextAreaFieldComponent,
    ],
})
export class TextAreaFieldModule {

    public static forRoot(): ModuleWithProviders<TextAreaFieldModule> {
        return {
            ngModule: TextAreaFieldModule,
            providers: [
            ],
        };
    }
}
