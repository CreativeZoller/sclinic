import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseFormComponent } from 'src/app/modules/app-common/utility/base-form-component/base-form-component.directive';
import { UnArray } from 'src/app/modules/core/utility/types/un-array';
import { MedicalEmployee } from 'src/app/modules/feature/master-data/medical-employee/models/medical-employee.model';
import { GeneratePlannedScheduleRequest } from '../../../models/generate-planned-schedule.model';


export type FormModel = {
    selectedEmployees: NonNullable<MedicalEmployee>[];
}

@Component({
    selector: 'app-schedule-generator-employee-form',
    templateUrl: './schedule-generator-employee-form.component.html',
    styleUrls: ['./schedule-generator-employee-form.component.scss']
})
export class ScheduleGeneratorEmployeeFormComponent extends BaseFormComponent<MedicalEmployee> {

    @Input() allSelected: MedicalEmployee[] = [];

    public errorResourceKeyPrefix = "schedule.generator.employee.form.errors";

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
        return value.medicalEmployeeId as UnArray<GeneratePlannedScheduleRequest["medicalEmployeeIdList"]>;
    }
}
