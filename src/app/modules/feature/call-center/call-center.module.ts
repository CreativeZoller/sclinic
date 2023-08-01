import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";
import { CcAppointmentsComponent } from "./appointments/appointments.component";
import { CcPatientListComponent } from "./appointments/components/list/patient-list.component";
import { CcPatientFormComponent } from "./appointments/components/form/patient-form.component";
import { CcPatientContactListFieldComponent } from "./appointments/components/patient-contact/list-field/patient-contact-list-field.component";
import { CcPatientContactFormComponent } from "./appointments/components/patient-contact/form/patient-contact-form.component";
import { CcPatientAddressListFieldComponent } from "./appointments/components/patient-address/list-field/patient-address-list-field.component";
import { CcPatientAddressFormComponent } from "./appointments/components/patient-address/form/patient-address-form.component";
import { CcPatientIdListFieldComponent } from "./appointments/components/patient-id/list-field/patient-id-list-field.component";
import { CcPatientIdFormComponent } from "./appointments/components/patient-id/form/patient-id-form.component";
import { CcPatientInsuranceDetailListFieldComponent } from "./appointments/components/patient-insurance-detail/list-field/patient-insurance-detail-list-field.component";
import { CcPatientInsuranceDetailFormComponent } from "./appointments/components/patient-insurance-detail/form/patient-insurance-detail-form.component";
import { CcPatientLanguageFormComponent } from "./appointments/components/patient-language/form/patient-language-form.component";
import { CcPatientLanguageListFieldComponent } from "./appointments/components/patient-language/list-field/patient-language-list-field.component";
import { CcPatientXPatientFormComponent } from "./appointments/components/patient-x-patient/form/patient-x-patient-form.component";
import { CcPatientXPatientListFieldComponent } from "./appointments/components/patient-x-patient/list-field/patient-x-patient-list-field.component";
import { CcPatientSingleSelectionListFieldComponent } from "./appointments/components/patient-x-patient/single-selection-list-field/patient-single-selection-list-field.component";
import { CcPatientDetailsComponent } from "./appointments/components/patient-details/patient-details.component";
import { CcPatientNavigationComponent } from "./appointments/components/patient-navigation/patient-navigation.component";
import { CcPatientServicesComponent } from "./appointments/components/patient-services/patient-services.component";
import { CcPatientServicesFormComponent } from "./appointments/components/patient-services/form/patient-services-form.component";
import { CcAppointmentCartFormComponent } from "./appointments/components/appointments-cart/form/appointments-cart-form.component";
import { CcPatientFilteredServicesComponent } from "./appointments/components/patient-services/filtered-services/filtered-services.component";
import { CcAppointmentTimepickerComponent } from "./appointments/components/appointments-timepicker/list/timepicker-list.component";

@NgModule({
    declarations: [
        CcAppointmentsComponent,
        CcPatientListComponent,
        CcPatientFormComponent,
        CcPatientAddressListFieldComponent,
        CcPatientAddressFormComponent,
        CcPatientContactListFieldComponent,
        CcPatientContactFormComponent,
        CcPatientIdListFieldComponent,
        CcPatientIdFormComponent,
        CcPatientInsuranceDetailListFieldComponent,
        CcPatientInsuranceDetailFormComponent,
        CcPatientLanguageListFieldComponent,
        CcPatientLanguageFormComponent,
        CcPatientXPatientListFieldComponent,
        CcPatientXPatientFormComponent,
        CcPatientSingleSelectionListFieldComponent,
        CcPatientDetailsComponent,
        CcPatientNavigationComponent,
        CcPatientServicesComponent,
        CcPatientServicesFormComponent,
        CcAppointmentCartFormComponent,
        CcPatientFilteredServicesComponent,
        CcAppointmentTimepickerComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
    ],
    exports: [
        CcAppointmentsComponent,
        CcPatientListComponent,
        CcPatientFormComponent,
        CcPatientAddressListFieldComponent,
        CcPatientAddressFormComponent,
        CcPatientContactListFieldComponent,
        CcPatientContactFormComponent,
        CcPatientIdListFieldComponent,
        CcPatientIdFormComponent,
        CcPatientInsuranceDetailListFieldComponent,
        CcPatientInsuranceDetailFormComponent,
        CcPatientLanguageListFieldComponent,
        CcPatientLanguageFormComponent,
        CcPatientXPatientListFieldComponent,
        CcPatientXPatientFormComponent,
        CcPatientSingleSelectionListFieldComponent,
        CcPatientDetailsComponent,
        CcPatientNavigationComponent,
        CcPatientServicesComponent,
        CcPatientServicesFormComponent,
        CcAppointmentCartFormComponent,
        CcPatientFilteredServicesComponent,
        CcAppointmentTimepickerComponent
    ],
})
export class CCModule { }
