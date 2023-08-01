import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { OccupationalHealthXAloneService_Model } from "../../../models/occupational.health.service.model";


type Full_Model = OccupationalHealthXAloneService_Model;

@UntilDestroy()
@Component({
    selector: "app-occupational-health-service-list-field",
    templateUrl: "./occupational-health-service-list-field.component.html",
    styleUrls: ["./occupational-health-service-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class OccupationalHealthServiceListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "exposure.item.service";
    public tableIdProperty = "occupationalHealthXServiceId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("exposure.item.service.list.table.headers.specialtyName"),
            formatterFn: (v: Full_Model) => v?.specialty?.specialtyName,
        },
        {
            name: this.resourceService.resolve("exposure.item.service.list.table.headers.serviceName"),
            formatterFn: (v: Full_Model) => v?.service?.serviceName,
        },
        {
            name: this.resourceService.resolve("exposure.item.service.list.table.headers.remarks"),
            formatterFn: (v: Full_Model) => v?.remarks,
        },
        {
            name: this.resourceService.resolve("exposure.item.service.list.table.headers.dC_ExposureFrequencyId"),
            formatterFn: (v: Full_Model) => {
                return this.initData.dC_ExposureFrequencyList.find(o => o.value === v?.dC_ExposureFrequencyId)?.name
            },
        },
        {
            name: this.resourceService.resolve("exposure.item.service.list.table.headers.isMandatory"),
            formatterFn: (v: Full_Model) => `<div class="form-check form-check-custom form-check-solid form-check-sm">
                <input type="checkbox" ${v?.isMandatory ? "checked" : ""} disabled class="form-check-input">
            </div>`,
        },
        {
            name: this.resourceService.resolve("exposure.item.service.list.table.headers.isPreviousResultAccepted"),
            formatterFn: (v: Full_Model) => `<div class="form-check form-check-custom form-check-solid form-check-sm">
                <input type="checkbox" ${v?.isPreviousResultAccepted ? "checked" : ""} disabled class="form-check-input">
            </div>`,
        },
    ];
}
