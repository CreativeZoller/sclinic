import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { BehaviorSubject, concat, debounceTime, map, Observable, of, shareReplay, switchMap, tap } from "rxjs";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { Clinic } from "../../models/clinic.model";
import { MasterDataManagementService } from "../../../../../../../api/services";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";
import { CoreModelsMasterDataClinicGetClinicByConditionRequest } from "../../../../../../../api/models";
import { SelectFieldComponent } from "../../../../../app-common/select-field/components/select-field/select-field.component";
import { TextFieldComponent } from "../../../../../app-common/text-field/components/text-field/text-field.component";
import { InitPageData } from "../../../../../app-common/init-page-data-provider/models/init-page-data.model";
import { ActivatedRoute } from "@angular/router";
import { NumberFieldComponent } from "../../../../../app-common/number-field/components/number-field/number-field.component";
import { PaginationConfig } from "../../../../../../components/table/pagination/pagination.component";


type Full_Model = Clinic

@UntilDestroy()
@Component({
    selector: "app-clinic-list",
    templateUrl: "./clinic-list.component.html",
    styleUrls: ["./clinic-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicListComponent {

    private masterDataManagementService = inject(MasterDataManagementService);
    private resourceService = inject(ResourceService);
    private activatedRoute = inject(ActivatedRoute);

    private initData = this.activatedRoute.snapshot.data["init"] as InitPageData;

    public baseResourceKey = "clinic";
    public tableIdProperty = "clinicId";

    private filterData$ = new BehaviorSubject<CoreModelsMasterDataClinicGetClinicByConditionRequest>({});

    tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("clinic.list.table.headers.clinicName"),
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
            name: this.resourceService.resolve("clinic.list.table.headers.postCode"),
            attributeName: "address.dC_City.postCode",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        postCode: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("clinic.list.table.headers.city.name"),
            attributeName: "address.dC_City.name",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        city: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("clinic.list.table.headers.streetName"),
            attributeName: "address.streetName",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        streetName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("clinic.list.table.headers.clinicType"),
            attributeName: "dC_ClinicType.name",
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.dC_ClinicTypeList;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        dC_ClinicTypeIdId: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("clinic.list.table.headers.phoneNumber"),
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
        },
        {
            name: this.resourceService.resolve("clinic.list.table.headers.selfName"),
            attributeName: "self.selfName",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        selfName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("clinic.list.table.headers.clinicRooms"),
            attributeName: "clinicRooms",
            formatterFn: (v) => v.length,
            headerSearchComponent: NumberFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: NumberFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.hideStepping = true;
                instance.minNumber = 0;
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        clinicRoomCount: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("clinic.list.table.headers.isDeletedStatus"),
            attributeName: "isDeleted",
            formatterFn: (v) => v
                ? this.resourceService.resolve("general.list.inactive")
                : this.resourceService.resolve("general.list.active"),
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = [
                    { name: this.resourceService.resolve("general.list.active"), value: false },
                    { name: this.resourceService.resolve("general.list.inactive"), value: true },
                ];
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        isDeleted: v ?? undefined,
                    });
                });
            },
        },
        // TODO Státus
    ];

    public totalRecordCount$ = new BehaviorSubject<number>(0);
    public getTableData$: (pageConfig: PaginationConfig) => Observable<Full_Model[]> = (pageConfig) => {
        return this.filterData$.pipe(
            debounceTime(200),
            switchMap((filterData) => {
                return concat(
                    of(undefined as any),
                    this.masterDataManagementService.clinicGetClinicByConditionPost({
                        ...filterData,
                        needAddress: true,
                        needDC_ClinicType: true,
                        needSelf: true,
                        needClinicXSpecialtyXService: true,
                        needClinicRoomXSpecialtyXServices: true,
                        needBookingArea: true,
                        needClinicRooms: true,
                        needClinicOpenHours: true,
                        needClinicRoomSchedules: true,
                        needDeleted: true,

                        page: pageConfig.currentSelectedPage,
                        pageSize: pageConfig.rowsPerPage,
                    }).pipe(
                        tap(res => {
                            if (res && res.totalRecordCount != null) {
                                this.totalRecordCount$.next(res.totalRecordCount);
                            }
                        }),
                        map(res => res?.businessObjectList ?? []),
                    ),
                );
            }),
        );
    }

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
}
