import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ServiceSubPackageXContract } from "../../../models/service-sub-package-x-contract.model";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";


type Full_Model = ServiceSubPackageXContract;

@UntilDestroy()
@Component({
    selector: "app-service-sub-package-contract-list-field",
    templateUrl: "./service-sub-package-contract-list-field.component.html",
    styleUrls: ["./service-sub-package-contract-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ServiceSubPackageContractListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "service.sub.package.contract";
    // TODO amint megvan a BE hozzá, frissíteni ezt a mezőt
    public tableIdProperty = "servicePackageXContractId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        // TODO amint megvan a BE struktúra frisíteni a mezőket
        {
            name: this.resourceService.resolve("service.sub.package.contract.list.table.headers.companyName"),
            attributeName: "companyName",
        },
        {
            name: this.resourceService.resolve("service.sub.package.contract.list.table.headers.contractName"),
            attributeName: "contractName",
        },
        {
            name: this.resourceService.resolve("service.sub.package.contract.list.table.headers.contractNumber"),
            attributeName: "contractNumber",
        },
        {
            name: this.resourceService.resolve("service.sub.package.contract.list.table.headers.isPriorityPartner"),
            attributeName: "isPriorityPartner",
        },
    ];
}
