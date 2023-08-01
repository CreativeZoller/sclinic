import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { MedicalEmployeeXProfessionalExam } from "../../../models/medical-employee-x-professional-exam.model";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";


type Full_Model = MedicalEmployeeXProfessionalExam;

@UntilDestroy()
@Component({
    selector: "app-medical-employee-professional-exam-list-field",
    templateUrl: "./medical-employee-professional-exam-list-field.component.html",
    styleUrls: ["./medical-employee-professional-exam-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class MedicalEmployeeProfessionalExamListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "medical.employee.professional.exam";
    public tableIdProperty = "medicalEmployeeXPUPHAX_ProfessionalExamCodeId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            id: 1,
            name: this.resourceService.resolve("medical.employee.professional.exam.list.table.headers.puphaX_ProfessionalExamCode.name"),
            // TODO mock property name
            attributeName: "puphaX_ProfessionalExamCode.name",
        },
    ];
}
