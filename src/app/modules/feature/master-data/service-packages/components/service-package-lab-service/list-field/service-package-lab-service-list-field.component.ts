import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BehaviorSubject, combineLatest, map, of, shareReplay, switchMap } from "rxjs";
import { CurrencyPipe } from "@angular/common";
import { ServiceTypeEnum } from "../../../../../../../../api/enums";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ListHandlerCallbackData } from "../../../../../../app-common/list/components/list/list.component";
import { ServicePackageXLabService } from "../../../models/service-package-x-lab-service.model";


type Full_Model = ServicePackageXLabService;

@UntilDestroy()
@Component({
    selector: "app-service-package-lab-service-list-field",
    templateUrl: "./service-package-lab-service-list-field.component.html",
    styleUrls: ["./service-package-lab-service-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ServicePackageLabServiceListFieldComponent extends BaseListFieldComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);
    private currencyPipe = inject(CurrencyPipe);

    public baseResourceKey$ = new BehaviorSubject<string>("service.package.lab.service");
    @Input() public set baseResourceKey(baseResourceKey: string) {
        this.baseResourceKey$.next(baseResourceKey);
    }
    @Input() public tableIdProperty = "servicePackageXLabServiceId";

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
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.lab.service.serviceName`),
                    attributeName: "labService.serviceName",
                },
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.maxMinute`),
                    attributeName: "maxMinute",
                    formatterFn: (v) => `${v ?? 0} ${this.resourceService.resolve("general.unit.minute")}`,
                },
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.lab.service.duration`),
                    attributeName: "labService.duration",
                    formatterFn: (v) => `${v ?? 0} ${this.resourceService.resolve("general.unit.minute")}`,
                },
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.lab.service.basePrice`),
                    attributeName: "labService.basePrice",
                    formatterFn: (v) => this.currencyPipe.transform(v, this.resourceService.resolve("general.currency.HUF"), "code", "1.0-0", "hu"),
                },
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.required`),
                    attributeName: "required",
                    formatterFn: (value) => `<div class="form-check form-check-custom form-check-solid form-check-sm">
                    <input type="checkbox" ${value ? "checked" : ""} disabled class="form-check-input">
                </div>`,
                },
            ];
        }),
        shareReplay(1),
    )

    public allSelectedLabServices$ = this.getValue$().pipe(
        map((list) => (list ?? []).map(v => v.labService!).filter(v => v != null)),
        shareReplay(1),
    );

    protected refreshAllLabServices$ = new BehaviorSubject<void>(void 0);
    protected allLabServices$ = this.refreshAllLabServices$.pipe(
        switchMap(() =>
            this.masterDataManagementService.serviceGetServiceByConditionPost({
                dC_ServiceTypeIdList: [ServiceTypeEnum.LAB_EXAMINATION],
            })),
        map((res) => res?.businessObjectList ?? []),
        shareReplay(1),
    );

    protected canCreate$ = combineLatest([
        this.allLabServices$,
        this.allSelectedLabServices$
    ]).pipe(
        map(([allLabServices, allSelectedLabServices]) => {
            return !(
                allLabServices.length === allSelectedLabServices.length
                && allLabServices.every(s => allSelectedLabServices.some(as => as.serviceId === s.serviceId))
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

    protected valueToFormValue: (value: Full_Model[]) => Full_Model[] = (value: Full_Model[]) => {
        if (!Array.isArray(value)) return [];
        if (this.listFieldComponent?.editorForm == null) return this.updateArrayOrdering(value) as unknown as Full_Model[];

        return this.updateArrayOrdering(
            value.map((v) => {
                // Workaround: valamiért a "listFieldComponent.editorForm.form"-ra nem setteli rendesen a "service"
                // property-t, így inkább nem is használjuk "setFormValue" és "getFormValue" metódusokat

                if (this.listFieldComponent == null) return v;

                const validProperties = Object.keys(this.listFieldComponent.editorForm.form.controls);

                const value: any = { ...v };
                for (const key of Object.keys(value)) {
                    if (!validProperties.includes(key)) delete value[key];
                }

                return value;
            })
        );
    };
}
