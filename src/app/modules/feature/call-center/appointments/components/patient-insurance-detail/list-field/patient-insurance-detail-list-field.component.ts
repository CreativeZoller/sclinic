import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { TableHeader } from "src/app/components/table/table/table-header";
import { SkipSettingValueAccessorProviders } from "src/app/modules/app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BaseListFieldComponent } from "src/app/modules/app-common/utility/base-list-field/base-list-field.directive";
import { PatientXInsuranceDetail } from "src/app/modules/feature/master-data/patients/models/patient-x-insurance-detail.model";


type Full_Model = PatientXInsuranceDetail;

@UntilDestroy()
@Component({
    selector: "app-cc-patient-insurance-detail-list-field",
    templateUrl: "./patient-insurance-detail-list-field.component.html",
    styleUrls: ["./patient-insurance-detail-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class CcPatientInsuranceDetailListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "patient.insurance.detail";
    public tableIdProperty = "patientInsuranceDetailId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("patient.insurance.detail.list.table.headers.partner"),
            attributeName: "partner",
            formatterFn: (value: Full_Model["partner"]) => value?.company?.fullName
        },
        {
            name: this.resourceService.resolve("patient.insurance.detail.list.table.headers.identificationNumber"),
            attributeName: "identificationNumber",
        },
        {
            name: this.resourceService.resolve("patient.insurance.detail.list.table.headers.isEP"),
            attributeName: "isEP",
            formatterFn: (value) => `<div class="form-check form-check-custom form-check-solid form-check-sm">
                <input type="checkbox" ${value ? "checked" : ""} disabled class="form-check-input">
            </div>`,
        },
    ];
}
