import { ChangeDetectionStrategy, Component, Input, inject } from "@angular/core";
import { BehaviorSubject, combineLatest, map, shareReplay, switchMap } from "rxjs";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { ServiceXConnectedService } from "../../../models/service-x-connected-service.model";
import { UntilDestroy } from "@ngneat/until-destroy";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BaseSelectionListFieldComponent } from "../../../../../../app-common/utility/base-selection-list-field/base-selection-list-field.directive";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { CurrencyPipe } from "@angular/common";
import { ServiceXIncompatibleService } from "../../../models/service-x-incompatible-service.model";


type Full_Model = NonNullable<ServiceXConnectedService["connectedService"]>;

@UntilDestroy()
@Component({
    selector: "app-service-connected-service-selection-list-field",
    templateUrl: "./service-connected-service-selection-list-field.component.html",
    styleUrls: ["./service-connected-service-selection-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ServiceConnectedServiceSelectionListFieldComponent extends BaseSelectionListFieldComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);
    private currencyPipe = inject(CurrencyPipe);

    public baseResourceKey = "service.connected.service";
    public tableIdProperty = "serviceId";

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("service.connected.service.list.table.headers.connectedService.serviceName"),
            attributeName: "serviceName",
        },
        {
            name: this.resourceService.resolve("service.connected.service.list.table.headers.connectedService.basePrice"),
            attributeName: "basePrice",
            formatterFn: (v) => this.currencyPipe.transform(v, this.resourceService.resolve("general.currency.HUF"), "code", "1.0-0", "hu"),
        },
        {
            name: this.resourceService.resolve("service.connected.service.list.table.headers.connectedService.duration"),
            attributeName: "duration",
            formatterFn: (v) => `${v ?? 0} ${this.resourceService.resolve("general.unit.minute")}`,
        },
        {
            name: this.resourceService.resolve("service.connected.service.list.table.headers.connectedService.dC_ServiceCategoryId"),
            attributeName: "dC_ServiceCategoryId",
            formatterFn: (v) => this.initData.dC_ServiceCategoryList.find(item => item.value === v)?.name,
        }
    ];

    protected _currentServiceId$ = new BehaviorSubject<number | undefined>(undefined);
    @Input() set currentServiceId(serviceType: number | undefined | null) {
        this._currentServiceId$.next(serviceType ?? undefined);
    }

    private allSelectedIncompatibleServices$ = new BehaviorSubject<number[]>([]);

    @Input() set allSelectedIncompatibleServices(allSelectedIncompatibleServices: ServiceXIncompatibleService[] | undefined) {
        this.allSelectedIncompatibleServices$.next(allSelectedIncompatibleServices?.map(x => x.incompatibleServiceId!) ?? []);
    }

    public getTableData$ = () => {
        return combineLatest([
            this.masterDataManagementService.serviceGetServiceByConditionPost({}).pipe(
                map(res => res?.businessObjectList ?? []),
            ),
            this.allSelectedIncompatibleServices$,
            this._currentServiceId$
        ]).pipe(
            map(([businessObjectList, incompatibleServiceIds, currentServiceId]) => {
                return businessObjectList.filter(x =>
                    !incompatibleServiceIds.includes(x.serviceId!) && x.serviceId !== currentServiceId);
            }),
            shareReplay(1),
        );
    }
}
