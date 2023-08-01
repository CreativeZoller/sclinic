import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BehaviorSubject, debounceTime, map, shareReplay, switchMap } from 'rxjs';
import { CoreModelsDTOsMasterDataMainTablesSpecialtyDTO, CoreModelsMasterDataSpecialtyGetSpecialtyByConditionRequest } from 'src/api/models';
import { MasterDataManagementService } from 'src/api/services';
import { TableHeader } from 'src/app/components/table/table/table-header';
import { CheckboxFieldComponent } from 'src/app/modules/app-common/checkbox-field/components/checkbox-field/checkbox-field.component';
import { TextFieldComponent } from 'src/app/modules/app-common/text-field/components/text-field/text-field.component';
import { SkipSettingValueAccessorProviders } from 'src/app/modules/app-common/utility/base-control-value-acessor/base-control-value-acessor.directive';
import { BaseSelectionListFieldComponent } from 'src/app/modules/app-common/utility/base-selection-list-field/base-selection-list-field.directive';


type Full_Model = CoreModelsDTOsMasterDataMainTablesSpecialtyDTO;

@Component({
    selector: 'app-schedule-planner-modal-specialty-selection-list-field',
    templateUrl: './schedule-planner-modal-specialty-selection-list-field.component.html',
    styleUrls: ['./schedule-planner-modal-specialty-selection-list-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class SchedulePlannerModalSpecialtySelectionListFieldComponent extends BaseSelectionListFieldComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);
    private filterData$ = new BehaviorSubject<CoreModelsMasterDataSpecialtyGetSpecialtyByConditionRequest>({});

    public baseResourceKey = "schedule.planner.modal.list.specialty";
    public tableIdProperty = "specialtyId";

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("schedule.planner.modal.list.specialty.list.table.headers.code"),
            attributeName: "specialtyCode",
        },
        {
            name: this.resourceService.resolve("schedule.planner.modal.list.specialty.list.table.headers.name"),
            attributeName: "specialtyName",
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

    public getTableData$ = () => {
        return this.filterData$.pipe(
            debounceTime(200),
            switchMap((filterData) => {
                return this.masterDataManagementService.specialtyGetSpecialtyByConditionPost(filterData)
            }),
            map(res => res?.businessObjectList ?? []),
            shareReplay(1)
        );
    }
}
