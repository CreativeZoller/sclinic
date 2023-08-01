import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CoreModelsResourceManagementPlannedScheduleGetPlannedScheduleByConditionRequest } from 'src/api/models';
import { ResourceManagementService } from 'src/api/services';
import { BaseFormComponent } from 'src/app/modules/app-common/utility/base-form-component/base-form-component.directive';
import { PlannedSchedule } from '../../models/planned-schedule.model';
import { PublishedSchedule } from '../../models/published-schedule.model';
import { filter, map, switchMap } from 'rxjs';


type Form_Model = CoreModelsResourceManagementPlannedScheduleGetPlannedScheduleByConditionRequest;

@UntilDestroy()
@Component({
    selector: 'app-schedule-planner-filter',
    templateUrl: './schedule-planner-filter.component.html',
    styleUrls: ['./schedule-planner-filter.component.scss']
})
export class SchedulePlannerFilterComponent extends BaseFormComponent<PlannedSchedule> {
    @Output() public plannedScheduleList: EventEmitter<PlannedSchedule[]> = new EventEmitter<PlannedSchedule[]>();
    @Output() public publishedScheduleList: EventEmitter<PublishedSchedule[]> = new EventEmitter<PublishedSchedule[]>();
    @Output() public filteredMedicalEmployeeIds: EventEmitter<Array<Number>> = new EventEmitter<Array<Number>>();
    @Output() public filteredClinicIds: EventEmitter<Array<Number>> = new EventEmitter<Array<Number>>();

    private resourceMenegmentService = inject(ResourceManagementService);

    public errorResourceKeyPrefix: string;

    public form: FormGroup = new FormGroup({
        medicalEmployeeIdList: new FormControl<Form_Model["medicalEmployeeIdList"]>([], {nonNullable: true, validators: [] }),
        specialtyIdList: new FormControl<Form_Model["specialtyIdList"]>([], {nonNullable: true, validators: [] }),
        startDate: new FormControl<Form_Model["startDate"]>(undefined, {nonNullable: true, validators: [] }),
        endDate: new FormControl<Form_Model["endDate"]>(undefined, {nonNullable: true, validators: [] }),
        clinicIdList: new FormControl<Form_Model["clinicIdList"]>([], {nonNullable: true, validators: [] }),
    });

    getData(): void {
        this.filteredClinicIds.emit(this.form.value.clinicIdList);
        this.filteredMedicalEmployeeIds.emit(this.form.value.medicalEmployeeIdList);
        const filterData = {
            ...this.form.value,
            needBookingArea: true,
            needSpecialty: true,
            needSpecialtyData: true,
            needMedicalEmployee: true,
            needMedicalEmployeeData: true,
            needPartner: true,
            needPartnerData: true,
            needClinic: true,
            needRoom: true
        };

        this.resourceMenegmentService.plannedScheduleGetPlannedScheduleByConditionPost(filterData).pipe(
            untilDestroyed(this),
            switchMap(response => {
                return this.resourceMenegmentService.publishedScheduleGetPublishedScheduleByConditionPost(filterData).pipe(
                    untilDestroyed(this),
                    map(res => {
                        this.publishedScheduleList.emit(res.publishedScheduleList)
                        return response;
                    })
                );
            })
        ).subscribe(res => {
            this.plannedScheduleList.emit(res.plannedScheduleList);
        });
    }
}
