import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { map, shareReplay } from "rxjs";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { ServiceXLab } from "../../../models/service-x-lab.model";
import { UntilDestroy } from "@ngneat/until-destroy";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BaseSelectionListFieldComponent } from "../../../../../../app-common/utility/base-selection-list-field/base-selection-list-field.directive";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { CurrencyPipe } from "@angular/common";


type Full_Model = NonNullable<ServiceXLab["lab"]>;

@UntilDestroy()
@Component({
    selector: "app-service-lab-selection-list-field",
    templateUrl: "./service-lab-selection-list-field.component.html",
    styleUrls: ["./service-lab-selection-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ServiceLabSelectionListFieldComponent extends BaseSelectionListFieldComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);
    private currencyPipe = inject(CurrencyPipe);

    public baseResourceKey = "service.lab";
    public tableIdProperty = "labId";

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("service.lab.list.table.headers.lab.dC_MarkerId"),
            attributeName: "dC_MarkerId",
            formatterFn: (v) => this.initData.dC_MarkerList.find(item => item.value === v)?.name,
        },
        {
            name: this.resourceService.resolve("service.lab.list.table.headers.lab.providerIdentificationNumber"),
            attributeName: "providerIdentificationNumber",
        },
        {
            name: this.resourceService.resolve("service.lab.list.table.headers.lab.dC_LabProviderId"),
            attributeName: "dC_LabProviderId",
            formatterFn: (v) => this.initData.dC_LabProviderList.find(item => item.value === v)?.name,
        },
        {
            name: this.resourceService.resolve("service.lab.list.table.headers.lab.price"),
            attributeName: "price",
            formatterFn: (v) => this.currencyPipe.transform(v, this.resourceService.resolve("general.currency.HUF"), "code", "1.0-0", "hu"),
        },
    ];

    public getTableData$ = () => this.masterDataManagementService.labGetLabsByConditionPost({}).pipe(
        map(res => res?.businessObjectList ?? []),
        shareReplay(1),
    );
}
