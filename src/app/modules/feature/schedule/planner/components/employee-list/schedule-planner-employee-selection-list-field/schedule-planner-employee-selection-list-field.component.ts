import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map, shareReplay } from 'rxjs';
import { ContactTypeEnum } from 'src/api/enums';
import { MasterDataManagementService } from 'src/api/services';
import { TableHeader } from 'src/app/components/table/table/table-header';
import { SkipSettingValueAccessorProviders } from 'src/app/modules/app-common/utility/base-control-value-acessor/base-control-value-acessor.directive';
import { BaseSelectionListFieldComponent } from 'src/app/modules/app-common/utility/base-selection-list-field/base-selection-list-field.directive';
import { MedicalEmployeeXContact } from 'src/app/modules/feature/master-data/medical-employee/models/medical-employee-x-contact.model';
import { MedicalEmployee } from 'src/app/modules/feature/master-data/medical-employee/models/medical-employee.model';


@Component({
    selector: 'app-schedule-planner-employee-selection-list-field',
    templateUrl: './schedule-planner-employee-selection-list-field.component.html',
    styleUrls: ['./schedule-planner-employee-selection-list-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class SchedulePlannerEmployeeSelectionListFieldComponent extends BaseSelectionListFieldComponent<MedicalEmployee> {

    private masterDataManagementService = inject(MasterDataManagementService);

    public baseResourceKey = "schedule.planner.filter.employee";
    public tableIdProperty = "medicalEmployeeId";

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("schedule.planner.filter.employee.list.table.headers.titleType"),
            attributeName: "dC_TitleType.name"
        },
        {
            name: this.resourceService.resolve("schedule.planner.filter.employee.list.table.headers.lastName"),
            attributeName: "lastName"
        },
        {
            name: this.resourceService.resolve("schedule.planner.filter.employee.list.table.headers.firstName"),
            attributeName: "firstName"
        },
        {
            name: this.resourceService.resolve("schedule.planner.filter.employee.list.table.headers.phone"),
            attributeName: "medicalEmployeeXContact",
            formatterFn: (v) => v.find((f: MedicalEmployeeXContact) => f.dC_ContactTypeId === ContactTypeEnum.EMAIL_1)?.contactValue ?? ''
        },
        {
            name: this.resourceService.resolve("schedule.planner.filter.employee.list.table.headers.sealNumber"),
            attributeName: "stampNumber"
        },
        {
            name: this.resourceService.resolve("schedule.planner.filter.employee.list.table.headers.nehi.identifier"),
            attributeName: "nehiIdentifier"
        },
        {
            name: this.resourceService.resolve("schedule.planner.filter.employee.list.table.headers.days.off"),
            attributeName: "numberOfDaysOff"
        },
        {
            name: this.resourceService.resolve("schedule.planner.filter.employee.list.table.headers.assistant"),
            attributeName: "assistant",
            formatterFn: (v) => v?.fullName ?? ''
        },
    ];

    public getTableData$ = () => this.masterDataManagementService.medicalEmployeeGetMedicalEmployeeByConditionPost({
        needMedicalEmployeeXService: true,
        needMedicalEmployeeXContact: true,
        needAssistant: true,
    }).pipe(
        map(res => res?.businessObjectList ?? []),
        shareReplay(1),
    );
}
