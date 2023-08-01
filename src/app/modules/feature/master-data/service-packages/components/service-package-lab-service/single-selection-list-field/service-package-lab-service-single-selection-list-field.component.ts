import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { BehaviorSubject, combineLatest, map, shareReplay } from "rxjs";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BaseSingleSelectionListFieldComponent } from "../../../../../../app-common/utility/base-single-selection-list-field/base-single-selection-list-field.directive";
import { CurrencyPipe } from "@angular/common";
import { ServicePackageXLabService } from "../../../models/service-package-x-lab-service.model";


type Full_Model = NonNullable<ServicePackageXLabService["labService"]>;

@UntilDestroy()
@Component({
    selector: "app-service-package-lab-service-single-selection-list-field",
    templateUrl: "./service-package-lab-service-single-selection-list-field.component.html",
    styleUrls: ["./service-package-lab-service-single-selection-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ServicePackageLabServiceSingleSelectionListFieldComponent extends BaseSingleSelectionListFieldComponent<Full_Model> {

    private currencyPipe = inject(CurrencyPipe);

    public baseResourceKey$ = new BehaviorSubject<string>("service.package.lab.service");
    @Input() public set baseResourceKey(baseResourceKey: string) {
        this.baseResourceKey$.next(baseResourceKey);
    }
    public tableIdProperty = "serviceId";

    public tableHeaders$ = this.baseResourceKey$.pipe(
        map((baseResourceKey) => {
            return <TableHeader[]>[
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.lab.service.serviceName`),
                    attributeName: "serviceName",
                },
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.lab.service.duration`),
                    attributeName: "duration",
                    formatterFn: (v) => `${v ?? 0} ${this.resourceService.resolve("general.unit.minute")}`,
                },
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.lab.service.basePrice`),
                    attributeName: "basePrice",
                    formatterFn: (v) => this.currencyPipe.transform(v, this.resourceService.resolve("general.currency.HUF"), "code", "1.0-0", "hu"),
                },
            ];
        }),
        shareReplay(1),
    )

    protected allUnselectableLabServices$ = new BehaviorSubject<Full_Model[]>([]);
    @Input() public set allUnselectableLabServices(list: Full_Model[] | null | undefined) {
        this.allUnselectableLabServices$.next(list ?? []);
    }

    protected allLabServices$ = new BehaviorSubject<Full_Model[]>([]);
    @Input() public set allLabServices(list: Full_Model[] | null | undefined) {
        this.allLabServices$.next(list ?? []);
    }
    @Output() refreshAllLabServices = new EventEmitter<void>();

    private isInitialGetTableData = true;
    public getTableData$ = () => {
        if (!this.isInitialGetTableData) this.refreshAllLabServices.next();
        this.isInitialGetTableData = false;

        return combineLatest([
            this.allUnselectableLabServices$,
            this.allLabServices$
        ]).pipe(
            map(([allUnselectableLabServices, allLabServices]) => allLabServices.filter(s => {
                return !allUnselectableLabServices.some((us) => us.serviceId === s.serviceId);
            })),
            shareReplay(1),
        );
    }
}
