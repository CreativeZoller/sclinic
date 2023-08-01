import { Component } from '@angular/core';
import { PlannedSchedule } from '../../models/planned-schedule.model';
import { PublishedSchedule } from '../../models/published-schedule.model';


@Component({
    selector: 'app-schedule-planner',
    templateUrl: './schedule-planner.component.html',
    styleUrls: ['./schedule-planner.component.scss']
})
export class SchedulePlannerComponent {
    public plannedScheduleList: PlannedSchedule[] = [];
    public publishedScheduleList: PublishedSchedule[] = [];
    public medicalEmployeeIds: Array<Number> = [];
    public clinicIds: Array<Number> = [];

    setPublishedScheduleList(data: PublishedSchedule[]): void {
        this.publishedScheduleList = data;
    }

    setPlannedScheduleList(data: PlannedSchedule[]): void {
        this.plannedScheduleList = data;
    }

    setClinicIds(clinicIds: Array<Number>): void {
        this.clinicIds = clinicIds;
    }

    setMedicalEmployeeIds(medicalEmployeeIds: Array<Number>): void {
        this.medicalEmployeeIds = medicalEmployeeIds;
    }
}
