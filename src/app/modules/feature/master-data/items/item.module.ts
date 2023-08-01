import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../shared/shared.module";
import { DeepErpItemIdentificationModule } from "../deep-erp-item-identification/deep-erp-item-identification.module";
import { ItemXSubItemListFieldComponent } from "./components/item-x-sub-item/list-field/item-x-sub-item-list-field.component";
import { ItemFormComponent } from "./components/form/item-form.component";
import { ItemListComponent } from "./components/list/item-list.component";
import { ItemXPriceTemplateItemListFieldComponent } from "./components/item-x-price-template/list-field/item-x-price-template-item-list-field.component";
import { ItemXPriceTemplateItemFormComponent } from "./components/item-x-price-template/form/item-x-price-template-item-form.component";


@NgModule({
    declarations: [
        ItemListComponent,
        ItemFormComponent,
        ItemXPriceTemplateItemListFieldComponent,
        ItemXPriceTemplateItemFormComponent,
        ItemXSubItemListFieldComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        DeepErpItemIdentificationModule,
    ],
    exports: [
        ItemListComponent,
        ItemFormComponent,
        ItemXPriceTemplateItemListFieldComponent,
        ItemXPriceTemplateItemFormComponent,
        ItemXSubItemListFieldComponent,
    ],
})
export class ItemModule { }
