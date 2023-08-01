import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { Item } from "../../../models/item.model";
import { CurrencyPipe } from "@angular/common";


type Full_Model = Item;

@UntilDestroy()
@Component({
    selector: "app-item-x-sub-item-list-field",
    templateUrl: "./item-x-sub-item-list-field.component.html",
    styleUrls: ["./item-x-sub-item-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ItemXSubItemListFieldComponent extends BaseListFieldComponent<Full_Model> {

    private currencyPipe = inject(CurrencyPipe);
    public baseResourceKey = "item.sub.item";
    public tableIdProperty = "itemXSubItemId";

    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;
    @Input() public parent: Full_Model | null;
    @Input() public nestingLevel: number;


    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("item.sub.item.list.table.headers.subItemName"),
            attributeName: "subItemName",
        },
        {
            name: this.resourceService.resolve("item.sub.item.list.table.headers.subItemNumber"),
            attributeName: "subItemNumber",
        },
        {
            name: this.resourceService.resolve("item.sub.item.list.table.headers.dC_ItemCategoryId"),
            attributeName: "dC_ItemCategoryId",
            formatterFn: (v) => this.initData.dC_ItemCategoryList.find((item) => item.value === v)?.name,
        },
        {
            name: this.resourceService.resolve("item.sub.item.list.table.headers.purchasePrice"),
            attributeName: "purchasePrice",
            formatterFn: (v) => this.currencyPipe.transform(v, "Ft", "code", "1.0-0", "hu"),
        },
        {
            name: this.resourceService.resolve("item.sub.item.list.table.headers.sellingPrice"),
            attributeName: "sellingPrice",
            formatterFn: (v) => this.currencyPipe.transform(v, "Ft", "code", "1.0-0", "hu")
        },
        {
            name: this.resourceService.resolve("item.sub.item.list.table.headers.dC_ItemStatusId"),
            attributeName: "dC_ItemStatusId",
            formatterFn: (v) => this.initData.dC_ItemStatusList.find((item) => item.value === v)?.name,
        },
    ];
}
