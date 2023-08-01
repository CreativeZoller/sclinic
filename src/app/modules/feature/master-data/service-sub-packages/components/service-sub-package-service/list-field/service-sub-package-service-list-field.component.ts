import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ServicePackageXLabService, ServiceSubPackageXService } from "../../../models/service-sub-package-x-service.model";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BehaviorSubject, combineLatest, map, of, shareReplay, switchMap, tap } from "rxjs";
import { CurrencyPipe } from "@angular/common";
import { ServiceTypeEnum } from "../../../../../../../../api/enums";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ListHandlerCallbackData } from "../../../../../../app-common/list/components/list/list.component";


type Full_Model = ServiceSubPackageXService;
type Full_Model_Lab = ServicePackageXLabService;


@UntilDestroy()
@Component({
    selector: "app-service-sub-package-service-list-field",
    templateUrl: "./service-sub-package-service-list-field.component.html",
    styleUrls: ["./service-sub-package-service-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ServiceSubPackageServiceListFieldComponent extends BaseListFieldComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);
    private currencyPipe = inject(CurrencyPipe);

    public baseResourceKey$ = new BehaviorSubject<string>("service.sub.package.service");
    @Input() public set baseResourceKey(baseResourceKey: string) {
        this.baseResourceKey$.next(baseResourceKey);
    }
    @Input() public tableIdProperty = "servicePackageXServiceId";

    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders$ = this.baseResourceKey$.pipe(
        map((baseResourceKey) => {
            return <TableHeader[]>[
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.position`),
                    attributeName: "position",
                },
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.service.serviceName`),
                    attributeName: "service.serviceName",
                },
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.maxMinute`),
                    attributeName: "maxMinute",
                    formatterFn: (v) => `${v ?? 0} ${this.resourceService.resolve("general.unit.minute")}`,
                },
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.service.duration`),
                    attributeName: "service.duration",
                    formatterFn: (v) => `${v ?? 0} ${this.resourceService.resolve("general.unit.minute")}`,
                },
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.service.basePrice`),
                    attributeName: "service.basePrice",
                    formatterFn: (v) => this.currencyPipe.transform(v, this.resourceService.resolve("general.currency.HUF"), "code", "1.0-0", "hu"),
                },
            ];
        }),
        shareReplay(1),
    )

    public allSelectedServices$ = this.getValue$().pipe(
        map((list) => (list ?? []).map(v => v.service!).filter(v => v != null)),
        shareReplay(1),
    );

    protected serviceType$ = new BehaviorSubject<ServiceTypeEnum | undefined>(undefined);
    @Input() set serviceType(serviceType: ServiceTypeEnum | undefined | null) {
        this.serviceType$.next(serviceType ?? undefined);
    }

    get serviceType(): ServiceTypeEnum | undefined {
        return this.serviceType$.getValue();
    }

    protected refreshAllServices$ = new BehaviorSubject<void>(void 0);
    protected allServices$ = this.refreshAllServices$.pipe(
        switchMap(() => this.serviceType$.pipe(
            switchMap((serviceType) => this.masterDataManagementService.serviceGetServiceByConditionPost({
                dC_ServiceTypeIdList: serviceType == null ? [] : [serviceType],
            })),
        )),
        map((res) => res?.businessObjectList ?? []),
        shareReplay(1),
    );

    protected canCreate$ = combineLatest([
        this.allServices$,
        this.allSelectedServices$
    ]).pipe(
        map(([allServices, allSelectedServices]) => {
            return !(
                allServices.length === allSelectedServices.length
                && allServices.every(s => allSelectedServices.some(as => as.serviceId === s.serviceId))
            );
        }),
        shareReplay(1),
    )

    private updateArrayOrdering(list: Full_Model[]): Full_Model[] {
        return list.map((row, i) => ({
            ...row,
            // Apply new positions to non "0" positioned rows
            position: ((row.position ?? 0) > 0)
                ? (i + 1)
                : row.position,
        }));
    }

    protected dragAndDropConfig = {
        enabled: true,
        onDrop: (event: CdkDragDrop<Full_Model[]>) => {
            if (event.currentIndex !== event.previousIndex) {
                const newListValue: Full_Model[] = [...this.listFieldComponent?.value] as any[];
                moveItemInArray(newListValue, event.previousIndex, event.currentIndex)

                const changedRow = newListValue[event.currentIndex];
                // In case we moved a row with "0" position
                changedRow.position = event.currentIndex + 1;

                this.listFieldComponent?.changeValue(this.updateArrayOrdering(newListValue));
            }
        },
    };

    protected handleSave$ = ({ rowData, formValue }: ListHandlerCallbackData<Full_Model, Full_Model>) => {
        const value = this.listFieldComponent.value ?? [];

        const indexToUpdate = (rowData as any)?._index as number | undefined;
        if (indexToUpdate != null) value[indexToUpdate] = formValue;
        else value.push(formValue);

        if ((formValue.position ?? 0) > 0) {
            moveItemInArray(value, indexToUpdate ?? value.length - 1, formValue.position! - 1)
        }

        this.listFieldComponent.changeValue([
            ...this.updateArrayOrdering(value),
        ]);

        return of(null);
    }

    protected handleDelete$ = ({ rowData }: ListHandlerCallbackData<Full_Model, Full_Model>) => {
        const value = this.listFieldComponent.value ?? [];

        this.listFieldComponent.changeValue(
            this.updateArrayOrdering(
                value.filter((_, i) => i !== (rowData as any)?._index)
            )
        );

        return of(null);
    }


    protected valueToFormValue: (value: Full_Model[] | Full_Model_Lab[]) => Full_Model[] | Full_Model_Lab[] = (value: Full_Model[] | Full_Model_Lab[]) => {
        if (!Array.isArray(value)) return [];
        if (this.listFieldComponent?.editorForm == null) return this.updateArrayOrdering(value) as unknown as Full_Model[] | Full_Model_Lab[];

        return this.updateArrayOrdering(
          value.map((v) => {
            if (this.listFieldComponent == null) return v;

            const validProperties = Object.keys(this.listFieldComponent.editorForm.form.controls);

            if (this.serviceType === ServiceTypeEnum.LAB_EXAMINATION) {
                validProperties.push("labService");
            }

            let value: any = { ...v };
            for (const key of Object.keys(value)) {
              if (!validProperties.includes(key)) delete value[key];
            }

            if (this.serviceType === ServiceTypeEnum.LAB_EXAMINATION) {
              const _value = {
                ...value,
                service: value?.labService,
                serviceId: value?.labServiceId,
              };

              return _value;
            } else {

              return value;
            }
          })
        );
      };

};
