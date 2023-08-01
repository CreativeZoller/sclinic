import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable, map, of, shareReplay } from 'rxjs';
import { CoreModelsDTOsMasterDataMainTablesSpecialtyDTO } from 'src/api/models';
import { TableHeader } from 'src/app/components/table/table/table-header';
import { ListHandlerCallbackData } from 'src/app/modules/app-common/list/components/list/list.component';
import { SkipSettingValueAccessorProviders } from 'src/app/modules/app-common/utility/base-control-value-acessor/base-control-value-acessor.directive';
import { BaseListFieldComponent } from 'src/app/modules/app-common/utility/base-list-field/base-list-field.directive';
import { FormModel } from '../schedule-planner-modal-specialty-form/schedule-planner-modal-specialty-form.component';
import { CheckboxFieldComponent } from 'src/app/modules/app-common/checkbox-field/components/checkbox-field/checkbox-field.component';
import { PlannedSchedule } from '../../../../models/planned-schedule.model';
import { UnArray } from 'src/app/modules/core/utility/types/un-array';


type Full_model = CoreModelsDTOsMasterDataMainTablesSpecialtyDTO;

@Component({
    selector: 'app-schedule-planner-modal-specialty-list-field',
    templateUrl: './schedule-planner-modal-specialty-list-field.component.html',
    styleUrls: ['./schedule-planner-modal-specialty-list-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class SchedulePlannerModalSpecialtyListFieldComponent extends BaseListFieldComponent<Full_model> {

    @Input() public tableTitleUseSectionSubtitle: boolean;

    public baseResourceKey = "schedule.planner.modal.list.specialty";
    public tableIdProperty = "schedulePlannerSpecialtyList";

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("schedule.planner.modal.list.specialty.list.table.headers.code"),
            attributeName: "specialtyCode"
        },
        {
            name: this.resourceService.resolve("schedule.planner.modal.list.specialty.list.table.headers.name"),
            attributeName: "specialtyName"
        },
        {
            name: this.resourceService.resolve("schedule.planner.modal.list.specialty.list.table.headers.isHide"),
            attributeName: "isHide",
            cellComponent: CheckboxFieldComponent,
            initCellComponentBindingsFactoryFn: (value, row) => {
                return (comp: CheckboxFieldComponent) => {
                    comp.writeValue(!!row.isHide);
                }
            }
        }
    ];

    public allSelected$ = this.getValue$().pipe(
        shareReplay(1),
        map(value => {
            return value;
            const _value = value as PlannedSchedule['plannedScheduleXSpecialty'];
            return (_value?.map(obj => obj.specialtyData) ?? []) as CoreModelsDTOsMasterDataMainTablesSpecialtyDTO[];
        })
    );

    public valueToFormValue = (value: any[]) => value.map(obj => obj.specialtyData);

    public handleSave$: (data: ListHandlerCallbackData<unknown, FormModel>) => Observable<any> = ({formValue}) => {
        this.listFieldComponent.changeValue(
            (formValue?.selectedSpecialities ?? [])
        );
        return of(null);
    }
}
