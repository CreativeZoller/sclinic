import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, OnInit, HostListener, ChangeDetectorRef, ViewChild, Type, Directive } from "@angular/core";
import { TableHeader } from "../../../../../../../../components/table/table/table-header";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BaseControlValueAccessor } from "../../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BehaviorSubject, buffer, debounceTime, distinctUntilChanged, filter, map, Observable, shareReplay, skip, Subject, switchMap, take, tap, withLatestFrom } from "rxjs";
import { PriceTable } from "../../../../models/price-table.model";
import { PriceTemplate } from "../../../../models/price-template.model";
import { PriceTemplateItem } from "../../../../models/price-template-item.model";
import { ActivatedRoute } from "@angular/router";
import { InitPageDataProviderService } from "../../../../../../../app-common/init-page-data-provider/services/init-page-data-provider.service";
import { CommonModule } from "@angular/common";
import { NumberFieldComponent } from "../../../../../../../app-common/number-field/components/number-field/number-field.component";
import { DynamicComponentModule } from "../../../../../../../../components/dynamic-component/dynamic-component.module";
import { DynamicComponentDirective } from "../../../../../../../../components/dynamic-component/directives/dynamic-component.directive";
import { InlineSVGModule } from "ng-inline-svg-2";
import { BASE_PRICE_TEMPLATE_INDEX, EUR_PRICE_TEMPLATE_INDEX } from "../../list-form-field/price-template-list-form-field.component";
import { ResourceService } from "../../../../../../../core/resource/services/resource.service";


type ModelWithPriceTemplateItemList<Model> = Model & { priceTemplateItemList: PriceTemplateItem[] };
type ReducedPriceTemplateItemModel = Pick<PriceTemplateItem, "price" | "priceTemplateId">

@UntilDestroy()
@Component({
    selector: "app-price-template-x-price-template-item-generic-list",
    templateUrl: "./price-template-x-price-template-item-generic-list.component.html",
    styleUrls: ["./price-template-x-price-template-item-generic-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceTemplateXPriceTemplateItemGenericListComponent<Model extends { basePrice?: number; basePriceEUR?: number; }> implements OnInit {

    private resourceService = inject(ResourceService);
    private cdr = inject(ChangeDetectorRef);

    private activatedRoute = inject(ActivatedRoute);
    private initPageDataProviderService = inject(InitPageDataProviderService);
    protected initData = this.initPageDataProviderService.getInitData(this.activatedRoute.snapshot);

    @Input() public baseResourceKey: string;
    @Input() public tableIdProperty: keyof Model;
    @Input() public getPriceTemplateItemsOfModel: (model: Model) => ReducedPriceTemplateItemModel[];
    @Input() public modelSpecificTableHeaders: TableHeader<ModelWithPriceTemplateItemList<Model>>[];
    @Input() public getModelList$: (priceTableId?: number) => Observable<Model[]>;

    private priceTableId$ = new BehaviorSubject<PriceTable["priceTableId"] | undefined>(undefined);
    @Input() set priceTableId(priceTableId: PriceTable["priceTableId"] | undefined | null) {
        this.priceTableId$.next(priceTableId ?? undefined);
    }

    private priceTemplates$ = new BehaviorSubject<PriceTemplate[] | undefined>(undefined);
    @Input() set priceTemplates(priceTemplates: PriceTemplate[] | undefined | null) {
        this.priceTemplates$.next(priceTemplates ?? undefined);
    }

    @Output() copyPriceTemplateAtIndex = new EventEmitter<number>();
    @Output() editPriceTemplateAtIndex = new EventEmitter<number>();
    @Output() changePriceTemplates = new EventEmitter<PriceTemplate[]>();

    protected showTableLoading$ = new BehaviorSubject<boolean>(true);

    @Output() loadingChanged = new EventEmitter<boolean>();
    @Output() hasLoadingErrorChanged = new EventEmitter<boolean>();

    protected tableHeaders$: Observable<TableHeader[]> = this.priceTemplates$.pipe(
        filter(priceTemplates => priceTemplates != null),
        map((priceTemplates) => {
            return <TableHeader<ModelWithPriceTemplateItemList<Model>>[]>[
                ...this.modelSpecificTableHeaders,
                {
                    cellClasses: ["price-col"],
                    headerClasses: ["price-col", "p-0", "h-0"],
                    formatterFn: (_, row: ModelWithPriceTemplateItemList<Model>) => row?.basePrice,
                    headerComponent: HeaderCellComponentWithButtonComponent,
                    initHeaderComponentBindingsFn: (instance: HeaderCellComponentWithButtonComponent) => {
                        instance.label = this.resourceService.resolve("price.template.list.table.headers.basePrice");
                        instance.btnClick.pipe(
                            untilDestroyed(this),
                            untilDestroyed(instance),
                        ).subscribe(() => {
                            this.copyPriceTemplateAtIndex.emit(BASE_PRICE_TEMPLATE_INDEX);
                            this.cdr.markForCheck();
                        });
                    },
                },
                {
                    cellClasses: ["price-col"],
                    headerClasses: ["price-col", "p-0", "h-0"],
                    formatterFn: (_, row: ModelWithPriceTemplateItemList<Model>) => row?.basePriceEUR,
                    headerComponent: HeaderCellComponentWithButtonComponent,
                    initHeaderComponentBindingsFn: (instance: HeaderCellComponentWithButtonComponent) => {
                        instance.label = this.resourceService.resolve("price.template.list.table.headers.basePriceEUR");
                        instance.btnClick.pipe(
                            untilDestroyed(this),
                            untilDestroyed(instance),
                        ).subscribe(() => {
                            this.copyPriceTemplateAtIndex.emit(EUR_PRICE_TEMPLATE_INDEX);
                            this.cdr.markForCheck();
                        });
                    },
                },
                ...priceTemplates!.map((priceTemplate, priceTemplateIndex) => {
                    return <TableHeader>{
                        cellClasses: ["price-col", "p-0"],
                        headerClasses: ["price-col", "p-0", "h-0"],
                        headerComponent: HeaderCellComponentWithButtonComponent,
                        initHeaderComponentBindingsFn: (instance: HeaderCellComponentWithButtonComponent) => {
                            instance.label = priceTemplate.priceTemplateName ?? "";
                            instance.btnClick.pipe(
                                untilDestroyed(this),
                                untilDestroyed(instance),
                            ).subscribe(() => {
                                this.copyPriceTemplateAtIndex.emit(priceTemplateIndex);
                                this.cdr.markForCheck();
                            });

                            instance.doubleClick.pipe(
                                untilDestroyed(this),
                                untilDestroyed(instance),
                            ).subscribe(() => {
                                this.editPriceTemplateAtIndex.emit(priceTemplateIndex);
                                this.cdr.markForCheck();
                            });
                        },
                        cellComponent: InlineEditableCellComponent,
                        initCellComponentBindingsFactoryFn: (_, row: ModelWithPriceTemplateItemList<Model>, rowIndex: number) => {
                            return (instance: InlineEditableCellComponent<NumberFieldComponent>) => {
                                instance.value = row
                                    ?.priceTemplateItemList?.[priceTemplateIndex]
                                    ?.price ?? 0;

                                instance.formFieldComponent = NumberFieldComponent;
                                instance.initFormFieldComponentBindingsFn = (instance: NumberFieldComponent) => {
                                    instance.hideLabel = true;
                                    instance.autoSizeConfig = { autoSize: true, minCharLen: 2 };
                                }

                                instance.changeValue.pipe(
                                    untilDestroyed(this),
                                    untilDestroyed(instance),
                                ).subscribe((newPrice) => {
                                    this.modelsWithPriceTemplateItemList$.next(
                                        this.modelsWithPriceTemplateItemList$.value.map((model, modelIndex) => ({
                                            ...model,
                                            priceTemplateItemList: model.priceTemplateItemList.map((pti, ptiIndex) => ({
                                                ...pti,
                                                price: (modelIndex === rowIndex && ptiIndex === priceTemplateIndex)
                                                    ? (newPrice ?? 0)
                                                    : (pti.price ?? 0),
                                                specialtyId: (model as any)?.specialtyId,
                                            })),
                                        }))
                                    );

                                    this.cdr.markForCheck();
                                })
                            }
                        },
                    }
                }),
            ]
        }),
    );

    private modelsWithPriceTemplateItemList$ = new BehaviorSubject<ModelWithPriceTemplateItemList<Model>[]>([]);

    public ngOnInit() {
        if (this.baseResourceKey == null) throw new Error("Missing input `baseResourceKey`!");
        if (this.tableIdProperty == null) throw new Error("Missing input `tableIdProperty`!");
        if (this.getPriceTemplateItemsOfModel == null) throw new Error("Missing input `getPriceTemplateItemsOfModel`!");
        if (this.modelSpecificTableHeaders == null) throw new Error("Missing input `modelSpecificTableHeaders`!");

        this.priceTableId$.pipe(
            filter(v => v != null),
            distinctUntilChanged(),
            tap(() => {
                this.showTableLoading$.next(true);
                this.loadingChanged.emit(true);
            }),
            switchMap((priceTableId) => this.getModelList$(priceTableId)),
            tap({
                error: () => {
                    this.hasLoadingErrorChanged.emit(true);
                    this.showTableLoading$.next(false);
                    this.loadingChanged.emit(false);
                },
            }),
            withLatestFrom(this.priceTemplates$.pipe(filter(v => v != null))),
            untilDestroyed(this),
        ).subscribe(([modelList, priceTablePriceTemplates]) => {
            this.modelsWithPriceTemplateItemList$.next(
                modelList.map(model => {
                    const priceTemplateItemMap: Record<string | number, PriceTemplateItem> = {};
                    for (const priceTablePriceTemplate of priceTablePriceTemplates!) {
                        priceTemplateItemMap[priceTablePriceTemplate.priceTemplateId!] = {
                            [this.tableIdProperty]: model[this.tableIdProperty],
                            priceTemplateId: priceTablePriceTemplate.priceTemplateId,
                            price: 0,
                            specialtyId: (model as any)?.specialtyId,
                        }
                    }

                    for (const priceTemplateItem of this.getPriceTemplateItemsOfModel(model)) {
                        if (priceTemplateItem.priceTemplateId != null) {
                            const pti = priceTemplateItemMap[priceTemplateItem.priceTemplateId];

                            if (pti != null) {
                                pti.price = priceTemplateItem.price ?? 0;
                            }
                        }
                    }

                    return {
                        ...model,
                        priceTemplateItemList: priceTablePriceTemplates!.map(pt => priceTemplateItemMap[pt.priceTemplateId!]),
                    };
                })
            );

            this.showTableLoading$.next(false);
            this.loadingChanged.emit(false);

            this.cdr.markForCheck();
        });

        this.modelsWithPriceTemplateItemList$.pipe(
            untilDestroyed(this),
            withLatestFrom(this.priceTemplates$.pipe(filter(v => v != null))),
        ).subscribe(([modelsWithPriceTemplateItemList, priceTemplates]) => {
            this.changePriceTemplates.emit(
                priceTemplates!.map((pt, ptIndex) => ({
                    ...pt,
                    priceTemplateItem: modelsWithPriceTemplateItemList.map(s => s?.priceTemplateItemList[ptIndex]!),
                }))
            );

            this.cdr.markForCheck();
        });
    }

    public onCopyPriceTemplateAtIndex(priceTemplateIndex: number) {
        const priceTemplateIndexList = [priceTemplateIndex];// Can handle multiple copy if needed

        let modelsWithPriceTemplateItemList = [...this.modelsWithPriceTemplateItemList$.value];
        for(const priceTemplateIndex of priceTemplateIndexList) {
            modelsWithPriceTemplateItemList = modelsWithPriceTemplateItemList.map(model => {
                return {
                    ...model,
                    priceTemplateItemList: [
                        ...model.priceTemplateItemList,
                        {
                            ...model.priceTemplateItemList[priceTemplateIndex],
                            priceTemplateId: 0,
                            priceTemplateItemId: 0,
                            [this.tableIdProperty]: model[this.tableIdProperty],
                            price: (priceTemplateIndex === EUR_PRICE_TEMPLATE_INDEX) ? model.basePriceEUR ?? 0
                                : (priceTemplateIndex === BASE_PRICE_TEMPLATE_INDEX) ? model.basePrice ?? 0
                                : model.priceTemplateItemList[priceTemplateIndex]?.price ?? 0,
                            specialtyId: (model as any)?.specialtyId,
                        },
                    ],
                };
            });
        }

        // Wait untill the new priceTemplates are set
        this.priceTemplates$.pipe(skip(1), take(1), untilDestroyed(this)).subscribe(
            () => {
                this.modelsWithPriceTemplateItemList$.next(modelsWithPriceTemplateItemList);
                this.cdr.markForCheck();
            }
        );
    }

    public getTableData$ = () => this.modelsWithPriceTemplateItemList$.pipe(shareReplay(1));
}


@Directive()
export class BasePriceTemplateXPriceTemplateItemGenericListComponent<Model extends { basePrice?: number; basePriceEUR?: number; }> {

    protected resourceService = inject(ResourceService);
    protected activatedRoute = inject(ActivatedRoute);
    protected initPageDataProviderService = inject(InitPageDataProviderService);
    protected initData = this.initPageDataProviderService.getInitData(this.activatedRoute.snapshot);

    @Input() priceTableId: PriceTable["priceTableId"] | undefined | null;
    @Input() priceTemplates: PriceTemplate[] | undefined | null;

    @Output() copyPriceTemplateAtIndex = new EventEmitter<number>();
    @Output() editPriceTemplateAtIndex = new EventEmitter<number>();
    @Output() changePriceTemplates = new EventEmitter<PriceTemplate[]>();

    @Output() loadingChanged = new EventEmitter<boolean>();
    @Output() hasLoadingErrorChanged = new EventEmitter<boolean>();

    @ViewChild(PriceTemplateXPriceTemplateItemGenericListComponent) wrappedComponent: PriceTemplateXPriceTemplateItemGenericListComponent<Model>;
    public onCopyPriceTemplateAtIndex(priceTemplateIndex: number) {
        return this.wrappedComponent.onCopyPriceTemplateAtIndex(priceTemplateIndex);
    }
}


@UntilDestroy()
@Component({
    standalone: true,
    template: `
        <ng-container *ngIf="!enableEditor">{{value}}</ng-container>
        <ng-container *ngIf="enableEditor">
            <ng-template appDynamicComponent
                [component]="formFieldComponent"
                [initComponentBindingFn]="initFormFieldComponentBindingsFn"
            ></ng-template>

            <div (click)="closeEditor(true)" class="btn customBtn">
                <i class="bi bi-check"></i>
            </div>

            <div (click)="closeEditor(false)" class="btn customBtn customBtn--secondary">
                <i class="bi bi-x"></i>
            </div>
        </ng-container>
    `,
    styles: [`
        :host {
            padding: 0.75rem;
            display: flex;
            flex-direction: row;
            gap: 5px;

            .customBtn {
                padding: 0.25rem !important;
                border-radius: 0.5rem !important;
                font-size: 20px !important;
            }

            .bi {
                font-size: inherit !important;
                color: inherit !important;
                margin: 0 !important;
                padding: 0.25rem !important;
            }
        }
    `],
    imports: [CommonModule, DynamicComponentModule],
})
class InlineEditableCellComponent<K extends BaseControlValueAccessor = BaseControlValueAccessor> {

    private cdr = inject(ChangeDetectorRef);

    @Input() value: K["value"] | undefined;
    @Output() changeValue = new EventEmitter<K["value"] | undefined>();

    private click$ = new Subject<void>();
    @HostListener("click") onHostClick() { this.click$.next(); }

    public enableEditor = false;

    @ViewChild(DynamicComponentDirective) dynamicComponentDirective?: DynamicComponentDirective<K>;
    @Input() public formFieldComponent: Type<K> | undefined;
    @Input() initFormFieldComponentBindingsFn: (instance: K) => void | undefined;

    constructor() {
        this.click$.pipe(
            buffer(this.click$.pipe(debounceTime(250))),
            map((clicks) => clicks.length),
            untilDestroyed(this),
        ).subscribe((clickCount) => {
            if (clickCount === 2 && this.enableEditor === false) {
                this.enableEditor = true;
                this.cdr.markForCheck();

                setTimeout(() => {
                    this.dynamicComponentDirective?.instance?.writeValue(this.value);
                    this.cdr.markForCheck();
                });
            }
        });
    }

    closeEditor(saveValue: boolean) {
        if (saveValue) {
            this.value = this.dynamicComponentDirective?.instance?.value;
            this.changeValue.next(this.value);
        }

        this.enableEditor = false;
        this.cdr.markForCheck();
    }
}


@UntilDestroy()
@Component({
    standalone: true,
    template: `
        <div class="d-flex flex-row gap-1 align-items-center">
            <span>{{label}}</span>

            <span
                [inlineSVG]="'./assets/images/icons/plus.svg'"
                class="svg-icon svg-icon-1 svg-icon-add"
                (click)="btnClick.emit()"
            ></span>
        </div>
    `,
    styles: [`
        @import "/src/assets/sass/variables";

        :host {
            display: flex;
            padding: 0.75rem;
            width: 100%;
            height: 100%;
            user-select: none;

            ::ng-deep {
                .svg-icon.svg-icon-1.svg-icon-add {
                    cursor: pointer;

                    svg {
                        width: 1.5em !important;
                        height: 1.5em !important;
                        color: $red;

                        path {
                            stroke-width: 4px;
                        }
                    }
                }
            }
        }
    `],
    imports: [CommonModule, InlineSVGModule],
})
class HeaderCellComponentWithButtonComponent {

    private cdr = inject(ChangeDetectorRef);

    @Input() label: string = "";
    @Output() btnClick = new EventEmitter<void>();
    @Output() doubleClick = new EventEmitter<void>();

    private click$ = new Subject<void>();
    @HostListener("click") onHostClick() { this.click$.next(); }

    constructor() {
        this.click$.pipe(
            buffer(this.click$.pipe(debounceTime(250))),
            map((clicks) => clicks.length),
            untilDestroyed(this),
        ).subscribe((clickCount) => {
            if (clickCount === 2) {
                this.doubleClick.emit();
                this.cdr.markForCheck();
            }
        });
    }
}
