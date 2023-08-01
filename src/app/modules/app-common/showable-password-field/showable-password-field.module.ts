import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ShowablePasswordFieldComponent } from "./components/showable-password-field/showable-password-field.component";
import { TextFieldModule } from "../text-field/text-field.module";


@NgModule({
    declarations: [
        ShowablePasswordFieldComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextFieldModule,
    ],
    exports: [
        ShowablePasswordFieldComponent,
    ],
})
export class ShowablePasswordFieldModule {

    public static forRoot(): ModuleWithProviders<ShowablePasswordFieldModule> {
        return {
            ngModule: ShowablePasswordFieldModule,
            providers: [
            ],
        };
    }
}
