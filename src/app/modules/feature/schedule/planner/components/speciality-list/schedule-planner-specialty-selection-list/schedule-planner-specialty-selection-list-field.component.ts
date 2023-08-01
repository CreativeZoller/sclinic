import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map, shareReplay } from 'rxjs';
import { CoreModelsDTOsMasterDataMainTablesSpecialtyDTO } from 'src/api/models';
import { MasterDataManagementService } from 'src/api/services';
import { TableHeader } from 'src/app/components/table/table/table-header';
import { SkipSettingValueAccessorProviders } from 'src/app/modules/app-common/utility/base-control-value-acessor/base-control-value-acessor.directive';
import { BaseSelectionListFieldComponent } from 'src/app/modules/app-common/utility/base-selection-list-field/base-selection-list-field.directive';


type Full_Model = CoreModelsDTOsMasterDataMainTablesSpecialtyDTO;

@Component({
    selector: 'app-schedule-planner-specialty-selection-list-field',
    templateUrl: './schedule-planner-specialty-selection-list-field.component.html',
    styleUrls: ['./schedule-planner-specialty-selection-list-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class SchedulePlannerSpecialtySelectionListFieldComponent extends BaseSelectionListFieldComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);

    public baseResourceKey = "schedule.planner.filter.specialty";
    public tableIdProperty = "specialtyId";

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("schedule.planner.filter.specialty.list.table.headers.name"),
            attributeName: "specialtyName",
        },
        {
            name: this.resourceService.resolve("schedule.planner.filter.specialty.list.table.headers.code"),
            attributeName: "specialtyCode",
        },
        {
            name: this.resourceService.resolve("schedule.planner.filter.specialty.list.table.headers.status"),
            attributeName: "specialtyCode",
        },
    ];

    public getTableData$ = () => this.masterDataManagementService.specialtyGetSpecialtyByConditionPost({}).pipe(
        map(res => res?.businessObjectList ?? []),
        shareReplay(1),
    );
}
