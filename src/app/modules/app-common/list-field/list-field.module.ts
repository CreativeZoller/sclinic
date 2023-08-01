import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ListFieldComponent } from "./components/list-field/list-field.component";
import { ListModule } from "../list/list.module";
import { FieldErrorModule } from "../field-error/field-error.module";
import { SectionTitleModule } from "../section-title/section-title.module";
import { SectionSubtitleModule } from "../section-subtitle/section-subtitle.module";


@NgModule({
    declarations: [
        ListFieldComponent,
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
        ListFieldComponent,
    ],
})
export class ListFieldModule {

    public static forRoot(): ModuleWithProviders<ListFieldModule> {
        return {
            ngModule: ListFieldModule,
            providers: [
            ],
        };
    }
}
