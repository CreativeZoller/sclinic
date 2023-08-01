import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { MedicalEmployeeXContract } from "../../../models/medical-employee-x-contract.model";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";


type Full_Model = MedicalEmployeeXContract;

@UntilDestroy()
@Component({
    selector: "app-medical-employee-contract-list-field",
    templateUrl: "./medical-employee-contract-list-field.component.html",
    styleUrls: ["./medical-employee-contract-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class MedicalEmployeeContractListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "medical.employee.contract";
    public tableIdProperty = "medicalContractId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            id: 1,
            name: this.resourceService.resolve("medical.employee.contract.list.table.headers.medicalContractNumber"),
            attributeName: "medicalContractNumber",
        },
        {
            id: 2,
            name: this.resourceService.resolve("medical.employee.contract.list.table.headers.medicalContractName"),
            attributeName: "medicalContractName",
        },
    ];
}
