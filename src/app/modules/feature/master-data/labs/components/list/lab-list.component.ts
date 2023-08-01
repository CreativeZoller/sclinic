import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { BehaviorSubject, concat, debounceTime, map, Observable, of, shareReplay, switchMap, tap } from "rxjs";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { MasterDataManagementService } from "src/api/services";
import { ActivatedRoute } from "@angular/router";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";
import { Lab } from "../../models/lab.model";
import { InitPageData } from "../../../../../app-common/init-page-data-provider/models/init-page-data.model";
import { CoreModelsMasterDataLabGetLabsByConditionRequest } from "../../../../../../../api/models";
import { isEmpty } from "../../../../../core/utility/methods/is-empty";
import { TextFieldComponent } from "../../../../../app-common/text-field/components/text-field/text-field.component";
import { SelectFieldComponent } from "../../../../../app-common/select-field/components/select-field/select-field.component";
import { PaginationConfig } from "../../../../../../components/table/pagination/pagination.component";


type Grid_Model = Lab;
type Full_Model = Lab;

@UntilDestroy()
@Component({
    selector: "app-lab-list",
    templateUrl: "./lab-list.component.html",
    styleUrls: ["./lab-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabListComponent {

    private masterDataManagementService = inject(MasterDataManagementService);
    private activatedRoute = inject(ActivatedRoute);
    private resourceService = inject(ResourceService);

    private initData = this.activatedRoute.snapshot.data["init"] as InitPageData;

    public baseResourceKey = "lab";
    public tableIdProperty = "labId";

    private filterData$ = new BehaviorSubject<CoreModelsMasterDataLabGetLabsByConditionRequest>({});

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("lab.list.table.headers.dC_MarkerId"),
            attributeName: "dC_MarkerId",
            formatterFn: (v) => this.initData.dC_MarkerList.find((item) => item.value === v)?.name,
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.dC_MarkerList;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        dC_MarkerIdList: isEmpty(v) ? [] : [v],
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("lab.list.table.headers.providerIdentificationNumber"),
            attributeName: "providerIdentificationNumber",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        providerIdentificationNumber: v,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("lab.list.table.headers.dC_LabSamplingTypeId"),
            attributeName: "dC_LabSamplingTypeId",
            formatterFn: (v) => this.initData.dC_LabSamplingTypeList.find((item) => item.value === v)?.name,
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.dC_LabSamplingTypeList;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        dC_LabSamplingTypeIdList: isEmpty(v) ? [] : [v],
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("lab.list.table.headers.dC_LabRepeatPeriodId"),
            attributeName: "dC_LabRepeatPeriodId",
            formatterFn: (v) => this.initData.dC_LabRepeatPeriodList.find((item) => item.value === v)?.name,
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.dC_LabRepeatPeriodList;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        dC_LabRepeatPeriodIdList: isEmpty(v) ? [] : [v],
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("lab.list.table.headers.dC_SamplingItemId"),
            attributeName: "dC_SamplingItemId",
            formatterFn: (v) => this.initData.dC_SamplingItemList.find((item) => item.value === v)?.name,
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.dC_SamplingItemList;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        dC_SamplingItemIdList: isEmpty(v) ? [] : [v],
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("lab.list.table.headers.dC_LabProviderId"),
            attributeName: "dC_LabProviderId",
            formatterFn: (v) => this.initData.dC_LabProviderList.find((item) => item.value === v)?.name,
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.dC_LabProviderList;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        dC_LabProviderIdList: isEmpty(v) ? [] : [v],
                    });
                });
            },
        },
    ];

    public totalRecordCount$ = new BehaviorSubject<number>(0);
    public getTableData$: (pageConfig: PaginationConfig) => Observable<Grid_Model[]> = (pageConfig) => {
        return this.filterData$.pipe(
            debounceTime(200),
            switchMap((filterData) => {
                return concat(
                    of(undefined as any),
                    this.masterDataManagementService.labGetLabsByConditionPost({
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

    public handleSave$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any> = ({rowData, formValue}) => {
        return this.masterDataManagementService.labCreateOrUpdateLabPost({
            businessObjectList: [{
                ...rowData,
                ...formValue,
            }],
        }).pipe(
            map((res) => res.businessObjectList),
            shareReplay(1),
        );
    }

    public handleDelete$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any> = ({gridRowData}) => {
        return this.masterDataManagementService.labDeleteLabDelete({
            labId: [ gridRowData?.labId! ],
        });
    }
}
