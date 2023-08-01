import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { GroupedExposureServiceList } from "../../../models/occupational.health.service.model";


type Full_Model = GroupedExposureServiceList;

@UntilDestroy()
@Component({
    selector: "app-grouped-exposure-list-field",
    templateUrl: "./grouped-exposure-list-field.component.html",
    styleUrls: ["./grouped-exposure-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class GroupedExposureListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "exposure";
    public tableIdProperty = "occupationalHealthXServiceId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public  tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("exposure.list.table.headers.description"),
            attributeName: "exposure.description",
        },
    ];
}
