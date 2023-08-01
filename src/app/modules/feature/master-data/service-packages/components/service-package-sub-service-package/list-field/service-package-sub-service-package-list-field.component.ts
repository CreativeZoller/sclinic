import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, of, shareReplay, switchMap } from "rxjs";
import { CurrencyPipe } from "@angular/common";
import { ServicePackageTypeEnum } from "../../../../../../../../api/enums";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ListHandlerCallbackData } from "../../../../../../app-common/list/components/list/list.component";
import { ServicePackageXSubServicePackage } from "../../../models/service-package-x-sub-service-package.model";


type Full_Model = ServicePackageXSubServicePackage;

@UntilDestroy()
@Component({
    selector: "app-service-package-sub-service-package-list-field",
    templateUrl: "./service-package-sub-service-package-list-field.component.html",
    styleUrls: ["./service-package-sub-service-package-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ServicePackageSubServicePackageListFieldComponent extends BaseListFieldComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);
    private currencyPipe = inject(CurrencyPipe);

    public baseResourceKey$ = new BehaviorSubject<string>("service.package.sub.service.package");
    @Input() public set baseResourceKey(baseResourceKey: string) {
        this.baseResourceKey$.next(baseResourceKey);
    }
    @Input() public tableIdProperty = "servicePackageXSubServicePackageId";

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
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.subServicePackage.servicePackageName`),
                    attributeName: "subServicePackage.servicePackageName",
                },
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.subServicePackage.dC_ServicePackageTypeId`),
                    attributeName: "subServicePackage.dC_ServicePackageTypeId",
                    formatterFn: (v) => this.initData.dC_ServicePackageTypeList.find(item => item.value === v)?.name,
                },
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.subServicePackage.basePrice`),
                    attributeName: "subServicePackage.basePrice",
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

    public allSelectedSubServicePackages$ = this.getValue$().pipe(
        map((list) => (list ?? []).map(v => v.subServicePackage!).filter(v => v != null)),
        shareReplay(1),
    );

    protected refreshAllSubServicePackages$ = new BehaviorSubject<void>(void 0);
    protected allSubServicePackages$ = this.refreshAllSubServicePackages$.pipe(
        switchMap(() => this.masterDataManagementService.servicePackageGetServicePackageByConditionPost({
            dC_ServicePackageTypeIdList: [ServicePackageTypeEnum.SUB_PACKAGE],
        })),
        map((res) => res?.businessObjectList ?? []),
        shareReplay(1),
    );

    protected canCreate$ = combineLatest([
        this.allSubServicePackages$,
        this.allSelectedSubServicePackages$
    ]).pipe(
        distinctUntilChanged(),
        map(([allSubServicePackages, allSelectedSubServicePackages]) => {
            return !(
                allSubServicePackages.length === allSelectedSubServicePackages.length
                && allSubServicePackages.every(s => allSelectedSubServicePackages.some(as => as.servicePackageId === s.servicePackageId))
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
                // Workaround: valamiért a "listFieldComponent.editorForm.form"-ra nem setteli rendesen a "servicePackage"
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
