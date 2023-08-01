import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { map, shareReplay } from 'rxjs';
import { MasterDataManagementService } from 'src/api/services';
import { TableHeader } from 'src/app/components/table/table/table-header';
import { CheckboxFieldComponent } from 'src/app/modules/app-common/checkbox-field/components/checkbox-field/checkbox-field.component';
import { SkipSettingValueAccessorProviders } from 'src/app/modules/app-common/utility/base-control-value-acessor/base-control-value-acessor.directive';
import { BaseSelectionListFieldComponent } from 'src/app/modules/app-common/utility/base-selection-list-field/base-selection-list-field.directive';
import { UnArray } from 'src/app/modules/core/utility/types/un-array';
import { Clinic } from 'src/app/modules/feature/master-data/clinics/models/clinic.model';
import { ScheduleTemplateSummary } from '../../../models/schedule-template-summary.model';


@Component({
  selector: 'app-schedule-template-clinic-selection-list',
  templateUrl: './schedule-template-clinic-selection-list.component.html',
  styleUrls: ['./schedule-template-clinic-selection-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Must set both providers & viewProviders fot @Host to work
  providers: SkipSettingValueAccessorProviders,
  viewProviders: SkipSettingValueAccessorProviders,
})
export class ScheduleTemplateClinicSelectionListComponent extends BaseSelectionListFieldComponent<Clinic> {

    private masterDataManagementService = inject(MasterDataManagementService);
    public baseResourceKey = "schedule.template.clinic";
    public tableIdProperty = "clinicId";

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("schedule.template.clinic.list.table.headers.name"),
            attributeName: "clinicName"
        },
        {
            name: this.resourceService.resolve("schedule.template.clinic.list.table.headers.bookable"),
            cellComponent: CheckboxFieldComponent,
            initCellComponentBindingsFactoryFn: (value, row: UnArray<ScheduleTemplateSummary["clinicDataList"]>) => {
                return (comp: CheckboxFieldComponent) => {
                    comp.writeValue(!!row.isExternalSite);
                }
            }
        },
        {
            name: this.resourceService.resolve("schedule.template.clinic.list.table.headers.phone"),
            attributeName: "phoneNumber"
        },
        {
            name: this.resourceService.resolve("schedule.template.clinic.list.table.headers.company"),
            attributeName: "clinicXSelf",
            formatterFn: (v: NonNullable<Clinic["clinicXSelf"]>) => v?.[0]?.self?.selfName ?? ''
        },
        {
            name: this.resourceService.resolve("schedule.template.clinic.list.table.headers.room"),
            attributeName: "clinicRooms",
            formatterFn: (v: NonNullable<Clinic["clinicRooms"]>) => v?.map(r => r.roomNumber).join(', ') ?? ''
        },
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
