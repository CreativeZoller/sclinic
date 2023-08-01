import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from "ng-inline-svg-2";
import { SectionTitleModule } from "../section-title/section-title.module";
import { SectionSubtitleModule } from "../section-subtitle/section-subtitle.module";
import { ExpandablePanelComponent } from "./components/expandable-panel/expandable-panel.component";


@NgModule({
    declarations: [
        ExpandablePanelComponent,
    ],
    imports: [
        CommonModule,
        InlineSVGModule,
        SectionTitleModule,
        SectionSubtitleModule,
    ],
    exports: [
        ExpandablePanelComponent,
    ],
})
export class ExpandablePanelModule {

    public static forRoot(): ModuleWithProviders<ExpandablePanelModule> {
        return {
            ngModule: ExpandablePanelModule,
            providers: [
            ],
        };
    }
}
