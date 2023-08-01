import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { Exposure } from "../../../models/exposure.model";
import { ExposureXExposureItem } from "../../../models/exposure-x-exposure-item.model";
import { ExposureXExposureItemXService } from "../../../models/exposure-x-exposure-item-x-service.model";


type Full_Model = ExposureXExposureItemXService;

@UntilDestroy()
@Component({
    selector: "app-exposure-item-service-list-field",
    templateUrl: "./exposure-item-service-list-field.component.html",
    styleUrls: ["./exposure-item-service-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ExposureItemServiceListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "exposure.item.service";
    public tableIdProperty = "exposureXExposureItemXServiceId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("exposure.item.service.list.table.headers.specialtyName"),
            formatterFn: (v: ExposureXExposureItemXService) => v?.specialty?.specialtyName,
        },
        {
            name: this.resourceService.resolve("exposure.item.service.list.table.headers.serviceName"),
            formatterFn: (v: ExposureXExposureItemXService) => v?.service?.serviceName,
        },
        {
            name: this.resourceService.resolve("exposure.item.service.list.table.headers.remarks"),
            formatterFn: (v: ExposureXExposureItemXService) => v?.remarks,
        },
        {
            name: this.resourceService.resolve("exposure.item.service.list.table.headers.dC_ExposureFrequencyId"),
            formatterFn: (v: ExposureXExposureItemXService) => {
                return this.initData.dC_ExposureFrequencyList.find(o => o.value === v?.dC_ExposureFrequencyId)?.name
            },
        },
        {
            name: this.resourceService.resolve("exposure.item.list.table.headers.price"),
            formatterFn: (v: ExposureXExposureItem) => v?.price,
        },
        {
            name: this.resourceService.resolve("exposure.item.list.table.headers.duration"),
            formatterFn: (v: ExposureXExposureItem) => v?.duration,
        },
        {
            name: this.resourceService.resolve("exposure.item.service.list.table.headers.isMandatory"),
            formatterFn: (v: ExposureXExposureItemXService) => `<div class="form-check form-check-custom form-check-solid form-check-sm">
                <input type="checkbox" ${v?.isMandatory ? "checked" : ""} disabled class="form-check-input">
            </div>`,
        },
        {
            name: this.resourceService.resolve("exposure.item.service.list.table.headers.isPreviousResultAccepted"),
            formatterFn: (v: ExposureXExposureItemXService) => `<div class="form-check form-check-custom form-check-solid form-check-sm">
                <input type="checkbox" ${v?.isPreviousResultAccepted ? "checked" : ""} disabled class="form-check-input">
            </div>`,
        },
    ];

    @Input() exposure: Exposure | undefined | null;
    @Input() exposureXExposureItem: ExposureXExposureItem | undefined | null;
}
