import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map, shareReplay } from 'rxjs';
import { MasterDataManagementService } from 'src/api/services';
import { TableHeader } from 'src/app/components/table/table/table-header';
import { SkipSettingValueAccessorProviders } from 'src/app/modules/app-common/utility/base-control-value-acessor/base-control-value-acessor.directive';
import { BaseSelectionListFieldComponent } from 'src/app/modules/app-common/utility/base-selection-list-field/base-selection-list-field.directive';
import { Clinic } from 'src/app/modules/feature/master-data/clinics/models/clinic.model';


@Component({
  selector: 'app-schedule-generator-clinic-selection-list-field',
  templateUrl: './schedule-generator-clinic-selection-list-field.component.html',
  styleUrls: ['./schedule-generator-clinic-selection-list-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Must set both providers & viewProviders fot @Host to work
  providers: SkipSettingValueAccessorProviders,
  viewProviders: SkipSettingValueAccessorProviders,
})
export class ScheduleGeneratorClinicSelectionListFieldComponent extends BaseSelectionListFieldComponent<Clinic> {

    private masterDataManagementService = inject(MasterDataManagementService);
    public baseResourceKey = "schedule.generator.clinic";
    public tableIdProperty = "clinicId";

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("schedule.generator.clinic.list.table.headers.id"),
            attributeName: "clinicId"
        },
        {
            name: this.resourceService.resolve("schedule.generator.clinic.list.table.headers.name"),
            attributeName: "clinicName"
        },
        {
            name: this.resourceService.resolve("schedule.generator.clinic.list.table.headers.phone"),
            attributeName: "phoneNumber"
        }
    ];

    public getTableData$ = () => this.masterDataManagementService.clinicGetClinicByConditionPost({
        needAddress: true,
        needClinicRooms: true,
        needSelf: true
    }).pipe(
        map(res => res?.businessObjectList ?? []),
        shareReplay(1),
    );
}
