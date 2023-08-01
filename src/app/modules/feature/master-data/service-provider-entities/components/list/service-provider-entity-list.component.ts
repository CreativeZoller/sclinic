import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, concat, debounceTime, map, Observable, of, shareReplay, switchMap, tap } from "rxjs";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { removeNullProperties } from "../../../../../core/utility/methods/remove-null-properties";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";
import { InitPageData } from "../../../../../app-common/init-page-data-provider/models/init-page-data.model";
import { MasterDataManagementService } from "../../../../../../../api/services";
import { Service_Provider_Entity } from "../../models/service-provider-entity.model";
import { CoreModelsMasterDataSelfGetSelfByConditionRequest } from "../../../../../../../api/models";
import { SelectFieldComponent } from "../../../../../app-common/select-field/components/select-field/select-field.component";
import { TextFieldComponent } from "../../../../../app-common/text-field/components/text-field/text-field.component";
import { PaginationConfig } from "../../../../../../components/table/pagination/pagination.component";


type Full_Model = Service_Provider_Entity;

@UntilDestroy()
@Component({
    selector: "app-service-provider-entity-list",
    templateUrl: "./service-provider-entity-list.component.html",
    styleUrls: ["./service-provider-entity-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceProviderEntityListComponent {

    private masterDataManagementService = inject(MasterDataManagementService);
    private resourceService = inject(ResourceService);
    private activatedRoute = inject(ActivatedRoute);

    private initData = this.activatedRoute.snapshot.data["init"] as InitPageData;

    public baseResourceKey = "service.provider.entity";
    public tableIdProperty = "selfId";

    private filterData$ = new BehaviorSubject<CoreModelsMasterDataSelfGetSelfByConditionRequest>({});

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("service.provider.entity.list.table.headers.partner.company.fullName"),
            attributeName: "partner.company.fullName",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        companyName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("service.provider.entity.list.table.headers.partner.company.dC_CompanyTypeId"),
            attributeName: "partner.company.dC_CompanyTypeId",
            formatterFn: (v) => this.initData.dC_CompanyTypeList.find((item) => item.value === v)?.name,
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.dC_CompanyTypeList;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        dC_CompanyTypeId: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("service.provider.entity.list.table.headers.partner.company.dC_PartnerModeId"),
            attributeName: "partner.dC_PartnerModeId",
            formatterFn: (v) => this.initData.dC_PartnerModeList.find((item) => item.value === v)?.name,
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.dC_PartnerModeList;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        dC_PartnerModeId: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("service.provider.entity.list.table.headers.partner.company.contactEmailAddress"),
            attributeName: "partner.company.contactEmailAddress",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        companyContactEmailAddress: v ?? undefined,
                    });
                });
            },
        },
    ];

    public totalRecordCount$ = new BehaviorSubject<number>(0);
    public getTableData$: (pageConfig: PaginationConfig) => Observable<Full_Model[]> = (pageConfig) => {
        return this.filterData$.pipe(
            debounceTime(200),
            switchMap((filterData) => {
                return concat(
                    of(undefined as any),
                    this.masterDataManagementService.selfGetSelfByConditionPost({
                        ...filterData,

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
        return this.masterDataManagementService.selfCreateOrUpdateSelfPost({
            businessObjectList: [
                removeNullProperties({
                    ...formValue,
                }),
            ],
        }).pipe(
            map((res) => res.businessObjectList?.[0]),
            shareReplay(1),
        );
    }

    public handleDelete$?: (data: ListHandlerCallbackData<Full_Model, Full_Model>) => Observable<any> = ({gridRowData}) => {
        return this.masterDataManagementService.selfDeleteSelfDelete({
            selfIds: [ gridRowData?.selfId! ],
        });
    }
}
