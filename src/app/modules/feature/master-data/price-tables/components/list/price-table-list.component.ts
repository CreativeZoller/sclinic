import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { BehaviorSubject, concat, debounceTime, map, Observable, of, shareReplay, switchMap, take, tap, throwError } from "rxjs";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { MasterDataManagementService } from "../../../../../../../api/generated/masterdata/api/api";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";
import { ActivatedRoute } from "@angular/router";
import { InitPageData } from "../../../../../app-common/init-page-data-provider/models/init-page-data.model";
import { DatePipe } from "@angular/common";
import { PriceTable } from "../../models/price-table.model";
import { PriceTableStatusEnum } from "../../../../../../../api/enums";
import { ConfirmDialogService } from "../../../../../app-common/confirm-dialog/services/confirm-dialog.service";
import { SelectFieldComponent } from "../../../../../app-common/select-field/components/select-field/select-field.component";
import { CoreModelsMasterDataPriceTableGetPriceTableByConditionRequest } from "../../../../../../../api/models";
import { TextFieldComponent } from "../../../../../app-common/text-field/components/text-field/text-field.component";
import { DatepickerFieldComponent } from "../../../../../app-common/datepicker-field/components/datepicker-field/datepicker-field.component";
import { PaginationConfig } from "../../../../../../components/table/pagination/pagination.component";


type Full_Model = PriceTable;

@UntilDestroy()
@Component({
    selector: "app-price-table-list",
    templateUrl: "./price-table-list.component.html",
    styleUrls: ["./price-table-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceTableListComponent {

    private masterDataManagementService = inject(MasterDataManagementService);
    private confirmDialogService = inject(ConfirmDialogService);
    private resourceService = inject(ResourceService);
    private activatedRoute = inject(ActivatedRoute);
    private datePipe = inject(DatePipe);

    public activePriceTable: Full_Model | undefined;
    public pendingActivePriceTable: Full_Model | undefined;

    private initData = this.activatedRoute.snapshot.data["init"] as InitPageData;

    public baseResourceKey = "price.table";
    public tableIdProperty = "priceTableId";

    private filterData$ = new BehaviorSubject<CoreModelsMasterDataPriceTableGetPriceTableByConditionRequest>({});

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("price.table.list.table.headers.priceTableName"),
            attributeName: "priceTableName",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        priceTableName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("price.table.list.table.headers.dC_PriceTableStatusId"),
            attributeName: "dC_PriceTableStatusId",
            formatterFn: (v) => this.initData.dC_PriceTableStatusList.find((item) => item.value === v)?.name,
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.dC_PriceTableStatusList;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        dC_PriceTableStatusId: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("price.table.list.table.headers.parentPriceTable.priceTableName"),
            attributeName: "parentPriceTable.priceTableName",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        parentPriceTableName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("price.table.list.table.headers.startDate"),
            attributeName: "startDate",
            formatterFn: (v) => this.datePipe.transform(v),
            headerSearchComponent: DatepickerFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: DatepickerFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        startDate: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("price.table.list.table.headers.endDate"),
            attributeName: "endDate",
            formatterFn: (v) => this.datePipe.transform(v),
            headerSearchComponent: DatepickerFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: DatepickerFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        endDate: v ?? undefined,
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
                    this.masterDataManagementService.priceTableGetPriceTableByConditionPost({
                        ...filterData,
                        needParentPriceTable: true,
                        needOrderByPriceTableStatus: true,
                        needPriceTemplate: true,

                        page: pageConfig.currentSelectedPage,
                        pageSize: pageConfig.rowsPerPage,
                    }).pipe(
                        tap(res => {
                            if (res && res.totalRecordCount != null) {
                                this.totalRecordCount$.next(res.totalRecordCount);
                            }
                        }),
                        map(res => res?.businessObjectList ?? []),
                        tap(res => {
                            this.activePriceTable = res.find(x => x.dC_PriceTableStatusId === PriceTableStatusEnum.ACTIVE);
                            if (!this.activePriceTable) this.fetchActivePriceTableData();

                            this.pendingActivePriceTable = res.find(x => x.dC_PriceTableStatusId === PriceTableStatusEnum.PENDING_ACTIVATION);
                            if (!this.pendingActivePriceTable) this.fetchPendingActivePriceTableData();
                        }),
                        shareReplay(1),
                    ),
                );
            }),
        );
    }

    private fetchActivePriceTableData() {
        this.masterDataManagementService.priceTableGetPriceTableByConditionPost({
            dC_PriceTableStatusId: PriceTableStatusEnum.ACTIVE,
        }).pipe(
            map(res => res?.businessObjectList ?? []),
            take(1),
            untilDestroyed(this),
        ).subscribe((list) => {
            this.activePriceTable = list.find(x => x.dC_PriceTableStatusId === PriceTableStatusEnum.ACTIVE);
        });
    }

    private fetchPendingActivePriceTableData() {
        this.masterDataManagementService.priceTableGetPriceTableByConditionPost({
            dC_PriceTableStatusId: PriceTableStatusEnum.PENDING_ACTIVATION
        }).pipe(
            map(res => res?.businessObjectList ?? []),
            take(1),
            untilDestroyed(this),
        ).subscribe((list) => {
            this.pendingActivePriceTable = list.find(x => x.dC_PriceTableStatusId === PriceTableStatusEnum.PENDING_ACTIVATION);
        });
    }

    public handleSave$?: (data: ListHandlerCallbackData<Full_Model, Full_Model>) => Observable<any> = ({ formValue }) => {
        const isConfirmed$ = (formValue.dC_PriceTableStatusId == PriceTableStatusEnum.ACTIVE)
            ? this.confirmDialogService.confirm()
            : of(true);

        return isConfirmed$.pipe(
            switchMap((isConfirmed) => {
                if (!isConfirmed) return throwError(() => new Error(this.resourceService.resolve("general.action.label.back")));

                return this.masterDataManagementService.priceTableCreateOrUpdatePriceTablePost({
                    businessObject: {
                        ...formValue,
                    },
                }).pipe(
                    map((res) => res.businessObject),
                    shareReplay(1),
                );
            }),
        );
    }

    public handleDelete$?: (data: ListHandlerCallbackData<Full_Model, Full_Model>) => Observable<any> = ({ gridRowData }) => {
        return this.masterDataManagementService.priceTableDeletePriceTableDelete({
            priceTableIds: [gridRowData?.priceTableId!],
        });
    }
}
