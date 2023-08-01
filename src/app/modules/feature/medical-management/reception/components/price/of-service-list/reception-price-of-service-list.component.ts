import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { BehaviorSubject, combineLatest, concat, debounceTime, map, Observable, of, shareReplay, switchMap, tap } from "rxjs";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ResourceService } from "../../../../../../core/resource/services/resource.service";
import { ActivatedRoute } from "@angular/router";
import { InitPageDataProviderService } from "../../../../../../app-common/init-page-data-provider/services/init-page-data-provider.service";
import { CoreModelsDTOsMasterDataMainTablesPriceTableDTO, CoreModelsMasterDataServiceGetServiceByConditionRequest } from "../../../../../../../../api/models";
import { TextFieldComponent } from "../../../../../../app-common/text-field/components/text-field/text-field.component";
import { SelectFieldComponent } from "../../../../../../app-common/select-field/components/select-field/select-field.component";
import { isEmpty } from "../../../../../../core/utility/methods/is-empty";
import { NumberFieldComponent } from "../../../../../../app-common/number-field/components/number-field/number-field.component";
import { PaginationConfig } from "../../../../../../../components/table/pagination/pagination.component";
import { Service } from "../../../../../master-data/services/models/service.model";


type Full_Model = Service

@UntilDestroy()
@Component({
    selector: "app-reception-price-of-service-list",
    templateUrl: "./reception-price-of-service-list.component.html",
    styleUrls: ["./reception-price-of-service-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceptionPriceOfServiceListComponent {

    private masterDataManagementService = inject(MasterDataManagementService);
    private resourceService = inject(ResourceService);

    private activatedRoute = inject(ActivatedRoute);
    private initPageDataProviderService = inject(InitPageDataProviderService);
    protected initData = this.initPageDataProviderService.getInitData(this.activatedRoute.snapshot);

    public baseResourceKey = "reception.prices.modal.service";
    public tableIdProperty = "serviceId";

    protected activePriceTable$ = new BehaviorSubject<CoreModelsDTOsMasterDataMainTablesPriceTableDTO | undefined>(undefined);
    @Input() set activePriceTable(activePriceTable: CoreModelsDTOsMasterDataMainTablesPriceTableDTO | undefined | null) {
        this.activePriceTable$.next(activePriceTable ?? undefined);
    }

    protected priceTemplates$ = this.activePriceTable$.pipe(
        map((activePriceTable) => activePriceTable?.priceTemplate ?? []),
        shareReplay(1),
    );

    private filterData$ = new BehaviorSubject<CoreModelsMasterDataServiceGetServiceByConditionRequest>({});

    protected tableHeaders$: Observable<TableHeader[]> = this.priceTemplates$.pipe(
        map((priceTemplates) => {
            return <TableHeader[]>[
                {
                    name: this.resourceService.resolve("reception.prices.modal.service.list.table.headers.dC_ServiceCategoryId"),
                    attributeName: "dC_ServiceCategoryId",
                    formatterFn: (v) => this.initData.dC_ServiceCategoryList.find(item => item.value === v)?.name,
                    headerSearchComponent: SelectFieldComponent,
                    initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                        instance.placeholder = this.resourceService.resolve("general.action.label.search");
                        instance.classes = ["form-control--search"];
                        instance.options = this.initData.dC_ServiceCategoryList;
                        instance.writeValue(null);
                        instance.registerOnChange((v) => {
                            this.filterData$.next({
                                ...this.filterData$.value,
                                dC_ServiceCategoryIdList: isEmpty(v) ? [] : [v],
                            });
                        });
                    },
                },
                {
                    name: this.resourceService.resolve("reception.prices.modal.service.list.table.headers.serviceName"),
                    attributeName: "serviceName",
                    headerSearchComponent: TextFieldComponent,
                    initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                        instance.placeholder = this.resourceService.resolve("general.action.label.search");
                        instance.classes = ["form-control--search"];
                        instance.registerOnChange((v) => {
                            this.filterData$.next({
                                ...this.filterData$.value,
                                serviceName: v ?? undefined,
                            });
                        });
                    },
                },
                {
                    name: this.resourceService.resolve("reception.prices.modal.service.list.table.headers.basePrice"),
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
                //     name: this.resourceService.resolve("reception.prices.modal.service.list.table.headers.basePriceEUR"),
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
                            return this.masterDataManagementService.serviceGetServiceByConditionPost({
                                ...filterData,
                                priceTableId: activePriceTable?.priceTableId ?? undefined,
                                needBookingArea: true,
                                needPricesForPriceTable: true,
                                needSpecialty: false,
                                needConnectedService: false,
                                needIncompatibleService: false,
                                needMedicalEmployee: false,
                                needItem: false,
                                needLab: false,
                                needRole: false,
                                needServicePackageXService: false,

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
}
