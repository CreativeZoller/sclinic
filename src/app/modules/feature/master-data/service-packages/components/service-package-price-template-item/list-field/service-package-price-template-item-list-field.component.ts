import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ServicePackageXPriceTemplateItem } from "../../../models/service-package-x-price-template-item.model";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BehaviorSubject, combineLatest, map, Observable, shareReplay, skip, switchMap, withLatestFrom } from "rxjs";
import { CoreModelsDTOsMasterDataMainTablesPriceTableDTO, CoreModelsDTOsMasterDataMainTablesPriceTemplateDTO } from "../../../../../../../../api/models";
import { DatePipe } from "@angular/common";


export const BASE_PRICE_PRICE_TEMPLATE_ID = "BASE_PRICE" as any;
type Full_Model = ServicePackageXPriceTemplateItem;

@UntilDestroy()
@Component({
    selector: "app-service-package-price-template-item-list-field",
    templateUrl: "./service-package-price-template-item-list-field.component.html",
    styleUrls: ["./service-package-price-template-item-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ServicePackagePriceTemplateItemListFieldComponent extends BaseListFieldComponent<Full_Model> implements AfterViewInit {

    private datePipe = inject(DatePipe);
    public baseResourceKey = "service.package.price.template.item";
    public tableIdProperty = "priceTemplateItemId";

    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("service.package.price.template.item.list.table.headers.priceTemplate.priceTemplateName"),
            attributeName: "priceTemplate.priceTemplateName",
        },
        {
            name: this.resourceService.resolve("service.package.price.template.item.list.table.headers.price"),
            attributeName: "price",
        },
        {
            name: this.resourceService.resolve("service.package.price.template.item.list.table.headers.priceTemplate.startDate"),
            attributeName: "priceTemplate.startDate",
            formatterFn: (v) => this.datePipe.transform(v),
        },
        {
            name: this.resourceService.resolve("service.package.price.template.item.list.table.headers.priceTemplate.endDate"),
            attributeName: "priceTemplate.endDate",
            formatterFn: (v) => this.datePipe.transform(v),
        },
    ];


    private _activePriceTable$ = new BehaviorSubject<CoreModelsDTOsMasterDataMainTablesPriceTableDTO | undefined>(undefined);
    @Input() set activePriceTable(activePriceTable: CoreModelsDTOsMasterDataMainTablesPriceTableDTO | undefined | null) {
        this._activePriceTable$.next(activePriceTable ?? undefined);
    }

    private readonly BASE_PRICE_PRICE_TEMPLATE$ = this._activePriceTable$.pipe(
        map((activePriceTable) => ({
            priceTemplateId: BASE_PRICE_PRICE_TEMPLATE_ID,
            priceTemplateName: this.resourceService.resolve("service.package.price.template.item.list.table.basePriceTemplateName"),
            startDate: activePriceTable?.startDate,
            endDate: activePriceTable?.endDate,
        } as CoreModelsDTOsMasterDataMainTablesPriceTemplateDTO)),
        shareReplay(1),
    );

    private _basePriceValue$ = new BehaviorSubject<Full_Model["price"]>(0);
    @Input() set basePriceValue(basePriceValue: Full_Model["price"] | null) {
        this._basePriceValue$.next(basePriceValue ?? 0);
    }
    @Output() setBasePriceValue = new EventEmitter<Full_Model["price"]>();

    public allPriceTemplates$ = combineLatest([
        this._activePriceTable$,
        this.BASE_PRICE_PRICE_TEMPLATE$,
    ]).pipe(
        map(([activePriceTable, BASE_PRICE_PRICE_TEMPLATE]) => {
            return [
                BASE_PRICE_PRICE_TEMPLATE!,
                ...(activePriceTable?.priceTemplate ?? []),
            ].filter(v => v != null);
        }),
        shareReplay(1),
    )

    public allSelectedPriceTemplates$ = this.getValue$().pipe(
        map((value) => value?.map(v => v.priceTemplate!) ?? []),
        shareReplay(1),
    )

    public canCreate$: Observable<boolean> = combineLatest([
        this.allPriceTemplates$,
        this.allSelectedPriceTemplates$,
    ]).pipe(
        map(([allPriceTemplates, allSelectedPriceTemplates]) => {
            return !(
                allPriceTemplates.length === allSelectedPriceTemplates.length
                && allSelectedPriceTemplates.every(stp => allPriceTemplates.some(tp => tp?.priceTemplateId === stp?.priceTemplateId))
            );
        })
    );

    private getBasePriceRow(rows: Full_Model[] | null | undefined) {
        return rows?.find(pti => {
            return pti.priceTemplateId === BASE_PRICE_PRICE_TEMPLATE_ID
                || pti.priceTemplate?.priceTemplateId === BASE_PRICE_PRICE_TEMPLATE_ID;
        });
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();

        const latestWroteValue$ = new BehaviorSubject<Full_Model[]>([]);
        const listFieldComponent_originalWriteValue = this.listFieldComponent.writeValue.bind(this.listFieldComponent);
        this.listFieldComponent.writeValue = (value: Full_Model[]) => {
            if (!Array.isArray(value)) value = [];
            latestWroteValue$.next(value);
        }

        const listFieldComponent_originalReadValue = this.listFieldComponent.readValue.bind(this.listFieldComponent);
        this.listFieldComponent.readValue = (value: Full_Model[]): Full_Model[] => {
            const transformerValue = listFieldComponent_originalReadValue(value);

            return transformerValue.filter(pti => {
                return pti.priceTemplateId !== BASE_PRICE_PRICE_TEMPLATE_ID
                    && pti.priceTemplate?.priceTemplateId !== BASE_PRICE_PRICE_TEMPLATE_ID;
            })
        }

        latestWroteValue$.pipe(
            untilDestroyed(this),
            switchMap((wroteValue) => {
                listFieldComponent_originalWriteValue(wroteValue);

                return combineLatest([
                    this.BASE_PRICE_PRICE_TEMPLATE$,
                    this._basePriceValue$,
                ]).pipe(
                    withLatestFrom(this.listFieldComponent.getValue$()),
                    switchMap(([[BASE_PRICE_PRICE_TEMPLATE, basePriceValue], rows]) => {
                        listFieldComponent_originalWriteValue([
                            {
                                priceTemplate: BASE_PRICE_PRICE_TEMPLATE,
                                price: basePriceValue,
                            },
                            ...(rows ?? []).filter(pti => {
                                return pti.priceTemplateId !== BASE_PRICE_PRICE_TEMPLATE_ID
                                    && pti.priceTemplate?.priceTemplateId !== BASE_PRICE_PRICE_TEMPLATE_ID;
                            }),
                        ]);

                        return this.listFieldComponent.getValue$().pipe(skip(1));
                    }),
                );
            }),
        ).subscribe((rows) => {
            const basePriceRow = this.getBasePriceRow(rows);

            if (basePriceRow == null) {
                this.setBasePriceValue.emit(0);
            } else {
                this.setBasePriceValue.emit(basePriceRow?.price ?? 0);
            }
        });
    }
}
