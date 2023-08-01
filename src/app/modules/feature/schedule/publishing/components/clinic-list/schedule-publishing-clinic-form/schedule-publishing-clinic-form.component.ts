import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseFormComponent } from 'src/app/modules/app-common/utility/base-form-component/base-form-component.directive';
import { UnArray } from 'src/app/modules/core/utility/types/un-array';
import { Clinic } from 'src/app/modules/feature/master-data/clinics/models/clinic.model';
import { PublishingRequestBody } from '../../../models/publishing-request-body.model';


export type FormModel = {
    selectedClinics: NonNullable<Clinic>[];
}

@Component({
    selector: 'app-schedule-publishing-clinic-form',
    templateUrl: './schedule-publishing-clinic-form.component.html',
    styleUrls: ['./schedule-publishing-clinic-form.component.scss']
})
export class SchedulePublishingClinicFormComponent extends BaseFormComponent<Clinic> {

    @Input() allSelected: Clinic[] = [];

    public errorResourceKeyPrefix = "schedule.publishing.form.errors";

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
        return value.clinicId as UnArray<PublishingRequestBody["clinicId"]>;
    }
}
