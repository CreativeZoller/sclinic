import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { BehaviorSubject, combineLatest, concat, debounceTime, map, Observable, of, shareReplay, switchMap, tap } from "rxjs";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ResourceService } from "../../../../../../core/resource/services/resource.service";
import { ActivatedRoute } from "@angular/router";
import { InitPageDataProviderService } from "../../../../../../app-common/init-page-data-provider/services/init-page-data-provider.service";
import { ServicePackageTypeEnum } from "../../../../../../../../api/enums";
import { CoreModelsDTOsMasterDataMainTablesPriceTableDTO, CoreModelsMasterDataServicePackageGetServicePackageByConditionRequest } from "../../../../../../../../api/models";
import { SelectFieldComponent } from "../../../../../../app-common/select-field/components/select-field/select-field.component";
import { NumberFieldComponent } from "../../../../../../app-common/number-field/components/number-field/number-field.component";
import { TextFieldComponent } from "../../../../../../app-common/text-field/components/text-field/text-field.component";
import { isEmpty } from "../../../../../../core/utility/methods/is-empty";
import { PaginationConfig } from "../../../../../../../components/table/pagination/pagination.component";
import { ServicePackage } from "../../../../../master-data/service-packages/models/service-package.model";


type Full_Model = ServicePackage

@UntilDestroy()
@Component({
    selector: "app-reception-price-of-service-package-list",
    templateUrl: "./reception-price-of-service-package-list.component.html",
    styleUrls: ["./reception-price-of-service-package-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceptionPriceOfServicePackageListComponent {

    private masterDataManagementService = inject(MasterDataManagementService);
    private resourceService = inject(ResourceService);

    private activatedRoute = inject(ActivatedRoute);
    private initPageDataProviderService = inject(InitPageDataProviderService);
    protected initData = this.initPageDataProviderService.getInitData(this.activatedRoute.snapshot);

    public baseResourceKey = "reception.prices.modal.service.package";
    public tableIdProperty = "servicePackageId";

    protected activePriceTable$ = new BehaviorSubject<CoreModelsDTOsMasterDataMainTablesPriceTableDTO | undefined>(undefined);
    @Input() set activePriceTable(activePriceTable: CoreModelsDTOsMasterDataMainTablesPriceTableDTO | undefined | null) {
        this.activePriceTable$.next(activePriceTable ?? undefined);
    }

    protected priceTemplates$ = this.activePriceTable$.pipe(
        map((activePriceTable) => activePriceTable?.priceTemplate ?? []),
        shareReplay(1),
    );

    private filterData$ = new BehaviorSubject<CoreModelsMasterDataServicePackageGetServicePackageByConditionRequest>({});

    protected tableHeaders$: Observable<TableHeader[]> = this.priceTemplates$.pipe(
        map((priceTemplates) => {
            return <TableHeader[]>[
                {
                    name: this.resourceService.resolve("reception.prices.modal.service.package.list.table.headers.dC_ServicePackageCategoryId"),
                    attributeName: "dC_ServicePackageCategoryId",
                    formatterFn: (v) => this.initData.dC_ServicePackageCategoryList.find(item => item.value === v)?.name,
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
                    name: this.resourceService.resolve("reception.prices.modal.service.package.list.table.headers.servicePackageName"),
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
                    name: this.resourceService.resolve("reception.prices.modal.service.package.list.table.headers.basePrice"),
                    attributeName: "basePrice",
                    headerSearchComponent: NumberFieldComponent,
                    initHeaderSearchComponentBindingsFn: (instance: NumberFieldComponent) => {
                        instance.placeholder = this.resourceService.resolve("general.action.label.search");
                        instance.classes = ["form-control--search"];
                        instance.hideStepping = true;
                        instance.registerOnChange((v) => {
                            this.filterData$.next({
                                ...this.filterData$.value,
                                basePrice: v ?? undefined,
                            });
                        });
                    },
                },
                // TODO ha kellene az EUR oszlop is:
                // {
                //     name: this.resourceService.resolve("reception.prices.modal.service.package.list.table.headers.basePriceEUR"),
                //     attributeName: "basePriceEUR",
                //     headerSearchComponent: NumberFieldComponent,
                //     initHeaderSearchComponentBindingsFn: (instance: NumberFieldComponent) => {
                //         instance.placeholder = this.resourceService.resolve("general.action.label.search");
                //         instance.classes = ["form-control--search"];
                //         instance.hideStepping = true;
                //         instance.registerOnChange((v) => {
                //             this.filterData$.next({
                //                 ...this.filterData$.value,
                //                 basePriceEUR: v ?? undefined,
                //             });
                //         });
                //     },
                // },
                ...priceTemplates.map((priceTemplate) => {
                    return <TableHeader>{
                        name: priceTemplate.priceTemplateName,
                        formatterFn: (row: Full_Model) => row
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
            ]
        }),
    );

    private refreshTableData$ = new BehaviorSubject<void>(void 0);
    public showTableLoading$ = new BehaviorSubject<boolean>(true);

    public totalRecordCount$ = new BehaviorSubject<number>(0);
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
                                dC_ServicePackageTypeIdList: [ServicePackageTypeEnum.PACKAGE],
                                needBookingArea: true,
                                priceTableId: activePriceTable?.priceTableId ?? undefined,
                                needPricesForPriceTable: true,
                                needService: true,
                                needServicePackage: true,
                                needRole: true,
                                needLabService: true,
                                needSubServicePackage: true,
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
                    )
                );
            }),
        );
    }
}
