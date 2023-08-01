import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { Observable, map, of, shareReplay } from 'rxjs';
import { CoreModelsDTOsMasterDataMainTablesSpecialtyDTO } from 'src/api/models';
import { TableHeader } from 'src/app/components/table/table/table-header';
import { CheckboxFieldComponent } from 'src/app/modules/app-common/checkbox-field/components/checkbox-field/checkbox-field.component';
import { ListHandlerCallbackData } from 'src/app/modules/app-common/list/components/list/list.component';
import { SkipSettingValueAccessorProviders } from 'src/app/modules/app-common/utility/base-control-value-acessor/base-control-value-acessor.directive';
import { BaseListFieldComponent } from 'src/app/modules/app-common/utility/base-list-field/base-list-field.directive';
import { PlannedSchedule } from '../../../../models/planned-schedule.model';
import { FormModel } from '../schedule-planner-modal-special-time-form/schedule-planner-modal-special-time-form.component';
import { DatePipe } from '@angular/common';


type Full_model = PlannedSchedule;

@Component({
    selector: 'app-schedule-planner-modal-special-time-list-field',
    templateUrl: './schedule-planner-modal-special-time-list-field.component.html',
    styleUrls: ['./schedule-planner-modal-special-time-list-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class SchedulePlannerModalSpecialTimeListFieldComponent extends BaseListFieldComponent<Full_model> {

    @Input() public tableTitleUseSectionSubtitle: boolean;

    private datePipe = inject(DatePipe);

    public baseResourceKey = "schedule.planner.modal.special.time";
    public tableIdProperty = "plannedScheduleId";

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("schedule.planner.modal.special.time.list.table.headers.type"),
            attributeName: "dC_ScheduleSpecialTypeId",
            formatterFn: (value: string) => this.initData.dC_ScheduleSpecialTypeList.find(item => item.value === Number(value))?.name ?? ''
        },
        {
            name: this.resourceService.resolve("schedule.planner.modal.special.time.list.table.headers.startDate"),
            attributeName: "startDate",
            formatterFn: (value: string) => this.datePipe.transform(value, 'HH:mm')
        },
        {
            name: this.resourceService.resolve("schedule.planner.modal.special.time.list.table.headers.endDate"),
            attributeName: "endDate",
            formatterFn: (value: string) => this.datePipe.transform(value, 'HH:mm')
        }
    ];

    public valueToFormValue = (value: any[]) => value;

    public handleSave$: (data: ListHandlerCallbackData<unknown, FormModel>) => Observable<any> = ({formValue}) => {
        this.listFieldComponent.changeValue([
            formValue,
            ...this.listFieldComponent.value
        ]);
        return of(null);
    }
}
