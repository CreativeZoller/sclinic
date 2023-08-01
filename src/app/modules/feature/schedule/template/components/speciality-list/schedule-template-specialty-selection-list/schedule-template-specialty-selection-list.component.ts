import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map, shareReplay } from 'rxjs';
import { MasterDataManagementService } from 'src/api/services';
import { TableHeader } from 'src/app/components/table/table/table-header';
import { ScheduleTemplateItemXSpecialty } from '../../../models/schedule-tempalte-item-x-specialty.model';
import { UnArray } from 'src/app/modules/core/utility/types/un-array';
import { BaseSelectionListFieldComponent } from 'src/app/modules/app-common/utility/base-selection-list-field/base-selection-list-field.directive';
import { SkipSettingValueAccessorProviders } from 'src/app/modules/app-common/utility/base-control-value-acessor/base-control-value-acessor.directive';


type Full_Model = UnArray<ScheduleTemplateItemXSpecialty>;

@Component({
    selector: 'app-schedule-template-specialty-selection-list',
    templateUrl: './schedule-template-specialty-selection-list.component.html',
    styleUrls: ['./schedule-template-specialty-selection-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ScheduleTemplateSpecialtySelectionListComponent extends BaseSelectionListFieldComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);

    public baseResourceKey = "schedule.template.specialty";
    public tableIdProperty = "specialtyId";

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("schedule.template.specialty.list.table.headers.name"),
            attributeName: "specialtyName",
        },
        {
            name: this.resourceService.resolve("schedule.template.specialty.list.table.headers.code"),
            attributeName: "specialtyCode",
        },
        {
            name: this.resourceService.resolve("schedule.template.specialty.list.table.headers.status"),
            attributeName: "specialtyCode",
        },
    ];

    public getTableData$ = () => this.masterDataManagementService.specialtyGetSpecialtyByConditionPost({}).pipe(
        map(res => res?.businessObjectList ?? []),
        shareReplay(1),
    );
}
