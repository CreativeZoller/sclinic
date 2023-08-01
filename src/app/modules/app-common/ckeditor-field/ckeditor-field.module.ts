import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CkeditorFieldComponent } from "./components/ckeditor-field/ckeditor-field.component";
import { FieldErrorModule } from "../field-error/field-error.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UtilityModule } from "../../core/utility/utility.module";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";


@NgModule({
    declarations: [
        CkeditorFieldComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FieldErrorModule,
        UtilityModule,
        CKEditorModule,
    ],
    exports: [
        CkeditorFieldComponent,
    ],
})
export class CkeditorFieldModule {

    public static forRoot(): ModuleWithProviders<CkeditorFieldModule> {
        return {
            ngModule: CkeditorFieldModule,
            providers: [
            ],
        };
    }
}
