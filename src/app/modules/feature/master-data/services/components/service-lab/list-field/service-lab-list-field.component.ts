import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ServiceXLab } from "../../../models/service-x-lab.model";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { Observable, of, shareReplay } from "rxjs";
import { ListHandlerCallbackData } from "../../../../../../app-common/list/components/list/list.component";
import { FormModel } from "../selection-list-form/service-lab-selection-list-form.component";
import { CurrencyPipe } from "@angular/common";


type Full_Model = ServiceXLab;

@UntilDestroy()
@Component({
    selector: "app-service-lab-list-field",
    templateUrl: "./service-lab-list-field.component.html",
    styleUrls: ["./service-lab-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ServiceLabListFieldComponent extends BaseListFieldComponent<Full_Model> {

    private currencyPipe = inject(CurrencyPipe);

    public baseResourceKey = "service.lab";
    public tableIdProperty = "serviceXLabId";

    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("service.lab.list.table.headers.lab.dC_MarkerId"),
            attributeName: "lab.dC_MarkerId",
            formatterFn: (v) => this.initData.dC_MarkerList.find(item => item.value === v)?.name,
        },
        {
            name: this.resourceService.resolve("service.lab.list.table.headers.lab.providerIdentificationNumber"),
            attributeName: "lab.providerIdentificationNumber",
        },
        {
            name: this.resourceService.resolve("service.lab.list.table.headers.lab.dC_LabProviderId"),
            attributeName: "lab.dC_LabProviderId",
            formatterFn: (v) => this.initData.dC_LabProviderList.find(item => item.value === v)?.name,
        },
        {
            name: this.resourceService.resolve("service.lab.list.table.headers.lab.price"),
            attributeName: "lab.price",
            formatterFn: (v) => this.currencyPipe.transform(v, this.resourceService.resolve("general.currency.HUF"), "code", "1.0-0", "hu"),
        },
    ];

    public allSelectedLabs$ = this.getValue$().pipe(
        shareReplay(1),
    );

    public valueToFormValue = (value: any[]) => value;

    public handleSave$: (data: ListHandlerCallbackData<unknown, FormModel>) => Observable<any> = ({formValue}) => {
        this.listFieldComponent.changeValue(
            (formValue?.selectedLabs ?? []).map(l => ({
                labId: l.labId,
                lab: l,
            })),
        );

        return of(null);
    }
}
