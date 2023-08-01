import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CoreModelsDTOsMasterDataMainTablesSpecialtyDTO } from 'src/api/models';
import { BaseFormComponent } from 'src/app/modules/app-common/utility/base-form-component/base-form-component.directive';


type Full_Model = CoreModelsDTOsMasterDataMainTablesSpecialtyDTO; // TODO ha a schedule tempalte backand át lesz dolgozva akkor ez a típus is változni fog

export type FormModel = {
    selectedSpecialities: NonNullable<Full_Model>[];
};

@Component({
    selector: 'app-schedule-planner-modal-specialty-form',
    templateUrl: './schedule-planner-modal-specialty-form.component.html',
    styleUrls: ['./schedule-planner-modal-specialty-form.component.scss']
})
export class SchedulePlannerModalSpecialtyFormComponent extends BaseFormComponent<Full_Model> {

    @Input() allSelected: Array<Full_Model> = [];

    public errorResourceKeyPrefix = "schedule.planner.filter.specialty.form.errors";

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
        return {
            specialtyId: value.specialtyId,
            isHide: false
        };
    }
}
