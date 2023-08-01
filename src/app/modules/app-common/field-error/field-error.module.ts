import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldErrorComponent } from "./components/field-error/field-error.component";
import { ResourceModule } from "../../core/resource/resource.module";
import { UtilityModule } from "../../core/utility/utility.module";


@NgModule({
    declarations: [
        FieldErrorComponent,
    ],
    imports: [
        CommonModule,
        UtilityModule,
        ResourceModule,
    ],
    exports: [
        FieldErrorComponent,
    ],
})
export class FieldErrorModule {

    public static forRoot(): ModuleWithProviders<FieldErrorModule> {
        return {
            ngModule: FieldErrorModule,
            providers: [
            ],
        };
    }
}
