import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { BehaviorSubject, concat, debounceTime, map, Observable, of, shareReplay, switchMap, tap } from "rxjs";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { DivisionNumber, Grid_DivisionNumber } from "../../models/division-number.model";
import { removeNullProperties } from "../../../../../core/utility/methods/remove-null-properties";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";
import { InitPageData } from "../../../../../app-common/init-page-data-provider/models/init-page-data.model";
import { ActivatedRoute } from "@angular/router";
import { MasterDataManagementService } from "../../../../../../../api/services";
import { CoreModelsMasterDataDivisionNumberGetDivisionNumbersByConditionRequest } from "../../../../../../../api/models";
import { SelectFieldComponent } from "../../../../../app-common/select-field/components/select-field/select-field.component";
import { TextFieldComponent } from "../../../../../app-common/text-field/components/text-field/text-field.component";
import { PaginationConfig } from "../../../../../../components/table/pagination/pagination.component";


type Grid_Model = Grid_DivisionNumber;
type Full_Model = DivisionNumber;

@UntilDestroy()
@Component({
    selector: "app-division-number-list",
    templateUrl: "./division-number-list.component.html",
    styleUrls: ["./division-number-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DivisionNumberListComponent {

    private masterDataManagementService = inject(MasterDataManagementService);
    private resourceService = inject(ResourceService);
    private activatedRoute = inject(ActivatedRoute);

    private initData = this.activatedRoute.snapshot.data["init"] as InitPageData;

    public baseResourceKey = "division.number";
    public tableIdProperty = "divisionNumberId";

    private filterData$ = new BehaviorSubject<CoreModelsMasterDataDivisionNumberGetDivisionNumbersByConditionRequest>({});

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("division.number.list.table.headers.name"),
            attributeName: "name",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        name: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("division.number.list.table.headers.value"),
            attributeName: "value",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        value: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("division.number.list.table.headers.dC_StatusId"),
            attributeName: "dC_StatusId",
            formatterFn: (v) => this.initData.dC_StatusList.find((item) => item.value === v)?.name,
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.dC_StatusList;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        dC_StatusId: v ?? undefined,
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
                    this.masterDataManagementService.divisionNumberGetDivisionNumbersByConditionPost({
                        needField: true,
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
        return this.masterDataManagementService.divisionNumberCreateOrUpdateDivisionNumberPost({
            businessObjectList: [
                removeNullProperties({
                    ...rowData,
                    ...formValue,
                }),
            ],
        }).pipe(
            map((res) => res.businessObjectList?.[0]),
            shareReplay(1),
        );
    }

    public handleDelete$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any> = ({gridRowData}) => {
        return this.masterDataManagementService.divisionNumberDeleteDivisionNumberDelete({
            divisionNumberIds: [ gridRowData?.divisionNumberId! ],
        });
    }
}
