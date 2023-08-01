import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { BehaviorSubject, combineLatest, concat, debounceTime, map, Observable, of, shareReplay, switchMap, tap } from "rxjs";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { ServiceSubPackage } from "../../models/service-sub-package.model";
import { MasterDataManagementService } from "../../../../../../../api/services";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";
import { ActivatedRoute } from "@angular/router";
import { InitPageDataProviderService } from "../../../../../app-common/init-page-data-provider/services/init-page-data-provider.service";
import { PriceTableStatusEnum, ServicePackageTypeEnum } from "../../../../../../../api/enums";
import { CheckboxFieldComponent } from "../../../../../app-common/checkbox-field/components/checkbox-field/checkbox-field.component";
import { ToastrService } from "ngx-toastr";
import { CoreModelsMasterDataServicePackageGetServicePackageByConditionRequest } from "../../../../../../../api/models";
import { TextFieldComponent } from "../../../../../app-common/text-field/components/text-field/text-field.component";
import { SelectFieldComponent } from "../../../../../app-common/select-field/components/select-field/select-field.component";
import { isEmpty } from "../../../../../core/utility/methods/is-empty";
import { NumberFieldComponent } from "../../../../../app-common/number-field/components/number-field/number-field.component";
import { PaginationConfig } from "../../../../../../components/table/pagination/pagination.component";


type Full_Model = ServiceSubPackage

@UntilDestroy()
@Component({
    selector: "app-service-sub-package-list",
    templateUrl: "./service-sub-package-list.component.html",
    styleUrls: ["./service-sub-package-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceSubPackageListComponent {

    private toastrService = inject(ToastrService);
    private masterDataManagementService = inject(MasterDataManagementService);
    private resourceService = inject(ResourceService);

    private activatedRoute = inject(ActivatedRoute);
    private initPageDataProviderService = inject(InitPageDataProviderService);
    protected initData = this.initPageDataProviderService.getInitData(this.activatedRoute.snapshot);

    public baseResourceKey = "service.sub.package";
    public tableIdProperty = "servicePackageId";

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

    private changedRows: Full_Model[] = [];

    private filterData$ = new BehaviorSubject<CoreModelsMasterDataServicePackageGetServicePackageByConditionRequest>({});

    protected tableHeaders$: Observable<TableHeader[]> = this.priceTemplates$.pipe(
        map((priceTemplates) => {
            return <TableHeader[]>[
                {
                    name: this.resourceService.resolve("service.sub.package.list.table.headers.servicePackageName"),
                    attributeName: "servicePackageName",
                    headerSearchComponent: TextFieldComponent,
                    initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                        instance.placeholder = this.resourceService.resolve("general.action.label.search");
                        instance.classes = ["form-control--search"];
                        instance.registerOnChange((v) => {
                            this.filterData$.next({
                                ...this.filterData$.value,
                                servicePackageName: v ?? undefined,
                            });
                        });
                    },
                },
                {
                    name: this.resourceService.resolve("service.sub.package.list.table.headers.dC_SubServicePackageCategoryId"),
                    attributeName: "dC_SubServicePackageCategoryId",
                    formatterFn: (v) => this.initData.dC_SubServicePackageCategoryList.find(item => item.value === v)?.name,
                    headerSearchComponent: SelectFieldComponent,
                    initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                        instance.placeholder = this.resourceService.resolve("general.action.label.search");
                        instance.classes = ["form-control--search"];
                        instance.options = this.initData.dC_ServicePackageCategoryList;
                        instance.writeValue(null);
                        instance.registerOnChange((v) => {
                            this.filterData$.next({
                                ...this.filterData$.value,
                                dC_ServicePackageCategoryIdList: isEmpty(v) ? [] : [v],
                            });
                        });
                    },
                },
                {
                    name: this.resourceService.resolve("service.sub.package.list.table.headers.duration"),
                    attributeName: "duration",
                    headerSearchComponent: NumberFieldComponent,
                    initHeaderSearchComponentBindingsFn: (instance: NumberFieldComponent) => {
                        instance.placeholder = this.resourceService.resolve("general.action.label.search");
                        instance.classes = ["form-control--search"];
                        instance.hideStepping = true;
                        instance.minNumber = 0;
                        instance.registerOnChange((v) => {
                            this.filterData$.next({
                                ...this.filterData$.value,
                                duration: v ?? undefined,
                            });
                        });
                    },
                },
                {
                    name: this.resourceService.resolve("service.sub.package.list.table.headers.basePrice"),
                    attributeName: "basePrice",
                    headerSearchComponent: NumberFieldComponent,
                    initHeaderSearchComponentBindingsFn: (instance: NumberFieldComponent) => {
                        instance.placeholder = this.resourceService.resolve("general.action.label.search");
                        instance.classes = ["form-control--search"];
                        instance.hideStepping = true;
                        instance.minNumber = 0;
                        instance.registerOnChange((v) => {
                            this.filterData$.next({
                                ...this.filterData$.value,
                                basePrice: v ?? undefined,
                            });
                        });
                    },
                },
                {
                    name: this.resourceService.resolve("service.sub.package.list.table.headers.basePriceEUR"),
                    attributeName: "basePriceEUR",
                    headerSearchComponent: NumberFieldComponent,
                    initHeaderSearchComponentBindingsFn: (instance: NumberFieldComponent) => {
                        instance.placeholder = this.resourceService.resolve("general.action.label.search");
                        instance.classes = ["form-control--search"];
                        instance.hideStepping = true;
                        instance.minNumber = 0;
                        instance.registerOnChange((v) => {
                            this.filterData$.next({
                                ...this.filterData$.value,
                                basePriceEUR: v ?? undefined,
                            });
                        });
                    },
                },
                ...priceTemplates.map((priceTemplate) => {
                    return <TableHeader>{
                        name: priceTemplate.priceTemplateName,
                        formatterFn: (value, row: Full_Model) => row
                            ?.smallPriceList
                            ?.find(p => p.priceTemplateId === priceTemplate.priceTemplateId)
                            ?.price,
                        headerSearchComponent: NumberFieldComponent,
                        initHeaderSearchComponentBindingsFn: (instance: NumberFieldComponent) => {
                            instance.placeholder = this.resourceService.resolve("general.action.label.search");
                            instance.classes = ["form-control--search"];
                            instance.hideStepping = true;
                            instance.registerOnChange((v) => {
                                const priceTemplateSearchDetailsWithoutCurrent = this.filterData$.value.priceTemplateSearchDetails
                                    ?.filter(v => v.priceTemplateId !== priceTemplate.priceTemplateId)
                                    ?? []

                                this.filterData$.next({
                                    ...this.filterData$.value,
                                    priceTemplateSearchDetails: v != null
                                        ? [
                                            ...priceTemplateSearchDetailsWithoutCurrent,
                                            {
                                                priceTemplateId: priceTemplate.priceTemplateId,
                                                price: v,
                                            },
                                        ]
                                        : priceTemplateSearchDetailsWithoutCurrent
                                });
                            });
                        },
                    }
                }),
                ...this.initData.dC_BookingAreaList.map((currentBookingArea) => {
                    return <TableHeader>{
                        name: currentBookingArea.name,
                        cellComponent: CheckboxFieldComponent,
                        initCellComponentBindingsFactoryFn: (value, row: Full_Model) => {
                            return (comp: CheckboxFieldComponent) => {
                                const currentBookinAreaValue = row.servicePackageXDC_BookingArea?.find(b => b.dC_BookingAreaId === currentBookingArea.value);
                                comp.writeValue(currentBookinAreaValue != null);

                                comp.registerOnChange((isChecked) => {
                                    let changedRow = this.changedRows.find(r => r.servicePackageId === row.servicePackageId)
                                    if (changedRow == null) {
                                        changedRow = {
                                            ...row,
                                            servicePackageXDC_BookingArea: row.servicePackageXDC_BookingArea?.map((spXba) => ({
                                                servicePackageId: spXba.servicePackageId,
                                                dC_BookingAreaId: spXba.dC_BookingAreaId,
                                            })) ?? [],
                                        };
                                        this.changedRows.push(changedRow);
                                    }

                                    const selectedBookingAreaIds = (isChecked
                                        ? [ ...changedRow.servicePackageXDC_BookingArea ?? [], currentBookingArea.dto ]
                                        : changedRow.servicePackageXDC_BookingArea?.filter(spXba => spXba.dC_BookingAreaId !== currentBookingArea.value) ?? []
                                    ).map(x => x.dC_BookingAreaId);

                                    changedRow.servicePackageXDC_BookingArea = this.initData.dC_BookingAreaList
                                        .filter(ba => selectedBookingAreaIds.includes(ba.value))
                                        .map(ba => ({
                                            servicePackageI: row.servicePackageId,
                                            dC_BookingAreaId: ba.value,
                                        }));
                                });
                            }
                        },
                        headerSearchComponent: SelectFieldComponent,
                        initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                            instance.placeholder = this.resourceService.resolve("general.action.label.search");
                            instance.classes = ["form-control--search"];
                            instance.options = [
                                { name: this.resourceService.resolve("general.label.true"), value: true },
                                { name: this.resourceService.resolve("general.label.false"), value: false },
                            ];
                            instance.writeValue(null);
                            instance.registerOnChange((v) => {
                                const dC_BookingAreaIdList = this.filterData$.value.dC_BookingAreaIdList ?? [];

                                this.filterData$.next({
                                    ...this.filterData$.value,
                                    dC_BookingAreaIdList: v
                                        ? [ ...dC_BookingAreaIdList, currentBookingArea.value ]
                                        : dC_BookingAreaIdList.filter(v => v !== currentBookingArea.value)
                                });
                            });
                        },
                    }
                }),
            ]
        }),
    );

    private refreshTableData$ = new BehaviorSubject<void>(void 0);
    protected showTableLoading$ = new BehaviorSubject<boolean>(true);
    public saveBookingAreasChanges() {
        if (this.changedRows.length > 0) {
            this.showTableLoading$.next(true);

            this.masterDataManagementService.servicePackageCreateOrUpdateServicePackagePost({
                businessObjectList: this.changedRows,
            }).pipe(
                map((res) => res.businessObjectList),
                untilDestroyed(this),
            ).subscribe({
                next: () => {
                    this.changedRows = [];
                    this.refreshTableData$.next();
                },
                error: () => this.showTableLoading$.next(false),
            });
        }
    }

    public totalRecordCount$ = new BehaviorSubject<number>(10);
    public getTableData$: (pageConfig: PaginationConfig) => Observable<Full_Model[]> = (pageConfig) => {
        return this.filterData$.pipe(
            debounceTime(200),
            switchMap((filterData) => {
                return concat(
                    of(undefined as any),
                    combineLatest([
                        this.refreshTableData$,
                        this.activePriceTable$,
                    ]).pipe(
                        tap(() => this.showTableLoading$.next(true)),
                        switchMap(([_, activePriceTable]) => {
                            return this.masterDataManagementService.servicePackageGetServicePackageByConditionPost({
                                ...filterData,
                                dC_ServicePackageTypeIdList: [ServicePackageTypeEnum.SUB_PACKAGE],
                                needBookingArea: true,
                                priceTableId: activePriceTable?.priceTableId ?? undefined,
                                needPricesForPriceTable: true,
                                needService: true,
                                needServicePackage: true,
                                needSubServicePackage: true,
                                needSubSerivePackageService: true,
                                needRole: true,
                                needLabService: true,
                                // TODO needs for servicePackageXContract

                                page: pageConfig.currentSelectedPage,
                                pageSize: pageConfig.rowsPerPage,
                            })
                        }),
                        tap({
                            next: () => this.showTableLoading$.next(false),
                            error: () => this.showTableLoading$.next(false),
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

    public handleSave$?: (data: ListHandlerCallbackData<Full_Model, Full_Model>) => Observable<any> = ({formValue}) => {
        return this.masterDataManagementService.servicePackageCreateOrUpdateServicePackagePost({
            businessObjectList: [{
                ...formValue,
            }],
        }).pipe(
            map((res) => res.businessObjectList),
            shareReplay(1),
        );
    }

    public handleDelete$?: (data: ListHandlerCallbackData<Full_Model, Full_Model>) => Observable<any> = ({gridRowData}) => {
        return this.masterDataManagementService.servicePackageDeleteServicePackageDelete({
            businessObjectList: [ gridRowData?.servicePackageId! ],
        });
    }
}
