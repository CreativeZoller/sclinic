import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../shared/shared.module";
import { PatientFormComponent } from "./components/form/patient-form.component";
import { PatientListComponent } from "./components/list/patient-list.component";
import { PatientAddressListFieldComponent } from "./components/patient-address/list-field/patient-address-list-field.component";
import { PatientAddressFormComponent } from "./components/patient-address/form/patient-address-form.component";
import { PatientContactListFieldComponent } from "./components/patient-contact/list-field/patient-contact-list-field.component";
import { PatientContactFormComponent } from "./components/patient-contact/form/patient-contact-form.component";
import { PatientEmploymentListFieldComponent } from "./components/patient-employment/list-field/patient-employment-list-field.component";
import { PatientEmploymentFormComponent } from "./components/patient-employment/form/patient-employment-form.component";
import { PatientIdListFieldComponent } from "./components/patient-id/list-field/patient-id-list-field.component";
import { PatientIdFormComponent } from "./components/patient-id/form/patient-id-form.component";
import { PatientInsuranceDetailListFieldComponent } from "./components/patient-insurance-detail/list-field/patient-insurance-detail-list-field.component";
import { PatientInsuranceDetailFormComponent } from "./components/patient-insurance-detail/form/patient-insurance-detail-form.component";
import { PatientLanguageListFieldComponent } from "./components/patient-language/list-field/patient-language-list-field.component";
import { PatientLanguageFormComponent } from "./components/patient-language/form/patient-language-form.component";
import { PatientXPatientListFieldComponent } from "./components/patient-x-patient/list-field/patient-x-patient-list-field.component";
import { PatientXPatientFormComponent } from "./components/patient-x-patient/form/patient-x-patient-form.component";
import { PatientSingleSelectionListFieldComponent } from "./components/patient-x-patient/single-selection-list-field/patient-single-selection-list-field.component";

@NgModule({
    declarations: [
        PatientListComponent,
        PatientFormComponent,
        PatientAddressListFieldComponent,
        PatientAddressFormComponent,
        PatientContactListFieldComponent,
        PatientContactFormComponent,
        PatientLanguageListFieldComponent,
        PatientLanguageFormComponent,
        PatientEmploymentListFieldComponent,
        PatientEmploymentFormComponent,
        PatientIdListFieldComponent,
        PatientIdFormComponent,
        PatientInsuranceDetailListFieldComponent,
        PatientInsuranceDetailFormComponent,
        PatientXPatientListFieldComponent,
        PatientXPatientFormComponent,
        PatientSingleSelectionListFieldComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
    ],
    exports: [
        PatientListComponent,
        PatientFormComponent,
        PatientAddressListFieldComponent,
        PatientAddressFormComponent,
        PatientContactListFieldComponent,
        PatientContactFormComponent,
        PatientLanguageListFieldComponent,
        PatientLanguageFormComponent,
        PatientEmploymentListFieldComponent,
        PatientEmploymentFormComponent,
        PatientIdListFieldComponent,
        PatientIdFormComponent,
        PatientInsuranceDetailListFieldComponent,
        PatientInsuranceDetailFormComponent,
        PatientXPatientListFieldComponent,
        PatientXPatientFormComponent,
        PatientSingleSelectionListFieldComponent,
    ],
})
export class PatientModule { }
