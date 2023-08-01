import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../shared/shared.module";
import { PriceTableListComponent } from "./components/list/price-table-list.component";
import { PriceTableFormCreateComponent } from "./components/form-create/price-table-form-create.component";
import { PriceTableFormUpdateComponent } from "./components/form-update/price-table-form-update.component";
import { PriceTableFormComponent } from "./components/form/price-table-form.component";
import { PriceTemplateFormComponent } from "./components/price-template/form/price-template-form.component";
import { PriceTemplateListFormFieldComponent } from "./components/price-template/list-form-field/price-template-list-form-field.component";
import { PriceTemplateXPriceTemplateItemGenericListComponent } from "./components/price-template/price-template-x-price-template-item/generic-list/price-template-x-price-template-item-generic-list.component"
import { PriceTemplateXPriceTemplateItemOfItemListComponent } from "./components/price-template/price-template-x-price-template-item/item-list/price-template-x-price-template-item-of-item-list.component"
import { PriceTemplateXPriceTemplateItemOfServiceListComponent } from "./components/price-template/price-template-x-price-template-item/service-list/price-template-x-price-template-item-of-service-list.component"
import { PriceTemplateXPriceTemplateItemOfServiceSubPackageListComponent } from "./components/price-template/price-template-x-price-template-item/service-sub-package-list/price-template-x-price-template-item-of-service-sub-package-list.component"
import { PriceTemplateXPriceTemplateItemOfServicePackageListComponent } from "./components/price-template/price-template-x-price-template-item/service-package-list/price-template-x-price-template-item-of-service-package-list.component"


@NgModule({
    declarations: [
        PriceTableListComponent,
        PriceTableFormComponent,
        PriceTableFormCreateComponent,
        PriceTableFormUpdateComponent,
        PriceTemplateFormComponent,
        PriceTemplateListFormFieldComponent,
        PriceTemplateXPriceTemplateItemGenericListComponent,
        PriceTemplateXPriceTemplateItemOfItemListComponent,
        PriceTemplateXPriceTemplateItemOfServiceListComponent,
        PriceTemplateXPriceTemplateItemOfServiceSubPackageListComponent,
        PriceTemplateXPriceTemplateItemOfServicePackageListComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
    ],
    exports: [
        PriceTableListComponent,
        PriceTableFormComponent,
        PriceTableFormCreateComponent,
        PriceTableFormUpdateComponent,
        PriceTemplateFormComponent,
        PriceTemplateListFormFieldComponent,
        PriceTemplateXPriceTemplateItemGenericListComponent,
        PriceTemplateXPriceTemplateItemOfItemListComponent,
        PriceTemplateXPriceTemplateItemOfServiceListComponent,
        PriceTemplateXPriceTemplateItemOfServiceSubPackageListComponent,
        PriceTemplateXPriceTemplateItemOfServicePackageListComponent,
    ],
})
export class PriceTableModule { }
