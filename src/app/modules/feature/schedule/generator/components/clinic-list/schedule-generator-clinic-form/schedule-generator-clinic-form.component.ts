import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseFormComponent } from 'src/app/modules/app-common/utility/base-form-component/base-form-component.directive';
import { UnArray } from 'src/app/modules/core/utility/types/un-array';
import { Clinic } from 'src/app/modules/feature/master-data/clinics/models/clinic.model';
import { GeneratePlannedScheduleRequest } from '../../../models/generate-planned-schedule.model';


export type FormModel = {
    selectedClinics: NonNullable<Clinic>[];
}

@Component({
    selector: 'app-schedule-generator-clinic-form',
    templateUrl: './schedule-generator-clinic-form.component.html',
    styleUrls: ['./schedule-generator-clinic-form.component.scss']
})
export class ScheduleGeneratorClinicFormComponent extends BaseFormComponent<Clinic> {

    @Input() allSelected: Clinic[] = [];

    public errorResourceKeyPrefix = "service.speciality.form.errors";

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
        return value.clinicId as UnArray<GeneratePlannedScheduleRequest["clinicIdList"]>;
    }
}
