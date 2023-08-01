import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { CompanySite } from "../../../models/company-site.model";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";


type Full_Model = CompanySite;

@UntilDestroy()
@Component({
    selector: "app-company-site-list-field",
    templateUrl: "./company-site-list-field.component.html",
    styleUrls: ["./company-site-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class CompanySiteListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "company.site";
    public tableIdProperty = "companySiteId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    @Input() companyFullName: string = "";

    public tableHeaders: TableHeader[] = [
        {
            id: 1,
            name: this.resourceService.resolve("company.site.list.table.headers.address.dC_City.postCode"),
            attributeName: "address.dC_City.postCode",
        },
        {
            id: 2,
            name: this.resourceService.resolve("company.site.list.table.headers.address.dC_City.name"),
            attributeName: "address.dC_City.name",
        },
        {
            id: 3,
            name: this.resourceService.resolve("company.site.list.table.headers.address"),
            attributeName: "address",
            formatterFn: (_, row: Full_Model) => [
                row?.address?.streetName,
                this.initData.dC_PublicPlaceCategoryList.find(item => item.value === row?.address?.dC_PublicPlaceCategoryId)?.name,
                row?.address?.buildingNumber,
                row?.address?.building,
                row?.address?.staircase,
                row?.address?.floor,
                row?.address?.door,
            ].filter(v => v != null).join(" "),
        },
        {
            id: 4,
            name: this.resourceService.resolve("company.site.list.table.headers.phoneNumber"),
            attributeName: "phoneNumber",
        },
    ];
}
