import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldErrorModule } from "../field-error/field-error.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UtilityModule } from "../../core/utility/utility.module";
import { ImgInputFieldComponent } from "./components/img-input-field/img-input-field.component";
import { ResourceModule } from "../../core/resource/resource.module";
import { InlineSVGModule } from "ng-inline-svg-2";


@NgModule({
    declarations: [
        ImgInputFieldComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FieldErrorModule,
        UtilityModule,
        ResourceModule,
        InlineSVGModule,
    ],
    exports: [
        ImgInputFieldComponent,
    ],
})
export class ImgInputFieldModule {

    public static forRoot(): ModuleWithProviders<ImgInputFieldModule> {
        return {
            ngModule: ImgInputFieldModule,
            providers: [
            ],
        };
    }
}
