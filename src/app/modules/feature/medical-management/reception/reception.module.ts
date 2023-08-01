import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../shared/shared.module";
import { PatientModule } from "../../master-data/patients/patient.module";
import { ReceptionMainComponent } from "./components/main/reception-main.component";
import { ReceptionPatientManagementComponent } from "./components/patient-management/reception-patient-management.component";
import { ReceptionPriceListModalComponent } from "./components/price/list-modal/reception-price-list-modal.component";
import { ReceptionPriceOfServiceListComponent } from "./components/price/of-service-list/reception-price-of-service-list.component";
import { ReceptionPriceOfServiceSubPackageListComponent } from "./components/price/of-service-sub-package-list/reception-price-of-service-sub-package-list.component";
import { ReceptionPriceOfServicePackageListComponent } from "./components/price/of-service-package-list/reception-price-of-service-package-list.component";
import { ReceptionPatientArrivalManagementFormComponent } from "./components/patient-arrival-management/form/reception-patient-arrival-management-form.component";
import { ReceptionPatientArrivalManagementFormModalComponent } from "./components/patient-arrival-management/form-modal/reception-patient-arrival-management-form-modal.component";
import { ReceptionPatientFormModalComponent } from "./components/patient/form-modal/reception-patient-form-modal.component";
import { ReceptionPatientArrivalManagementStatementListComponent } from "./components/patient-arrival-management/statement/list/reception-patient-arrival-management-statement-list.component";
import { ReceptionPatientArrivalManagementAppointmentServiceListFieldComponent } from "./components/patient-arrival-management/appointment-service/list-field/reception-patient-arrival-management-appointment-service-list-field.component";
import { ReceptionPatientArrivalManagementAppointmentServiceFormComponent } from "./components/patient-arrival-management/appointment-service/form/reception-patient-arrival-management-appointment-service-form.component";
import { ReceptionPatientArrivalManagementAppointmentServiceCostBearerListFieldComponent } from "./components/patient-arrival-management/appointment-service/cost-bearer/list-field/reception-patient-arrival-management-appointment-service-cost-bearer-list-field.component";
import { ReceptionPatientArrivalManagementAppointmentServiceCostBearerFormComponent } from "./components/patient-arrival-management/appointment-service/cost-bearer/form/reception-patient-arrival-management-appointment-service-cost-bearer-form.component";


@NgModule({
    declarations: [
        ReceptionMainComponent,
        ReceptionPriceListModalComponent,
        ReceptionPriceOfServiceListComponent,
        ReceptionPriceOfServiceSubPackageListComponent,
        ReceptionPriceOfServicePackageListComponent,
        ReceptionPatientManagementComponent,
        ReceptionPatientArrivalManagementFormComponent,
        ReceptionPatientArrivalManagementFormModalComponent,
        ReceptionPatientFormModalComponent,
        ReceptionPatientArrivalManagementStatementListComponent,
        ReceptionPatientArrivalManagementAppointmentServiceListFieldComponent,
        ReceptionPatientArrivalManagementAppointmentServiceFormComponent,
        ReceptionPatientArrivalManagementAppointmentServiceCostBearerListFieldComponent,
        ReceptionPatientArrivalManagementAppointmentServiceCostBearerFormComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        PatientModule,
    ],
    exports: [
        ReceptionMainComponent,
        ReceptionPriceListModalComponent,
        ReceptionPriceOfServiceListComponent,
        ReceptionPriceOfServiceSubPackageListComponent,
        ReceptionPriceOfServicePackageListComponent,
        ReceptionPatientManagementComponent,
        ReceptionPatientArrivalManagementFormComponent,
        ReceptionPatientArrivalManagementFormModalComponent,
        ReceptionPatientFormModalComponent,
        ReceptionPatientArrivalManagementStatementListComponent,
        ReceptionPatientArrivalManagementAppointmentServiceListFieldComponent,
        ReceptionPatientArrivalManagementAppointmentServiceFormComponent,
        ReceptionPatientArrivalManagementAppointmentServiceCostBearerListFieldComponent,
        ReceptionPatientArrivalManagementAppointmentServiceCostBearerFormComponent,
    ],
})
export class ReceptionModule { }
