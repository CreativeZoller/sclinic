import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ListModule } from "../list/list.module";
import { FieldErrorModule } from "../field-error/field-error.module";
import { SelectionListFieldModule } from "../selection-list-field/selection-list-field.module";
import { SectionTitleModule } from "../section-title/section-title.module";
import { SectionSubtitleModule } from "../section-subtitle/section-subtitle.module";
import { SingleSelectionListFieldComponent } from "./components/single-selection-list-field/single-selection-list-field.component";


@NgModule({
    declarations: [
        SingleSelectionListFieldComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ListModule,
        SelectionListFieldModule,
        FieldErrorModule,
        SectionTitleModule,
        SectionSubtitleModule,
    ],
    exports: [
        SingleSelectionListFieldComponent,
    ],
})
export class SingleSelectionListFieldModule {

    public static forRoot(): ModuleWithProviders<SingleSelectionListFieldModule> {
        return {
            ngModule: SingleSelectionListFieldModule,
            providers: [
            ],
        };
    }
}
