import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormErrorComponent } from "./components/form-error/form-error.component";
import { ResourceModule } from "../../core/resource/resource.module";
import { UtilityModule } from "../../core/utility/utility.module";
import { InlineSVGModule } from "ng-inline-svg-2";


@NgModule({
    declarations: [
        FormErrorComponent,
    ],
    imports: [
        CommonModule,
        UtilityModule,
        ResourceModule,
        InlineSVGModule,
    ],
    exports: [
        FormErrorComponent,
    ],
})
export class FormErrorModule {

    public static forRoot(): ModuleWithProviders<FormErrorModule> {
        return {
            ngModule: FormErrorModule,
            providers: [
            ],
        };
    }
}
