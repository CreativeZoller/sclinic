import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ListComponent } from "./components/list/list.component";
import { _SharedModule } from "../../shared/_shared.module";
import { ResourceModule } from "../../core/resource/resource.module";


@NgModule({
    declarations: [
        ListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ResourceModule,
        // TODO remove this import
        _SharedModule,
    ],
    exports: [
        ListComponent,
    ],
})
export class ListModule {

    public static forRoot(): ModuleWithProviders<ListModule> {
        return {
            ngModule: ListModule,
            providers: [
            ],
        };
    }
}
