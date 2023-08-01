import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseFormComponent } from 'src/app/modules/app-common/utility/base-form-component/base-form-component.directive';
import { UnArray } from 'src/app/modules/core/utility/types/un-array';
import { Clinic } from 'src/app/modules/feature/master-data/clinics/models/clinic.model';
import { ScheduleTemplateSummary } from '../../../models/schedule-template-summary.model';


export type FormModel = {
    selectedClinics: NonNullable<Clinic>[];
}

@Component({
    selector: 'app-schedule-template-clinic-form',
    templateUrl: './schedule-template-clinic-form.component.html',
    styleUrls: ['./schedule-template-clinic-form.component.scss']
})
export class ScheduleTemplateClinicFormComponent extends BaseFormComponent<Clinic> {

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
        return {
            // TODO ha a schedule tempalte backand át lesz dolgozva akkor ez a típus is változni fog
        } as UnArray<ScheduleTemplateSummary["clinicDataList"]>;
    }
}
