import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../shared/shared.module";
import { DeepErpItemIdentificationModule } from "../deep-erp-item-identification/deep-erp-item-identification.module";
import { ServiceXServicePackageConfirmDialogContentComponent } from "./components/utility/confirm-dialog-content-components/service-service-package-confirm-dialog-content.component";
import { ServiceListComponent } from "./components/list/service-list.component";
import { ServiceFormComponent } from "./components/form/service-form.component";
import { ServiceBookingAreaSelectionListFieldComponent } from "./components/service-booking-area/selection-list-field/service-booking-area-selection-list-field.component";
import { ServiceSpecialityListFieldComponent } from "./components/service-speciality/list-field/service-speciality-list-field.component";
import { ServiceSpecialitySelectionListFormComponent } from "./components/service-speciality/selection-list-form/service-speciality-selection-list-form.component";
import { ServiceSpecialitySelectionListFieldComponent } from "./components/service-speciality/selection-list-field/service-speciality-selection-list-field.component";
import { ServiceSpecialtyDoctorListFieldComponent } from "./components/service-specialty-doctor/list-field/service-specialty-doctor-list-field.component";
import { ServiceSpecialtyDoctorSelectionListFormComponent } from "./components/service-specialty-doctor/selection-list-form/service-specialty-doctor-selection-list-form.component";
import { ServiceSpecialtyDoctorSelectionListFieldComponent } from "./components/service-specialty-doctor/selection-list-field/service-specialty-doctor-selection-list-field.component";
import { ServicePriceTemplateItemListFieldComponent } from "./components/service-price-template-item/list-field/service-price-template-item-list-field.component";
import { ServicePriceTemplateItemFormComponent } from "./components/service-price-template-item/form/service-price-template-item-form.component";
import { ServiceIncompatibleServiceListFieldComponent } from "./components/service-incompatible-service/list-field/service-incompatible-service-list-field.component";
import { ServiceIncompatibleServiceSelectionListFormComponent } from "./components/service-incompatible-service/selection-list-form/service-incompatible-service-selection-list-form.component";
import { ServiceIncompatibleServiceSelectionListFieldComponent } from "./components/service-incompatible-service/selection-list-field/service-incompatible-service-selection-list-field.component";
import { ServiceConnectedServiceListFieldComponent } from "./components/service-connected-service/list-field/service-connected-service-list-field.component";
import { ServiceConnectedServiceSelectionListFormComponent } from "./components/service-connected-service/selection-list-form/service-connected-service-selection-list-form.component";
import { ServiceConnectedServiceSelectionListFieldComponent } from "./components/service-connected-service/selection-list-field/service-connected-service-selection-list-field.component";
import { ServiceItemListFieldComponent } from "./components/service-item/list-field/service-item-list-field.component";
import { ServiceItemSelectionListFormComponent } from "./components/service-item/selection-list-form/service-item-selection-list-form.component";
import { ServiceItemSelectionListFieldComponent } from "./components/service-item/selection-list-field/service-item-selection-list-field.component";
import { ServiceLabListFieldComponent } from "./components/service-lab/list-field/service-lab-list-field.component";
import { ServiceLabSelectionListFormComponent } from "./components/service-lab/selection-list-form/service-lab-selection-list-form.component";
import { ServiceLabSelectionListFieldComponent } from "./components/service-lab/selection-list-field/service-lab-selection-list-field.component";
import { ServiceRoleListFieldComponent } from "./components/service-role/list-field/service-role-list-field.component";
import { ServiceRoleFormComponent } from "./components/service-role/form/service-role-form.component";
import { ServiceServicePackageListFieldComponent } from "./components/service-service-package/list-field/service-service-package-list-field.component";


@NgModule({
    declarations: [
        ServiceXServicePackageConfirmDialogContentComponent,
        ServiceListComponent,
        ServiceFormComponent,
        ServiceBookingAreaSelectionListFieldComponent,
        ServiceSpecialityListFieldComponent,
        ServiceSpecialitySelectionListFormComponent,
        ServiceSpecialitySelectionListFieldComponent,
        ServiceSpecialtyDoctorListFieldComponent,
        ServiceSpecialtyDoctorSelectionListFormComponent,
        ServiceSpecialtyDoctorSelectionListFieldComponent,
        ServicePriceTemplateItemListFieldComponent,
        ServicePriceTemplateItemFormComponent,
        ServiceIncompatibleServiceListFieldComponent,
        ServiceIncompatibleServiceSelectionListFormComponent,
        ServiceIncompatibleServiceSelectionListFieldComponent,
        ServiceConnectedServiceListFieldComponent,
        ServiceConnectedServiceSelectionListFormComponent,
        ServiceConnectedServiceSelectionListFieldComponent,
        ServiceItemListFieldComponent,
        ServiceItemSelectionListFormComponent,
        ServiceItemSelectionListFieldComponent,
        ServiceLabListFieldComponent,
        ServiceLabSelectionListFormComponent,
        ServiceLabSelectionListFieldComponent,
        ServiceRoleListFieldComponent,
        ServiceRoleFormComponent,
        ServiceServicePackageListFieldComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        DeepErpItemIdentificationModule,
    ],
    exports: [
        ServiceXServicePackageConfirmDialogContentComponent,
        ServiceListComponent,
        ServiceFormComponent,
        ServiceBookingAreaSelectionListFieldComponent,
        ServiceSpecialityListFieldComponent,
        ServiceSpecialitySelectionListFormComponent,
        ServiceSpecialitySelectionListFieldComponent,
        ServiceSpecialtyDoctorListFieldComponent,
        ServiceSpecialtyDoctorSelectionListFormComponent,
        ServiceSpecialtyDoctorSelectionListFieldComponent,
        ServicePriceTemplateItemListFieldComponent,
        ServicePriceTemplateItemFormComponent,
        ServiceIncompatibleServiceListFieldComponent,
        ServiceIncompatibleServiceSelectionListFormComponent,
        ServiceIncompatibleServiceSelectionListFieldComponent,
        ServiceConnectedServiceListFieldComponent,
        ServiceConnectedServiceSelectionListFormComponent,
        ServiceConnectedServiceSelectionListFieldComponent,
        ServiceItemListFieldComponent,
        ServiceItemSelectionListFormComponent,
        ServiceItemSelectionListFieldComponent,
        ServiceLabListFieldComponent,
        ServiceLabSelectionListFormComponent,
        ServiceLabSelectionListFieldComponent,
        ServiceRoleListFieldComponent,
        ServiceRoleFormComponent,
        ServiceServicePackageListFieldComponent,
    ],
})
export class ServicesModule { }
