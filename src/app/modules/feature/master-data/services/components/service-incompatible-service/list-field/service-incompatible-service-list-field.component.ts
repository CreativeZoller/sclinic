import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ServiceXIncompatibleService } from "../../../models/service-x-incompatible-service.model";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BehaviorSubject, Observable, of, shareReplay } from "rxjs";
import { ListHandlerCallbackData } from "../../../../../../app-common/list/components/list/list.component";
import { FormModel } from "../selection-list-form/service-incompatible-service-selection-list-form.component";
import { CurrencyPipe } from "@angular/common";
import { ServiceXConnectedService } from "../../../models/service-x-connected-service.model";


type Full_Model = ServiceXIncompatibleService;

@UntilDestroy()
@Component({
    selector: "app-service-incompatible-service-list-field",
    templateUrl: "./service-incompatible-service-list-field.component.html",
    styleUrls: ["./service-incompatible-service-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ServiceIncompatibleServiceListFieldComponent extends BaseListFieldComponent<Full_Model> {

    private currencyPipe = inject(CurrencyPipe);

    public baseResourceKey = "service.incompatible.service";
    public tableIdProperty = "serviceXIncompatibleServiceId";

    @Input() currentServiceId: number | undefined;

    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("service.incompatible.service.list.table.headers.incompatibleService.serviceName"),
            attributeName: "incompatibleService.serviceName",
        },
        {
            name: this.resourceService.resolve("service.incompatible.service.list.table.headers.incompatibleService.basePrice"),
            attributeName: "incompatibleService.basePrice",
            formatterFn: (v) => this.currencyPipe.transform(v, this.resourceService.resolve("general.currency.HUF"), "code", "1.0-0", "hu"),
        },
        {
            name: this.resourceService.resolve("service.incompatible.service.list.table.headers.incompatibleService.dC_ServiceCategoryId"),
            attributeName: "incompatibleService.dC_ServiceCategoryId",
            formatterFn: (v) => this.initData.dC_ServiceCategoryList.find(item => item.value === v)?.name,

        },
    ];

    @Input() allSelectedConnectedServices: ServiceXConnectedService[] | undefined = [];
    allSelectedIncompatibleServices$ = this.getValue$().pipe(
        shareReplay(1),
    );

    public valueToFormValue = (value: any[]) => value;

    public handleSave$: (data: ListHandlerCallbackData<unknown, FormModel>) => Observable<any> = ({formValue}) => {
        this.listFieldComponent.changeValue(
            (formValue?.selectedIncompatibleServices ?? []).map(is => ({
                incompatibleServiceId: is.serviceId,
                incompatibleService: is,
            })),
        );

        return of(null);
    }
}
