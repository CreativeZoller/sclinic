import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SectionTitleComponent } from "./components/section-title/section-title.component";
import { ResourceModule } from "../../core/resource/resource.module";
import { InlineSVGModule } from "ng-inline-svg-2";


@NgModule({
    declarations: [
        SectionTitleComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InlineSVGModule,
        ResourceModule,
    ],
    exports: [
        SectionTitleComponent,
    ],
})
export class SectionTitleModule {

    public static forRoot(): ModuleWithProviders<SectionTitleModule> {
        return {
            ngModule: SectionTitleModule,
            providers: [
            ],
        };
    }
}
