import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldErrorModule } from "../field-error/field-error.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UtilityModule } from "../../core/utility/utility.module";
import { AutocompleteFieldComponent } from "./components/autocomplete-field/autocomplete-field.component";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";


@NgModule({
    declarations: [
        AutocompleteFieldComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FieldErrorModule,
        UtilityModule,
        NgbTypeaheadModule,
    ],
    exports: [
        AutocompleteFieldComponent,
    ],
})
export class AutocompleteFieldModule {

    public static forRoot(): ModuleWithProviders<AutocompleteFieldModule> {
        return {
            ngModule: AutocompleteFieldModule,
            providers: [
            ],
        };
    }
}
