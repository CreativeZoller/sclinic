import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { _SharedModule } from "../../shared/_shared.module";


@NgModule({
    declarations: [
        // BaseControlValueAccessor,
        // BaseControlValueAccessorWithForm,
        // BaseFormComponent,
        // BaseListFieldComponent,
        // BaseSelectionListFieldComponent,
        // BaseSingleSelectionListFieldComponent,
        // BaseFormModalComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        // BaseControlValueAccessor,
        // BaseControlValueAccessorWithForm,
        // BaseFormComponent,
        // BaseListFieldComponent,
        // BaseSelectionListFieldComponent,
        // BaseSingleSelectionListFieldComponent,
        // BaseFormModalComponent,
    ],
})
export class UtilityModule {

    public static forRoot(): ModuleWithProviders<UtilityModule> {
        return {
            ngModule: UtilityModule,
            providers: [
            ],
        };
    }
}
