import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseFormComponent } from 'src/app/modules/app-common/utility/base-form-component/base-form-component.directive';
import { ScheduleTemplateItemXSpecialty } from '../../../models/schedule-tempalte-item-x-specialty.model';


type Full_Model = ScheduleTemplateItemXSpecialty; // TODO ha a schedule tempalte backand át lesz dolgozva akkor ez a típus is változni fog

export type FormModel = {
    selectedSpecialities: NonNullable<Full_Model>;
};

@Component({
    selector: 'app-schedule-template-specialty-form',
    templateUrl: './schedule-template-specialty-form.component.html',
    styleUrls: ['./schedule-template-specialty-form.component.scss']
})
export class ScheduleTemplateSpecialtyFormComponent extends BaseFormComponent<Full_Model> {

    @Input() allSelected: ScheduleTemplateItemXSpecialty = [];

    public errorResourceKeyPrefix = "schedule.template.specialtyForm.errors";

    public form = new FormGroup({
        selectedSpecialities: new FormControl<FormModel["selectedSpecialities"]>([], { nonNullable: true, validators: []}),
    });

    public setFormValue() {
        this.form.reset();
        this.form.patchValue({
            selectedSpecialities: this.allSelected
        });
    }

    public formValueToRequestValue(_value: any): any {
        const value = _value as Full_Model;
        return {  } as Full_Model; // TODO ha a schedule tempalte backand át lesz dolgozva akkor ez a típus is változni fog
    }
}
