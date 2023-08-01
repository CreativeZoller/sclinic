import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { ClinicsModule } from "../master-data/clinics/clinics.module";
import { ScheduleGeneratorClinicFormComponent } from "./generator/components/clinic-list/schedule-generator-clinic-form/schedule-generator-clinic-form.component";
import { ScheduleGeneratorClinicListFieldComponent } from "./generator/components/clinic-list/schedule-generator-clinic-list-field/schedule-generator-clinic-list-field.component";
import { ScheduleGeneratorClinicSelectionListFieldComponent } from "./generator/components/clinic-list/schedule-generator-clinic-selection-list-field/schedule-generator-clinic-selection-list-field.component";
import { ScheduleGeneratorEmployeeFormComponent } from "./generator/components/employee-list/schedule-generator-employee-form/schedule-generator-employee-form.component";
import { ScheduleGeneratorEmployeeListFieldComponent } from "./generator/components/employee-list/schedule-generator-employee-list-field/schedule-generator-employee-list-field.component";
import { ScheduleGeneratorEmployeeSelectionListFieldComponent } from "./generator/components/employee-list/schedule-generator-employee-selection-list-field/schedule-generator-employee-selection-list-field.component";
import { ScheduleGeneratorBookingAreaSelectionListFieldComponent } from "./generator/components/schedule-generator-booking-area/schedule-generator-booking-area-selection-list-field.component";
import { ScheduleGeneratorComponent } from './generator/components/schedule-generator/schedule-generator.component';
import { SchedulePlannerClinicFormComponent } from "./planner/components/clinic-list/schedule-planner-clinic-form/schedule-planner-clinic-form.component";
import { SchedulePlannerClinicListFieldComponent } from "./planner/components/clinic-list/schedule-planner-clinic-list-field/schedule-planner-clinic-list-field.component";
import { SchedulePlannerClinicSelectionListFieldComponent } from "./planner/components/clinic-list/schedule-planner-clinic-selection-list-field/schedule-planner-clinic-selection-list-field.component";
import { SchedulePlannerEmployeeFormComponent } from "./planner/components/employee-list/schedule-planner-employee-form/schedule-planner-employee-form.component";
import { SchedulePlannerEmployeeListFieldComponent } from "./planner/components/employee-list/schedule-planner-employee-list-field/schedule-planner-employee-list-field.component";
import { SchedulePlannerEmployeeSelectionListFieldComponent } from "./planner/components/employee-list/schedule-planner-employee-selection-list-field/schedule-planner-employee-selection-list-field.component";
import { SchedulePlannerCalendarEventCopyModalComponent } from './planner/components/schedule-planner-calendar-event-copy-modal/schedule-planner-calendar-event-copy-modal.component';
import { SchedulePlannerCalendarEventModalComponent } from './planner/components/schedule-planner-calendar-event-modal/schedule-planner-calendar-event-modal.component';
import { SchedulePlannerCalendarComponent } from './planner/components/schedule-planner-calendar/schedule-planner-calendar.component';
import { SchedulePlannerAssistantFormComponent } from "./planner/components/schedule-planner-event-modal-lists/assistant-list/schedule-planner-assistant-form/schedule-planner-assistant-form.component";
import { SchedulePlannerAssistantListFieldComponent } from "./planner/components/schedule-planner-event-modal-lists/assistant-list/schedule-planner-assistant-list-field/schedule-planner-assistant-list-field.component";
import { SchedulePlannerAssistantSelectionListFieldComponent } from "./planner/components/schedule-planner-event-modal-lists/assistant-list/schedule-planner-assistant-selection-list-field/schedule-planner-assistant-selection-list-field.component";
import { SchedulePlannerDoctorFormComponent } from "./planner/components/schedule-planner-event-modal-lists/doctor-list/schedule-planner-doctor-form/schedule-planner-doctor-form.component";
import { SchedulePlannerDoctorListFieldComponent } from "./planner/components/schedule-planner-event-modal-lists/doctor-list/schedule-planner-doctor-list-field/schedule-planner-doctor-list-field.component";
import { SchedulePlannerDoctorSelectionListFieldComponent } from "./planner/components/schedule-planner-event-modal-lists/doctor-list/schedule-planner-doctor-selection-list-field/schedule-planner-doctor-selection-list-field.component";
import { SchedulePlannerModalSpecialtyFormComponent } from "./planner/components/schedule-planner-event-modal-lists/speciality-list/schedule-planner-modal-specialty-form/schedule-planner-modal-specialty-form.component";
import { SchedulePlannerModalSpecialtyListFieldComponent } from "./planner/components/schedule-planner-event-modal-lists/speciality-list/schedule-planner-modal-specialty-list/schedule-planner-modal-specialty-list-field.component";
import { SchedulePlannerModalSpecialtySelectionListFieldComponent } from "./planner/components/schedule-planner-event-modal-lists/speciality-list/schedule-planner-modal-specialty-selection-list/schedule-planner-modal-specialty-selection-list-field.component";
import { SchedulePlannersubStituteDoctorFormComponent } from "./planner/components/schedule-planner-event-modal-lists/substitute-doctor-list/schedule-planner-substitute-doctor-form/schedule-planner-substitute-doctor-form.component";
import { SchedulePlannerSubstituteDoctorListFieldComponent } from "./planner/components/schedule-planner-event-modal-lists/substitute-doctor-list/schedule-planner-substitute-doctor-list-field/schedule-planner-substitute-doctor-list-field.component";
import { SchedulePlannerSubstituteSelectionListFieldComponent } from "./planner/components/schedule-planner-event-modal-lists/substitute-doctor-list/schedule-planner-substitute-selection-list-field/schedule-planner-substitute-selection-list-field.component";
import { SchedulePlannerFilterComponent } from "./planner/components/schedule-planner-filter/schedule-planner-filter.component";
import { SchedulePlannerComponent } from './planner/components/schedule-planner/schedule-planner.component';
import { SchedulePlannerSpecialtyFormComponent } from "./planner/components/speciality-list/schedule-planner-specialty-form/schedule-planner-specialty-form.component";
import { SchedulePlannerSpecialtyListFieldComponent } from "./planner/components/speciality-list/schedule-planner-specialty-list/schedule-planner-specialty-list-field.component";
import { SchedulePlannerSpecialtySelectionListFieldComponent } from "./planner/components/speciality-list/schedule-planner-specialty-selection-list/schedule-planner-specialty-selection-list-field.component";
import { SchedulePublishingClinicFormComponent } from "./publishing/components/clinic-list/schedule-publishing-clinic-form/schedule-publishing-clinic-form.component";
import { SchedulePublishingClinicListFieldComponent } from "./publishing/components/clinic-list/schedule-publishing-clinic-list-field/schedule-publishing-clinic-list-field.component";
import { SchedulePublishingClinicSelectionListFieldComponent } from "./publishing/components/clinic-list/schedule-publishing-clinic-selection-list-field/schedule-publishing-clinic-selection-list-field.component";
import { SchedulePublishingEmployeeFormComponent } from "./publishing/components/employee-list/schedule-publishing-employee-form/schedule-publishing-employee-form.component";
import { SchedulePublishingEmployeeListFieldComponent } from "./publishing/components/employee-list/schedule-publishing-employee-list-field/schedule-publishing-employee-list-field.component";
import { SchedulePublishingEmployeeSelectionListFieldComponent } from "./publishing/components/employee-list/schedule-publishing-employee-selection-list-field/schedule-publishing-employee-selection-list-field.component";
import { SchedulePublishingComponent } from "./publishing/components/schedule-publishing/schedule-publishing.component";
import { ScheduleTemplateClinicFormComponent } from './template/components/clinic-list/schedule-template-clinic-form/schedule-template-clinic-form.component';
import { ScheduleTemplateClinicListComponent } from './template/components/clinic-list/schedule-template-clinic-list/schedule-template-clinic-list.component';
import { ScheduleTemplateClinicSelectionListComponent } from './template/components/clinic-list/schedule-template-clinic-selection-list/schedule-template-clinic-selection-list.component';
import { ScheduleTemplateEmployeeFormComponent } from './template/components/employee-list/schedule-template-employee-form/schedule-template-employee-form.component';
import { ScheduleTemplateEmployeeListComponent } from './template/components/employee-list/schedule-template-employee-list/schedule-template-employee-list.component';
import { ScheduleTemplateEmployeeSelectionListComponent } from './template/components/employee-list/schedule-template-employee-selection-list/schedule-template-employee-selection-list.component';
import { ScheduleTemplateFormComponent } from './template/components/form/schedule-template-form.component';
import { ScheduleTemplateListComponent } from './template/components/list/schedule-template-list.component';
import { ScheduleTemplateSpecialtyFormComponent } from './template/components/speciality-list/schedule-template-specialty-form/schedule-template-specialty-form.component';
import { ScheduleTemplateSpecialtyListComponent } from './template/components/speciality-list/schedule-template-specialty-list/schedule-template-specialty-list.component';
import { ScheduleTemplateSpecialtySelectionListComponent } from './template/components/speciality-list/schedule-template-specialty-selection-list/schedule-template-specialty-selection-list.component';
import { SchedulePlannerModalSpecialTimeFormComponent } from "./planner/components/schedule-planner-event-modal-lists/special-time-list/schedule-planner-modal-special-time-form/schedule-planner-modal-special-time-form.component";
import { SchedulePlannerModalSpecialTimeListFieldComponent } from "./planner/components/schedule-planner-event-modal-lists/special-time-list/schedule-planner-modal-special-time-list/schedule-planner-modal-special-time-list-field.component";



@NgModule({
    declarations: [
        ScheduleTemplateListComponent,
        ScheduleTemplateFormComponent,
        ScheduleTemplateClinicListComponent,
        ScheduleTemplateClinicFormComponent,
        ScheduleTemplateClinicSelectionListComponent,
        ScheduleTemplateSpecialtyListComponent,
        ScheduleTemplateSpecialtyFormComponent,
        ScheduleTemplateSpecialtySelectionListComponent,
        ScheduleTemplateEmployeeListComponent,
        ScheduleTemplateEmployeeFormComponent,
        ScheduleTemplateEmployeeSelectionListComponent,
        SchedulePlannerComponent,
        SchedulePlannerCalendarComponent,
        ScheduleGeneratorComponent,
        ScheduleGeneratorClinicSelectionListFieldComponent,
        ScheduleGeneratorClinicFormComponent,
        ScheduleGeneratorClinicListFieldComponent,
        ScheduleGeneratorEmployeeSelectionListFieldComponent,
        ScheduleGeneratorEmployeeFormComponent,
        ScheduleGeneratorEmployeeListFieldComponent,
        ScheduleGeneratorBookingAreaSelectionListFieldComponent,
        SchedulePlannerComponent,
        SchedulePlannerFilterComponent,
        SchedulePlannerEmployeeFormComponent,
        SchedulePlannerEmployeeListFieldComponent,
        SchedulePlannerEmployeeSelectionListFieldComponent,
        SchedulePlannerSpecialtyFormComponent,
        SchedulePlannerSpecialtyListFieldComponent,
        SchedulePlannerSpecialtySelectionListFieldComponent,
        SchedulePlannerClinicSelectionListFieldComponent,
        SchedulePlannerClinicListFieldComponent,
        SchedulePlannerClinicFormComponent,
        SchedulePlannerCalendarEventModalComponent,
        SchedulePlannerDoctorFormComponent,
        SchedulePlannerDoctorListFieldComponent,
        SchedulePlannerDoctorSelectionListFieldComponent,
        SchedulePlannerAssistantFormComponent,
        SchedulePlannerAssistantListFieldComponent,
        SchedulePlannerAssistantSelectionListFieldComponent,
        SchedulePlannerSubstituteDoctorListFieldComponent,
        SchedulePlannerSubstituteSelectionListFieldComponent,
        SchedulePlannersubStituteDoctorFormComponent,
        SchedulePlannerCalendarEventModalComponent,
        SchedulePlannerModalSpecialtyFormComponent,
        SchedulePlannerModalSpecialtyListFieldComponent,
        SchedulePlannerModalSpecialtySelectionListFieldComponent,
        SchedulePlannerCalendarEventCopyModalComponent,
        SchedulePublishingComponent,
        SchedulePublishingClinicFormComponent,
        SchedulePublishingClinicSelectionListFieldComponent,
        SchedulePublishingClinicListFieldComponent,
        SchedulePublishingEmployeeSelectionListFieldComponent,
        SchedulePublishingEmployeeListFieldComponent,
        SchedulePublishingEmployeeFormComponent,
        SchedulePlannerModalSpecialTimeFormComponent,
        SchedulePlannerModalSpecialTimeListFieldComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        ClinicsModule
    ]
})
export class ScheduleModule { }
