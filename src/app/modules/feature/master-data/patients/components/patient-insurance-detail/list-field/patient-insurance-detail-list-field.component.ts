import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { PatientXInsuranceDetail } from "../../../models/patient-x-insurance-detail.model";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";


type Full_Model = PatientXInsuranceDetail;

@UntilDestroy()
@Component({
    selector: "app-patient-insurance-detail-list-field",
    templateUrl: "./patient-insurance-detail-list-field.component.html",
    styleUrls: ["./patient-insurance-detail-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class PatientInsuranceDetailListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "patient.insurance.detail";
    public tableIdProperty = "patientInsuranceDetailId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            id: 1,
            name: this.resourceService.resolve("patient.insurance.detail.list.table.headers.partner"),
            attributeName: "partner",
            formatterFn: (value: Full_Model["partner"]) => value?.company?.fullName
        },
        {
            id: 2,
            name: this.resourceService.resolve("patient.insurance.detail.list.table.headers.identificationNumber"),
            attributeName: "identificationNumber",
        },
        {
            id: 3,
            name: this.resourceService.resolve("patient.insurance.detail.list.table.headers.isEP"),
            attributeName: "isEP",
            formatterFn: (value) => `<div class="form-check form-check-custom form-check-solid form-check-sm">
                <input type="checkbox" ${value ? "checked" : ""} disabled class="form-check-input">
            </div>`,
        },
    ];
}
