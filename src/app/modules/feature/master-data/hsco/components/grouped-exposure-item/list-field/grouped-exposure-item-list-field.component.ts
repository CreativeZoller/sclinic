import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { GroupExposureItemList } from "../../../models/occupational.health.service.model";
import { Exposure } from "../../../../exposure/models/exposure.model";


type Full_Model = GroupExposureItemList;

@UntilDestroy()
@Component({
    selector: "app-grouped-exposure-item-list-field",
    templateUrl: "./grouped-exposure-item-list-field.component.html",
    styleUrls: ["./grouped-exposure-item-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class GroupedExposureItemListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "exposure.item";
    public tableIdProperty = "exposureItemId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public  tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("exposure.list.table.headers.description"),
            attributeName: "exposureItem.description",
        },
        {
            name: this.resourceService.resolve("exposure.list.table.headers.code"),
            attributeName: "exposureItem.code",
        },
    ];

    @Input() exposure: Exposure | undefined | null;
}
