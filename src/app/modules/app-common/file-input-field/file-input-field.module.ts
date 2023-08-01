import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldErrorModule } from "../field-error/field-error.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UtilityModule } from "../../core/utility/utility.module";
import { FileInputFieldComponent } from "./components/file-input-field/file-input-field.component";
import { MatIconModule } from "@angular/material/icon";
import { ResourceModule } from "../../core/resource/resource.module";
import { InlineSVGModule } from "ng-inline-svg-2";


@NgModule({
    declarations: [
        FileInputFieldComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FieldErrorModule,
        MatIconModule,
        UtilityModule,
        ResourceModule,
        InlineSVGModule,
    ],
    exports: [
        FileInputFieldComponent,
    ],
})
export class FileInputFieldModule {

    public static forRoot(): ModuleWithProviders<FileInputFieldModule> {
        return {
            ngModule: FileInputFieldModule,
            providers: [
            ],
        };
    }
}
