import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ServiceXItem } from "../../../models/service-x-item.model";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { Observable, of, shareReplay } from "rxjs";
import { ListHandlerCallbackData } from "../../../../../../app-common/list/components/list/list.component";
import { FormModel } from "../selection-list-form/service-item-selection-list-form.component";


type Full_Model = ServiceXItem;

@UntilDestroy()
@Component({
    selector: "app-service-item-list-field",
    templateUrl: "./service-item-list-field.component.html",
    styleUrls: ["./service-item-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ServiceItemListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "service.item";
    public tableIdProperty = "serviceXItemId";

    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("service.item.list.table.headers.item.itemNumber"),
            attributeName: "item.itemNumber",
        },
        {
            name: this.resourceService.resolve("service.item.list.table.headers.item.itemName"),
            attributeName: "item.itemName",
        },
        {
            name: this.resourceService.resolve("service.item.list.table.headers.itemConsumption"),
            attributeName: "itemConsumption",
        },
        {
            name: this.resourceService.resolve("service.item.list.table.headers.isRetailable"),
            attributeName: "isRetailable",
            formatterFn: (value) => `<div class="form-check form-check-custom form-check-solid form-check-sm">
                <input type="checkbox" ${value ? "checked" : ""} disabled class="form-check-input">
            </div>`,
        },
        {
            name: this.resourceService.resolve("service.item.list.table.headers.item.dC_ItemTypeId"),
            attributeName: "item.dC_ItemTypeId",
            formatterFn: (v) => this.initData.dC_ItemTypeList.find((item) => item.value === v)?.name,
        },
        {
            name: this.resourceService.resolve("service.item.list.table.headers.dC_ItemConsumerTypeId"),
            attributeName: "dC_ItemConsumerTypeId",
            formatterFn: (v) => this.initData.dC_ItemConsumerTypeList.find((item) => item.value === v)?.name,
        },
    ];

    public allSelectedItems$ = this.getValue$().pipe(
        shareReplay(1),
    );

    public valueToFormValue = (value: any[]) => value;

    public handleSave$: (data: ListHandlerCallbackData<unknown, FormModel>) => Observable<any> = ({formValue}) => {
        this.listFieldComponent.changeValue((formValue?.selectedItems ?? []));

        return of(null);
    }
}
