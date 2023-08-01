import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable, map, of, shareReplay } from 'rxjs';
import { TableHeader } from 'src/app/components/table/table/table-header';
import { ListHandlerCallbackData } from 'src/app/modules/app-common/list/components/list/list.component';
import { SkipSettingValueAccessorProviders } from 'src/app/modules/app-common/utility/base-control-value-acessor/base-control-value-acessor.directive';
import { BaseListFieldComponent } from 'src/app/modules/app-common/utility/base-list-field/base-list-field.directive';
import { MedicalEmployeeXContact } from 'src/app/modules/feature/master-data/medical-employee/models/medical-employee-x-contact.model';
import { MedicalEmployee } from 'src/app/modules/feature/master-data/medical-employee/models/medical-employee.model';
import { ContactTypeEnum } from 'src/api/enums';
import { MedicalalEmployeeXService } from 'src/app/modules/feature/schedule/template/models/medical-employee-x-service.model';
import { FormModel } from '../schedule-planner-assistant-form/schedule-planner-assistant-form.component';
import { PlannedSchedule } from '../../../../models/planned-schedule.model';
import { UnArray } from 'src/app/modules/core/utility/types/un-array';


type Full_Model = MedicalEmployee;

@Component({
    selector: 'app-schedule-planner-assistant-list-field',
    templateUrl: './schedule-planner-assistant-list-field.component.html',
    styleUrls: ['./schedule-planner-assistant-list-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class SchedulePlannerAssistantListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "schedule.planner.modal.list.assistant";
    public tableIdProperty = "medicalEmployeeId";
    public tableTitleProperty = "schedule.planner.modal.list.assistant";

    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("schedule.planner.modal.list.titleType"),
            attributeName: "dC_TitleType.name"
        },
        {
            name: this.resourceService.resolve("schedule.planner.modal.list.lastName"),
            attributeName: "lastName"
        },
        {
            name: this.resourceService.resolve("schedule.planner.modal.list.firstName"),
            attributeName: "firstName"
        },
        {
            name: this.resourceService.resolve("schedule.planner.modal.list.phone"),
            attributeName: "medicalEmployeeXContact",
            formatterFn: (v) => v.find((f: MedicalEmployeeXContact) => f.dC_ContactTypeId === ContactTypeEnum.PHONE_NUMBER_1)?.contactValue ?? ''
        },
        {
            name: this.resourceService.resolve("schedule.planner.modal.list.shiftStart"),
            attributeName: "shiftStart"
        },
        {
            name: this.resourceService.resolve("schedule.planner.modal.list.shiftEnd"),
            attributeName: "shiftEnd"
        }
    ];

    public allSelected$ = this.getValue$().pipe(
        shareReplay(1),
        map(value => value?.map((obj: UnArray<PlannedSchedule["plannedScheduleXMedicalEmployee"]>) => obj.medicalEmployeeData ?? {}) ?? [])

    );

    public valueToFormValue = (value: any[]) => value.map(v => v.medicalEmployeeData);

    public handleSave$: (data: ListHandlerCallbackData<unknown, FormModel>) => Observable<any> = ({formValue}) => {
        this.listFieldComponent.changeValue(
            (formValue?.selectedEmployees ?? [])
        );
        return of(null);
    }
}
