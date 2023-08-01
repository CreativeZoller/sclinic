import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, shareReplay } from "rxjs";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { ServicePackageXService } from "../../../models/service-package-x-service.model";
import { UntilDestroy } from "@ngneat/until-destroy";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BaseSingleSelectionListFieldComponent } from "../../../../../../app-common/utility/base-single-selection-list-field/base-single-selection-list-field.directive";
import { CurrencyPipe } from "@angular/common";


type Full_Model = NonNullable<ServicePackageXService["servicePackage"]>;

@UntilDestroy()
@Component({
    selector: "app-service-package-sub-service-package-single-selection-list-field",
    templateUrl: "./service-package-sub-service-package-single-selection-list-field.component.html",
    styleUrls: ["./service-package-sub-service-package-single-selection-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ServicePackageSubServicePackageSingleSelectionListFieldComponent extends BaseSingleSelectionListFieldComponent<Full_Model> {

    private currencyPipe = inject(CurrencyPipe);

    public baseResourceKey$ = new BehaviorSubject<string>("service.package.service");
    @Input() public set baseResourceKey(baseResourceKey: string) {
        this.baseResourceKey$.next(baseResourceKey);
    }
    public tableIdProperty = "servicePackageId";

    public tableHeaders$ = this.baseResourceKey$.pipe(
        map((baseResourceKey) => {
            return <TableHeader[]>[
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.subServicePackage.servicePackageName`),
                    attributeName: "servicePackageName",
                },
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.subServicePackage.duration`),
                    attributeName: "duration",
                    formatterFn: (v) => `${v ?? 0} ${this.resourceService.resolve("general.unit.minute")}`,
                },
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.subServicePackage.basePrice`),
                    attributeName: "basePrice",
                    formatterFn: (v) => this.currencyPipe.transform(v, this.resourceService.resolve("general.currency.HUF"), "code", "1.0-0", "hu"),
                },
            ];
        }),
        shareReplay(1),
    )

    protected allUnselectableSubServicePackages$ = new BehaviorSubject<Full_Model[]>([]);
    @Input() public set allUnselectableSubServicePackages(list: Full_Model[] | null | undefined) {
        this.allUnselectableSubServicePackages$.next(list ?? []);
    }

    protected allSubServicePackages$ = new BehaviorSubject<Full_Model[]>([]);
    @Input() public set allSubServicePackages(list: Full_Model[] | null | undefined) {
        this.allSubServicePackages$.next(list ?? []);
    }
    @Output() refreshAllSubServicePackages = new EventEmitter<void>();

    private isInitialGetTableData = true;

    public getTableData$ = () => {
        if (!this.isInitialGetTableData) this.refreshAllSubServicePackages.next();
        this.isInitialGetTableData = false;

        return combineLatest([
            this.allUnselectableSubServicePackages$,
            this.allSubServicePackages$
        ]).pipe(
            map(([allUnselectableSubServicePackages, allSubServicePackages]) =>
                allSubServicePackages.filter(s =>
                    !allUnselectableSubServicePackages.some((us) => us.servicePackageId === s.servicePackageId)),
                shareReplay(1),
            ));
    }
}
