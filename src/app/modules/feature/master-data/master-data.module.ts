import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";
import { DeepErpItemIdentificationModule } from "./deep-erp-item-identification/deep-erp-item-identification.module";
import { ServicesModule } from "./services/services.module";
import { ServiceSubPackagesModule } from "./service-sub-packages/service-sub-packages.module";
import { ServicePackagesModule } from "./service-packages/service-packages.module";
import { PriceTableModule } from "./price-tables/price-table.module";
import { ItemModule } from "./items/item.module";
import { PatientModule } from "./patients/patient.module";
import { PartnerListComponent } from "./partners/components/list/partner-list.component";
import { PartnerFormComponent } from "./partners/components/form/partner-form.component";
import { DictionaryCategoryListComponent } from "./dictionary-categories/components/list/dictionary-category-list.component";
import { DictionaryCategoryFormComponent } from "./dictionary-categories/components/form/dictionary-category-form.component";
import { DictionaryEntryListComponent } from "./dictionary-entries/components/list/dictionary-entry-list.component";
import { DictionaryEntryFormComponent } from "./dictionary-entries/components/form/dictionary-entry-form.component";
import { CompanySiteListFieldComponent } from "./companies/components/company-site/list-field/company-site-list-field.component";
import { CompanySiteFormComponent } from "./companies/components/company-site/form/company-site-form.component";
import { DocumentTemplateListComponent } from "./document-templates/components/list/document-template-list.component";
import { DocumentTemplateFormComponent } from "./document-templates/components/form/document-template-form.component";
import { EmailTemplateListComponent } from "./email-templates/components/list/email-template-list.component";
import { EmailTemplateFormComponent } from "./email-templates/components/form/email-template-form.component";
import { ServiceProviderEntityListComponent } from "./service-provider-entities/components/list/service-provider-entity-list.component";
import { ServiceProviderEntityFormComponent } from "./service-provider-entities/components/form/service-provider-entity-form.component";
import { LabListComponent } from "./labs/components/list/lab-list.component";
import { LabFormComponent } from "./labs/components/form/lab-form.component";
import { CityListComponent } from "./cities/components/list/city-list.component";
import { CityFormComponent } from "./cities/components/form/city-form.component";
import { ClinicsModule } from "./clinics/clinics.module";
import { MedicalEmployeeFormComponent } from "./medical-employee/components/form/medical-employee-form.component";
import { MedicalEmployeeBookingAreaSelectionListFieldComponent } from "./medical-employee/components/medical-employee-booking-area/selection-list-field/medical-employee-booking-area-selection-list-field.component";
import { MedicalEmployeeContactListFieldComponent } from "./medical-employee/components/medical-employee-contact/list-field/medical-employee-contact-list-field.component";
import { MedicalEmployeeContactFormComponent } from "./medical-employee/components/medical-employee-contact/form/medical-employee-contact-form.component";
import { MedicalEmployeeLanguageListFieldComponent } from "./medical-employee/components/medical-employee-language/list-field/medical-employee-language-list-field.component";
import { MedicalEmployeeLanguageFormComponent } from "./medical-employee/components/medical-employee-language/form/medical-employee-language-form.component";
import { MedicalEmployeeProfessionalExamListFieldComponent } from "./medical-employee/components/medical-employee-professional-exam/list-field/medical-employee-professional-exam-list-field.component";
import { MedicalEmployeeProfessionalExamFormComponent } from "./medical-employee/components/medical-employee-professional-exam/form/medical-employee-professional-exam-form.component";
import { MedicalEmployeeSpecialityServiceTreeFieldComponent } from "./medical-employee/components/medical-employee-speciality-service/medical-employee-speciality-service-tree-field/medical-employee-speciality-service-tree-field.component";
import { MedicalEmployeeContractListFieldComponent } from "./medical-employee/components/medical-employee-contract/list-field/medical-employee-contract-list-field.component";
import { MedicalEmployeeContractFormComponent } from "./medical-employee/components/medical-employee-contract/form/medical-employee-contract-form.component";
import { MedicalEmployeeContractScheduleEntryListFieldComponent } from "./medical-employee/components/medical-employee-contract/medical-employee-contract-schedule-entry/list-field/medical-employee-contract-schedule-entry-list-field.component";
import { MedicalEmployeeContractScheduleEntryFormComponent } from "./medical-employee/components/medical-employee-contract/medical-employee-contract-schedule-entry/form/medical-employee-contract-schedule-entry-form.component";
import { MedicalEmployeeContractCommissionTreeFieldComponent } from "./medical-employee/components/medical-employee-contract/medical-employee-contract-commission/tree-field/medical-employee-contract-commission-tree-field.component";
import { DoctorListComponent } from "./doctors/components/list/doctor-list.component";
import { AssistantListComponent } from "./assistants/components/list/assistant-list.component";
import { ExposureModule } from "./exposure/exposure.module";
import { JobTitleModule } from "./job/job-title.module";
import { HSCOModel } from "./hsco/hsco.module";


@NgModule({
    declarations: [
        PartnerListComponent,
        PartnerFormComponent,
        DictionaryCategoryListComponent,
        DictionaryCategoryFormComponent,
        DictionaryEntryListComponent,
        DictionaryEntryFormComponent,
        CompanySiteListFieldComponent,
        CompanySiteFormComponent,
        DocumentTemplateListComponent,
        DocumentTemplateFormComponent,
        EmailTemplateListComponent,
        EmailTemplateFormComponent,
        ServiceProviderEntityListComponent,
        ServiceProviderEntityFormComponent,
        LabListComponent,
        LabFormComponent,
        CityListComponent,
        CityFormComponent,
        MedicalEmployeeFormComponent,
        MedicalEmployeeBookingAreaSelectionListFieldComponent,
        MedicalEmployeeContactListFieldComponent,
        MedicalEmployeeContactFormComponent,
        MedicalEmployeeLanguageListFieldComponent,
        MedicalEmployeeLanguageFormComponent,
        MedicalEmployeeProfessionalExamListFieldComponent,
        MedicalEmployeeProfessionalExamFormComponent,
        MedicalEmployeeSpecialityServiceTreeFieldComponent,
        MedicalEmployeeContractListFieldComponent,
        MedicalEmployeeContractFormComponent,
        MedicalEmployeeContractScheduleEntryListFieldComponent,
        MedicalEmployeeContractScheduleEntryFormComponent,
        MedicalEmployeeContractCommissionTreeFieldComponent,
        DoctorListComponent,
        AssistantListComponent,
    ],
    exports: [
        PartnerListComponent,
        PartnerFormComponent,
        DictionaryCategoryListComponent,
        DictionaryCategoryFormComponent,
        DictionaryEntryListComponent,
        DictionaryEntryFormComponent,
        CompanySiteListFieldComponent,
        CompanySiteFormComponent,
        DocumentTemplateListComponent,
        DocumentTemplateFormComponent,
        EmailTemplateListComponent,
        EmailTemplateFormComponent,
        ServiceProviderEntityListComponent,
        ServiceProviderEntityFormComponent,
        LabListComponent,
        LabFormComponent,
        CityListComponent,
        CityFormComponent,
        MedicalEmployeeFormComponent,
        MedicalEmployeeBookingAreaSelectionListFieldComponent,
        MedicalEmployeeContactListFieldComponent,
        MedicalEmployeeContactFormComponent,
        MedicalEmployeeLanguageListFieldComponent,
        MedicalEmployeeLanguageFormComponent,
        MedicalEmployeeProfessionalExamListFieldComponent,
        MedicalEmployeeProfessionalExamFormComponent,
        MedicalEmployeeSpecialityServiceTreeFieldComponent,
        MedicalEmployeeContractListFieldComponent,
        MedicalEmployeeContractFormComponent,
        MedicalEmployeeContractScheduleEntryListFieldComponent,
        MedicalEmployeeContractScheduleEntryFormComponent,
        MedicalEmployeeContractCommissionTreeFieldComponent,
        DoctorListComponent,
        AssistantListComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        DeepErpItemIdentificationModule,
        ServicesModule,
        ServiceSubPackagesModule,
        ServicePackagesModule,
        PriceTableModule,
        ItemModule,
        PatientModule,
        ClinicsModule,
        ExposureModule,
        JobTitleModule,
        HSCOModel,
    ]
})
export class MasterDataModule { }
