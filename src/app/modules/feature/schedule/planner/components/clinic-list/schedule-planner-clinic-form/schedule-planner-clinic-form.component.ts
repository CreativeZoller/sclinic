import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseFormComponent } from 'src/app/modules/app-common/utility/base-form-component/base-form-component.directive';
import { UnArray } from 'src/app/modules/core/utility/types/un-array';
import { Clinic } from 'src/app/modules/feature/master-data/clinics/models/clinic.model';
import { PlannedScheduleRequest } from '../../../models/planned-schedule-request.model';


export type FormModel = {
    selectedClinics: NonNullable<Clinic>[];
}

@Component({
    selector: 'app-schedule-planner-clinic-form',
    templateUrl: './schedule-planner-clinic-form.component.html',
    styleUrls: ['./schedule-planner-clinic-form.component.scss']
})
export class SchedulePlannerClinicFormComponent extends BaseFormComponent<Clinic> {

    @Input() allSelected: Clinic[] = [];

    public errorResourceKeyPrefix = "schedule.planner.filter.clinic.form.errors";

    public form = new FormGroup({
        selectedClinics: new FormControl<FormModel["selectedClinics"]>([], { nonNullable: true, validators: []}),
    });

    public setFormValue() {
        this.form.reset();
        this.form.patchValue({
            selectedClinics: this.allSelected
        });
    }

    public formValueToRequestValue(_value: any): any {
        const value = _value as Clinic;
        return value.clinicId as UnArray<PlannedScheduleRequest["clinicIdList"]>;
    }
}
