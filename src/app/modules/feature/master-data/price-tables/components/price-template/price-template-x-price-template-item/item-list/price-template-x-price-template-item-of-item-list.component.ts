import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { map, Observable } from "rxjs";
import { BasePriceTemplateXPriceTemplateItemGenericListComponent } from "../generic-list/price-template-x-price-template-item-generic-list.component";
import { Item } from "../../../../../items/models/item.model";
import { MasterDataManagementService } from "../../../../../../../../../api/services";


type Model = Item & {
    basePrice?: number;
    basePriceEUR?: number;
};

@UntilDestroy()
@Component({
    selector: "app-price-template-x-price-template-item-of-item-list",
    templateUrl: "./price-template-x-price-template-item-of-item-list.component.html",
    styleUrls: ["./price-template-x-price-template-item-of-item-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceTemplateXPriceTemplateItemOfItemListComponent extends BasePriceTemplateXPriceTemplateItemGenericListComponent<Model> {

    private masterDataManagementService = inject(MasterDataManagementService);

    public baseResourceKey: string = "price.template.of.item";
    public tableIdProperty: keyof Model = "itemId";
    public getPriceTemplateItemsOfModel = (model: Model) => model.smallPriceList ?? [];
    public modelSpecificTableHeaders: TableHeader<Model>[] = [
        {
            name: this.resourceService.resolve("price.template.of.item.list.table.headers.itemName"),
            formatterFn: (_, row: Model) => row?.itemName,
        },
    ];
    @Input() public getModelList$ = (priceTableId?: number) : Observable<Model[]> => {
        return this.masterDataManagementService.itemGetItemByConditionPost({
            needPricesForPriceTable: true,
            priceTableId: priceTableId,
            // TODO needs
        }).pipe(
            map(res => res?.businessObjectList ?? []),
            map(list => list.map(model => ({
                ...model,
                basePrice: model.sellingPrice,
                basePriceEUR: 0,// TODO ez honna jön majd? "sellingPrice_EUR" ??
            })))
        );
    };
}

