import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { BehaviorSubject, combineLatest, map, shareReplay } from "rxjs";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { JobTitleXService } from "../../../models/job-title-x-service.model";
import { UntilDestroy } from "@ngneat/until-destroy";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BaseSingleSelectionListFieldComponent } from "../../../../../../app-common/utility/base-single-selection-list-field/base-single-selection-list-field.directive";
import { CurrencyPipe } from "@angular/common";


type Full_Model = NonNullable<JobTitleXService["service"]>;

@UntilDestroy()
@Component({
    selector: "app-job-title-service-single-selection-list-field",
    templateUrl: "./job-title-service-single-selection-list-field.component.html",
    styleUrls: ["./job-title-service-single-selection-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class JobTitleServiceSingleSelectionListFieldComponent extends BaseSingleSelectionListFieldComponent<Full_Model> {

    private currencyPipe = inject(CurrencyPipe);

    public baseResourceKey$ = new BehaviorSubject<string>("job.title.service");
    @Input() public set baseResourceKey(baseResourceKey: string) {
        this.baseResourceKey$.next(baseResourceKey);
    }
    public tableIdProperty = "serviceId";

    public tableHeaders$ = this.baseResourceKey$.pipe(
        map((baseResourceKey) => {
            return <TableHeader[]>[
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.service.serviceName`),
                    attributeName: "serviceName",
                },
            ];
        }),
        shareReplay(1),
    )

    protected allUnselectableServices$ = new BehaviorSubject<Full_Model[]>([]);
    @Input() public set allUnselectableServices(list: Full_Model[] | null | undefined) {
        this.allUnselectableServices$.next(list ?? []);
    }

    protected allServices$ = new BehaviorSubject<Full_Model[]>([]);
    @Input() public set allServices(list: Full_Model[] | null | undefined) {
        this.allServices$.next(list ?? []);
    }
    @Output() refreshAllServices = new EventEmitter<void>();

    private isInitialGetTableData = true;
    public getTableData$ = () => {
        if (!this.isInitialGetTableData) this.refreshAllServices.next();
        this.isInitialGetTableData = false;

        return combineLatest([
            this.allUnselectableServices$,
            this.allServices$
        ]).pipe(
            map(([allUnselectableServices, allServices]) => allServices.filter(s => {
                return !allUnselectableServices.some((us) => us.serviceId === s.serviceId);
            })),
            shareReplay(1),
        );
    }
}
