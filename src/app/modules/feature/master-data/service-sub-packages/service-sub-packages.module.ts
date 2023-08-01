import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../shared/shared.module";
import { DeepErpItemIdentificationModule } from "../deep-erp-item-identification/deep-erp-item-identification.module";
import { ServiceSubPackageXServicePackageConfirmDialogContentComponent } from "./components/utility/confirm-dialog-content-components/service-sub-package-service-package-confirm-dialog-content.component";
import { ServiceSubPackageListComponent } from "./components/list/service-sub-package-list.component";
import { ServiceSubPackageFormComponent } from "./components/form/service-sub-package-form.component";
import { ServiceSubPackageBookingAreaSelectionListFieldComponent } from "./components/service-sub-package-booking-area/selection-list-field/service-sub-package-booking-area-selection-list-field.component";
import { ServiceSubPackagePriceTemplateItemListFieldComponent } from "./components/service-sub-package-price-template-item/list-field/service-sub-package-price-template-item-list-field.component";
import { ServiceSubPackagePriceTemplateItemFormComponent } from "./components/service-sub-package-price-template-item/form/service-sub-package-price-template-item-form.component";
import { ServiceSubPackageServiceListFieldComponent } from "./components/service-sub-package-service/list-field/service-sub-package-service-list-field.component";
import { ServiceSubPackageServiceFormComponent } from "./components/service-sub-package-service/form/service-sub-package-service-form.component";
import { ServiceSubPackageServiceSingleSelectionListFieldComponent } from "./components/service-sub-package-service/single-selection-list-field/service-sub-package-service-single-selection-list-field.component";
import { ServiceSubPackageRoleListFieldComponent } from "./components/service-sub-package-role/list-field/service-sub-package-role-list-field.component";
import { ServiceSubPackageRoleFormComponent } from "./components/service-sub-package-role/form/service-sub-package-role-form.component";
import { ServiceSubPackageServicePackageListFieldComponent } from "./components/service-sub-package-service-package/list-field/service-sub-package-service-package-list-field.component";
import { ServiceSubPackageContractListFieldComponent } from "./components/service-sub-package-contract/list-field/service-sub-package-contract-list-field.component";


@NgModule({
    declarations: [
        ServiceSubPackageXServicePackageConfirmDialogContentComponent,
        ServiceSubPackageListComponent,
        ServiceSubPackageFormComponent,
        ServiceSubPackageBookingAreaSelectionListFieldComponent,
        ServiceSubPackagePriceTemplateItemListFieldComponent,
        ServiceSubPackagePriceTemplateItemFormComponent,
        ServiceSubPackageServiceListFieldComponent,
        ServiceSubPackageServiceFormComponent,
        ServiceSubPackageServiceSingleSelectionListFieldComponent,
        ServiceSubPackageRoleListFieldComponent,
        ServiceSubPackageRoleFormComponent,
        ServiceSubPackageServicePackageListFieldComponent,
        ServiceSubPackageContractListFieldComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        DeepErpItemIdentificationModule,
    ],
    exports: [
        ServiceSubPackageXServicePackageConfirmDialogContentComponent,
        ServiceSubPackageListComponent,
        ServiceSubPackageFormComponent,
        ServiceSubPackageBookingAreaSelectionListFieldComponent,
        ServiceSubPackagePriceTemplateItemListFieldComponent,
        ServiceSubPackagePriceTemplateItemFormComponent,
        ServiceSubPackageServiceListFieldComponent,
        ServiceSubPackageServiceFormComponent,
        ServiceSubPackageServiceSingleSelectionListFieldComponent,
        ServiceSubPackageRoleListFieldComponent,
        ServiceSubPackageRoleFormComponent,
        ServiceSubPackageServicePackageListFieldComponent,
        ServiceSubPackageContractListFieldComponent,
    ],
})
export class ServiceSubPackagesModule { }
