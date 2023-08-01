import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { MedicalEmployeeXContractScheduleEntry } from "../../../../models/medical-employee-x-contract-schedule-entry.model";


type Full_Model = MedicalEmployeeXContractScheduleEntry;

@UntilDestroy()
@Component({
    selector: "app-medical-employee-contract-schedule-entry-form",
    templateUrl: "./medical-employee-contract-schedule-entry-form.component.html",
    styleUrls: ["./medical-employee-contract-schedule-entry-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalEmployeeContractScheduleEntryFormComponent extends BaseFormComponent<Full_Model> {

    public errorResourceKeyPrefix = "medical.employee.contract.schedule.entry.form.errors";

    protected dC_ScheduleSpecialTypeOptions: typeof this.initData.dC_ScheduleSpecialTypeList = [
        {
            value: null as any,
            dto: null as any,
            name: "Műszak",
        },
        ...this.initData.dC_ScheduleSpecialTypeList
    ];

    public form = new FormGroup({
        dC_ScheduleSpecialTypeId: new FormControl<MedicalEmployeeXContractScheduleEntry["dC_ScheduleSpecialTypeId"]>(undefined, { nonNullable: true, validators: []}),
        startTime: new FormControl<MedicalEmployeeXContractScheduleEntry["startTime"]>(undefined, { nonNullable: true, validators: [Validators.required]}),
        endTime: new FormControl<MedicalEmployeeXContractScheduleEntry["endTime"]>(undefined, { nonNullable: true, validators: [Validators.required]}),
        amount: new FormControl<MedicalEmployeeXContractScheduleEntry["amount"]>(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)]}),
    });
}
