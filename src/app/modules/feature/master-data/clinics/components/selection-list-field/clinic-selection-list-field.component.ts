import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { BehaviorSubject, map, Observable, shareReplay, switchMap } from "rxjs";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { MasterDataManagementService } from "../../../../../../../api/services";
import { SkipSettingValueAccessorProviders } from "../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BaseSelectionListFieldComponent } from "../../../../../app-common/utility/base-selection-list-field/base-selection-list-field.directive";
import { CoreModelsDTOsMasterDataMainTablesClinicDTO } from "../../../../../../../api/models";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";


type Full_Model = CoreModelsDTOsMasterDataMainTablesClinicDTO;

@UntilDestroy()
@Component({
    selector: "app-clinic-selection-list-field",
    templateUrl: "./clinic-selection-list-field.component.html",
    styleUrls: ["./clinic-selection-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ClinicSelectionListFieldComponent extends BaseSelectionListFieldComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);

    public baseResourceKey = "clinic";
    public tableIdProperty = "clinicId";

    public tableHeaders: TableHeader[] = [
        {
            id: 1,
            name: this.resourceService.resolve("clinic.list.table.headers.clinicName"),
            attributeName: "clinicName",
        },
        {
            id: 2,
            name: this.resourceService.resolve("clinic.list.table.headers.postCode"),
            attributeName: "address.dC_City.postCode",
        },
        {
            id: 3,
            name: this.resourceService.resolve("clinic.list.table.headers.city.name"),
            attributeName: "address.dC_City.name",
        },
        {
            id: 4,
            name: this.resourceService.resolve("clinic.list.table.headers.streetName"),
            attributeName: "address.streetName",
        },
        {
            id: 5,
            name: this.resourceService.resolve("clinic.list.table.headers.clinicType"),
            attributeName: "dC_ClinicType.name",
        },
        {
            id: 6,
            name: this.resourceService.resolve("clinic.list.table.headers.phoneNumber"),
            attributeName: "phoneNumber",
        },
        {
            id: 7,
            name: this.resourceService.resolve("clinic.list.table.headers.selfName"),
            attributeName: "self.selfName",
        },
        {
            id: 8,
            name: this.resourceService.resolve("clinic.list.table.headers.clinicRooms"),
            attributeName: "clinicRooms",
            formatterFn: (v) => v.length,
        },
        // TODO Státus
    ];

    public getTableData$ = () => this.enableEditor$.pipe(
        switchMap((enableEditor) => this.masterDataManagementService.clinicGetClinicByConditionPost({
            needAddress: true,
            needDC_ClinicType: enableEditor,
            needSelf: enableEditor,
            needClinicXSpecialtyXService: enableEditor,
            needClinicRoomXSpecialtyXServices: enableEditor,
            needBookingArea: enableEditor,
            needClinicRooms: enableEditor,
            needClinicOpenHours: enableEditor,
            needClinicRoomSchedules: enableEditor,
        })),
        map(res => res?.businessObjectList ?? []),
        shareReplay(1),
    );

    public handleSave$?: (data: ListHandlerCallbackData<Full_Model, Full_Model>) => Observable<any> = ({formValue}) => {
        return this.masterDataManagementService.clinicCreateOrUpdateClinicPost({
            businessObjectList: [
                {
                    ...formValue,
                },
            ],
        }).pipe(
            map((res) => res.businessObjectList?.[0]),
            shareReplay(1),
        );
    }

    public handleDelete$?: (data: ListHandlerCallbackData<Full_Model, Full_Model>) => Observable<any> = ({gridRowData}) => {
        return this.masterDataManagementService.clinicDeleteClinicDelete({
            clinicIds: [ gridRowData?.clinicId! ],
        });
    }

    public enableEditor$ = new BehaviorSubject<boolean>(true);
    @Input() public set enableEditor(value: boolean) {
        this.enableEditor$.next(value);
    };
}
