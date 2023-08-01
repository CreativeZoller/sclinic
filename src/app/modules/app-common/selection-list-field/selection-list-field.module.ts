import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SelectionListFieldComponent } from "./components/selection-list-field/selection-list-field.component";
import { ListModule } from "../list/list.module";
import { FieldErrorModule } from "../field-error/field-error.module";
import { SectionTitleModule } from "../section-title/section-title.module";
import { SectionSubtitleModule } from "../section-subtitle/section-subtitle.module";


@NgModule({
    declarations: [
        SelectionListFieldComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ListModule,
        FieldErrorModule,
        SectionTitleModule,
        SectionSubtitleModule,
    ],
    exports: [
        SelectionListFieldComponent,
    ],
})
export class SelectionListFieldModule {

    public static forRoot(): ModuleWithProviders<SelectionListFieldModule> {
        return {
            ngModule: SelectionListFieldModule,
            providers: [
            ],
        };
    }
}
