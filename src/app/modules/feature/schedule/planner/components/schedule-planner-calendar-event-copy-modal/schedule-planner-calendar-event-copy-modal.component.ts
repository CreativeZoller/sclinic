import { Component, Input, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseFormComponent } from 'src/app/modules/app-common/utility/base-form-component/base-form-component.directive';
import { ResourceService } from 'src/app/modules/core/resource/services/resource.service';
import { untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, of } from 'rxjs';
import { ResourceManagementService } from 'src/api/services';
import { PlannedSchedule } from '../../models/planned-schedule.model';


@Component({
    selector: 'app-schedule-planner-calendar-event-copy-modal',
    templateUrl: './schedule-planner-calendar-event-copy-modal.component.html',
    styleUrls: ['./schedule-planner-calendar-event-copy-modal.component.scss']
})
export class SchedulePlannerCalendarEventCopyModalComponent extends BaseFormComponent<any> {

    @Input() set plannedSchedule(value: PlannedSchedule) {
        this.setFormValue({
            medicalEmployee: value.medicalEmployeeData?.fullName,
            specialty: value.plannedScheduleXSpecialty?.map(x => x.specialtyData?.specialtyName).join(', '),
        });
        this._plannedSchedule = value;
    }

    private _plannedSchedule: PlannedSchedule;
    private resourceMenegmentService = inject(ResourceManagementService);
    private toastrService = inject(ToastrService);
    private resourceService = inject(ResourceService);

    public errorResourceKeyPrefix: string;
    public modalTitle = this.resourceService.resolve('schedule.planner.modal.copy.title');
    public form = new FormGroup({
        medicalEmployee: new FormControl({value: undefined, disabled: true}, { nonNullable: true, validators: [] }),
        specialty: new FormControl({value: undefined, disabled: true}, { nonNullable: true, validators: [] }),
        aWeek: new FormControl(false, { nonNullable: true, validators: [] }),
        bWeek: new FormControl(false, { nonNullable: true, validators: [] }),
        cWeek: new FormControl(false, { nonNullable: true, validators: [] }),
        dWeek: new FormControl(false, { nonNullable: true, validators: [] }),
        monday: new FormControl(false, { nonNullable: true, validators: [] }),
        tuesday: new FormControl(false, { nonNullable: true, validators: [] }),
        wednesday: new FormControl(false, { nonNullable: true, validators: [] }),
        thursday: new FormControl(false, { nonNullable: true, validators: [] }),
        friday: new FormControl(false, { nonNullable: true, validators: [] }),
        saturday: new FormControl(false, { nonNullable: true, validators: [] }),
        sunday: new FormControl(false, { nonNullable: true, validators: [] }),
        startDate: new FormControl(undefined, { nonNullable: true, validators: [Validators.required] }),
        endDate: new FormControl(undefined, { nonNullable: true, validators: [Validators.required] }),
        startWeek: new FormControl(undefined, { nonNullable: true, validators: [] }),
        endWeek: new FormControl(undefined, { nonNullable: true, validators: [] }),
    });

    save(): Observable<any> {
        this.form.markAllAsTouched();

        if (!this.form.valid) {
            return of(null);
        }

        const startDate = new Date(this.form.value.startDate ?? '');
        const endDate = new Date(this.form.value.endDate ?? '');
        const plannedScheduleStartDate = new Date(this._plannedSchedule.startDate ?? '');
        const plannedScheduleEndDate = new Date(this._plannedSchedule.endDate ?? '');
        const copiedPlannedSchedules: Array<PlannedSchedule> = [];
        const datesBetween = this.getDatesBetween(startDate, endDate);

        datesBetween.forEach(date => {
            if (this.isWeekOfDateChecked(date)) {
                const copiedStartDate = new Date(date);
                const copiedEndDate = new Date(date);
                copiedStartDate.setHours(plannedScheduleStartDate.getHours(), plannedScheduleStartDate.getMinutes());
                copiedEndDate.setHours(plannedScheduleEndDate.getHours(), plannedScheduleEndDate.getMinutes());

                copiedPlannedSchedules.push({
                    ...this._plannedSchedule,
                    plannedScheduleId: 0,
                    startDate: copiedStartDate.toISOString(),
                    endDate: copiedEndDate.toISOString(),
                });

            }
        });


        return this.resourceMenegmentService.plannedScheduleCreateOrUpdatePlannedSchedulePost({plannedScheduleList: copiedPlannedSchedules})
            .pipe(untilDestroyed(this), map(res => {
                if (res.errorMessage === null) {
                    this.toastrService.success(this.resourceService.resolve('schedule.planner.modal.form.success.delete'));
                }

                return res;
            }))

    }

    private isWeekOfDateChecked(date: Date): boolean {
        const daysOfWeek = [
            this.form.value.sunday, // Date class starts from Sunday
            this.form.value.monday,
            this.form.value.tuesday,
            this.form.value.wednesday,
            this.form.value.thursday,
            this.form.value.friday,
            this.form.value.saturday,
        ];

        const dayIndex = date.getDay();

        return daysOfWeek[dayIndex] ?? false;
    }

    private getDatesBetween(startDate: Date, endDate: Date): Date[] {
        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        return Array.from({ length: days + 1 }, (_, index) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + index);
            return date;
        });
    }
}