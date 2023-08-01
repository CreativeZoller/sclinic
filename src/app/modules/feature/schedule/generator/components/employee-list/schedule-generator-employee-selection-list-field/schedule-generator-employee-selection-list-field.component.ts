import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map, shareReplay } from 'rxjs';
import { MasterDataManagementService } from 'src/api/services';
import { TableHeader } from 'src/app/components/table/table/table-header';
import { SkipSettingValueAccessorProviders } from 'src/app/modules/app-common/utility/base-control-value-acessor/base-control-value-acessor.directive';
import { BaseSelectionListFieldComponent } from 'src/app/modules/app-common/utility/base-selection-list-field/base-selection-list-field.directive';
import { MedicalEmployee } from 'src/app/modules/feature/master-data/medical-employee/models/medical-employee.model';
import { MedicalalEmployeeXService } from '../../../../template/models/medical-employee-x-service.model';


@Component({
    selector: 'app-schedule-generator-employee-selection-list-field',
    templateUrl: './schedule-generator-employee-selection-list-field.component.html',
    styleUrls: ['./schedule-generator-employee-selection-list-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ScheduleGeneratorEmployeeSelectionListFieldComponent extends BaseSelectionListFieldComponent<MedicalEmployee> {

    private masterDataManagementService = inject(MasterDataManagementService);

    public baseResourceKey = "schedule.generator.employee";
    public tableIdProperty = "medicalEmployeeId";

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("schedule.generator.employee.list.table.headers.titleType"),
            attributeName: "dC_TitleType.name"
        },
        {
            name: this.resourceService.resolve("schedule.generator.employee.list.table.headers.firstName"),
            attributeName: "firstName"
        },
        {
            name: this.resourceService.resolve("schedule.generator.employee.list.table.headers.lastName"),
            attributeName: "lastName"
        },
        {
            name: this.resourceService.resolve("schedule.generator.employee.list.table.headers.sealNumber"),
            attributeName: "stampNumber"
        },
        {
            name: this.resourceService.resolve("schedule.generator.employee.list.table.headers.specialties"),
            attributeName: "medicalEmployeeXService",
            formatterFn: (v) => v.map((r: MedicalalEmployeeXService) => r?.specialty?.specialtyName ?? '').join(', ') ?? ""
        }
    ];

    public getTableData$ = () => this.masterDataManagementService.medicalEmployeeGetMedicalEmployeeByConditionPost({
        needMedicalEmployeeXService: true,
        needMedicalEmployeeXContact: true
    }).pipe(
        map(res => res?.businessObjectList ?? []),
        shareReplay(1),
    );
}
