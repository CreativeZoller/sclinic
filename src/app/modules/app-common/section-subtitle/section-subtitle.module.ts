import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SectionSubtitleComponent } from "./components/section-subtitle/section-subtitle.component";
import { ResourceModule } from "../../core/resource/resource.module";
import { InlineSVGModule } from "ng-inline-svg-2";



@NgModule({
    declarations: [
        SectionSubtitleComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InlineSVGModule,
        ResourceModule,
    ],
    exports: [
        SectionSubtitleComponent,
    ],
})
export class SectionSubtitleModule {

    public static forRoot(): ModuleWithProviders<SectionSubtitleModule> {
        return {
            ngModule: SectionSubtitleModule,
            providers: [
            ],
        };
    }
}
