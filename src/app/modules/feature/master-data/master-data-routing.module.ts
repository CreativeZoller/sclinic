import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DOCUMENT_TEMPLATES_ROUTE, EMAIL_TEMPLATES_ROUTE, ITEMS_ROUTE, CITIES_ROUTE, LABS_ROUTE, PATIENTS_ROUTE, PARTNERS_ROUTE, SERVICE_PROVIDER_ENTITIES_ROUTE, CLINICS_ROUTE, DOCTORS_ROUTE, ASSISTANTS_ROUTE, DICTIONARY_ENTRIES_ROUTE, SERVICES_ROUTE, SERVICE_PACKAGES_ROUTE, SERVICE_SUB_PACKAGES_ROUTE, PRICE_TABLES_ROUTE, EXPOSURES_ROUTE, JOB_TITLE_ROUTE, FEOR_GROUP_ROUTE } from "../../../app.config";
import { MasterDataModule } from "./master-data.module";
import { ServiceListComponent } from './services/components/list/service-list.component';
import { ServicesInitPageResolver } from "./services/resolvers/services-init-page.resolver";
import { ServiceSubPackageListComponent } from './service-sub-packages/components/list/service-sub-package-list.component';
import { ServiceSubPackagesInitPageResolver } from "./service-sub-packages/resolvers/service-sub-packages-init-page.resolver";
import { ServicePackageListComponent } from './service-packages/components/list/service-package-list.component';
import { ServicePackagesInitPageResolver } from './service-packages/resolvers/service-packages-init-page.resolver';
import { PriceTableListComponent } from './price-tables/components/list/price-table-list.component';
import { PriceTablesInitPageResolver } from "./price-tables/resolvers/price-tables-init-page.resolver";
import { ItemListComponent } from './items/components/list/item-list.component';
import { ItemsInitPageResolver } from "./items/resolvers/items-init-page.resolver";
import { PatientListComponent } from "./patients/components/list/patient-list.component";
import { PatientsInitPageResolver } from "./patients/resolvers/patients-init-page.resolver";
import { PartnerListComponent } from "./partners/components/list/partner-list.component";
import { PartnersInitPageResolver } from "./partners/resolvers/partners-init-page.resolver";
import { DictionaryCategoryListComponent } from './dictionary-categories/components/list/dictionary-category-list.component';
import { DocumentTemplateListComponent } from "./document-templates/components/list/document-template-list.component";
import { DocumentTemplatesInitPageResolver } from "./document-templates/resolvers/document-templates-init-page.resolver";
import { EmailTemplateListComponent } from "./email-templates/components/list/email-template-list.component";
import { EmailTemplatesInitPageResolver } from "./email-templates/resolvers/email-templates-init-page.resolver";
import { ServiceProviderEntityListComponent } from './service-provider-entities/components/list/service-provider-entity-list.component';
import { ServiceProviderEntitiesInitPageResolver } from './service-provider-entities/resolvers/service-provider-entities-init-page.resolver';
import { LabListComponent } from './labs/components/list/lab-list.component';
import { LabsInitPageResolver } from './labs/resolvers/labs-init-page.resolver';
import { CityListComponent } from './cities/components/list/city-list.component';
import { CitiesInitPageResolver } from './cities/resolvers/cities-init-page.resolver';
import { ClinicListComponent } from "./clinics/components/list/clinic-list.component";
import { ClinicsInitPageResolver } from "./clinics/resolvers/clinics-init-page.resolver";
import { DoctorListComponent } from './doctors/components/list/doctor-list.component';
import { AssistantListComponent } from './assistants/components/list/assistant-list.component';
import { MedicalEmployeesInitPageResolver } from './medical-employee/resolvers/medical-employees-init-page.resolver';
import { ExposureListComponent } from './exposure/components/list/exposure-list.component';
import { ExposuresInitPageResolver } from './exposure/resolvers/exposures-init-page.resolver';
import { JobTitleInitPageResolver } from './job/resolvers/job-init-page.resolver';
import { JobTitleListComponent } from './job/components/list/job-title-list.component';
import { HSCOInitPageResolver } from './hsco/resolvers/hsco-init-page.resolver';
import { HSCOListComponent } from './hsco/components/list/hsco-list.component';


const routes: Routes = [
    {
        path: SERVICES_ROUTE,
        component: ServiceListComponent,
        resolve: {
            init: ServicesInitPageResolver,
        },
    },
    {
        path: SERVICE_SUB_PACKAGES_ROUTE,
        component: ServiceSubPackageListComponent,
        resolve: {
            init: ServiceSubPackagesInitPageResolver,
        },
    },
    {
        path: SERVICE_PACKAGES_ROUTE,
        component: ServicePackageListComponent,
        resolve: {
            init: ServicePackagesInitPageResolver,
        },
    },
    {
        path: PRICE_TABLES_ROUTE,
        component: PriceTableListComponent,
        resolve: {
            init: PriceTablesInitPageResolver,
        },
    },
    {
        path: ITEMS_ROUTE,
        component: ItemListComponent,
        resolve: {
            init: ItemsInitPageResolver,
        },
    },
    {
        path: PATIENTS_ROUTE,
        component: PatientListComponent,
        resolve: {
            init: PatientsInitPageResolver,
        },
    },
    {
        path: PARTNERS_ROUTE,
        component: PartnerListComponent,
        resolve: {
            init: PartnersInitPageResolver,
        },
    },
    {
        path: DICTIONARY_ENTRIES_ROUTE,
        component: DictionaryCategoryListComponent,
    },
    {
        path: DOCUMENT_TEMPLATES_ROUTE,
        component: DocumentTemplateListComponent,
        resolve: {
            init: DocumentTemplatesInitPageResolver,
        },
    },
    {
        path: EMAIL_TEMPLATES_ROUTE,
        component: EmailTemplateListComponent,
        resolve: {
            init: EmailTemplatesInitPageResolver,
        },
    },
    {
        path: SERVICE_PROVIDER_ENTITIES_ROUTE,
        component: ServiceProviderEntityListComponent,
        resolve: {
            init: ServiceProviderEntitiesInitPageResolver,
        },
    },
    {
        path: LABS_ROUTE,
        component: LabListComponent,
        resolve: {
            init: LabsInitPageResolver,
        },
    },
    {
        path: CITIES_ROUTE,
        component: CityListComponent,
        resolve: {
            init: CitiesInitPageResolver,
        },
    },
    {
        path: CLINICS_ROUTE,
        component: ClinicListComponent,
        resolve: {
            init: ClinicsInitPageResolver,
        },
    },
    {
        path: DOCTORS_ROUTE,
        component: DoctorListComponent,
        resolve: {
            init: MedicalEmployeesInitPageResolver,
        },
    },
    {
        path: ASSISTANTS_ROUTE,
        component: AssistantListComponent,
        resolve: {
            init: MedicalEmployeesInitPageResolver,
        },
    },
    {
        path: EXPOSURES_ROUTE,
        component: ExposureListComponent,
        resolve: {
            init: ExposuresInitPageResolver,
        },
    },
    {
        path: JOB_TITLE_ROUTE,
        component: JobTitleListComponent,
        resolve: {
            init: JobTitleInitPageResolver,
        },
    },
    {
        path: FEOR_GROUP_ROUTE,
        component: HSCOListComponent,
        resolve: {
            init: HSCOInitPageResolver,
        },
    },
    // TODO partner specifikus expozíciós mátrix... : export const TODO_ROUTE: string = "TODO";
];

@NgModule({
    imports: [
        MasterDataModule,
        RouterModule.forChild(routes),
    ],
    exports: [
        MasterDataModule,
        RouterModule,
    ],
})
export class MasterDataRoutingModule { }
