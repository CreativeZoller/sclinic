import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../shared/shared.module";
import { DeepErpItemIdentificationModule } from "../deep-erp-item-identification/deep-erp-item-identification.module";
import { ServicePackageListComponent } from "./components/list/service-package-list.component";
import { ServicePackageFormComponent } from "./components/form/service-package-form.component";
import { ServicePackageServiceSingleSelectionListFieldComponent } from "./components/service-package-service/single-selection-list-field/service-package-service-single-selection-list-field.component";
import { ServicePackageServiceListFieldComponent } from "./components/service-package-service/list-field/service-package-service-list-field.component";
import { ServicePackageServiceFormComponent } from "./components/service-package-service/form/service-package-service-form.component";
import { ServicePackageSubServicePackageFormComponent } from "./components/service-package-sub-service-package/form/service-package-sub-service-package-form.component";
import { ServicePackageSubServicePackageListFieldComponent } from "./components/service-package-sub-service-package/list-field/service-package-sub-service-package-list-field.component";
import { ServicePackageSubServicePackageSingleSelectionListFieldComponent } from "./components/service-package-sub-service-package/single-selection-list-field/service-package-sub-service-package-single-selection-list-field.component";
import { ServicePackagePriceTemplateItemListFieldComponent } from "./components/service-package-price-template-item/list-field/service-package-price-template-item-list-field.component";
import { ServicePackagePriceTemplateItemFormComponent } from "./components/service-package-price-template-item/form/service-package-price-template-item-form.component";
import { ServicePackageLabServiceFormComponent } from "./components/service-package-lab-service/form/service-package-lab-service-form.component";
import { ServicePackageLabServiceListFieldComponent } from "./components/service-package-lab-service/list-field/service-package-lab-service-list-field.component";
import { ServicePackageLabServiceSingleSelectionListFieldComponent } from "./components/service-package-lab-service/single-selection-list-field/service-package-lab-service-single-selection-list-field.component";
import { ServicePackageBookingAreaSelectionListFieldComponent } from "./components/service-package-booking-area/selection-list-field/service-package-booking-area-selection-list-field.component";
import { ServicePackageRoleFormComponent } from "./components/service-package-role/form/service-package-role-form.component";
import { ServicePackageRoleListFieldComponent } from "./components/service-package-role/list-field/service-package-role-list-field.component";


@NgModule({
    declarations: [
        ServicePackageListComponent,
        ServicePackageFormComponent,
        ServicePackageBookingAreaSelectionListFieldComponent,
        ServicePackagePriceTemplateItemListFieldComponent,
        ServicePackagePriceTemplateItemFormComponent,
        ServicePackageServiceListFieldComponent,
        ServicePackageServiceFormComponent,
        ServicePackageServiceSingleSelectionListFieldComponent,
        ServicePackageLabServiceListFieldComponent,
        ServicePackageLabServiceFormComponent,
        ServicePackageLabServiceSingleSelectionListFieldComponent,
        ServicePackageSubServicePackageListFieldComponent,
        ServicePackageSubServicePackageFormComponent,
        ServicePackageSubServicePackageSingleSelectionListFieldComponent,
        ServicePackageRoleFormComponent,
        ServicePackageRoleListFieldComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        DeepErpItemIdentificationModule,
    ],
    exports: [
        ServicePackageListComponent,
        ServicePackageFormComponent,
        ServicePackageBookingAreaSelectionListFieldComponent,
        ServicePackagePriceTemplateItemListFieldComponent,
        ServicePackagePriceTemplateItemFormComponent,
        ServicePackageServiceListFieldComponent,
        ServicePackageServiceFormComponent,
        ServicePackageServiceSingleSelectionListFieldComponent,
        ServicePackageLabServiceListFieldComponent,
        ServicePackageLabServiceFormComponent,
        ServicePackageLabServiceSingleSelectionListFieldComponent,
        ServicePackageSubServicePackageListFieldComponent,
        ServicePackageSubServicePackageFormComponent,
        ServicePackageSubServicePackageSingleSelectionListFieldComponent,
        ServicePackageRoleFormComponent,
        ServicePackageRoleListFieldComponent,
    ],
})
export class ServicePackagesModule { }
