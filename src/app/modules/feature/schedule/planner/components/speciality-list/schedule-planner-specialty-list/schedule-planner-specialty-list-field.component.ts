import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable, of, shareReplay } from 'rxjs';
import { CoreModelsDTOsMasterDataMainTablesSpecialtyDTO } from 'src/api/models';
import { TableHeader } from 'src/app/components/table/table/table-header';
import { ListHandlerCallbackData } from 'src/app/modules/app-common/list/components/list/list.component';
import { SkipSettingValueAccessorProviders } from 'src/app/modules/app-common/utility/base-control-value-acessor/base-control-value-acessor.directive';
import { BaseListFieldComponent } from 'src/app/modules/app-common/utility/base-list-field/base-list-field.directive';
import { FormModel } from '../schedule-planner-specialty-form/schedule-planner-specialty-form.component';


type Full_model = CoreModelsDTOsMasterDataMainTablesSpecialtyDTO;

@Component({
    selector: 'app-schedule-planner-specialty-list-field',
    templateUrl: './schedule-planner-specialty-list-field.component.html',
    styleUrls: ['./schedule-planner-specialty-list-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class SchedulePlannerSpecialtyListFieldComponent extends BaseListFieldComponent<Full_model> {

    public baseResourceKey = "schedule.planner.filter.specialty";
    public tableIdProperty = "schedulePlannerSpecialtyList";

    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("schedule.planner.filter.specialty.list.table.headers.name"),
            attributeName: "specialtyName"
        },
        {
            name: this.resourceService.resolve("schedule.planner.filter.specialty.list.table.headers.code"),
            attributeName: "specialtyCode"
        },
        {
            name: this.resourceService.resolve("schedule.planner.filter.specialty.list.table.headers.status"),
            attributeName: "specialtyStatus"
        }
    ];

    public allSelected$ = this.getValue$().pipe(
        shareReplay(1),
    );

    public valueToFormValue = (value: any[]) => value;

    public handleSave$: (data: ListHandlerCallbackData<unknown, FormModel>) => Observable<any> = ({formValue}) => {
        this.listFieldComponent.changeValue(
            (formValue?.selectedSpecialities ?? [])
        );
        return of(null);
    }
}
