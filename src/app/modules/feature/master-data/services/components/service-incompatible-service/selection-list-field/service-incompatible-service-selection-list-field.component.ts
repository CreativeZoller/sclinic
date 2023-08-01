import { ChangeDetectionStrategy, Component, Input, inject } from "@angular/core";
import { BehaviorSubject, combineLatest, map, shareReplay } from "rxjs";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { ServiceXIncompatibleService } from "../../../models/service-x-incompatible-service.model";
import { UntilDestroy } from "@ngneat/until-destroy";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BaseSelectionListFieldComponent } from "../../../../../../app-common/utility/base-selection-list-field/base-selection-list-field.directive";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { CurrencyPipe } from "@angular/common";
import { ServiceXConnectedService } from "../../../models/service-x-connected-service.model";


type Full_Model = NonNullable<ServiceXIncompatibleService["incompatibleService"]>;

@UntilDestroy()
@Component({
    selector: "app-service-incompatible-service-selection-list-field",
    templateUrl: "./service-incompatible-service-selection-list-field.component.html",
    styleUrls: ["./service-incompatible-service-selection-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ServiceIncompatibleServiceSelectionListFieldComponent extends BaseSelectionListFieldComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);
    private currencyPipe = inject(CurrencyPipe);

    public baseResourceKey = "service.incompatible.service";
    public tableIdProperty = "serviceId";

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("service.incompatible.service.list.table.headers.incompatibleService.serviceName"),
            attributeName: "serviceName",
        },
        {
            name: this.resourceService.resolve("service.incompatible.service.list.table.headers.incompatibleService.basePrice"),
            attributeName: "basePrice",
            formatterFn: (v) => this.currencyPipe.transform(v, this.resourceService.resolve("general.currency.HUF"), "code", "1.0-0", "hu"),
        },
        {
            name: this.resourceService.resolve("service.incompatible.service.list.table.headers.incompatibleService.dC_ServiceCategoryId"),
            attributeName: "dC_ServiceCategoryId",
            formatterFn: (v) => this.initData.dC_ServiceCategoryList.find(item => item.value === v)?.name,

        },
    ];

    protected _currentServiceId$ = new BehaviorSubject<number | undefined>(undefined);
    @Input() set currentServiceId(serviceType: number | undefined | null) {
        this._currentServiceId$.next(serviceType ?? undefined);
    }

    private allSelectedConnectedServiceIds$ = new BehaviorSubject<number[]>([]);

    @Input() set allSelectedConnectedServices(allSelectedCompatibleServices: ServiceXConnectedService[] | undefined) {
        this.allSelectedConnectedServiceIds$.next(allSelectedCompatibleServices?.map(x => x.connectedServiceId!) ?? []);


    }

    public getTableData$ = () => {
        return combineLatest([
            this.masterDataManagementService.serviceGetServiceByConditionPost({}).pipe(
                map(res => res?.businessObjectList ?? []),
            ),
            this.allSelectedConnectedServiceIds$,
            this._currentServiceId$
        ]).pipe(
            map(([businessObjectList, connectedServiceIds, _currentServiceId]) => {
                return businessObjectList.filter(x => !connectedServiceIds.includes(x.serviceId!) && x.serviceId !== _currentServiceId);
            }),
            shareReplay(1),
        );
    }
}
