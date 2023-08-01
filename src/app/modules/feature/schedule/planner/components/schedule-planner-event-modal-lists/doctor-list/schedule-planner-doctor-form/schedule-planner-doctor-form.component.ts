import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MedicalEmployeeTypeEnum } from 'src/api/enums';
import { BaseFormComponent } from 'src/app/modules/app-common/utility/base-form-component/base-form-component.directive';
import { UnArray } from 'src/app/modules/core/utility/types/un-array';
import { MedicalEmployee } from 'src/app/modules/feature/master-data/medical-employee/models/medical-employee.model';
import { SchedulePlannerInitPageResolver } from '../../../../resolver/schedule-planner-init-page.resolver';


export type FormModel = {
    selectedEmployees: NonNullable<MedicalEmployee>[];
}

@Component({
    selector: 'app-schedule-planner-doctor-form',
    templateUrl: './schedule-planner-doctor-form.component.html',
    styleUrls: ['./schedule-planner-doctor-form.component.scss']
})
export class SchedulePlannerDoctorFormComponent extends BaseFormComponent<MedicalEmployee> {

    @Input() allSelected: MedicalEmployee[] = [];

    public errorResourceKeyPrefix = "schedule.planner.filter.employee.form.errors";

    public form = new FormGroup({
        selectedEmployees: new FormControl<FormModel["selectedEmployees"]>([], { nonNullable: true, validators: []}),
    });

    public setFormValue() {
        this.form.reset();
        this.form.patchValue({
            selectedEmployees: this.allSelected
        });
    }

    public formValueToRequestValue(_value: any): any {
        const value = _value as MedicalEmployee;
        return {
            medicalEmployeeId: value.medicalEmployeeId,
            dC_MedicalEmployeeScheduleTypeId: MedicalEmployeeTypeEnum.DOCTOR
        };
    }
}
