import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BehaviorSubject, debounceTime, map, shareReplay, switchMap } from 'rxjs';
import { CoreModelsMasterDataClinicGetClinicByConditionRequest } from 'src/api/models';
import { MasterDataManagementService } from 'src/api/services';
import { TableHeader } from 'src/app/components/table/table/table-header';
import { TextFieldComponent } from 'src/app/modules/app-common/text-field/components/text-field/text-field.component';
import { SkipSettingValueAccessorProviders } from 'src/app/modules/app-common/utility/base-control-value-acessor/base-control-value-acessor.directive';
import { BaseSelectionListFieldComponent } from 'src/app/modules/app-common/utility/base-selection-list-field/base-selection-list-field.directive';
import { Clinic } from 'src/app/modules/feature/master-data/clinics/models/clinic.model';


@Component({
  selector: 'app-schedule-publishing-clinic-selection-list-field',
  templateUrl: './schedule-publishing-clinic-selection-list-field.component.html',
  styleUrls: ['./schedule-publishing-clinic-selection-list-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Must set both providers & viewProviders fot @Host to work
  providers: SkipSettingValueAccessorProviders,
  viewProviders: SkipSettingValueAccessorProviders,
})
export class SchedulePublishingClinicSelectionListFieldComponent extends BaseSelectionListFieldComponent<Clinic> {

    private masterDataManagementService = inject(MasterDataManagementService);
    public baseResourceKey = "schedule.publishing.clinic";
    public tableIdProperty = "clinicId";
    private filterData$ = new BehaviorSubject<CoreModelsMasterDataClinicGetClinicByConditionRequest>({});

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("schedule.publishing.clinic.list.table.headers.name"),
            attributeName: "clinicName",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        clinicName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("schedule.publishing.clinic.list.table.headers.address"),
            attributeName: "address",
            formatterFn: (v: Clinic["address"]) => [v?.dC_City?.postCode ?? "", v?.dC_City?.name ?? '', v?.streetName ?? '', v?.buildingNumber ?? ''].join(' '),
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        clinicName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("schedule.publishing.clinic.list.table.headers.phone"),
            attributeName: "phoneNumber",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        phoneNumber: v ?? undefined,
                    });
                });
            },
        }
    ];

    public getTableData$ = () => {
        return this.filterData$.pipe(
            debounceTime(200),
            switchMap((filterData) => {
                return this.masterDataManagementService.clinicGetClinicByConditionPost({
                            needAddress: true,
                            needClinicRooms: true,
                            needSelf: true,
                            ...filterData
                });
            }),
            map(res => res?.businessObjectList ?? []),
            shareReplay(1)
        );
    }
}
