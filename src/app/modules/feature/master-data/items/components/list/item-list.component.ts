import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { BehaviorSubject, combineLatest, concat, debounceTime, map, Observable, of, shareReplay, switchMap, tap } from "rxjs";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { Item } from "../../models/item.model";
import { MasterDataManagementService } from "../../../../../../../api/services";
import { CurrencyPipe } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";
import { InitPageData } from "../../../../../app-common/init-page-data-provider/models/init-page-data.model";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { PriceTableStatusEnum } from "../../../../../../../api/enums";
import { CoreModelsMasterDataItemGetItemByConditionRequest } from "../../../../../../../api/models";
import { SelectFieldComponent } from "../../../../../app-common/select-field/components/select-field/select-field.component";
import { isEmpty } from "../../../../../core/utility/methods/is-empty";
import { TextFieldComponent } from "../../../../../app-common/text-field/components/text-field/text-field.component";
import { NumberFieldComponent } from "../../../../../app-common/number-field/components/number-field/number-field.component";
import { PaginationConfig } from "../../../../../../components/table/pagination/pagination.component";


type Full_Model = Item

@UntilDestroy()
@Component({
    selector: "app-item-list",
    templateUrl: "./item-list.component.html",
    styleUrls: ["./item-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemListComponent {

    private activatedRoute = inject(ActivatedRoute);
    private resourceService = inject(ResourceService);
    private masterDataManagementService = inject(MasterDataManagementService);
    private currencyPipe = inject(CurrencyPipe);

    public baseResourceKey = "item";
    public tableIdProperty = "itemId";
    private initData = this.activatedRoute.snapshot.data["init"] as InitPageData;

    private filterData$ = new BehaviorSubject<CoreModelsMasterDataItemGetItemByConditionRequest>({});

    tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("item.list.table.headers.itemName"),
            attributeName: "itemName",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        itemName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("item.list.table.headers.subItemName"),
            attributeName: "subItemName",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        subItemName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("item.list.table.headers.dC_ItemCategoryId"),
            attributeName: "dC_ItemCategoryId",
            formatterFn: (v) => this.initData.dC_ItemCategoryList.find((item) => item.value === v)?.name,
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.dC_ItemCategoryList;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        dC_ItemCategoryIds: isEmpty(v) ? [] : [v],
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("item.list.table.headers.purchasePrice"),
            attributeName: "purchasePrice",
            formatterFn: (v) => this.currencyPipe.transform(v, "Ft", "code", "1.0-0", "hu"),
            headerSearchComponent: NumberFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: NumberFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.hideStepping = true;
                instance.minNumber = 0;
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        purchasePrice: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("item.list.table.headers.sellingPrice"),
            attributeName: "sellingPrice",
            formatterFn: (v) => this.currencyPipe.transform(v, "Ft", "code", "1.0-0", "hu"),
            headerSearchComponent: NumberFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: NumberFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.hideStepping = true;
                instance.minNumber = 0;
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        sellingPrice: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("item.list.table.headers.dC_ItemStatusId"),
            attributeName: "dC_ItemStatusId",
            formatterFn: (v) => this.initData.dC_ItemStatusList.find((item) => item.value === v)?.name,
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.dC_ItemStatusList;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        dC_ItemStatusIds: isEmpty(v) ? [] : [v],
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
                    combineLatest([
                        this.activePriceTable$,
                    ]).pipe(
                        switchMap(([activePriceTable]) => {
                            return this.masterDataManagementService.itemGetItemByConditionPost({
                                ...filterData,
                                needParentItem: true,
                                needSubItems: true,
                                needPartner: true,
                                needPricesForPriceTable : true,
                                priceTableId: activePriceTable?.priceTableId,

                                page: pageConfig.currentSelectedPage,
                                pageSize: pageConfig.rowsPerPage,
                            })
                        }),
                        tap(res => {
                            if (res && res.totalRecordCount != null) {
                                this.totalRecordCount$.next(res.totalRecordCount);
                            }
                        }),
                        map(res => res?.businessObjectList ?? []),
                        shareReplay(1),
                    ),
                );
            }),
        );
    }

    public handleSave$?: (data: ListHandlerCallbackData<Full_Model, Full_Model>) => Observable<any> = ({rowData, formValue}) => {
        return this.masterDataManagementService.itemCreateOrUpdateItemPost({
            businessObjectList: [formValue],
        }).pipe(
            map((res) => res.businessObjectList),
            shareReplay(1),
        );
    }

    public handleDelete$?: (data: ListHandlerCallbackData<Full_Model, Full_Model>) => Observable<any> = ({gridRowData}) => {
        return this.masterDataManagementService.itemDeleteItemDelete({
            itemIds: [gridRowData?.itemId!],
        });
    }


    protected activePriceTable$ = this.masterDataManagementService.priceTableGetPriceTableByConditionPost({
        dC_PriceTableStatusId: PriceTableStatusEnum.ACTIVE,
        needPriceTemplate: true
    }).pipe(
        map((resp) => resp.businessObjectList?.[0]),
        shareReplay(1),
    );

    protected priceTemplates$ = this.activePriceTable$.pipe(
        map((activePriceTable) => activePriceTable?.priceTemplate ?? []),
        shareReplay(1),
    );

}
