import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxFieldComponent } from "./components/checkbox-field/checkbox-field.component";
import { FieldErrorModule } from "../field-error/field-error.module";
import { FormsModule } from "@angular/forms";
import { UtilityModule } from "../../core/utility/utility.module";


@NgModule({
    declarations: [
        CheckboxFieldComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        FieldErrorModule,
        UtilityModule,
    ],
    exports: [
        CheckboxFieldComponent,
    ],
})
export class CheckboxFieldModule {

    public static forRoot(): ModuleWithProviders<CheckboxFieldModule> {
        return {
            ngModule: CheckboxFieldModule,
            providers: [
            ],
        };
    }
}
