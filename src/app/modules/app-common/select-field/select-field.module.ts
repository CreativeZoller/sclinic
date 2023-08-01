import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldErrorModule } from "../field-error/field-error.module";
import { FormsModule } from "@angular/forms";
import { UtilityModule } from "../../core/utility/utility.module";
import { SelectFieldComponent } from "./components/select-field/select-field.component";


@NgModule({
    declarations: [
        SelectFieldComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        FieldErrorModule,
        UtilityModule,
    ],
    exports: [
        SelectFieldComponent,
    ],
})
export class SelectFieldModule {

    public static forRoot(): ModuleWithProviders<SelectFieldModule> {
        return {
            ngModule: SelectFieldModule,
            providers: [
            ],
        };
    }
}
