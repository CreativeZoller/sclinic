import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormModalComponent } from "./components/form-modal/form-modal.component";
import { _SharedModule } from "../../shared/_shared.module";


@NgModule({
    declarations: [
        FormModalComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // TODO remove this import
        _SharedModule,
    ],
    exports: [
        FormModalComponent,
    ],
})
export class FormModalModule {

    public static forRoot(): ModuleWithProviders<FormModalModule> {
        return {
            ngModule: FormModalModule,
            providers: [
            ],
        };
    }
}
