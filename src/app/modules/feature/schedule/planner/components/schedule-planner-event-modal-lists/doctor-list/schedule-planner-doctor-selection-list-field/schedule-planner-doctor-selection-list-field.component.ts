import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BehaviorSubject, debounceTime, map, shareReplay, switchMap } from 'rxjs';
import { ContactTypeEnum, MedicalEmployeeTypeEnum } from 'src/api/enums';
import { CoreModelsMasterDataMedicalEmployeeGetMedicalEmployeeByConditionRequest } from 'src/api/models';
import { MasterDataManagementService } from 'src/api/services';
import { TableHeader } from 'src/app/components/table/table/table-header';
import { SelectFieldComponent } from 'src/app/modules/app-common/select-field/components/select-field/select-field.component';
import { TextFieldComponent } from 'src/app/modules/app-common/text-field/components/text-field/text-field.component';
import { SkipSettingValueAccessorProviders } from 'src/app/modules/app-common/utility/base-control-value-acessor/base-control-value-acessor.directive';
import { BaseSelectionListFieldComponent } from 'src/app/modules/app-common/utility/base-selection-list-field/base-selection-list-field.directive';
import { isEmpty } from 'src/app/modules/core/utility/methods/is-empty';
import { MedicalEmployeeXContact } from 'src/app/modules/feature/master-data/medical-employee/models/medical-employee-x-contact.model';
import { MedicalEmployee } from 'src/app/modules/feature/master-data/medical-employee/models/medical-employee.model';
import { MedicalalEmployeeXService } from 'src/app/modules/feature/schedule/template/models/medical-employee-x-service.model';


@Component({
    selector: 'app-schedule-planner-doctor-selection-list-field',
    templateUrl: './schedule-planner-doctor-selection-list-field.component.html',
    styleUrls: ['./schedule-planner-doctor-selection-list-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class SchedulePlannerDoctorSelectionListFieldComponent extends BaseSelectionListFieldComponent<MedicalEmployee> {

    private masterDataManagementService = inject(MasterDataManagementService);
    private filterData$ = new BehaviorSubject<CoreModelsMasterDataMedicalEmployeeGetMedicalEmployeeByConditionRequest>({});

    public baseResourceKey = "schedule.planner.modal.list.doctor";
    public tableIdProperty = "medicalEmployeeId";
    public tableTitleProperty = "schedule.planner.modal.list.doctor";

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("schedule.planner.filter.employee.list.table.headers.titleType"),
            attributeName: "dC_TitleType.name",
        },
        {
            name: this.resourceService.resolve("schedule.planner.filter.employee.list.table.headers.lastName"),
            attributeName: "lastName",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        lastName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("schedule.planner.filter.employee.list.table.headers.firstName"),
            attributeName: "firstName",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        firstName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("schedule.planner.filter.employee.list.table.headers.phone"),
            attributeName: "medicalEmployeeXContact",
            formatterFn: (v) => v.find((f: MedicalEmployeeXContact) => f.dC_ContactTypeId === ContactTypeEnum.PHONE_NUMBER_1)?.contactValue ?? ''
        },
        {
            name: this.resourceService.resolve("schedule.template.employee.list.table.headers.specialties"),
            attributeName: "medicalEmployeeXService",
            formatterFn: (v) => v.map((r: MedicalalEmployeeXService) => r?.specialty?.specialtyName ?? '').join(', ') ?? "",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        specialtyName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("schedule.planner.filter.employee.list.table.headers.sealNumber"),
            attributeName: "stampNumber",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        stampNumber: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("schedule.planner.filter.employee.list.table.headers.nehi.identifier"),
            attributeName: "nehiIdentifier",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        nehiIdentifier: v ?? undefined,
                    });
                });
            },
        }
    ];

    public getTableData$ = () => {
        return this.filterData$.pipe(
            debounceTime(200),
            switchMap((filterData) => {
                return this.masterDataManagementService.medicalEmployeeGetMedicalEmployeeByConditionPost({
                        needMedicalEmployeeXService: true,
                        needMedicalEmployeeXContact: true,
                        ...filterData,
                    })
                }),
                map(res => res?.businessObjectList ?? []),
                shareReplay(1)
        );
    }
}
