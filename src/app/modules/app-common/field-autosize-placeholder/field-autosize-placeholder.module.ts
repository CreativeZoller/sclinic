import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UtilityModule } from "../../core/utility/utility.module";
import { FieldAutosizePlaceholderComponent } from "./components/field-autosize-placeholder/field-autosize-placeholder.component";


@NgModule({
    declarations: [
        FieldAutosizePlaceholderComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UtilityModule,
    ],
    exports: [
        FieldAutosizePlaceholderComponent,
    ],
})
export class FieldAutosizePlaceholderModule {

    public static forRoot(): ModuleWithProviders<FieldAutosizePlaceholderModule> {
        return {
            ngModule: FieldAutosizePlaceholderModule,
            providers: [
            ],
        };
    }
}
