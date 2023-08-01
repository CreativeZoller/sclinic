import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../shared/shared.module";
import { DeepErpItemIdentificationFormFieldComponent } from "./components/form-field/deep-erp-item-identification-form-field.component";


@NgModule({
    declarations: [
        DeepErpItemIdentificationFormFieldComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
    ],
    exports: [
        DeepErpItemIdentificationFormFieldComponent,
    ],
})
export class DeepErpItemIdentificationModule { }
