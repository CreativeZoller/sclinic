import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CoreModelsDTOsMasterDataMainTablesSpecialtyDTO } from 'src/api/models';
import { BaseFormComponent } from 'src/app/modules/app-common/utility/base-form-component/base-form-component.directive';
import { PlannedSchedule } from '../../../../models/planned-schedule.model';


type Full_Model = PlannedSchedule; // TODO ha a schedule tempalte backand át lesz dolgozva akkor ez a típus is változni fog

export type FormModel = PlannedSchedule;

@Component({
    selector: 'app-schedule-planner-modal-special-time-form',
    templateUrl: './schedule-planner-modal-special-time-form.component.html',
    styleUrls: ['./schedule-planner-modal-special-time-form.component.scss']
})
export class SchedulePlannerModalSpecialTimeFormComponent extends BaseFormComponent<Full_Model> {

    public errorResourceKeyPrefix = "schedule.planner.filter.specialty.form.errors";

    public form = new FormGroup({
        startDate: new FormControl<PlannedSchedule["startDate"]>(undefined, {nonNullable: true, validators: [Validators.required]}),
        endDate: new FormControl<PlannedSchedule["endDate"]>(undefined, {nonNullable: true, validators: [Validators.required]}),
        dC_ScheduleSpecialTypeId: new FormControl<PlannedSchedule["dC_ScheduleSpecialTypeId"]>(undefined, {nonNullable: true, validators: [Validators.required]}),
    });

    public formValueToRequestValue(_value: any): any {
        return _value as PlannedSchedule;
    }
}
