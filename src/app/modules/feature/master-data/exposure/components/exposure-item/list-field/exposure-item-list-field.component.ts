import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ExposureXExposureItem } from "../../../models/exposure-x-exposure-item.model";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { ExposureXExposureItemXService } from "../../../models/exposure-x-exposure-item-x-service.model";
import { Exposure } from "../../../models/exposure.model";
import { of } from "rxjs";
import { ListHandlerCallbackData } from "../../../../../../app-common/list/components/list/list.component";
import { ExpandButtonComponent } from "../../../../../../../components/table/expand-button/expand-button.component";


type Full_Model = ExposureXExposureItem;
type Extended_Full_Model = Full_Model & {
    _index?: number,
    _exposure?: Exposure,
    _exposureXExposureItem?: Extended_Full_Model,
};

@UntilDestroy()
@Component({
    selector: "app-exposure-item-list-field",
    templateUrl: "./exposure-item-list-field.component.html",
    styleUrls: ["./exposure-item-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ExposureItemListFieldComponent extends BaseListFieldComponent<Extended_Full_Model> {

    public baseResourceKey = "exposure.item";
    public tableIdProperty = "exposureItemId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: "",
            cellComponent: ExpandButtonComponent,
            initCellComponentBindingsFactoryFn: (value, row, index) => {
                return (instance: ExpandButtonComponent) => {
                    instance.expandable = this.getExpandedRowChildRows(row).length > 0;
                    instance.expanded = false;
                    instance.click.pipe(
                        untilDestroyed(this),
                        untilDestroyed(instance),
                    ).subscribe(() => {
                        this.listFieldComponent.listComponent.toggleExpandRow(row);
                        instance.expanded = !instance.expanded;
                    });
                };
            },
        },
        {
            name: this.resourceService.resolve("exposure.item.list.table.headers.description"),
            formatterFn: (v: ExposureXExposureItem) => v?.exposureItem?.description,
        },
        {
            name: this.resourceService.resolve("exposure.item.list.table.headers.specialtyName"),
            formatterFn: (v: ExposureXExposureItemXService) => v?.specialty?.specialtyName,
        },
        {
            name: this.resourceService.resolve("exposure.item.list.table.headers.serviceName"),
            formatterFn: (v: ExposureXExposureItemXService) => v?.service?.serviceName,
        },
        {
            name: this.resourceService.resolve("exposure.item.list.table.headers.remarks"),
            formatterFn: (v: ExposureXExposureItemXService) => v?.remarks,
        },
        // TODO lehet itt is maradhat de kell egy átvezetés a 'exposure-item-service'-be
        {
            name: this.resourceService.resolve("exposure.item.list.table.headers.price"),
            formatterFn: (v: ExposureXExposureItem | ExposureXExposureItemXService) => {
                const exposureXExposureItem = v as ExposureXExposureItem;
                const exposureXExposureItemXService = v as ExposureXExposureItemXService;

                return exposureXExposureItem?.price
                    ?? exposureXExposureItemXService?.service?.basePrice
                    ?? exposureXExposureItemXService?.servicePackage?.basePrice;
            },
        },
        {
            name: this.resourceService.resolve("exposure.item.list.table.headers.duration"),
            formatterFn: (v: ExposureXExposureItem) => v?.duration,
        },
        {
            name: this.resourceService.resolve("exposure.item.list.table.headers.dC_ExposureFrequencyId"),
            formatterFn: (v: ExposureXExposureItemXService) => {
                return this.initData.dC_ExposureFrequencyList.find(o => o.value === v?.dC_ExposureFrequencyId)?.name
            },
        },
        {
            name: this.resourceService.resolve("exposure.item.list.table.headers.isMandatory"),
            formatterFn: (v: ExposureXExposureItemXService) => `<div class="form-check form-check-custom form-check-solid form-check-sm">
                <input type="checkbox" ${v?.isMandatory ? "checked" : ""} disabled class="form-check-input">
            </div>`,
        },
        {
            name: this.resourceService.resolve("exposure.item.list.table.headers.isPreviousResultAccepted"),
            formatterFn: (v: ExposureXExposureItemXService) => `<div class="form-check form-check-custom form-check-solid form-check-sm">
                <input type="checkbox" ${v?.isPreviousResultAccepted ? "checked" : ""} disabled class="form-check-input">
            </div>`,
        },
    ];

    @Input() exposure: Exposure | undefined | null;

    getExpandedRowChildRows = (row: Extended_Full_Model): Extended_Full_Model[]  => {
        return (row.exposureXExposureItemXService ?? []).map((s, i) => ({
            ...s,
            _index: i,
            _exposure: this.exposure ?? undefined,
            _exposureXExposureItem: row,
        }));
    }

    getFullModelFromGridModel$ = (gridModel: Extended_Full_Model) => of({
        ...gridModel,
        _exposure: this.exposure,
    });

    public getEditorModalTitle: (gridRowData?: ExposureXExposureItem | ExposureXExposureItemXService) => string = (gridRowData) => {
        return this.resourceService.resolve(
            gridRowData == null
                ? "exposure.item.editor.title.create"
                : (gridRowData as ExposureXExposureItemXService)?.exposureXExposureItemXServiceId == null
                    ? "exposure.item.editor.title.editOrDelete"
                    : "exposure.item.service.editor.title.editOrDelete"
        );
    }

    protected handleSave$ = ({ rowData, formValue }: ListHandlerCallbackData<Extended_Full_Model, Extended_Full_Model>) => {
        const value = this.listFieldComponent.value ?? [];

        if (rowData?._exposureXExposureItem == null) {
            const indexToUpdate = rowData?._index;
            if (indexToUpdate != null) {
                this.listFieldComponent.changeValue(
                    value.map((v, i) => {
                        return i !== rowData?._index
                            ? v
                            : formValue;
                    })
                );
            } else {
                this.listFieldComponent.changeValue([
                    ...value,
                    formValue,
                ]);
            }
        } else {
            this.listFieldComponent.changeValue(
                value.map((v, i) => {
                    if (i === rowData?._exposureXExposureItem?._index) {
                        v.exposureXExposureItemXService = v.exposureXExposureItemXService
                            ?.map((v2, i2) => (i2 !== rowData._index) ? (v2) : (formValue));
                    }

                    return v;
                })
            );
        }

        return of(null);
    }

    protected handleDelete$ = ({ rowData, formValue }: ListHandlerCallbackData<Extended_Full_Model, Extended_Full_Model>) => {
        const value = this.listFieldComponent.value ?? [];

        if (rowData?._exposureXExposureItem == null) {
            this.listFieldComponent.changeValue(
                value.filter((_, i) => i !== rowData?._index)
            );
        } else {
            this.listFieldComponent.changeValue(
                value.map((v, i) => {
                    if (i === rowData?._exposureXExposureItem?._index) {
                        v.exposureXExposureItemXService = v.exposureXExposureItemXService
                            ?.filter((_, i2) => i2 !== rowData._index);
                    }

                    return v;
                })
            );
        }

        return of(null);
    }
}
