import { ChangeDetectionStrategy, Component, inject, Input, Output } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ServiceXConnectedService } from "../../../models/service-x-connected-service.model";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { Observable, of, shareReplay } from "rxjs";
import { ListHandlerCallbackData } from "../../../../../../app-common/list/components/list/list.component";
import { FormModel } from "../selection-list-form/service-connected-service-selection-list-form.component";
import { CurrencyPipe } from "@angular/common";
import { ServiceXIncompatibleService } from "../../../models/service-x-incompatible-service.model";


type Full_Model = ServiceXConnectedService;

@UntilDestroy()
@Component({
    selector: "app-service-connected-service-list-field",
    templateUrl: "./service-connected-service-list-field.component.html",
    styleUrls: ["./service-connected-service-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ServiceConnectedServiceListFieldComponent extends BaseListFieldComponent<Full_Model> {

    private currencyPipe = inject(CurrencyPipe);

    public baseResourceKey = "service.connected.service";
    public tableIdProperty = "serviceXConnectedServiceId";

    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("service.connected.service.list.table.headers.connectedService.serviceName"),
            attributeName: "connectedService.serviceName",
        },
        {
            name: this.resourceService.resolve("service.connected.service.list.table.headers.connectedService.basePrice"),
            attributeName: "connectedService.basePrice",
            formatterFn: (v) => this.currencyPipe.transform(v, this.resourceService.resolve("general.currency.HUF"), "code", "1.0-0", "hu"),
        },
        {
            name: this.resourceService.resolve("service.connected.service.list.table.headers.connectedService.duration"),
            attributeName: "connectedService.duration",
            formatterFn: (v) => `${v ?? 0} ${this.resourceService.resolve("general.unit.minute")}`,
        },
        {
            name: this.resourceService.resolve("service.connected.service.list.table.headers.connectedService.dC_ServiceCategoryId"),
            attributeName: "connectedService.dC_ServiceCategoryId",
            formatterFn: (v) => this.initData.dC_ServiceCategoryList.find(item => item.value === v)?.name,
        }
    ];

    @Input() currentServiceId: number | undefined;
    @Input() allSelectedIncompatibleServices: ServiceXIncompatibleService[] | undefined = [];
    public allSelectedConnectedServices$ = this.getValue$().pipe(
        shareReplay(1),
    );

    public valueToFormValue = (value: any[]) => value;

    public handleSave$: (data: ListHandlerCallbackData<unknown, FormModel>) => Observable<any> = ({formValue}) => {
        this.listFieldComponent.changeValue(
            (formValue?.selectedConnectedServices ?? []).map(cs => ({
                connectedServiceId: cs.serviceId,
                connectedService: cs,
            })),
        );

        return of(null);
    }
}
