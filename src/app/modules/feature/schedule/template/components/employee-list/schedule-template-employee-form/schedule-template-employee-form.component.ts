import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseFormComponent } from 'src/app/modules/app-common/utility/base-form-component/base-form-component.directive';
import { UnArray } from 'src/app/modules/core/utility/types/un-array';
import { MedicalEmployee } from 'src/app/modules/feature/master-data/medical-employee/models/medical-employee.model';
import { ScheduleTemplateSummary } from '../../../models/schedule-template-summary.model';


export type FormModel = {
    selectedEmployees: NonNullable<MedicalEmployee>[];
}

@Component({
    selector: 'app-schedule-template-employee-form',
    templateUrl: './schedule-template-employee-form.component.html',
    styleUrls: ['./schedule-template-employee-form.component.scss']
})
export class ScheduleTemplateEmployeeFormComponent extends BaseFormComponent<MedicalEmployee> {

    @Input() allSelected: MedicalEmployee[] = [];

    public errorResourceKeyPrefix = "service.speciality.form.errors";

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
            // TODO ha a schedule tempalte backand át lesz dolgozva akkor ez a típus is változni fog
        } as UnArray<ScheduleTemplateSummary["employeeDataList"]>;
    }
}
