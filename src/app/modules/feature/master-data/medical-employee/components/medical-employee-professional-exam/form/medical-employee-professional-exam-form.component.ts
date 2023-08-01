import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { delay, of } from "rxjs";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { MedicalEmployeeXProfessionalExam } from "../../../models/medical-employee-x-professional-exam.model";

// TODO MOCK
type Full_Model = any//MedicalEmployeeXProfessionalExam;

@UntilDestroy()
@Component({
    selector: "app-medical-employee-professional-exam-form",
    templateUrl: "./medical-employee-professional-exam-form.component.html",
    styleUrls: ["./medical-employee-professional-exam-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalEmployeeProfessionalExamFormComponent extends BaseFormComponent<Full_Model> {

    public errorResourceKeyPrefix = "medical.employee.professional.exam.form.errors";

    public form = new FormGroup({
        // Szakvizsga
        puphaX_ProfessionalExamCode: new FormControl<Full_Model["puphaX_ProfessionalExamCode"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
    });

    professionalExamAutocomplete = {
        searhcFn$: (value: string) => {
            // TODO mock
            return of([{
                puphaX_ProfessionalExamCodeId: 1,
                name: "MOCK " + value,
            }]).pipe(
                delay(2000)
            );
        },

        // TODO mock
        getFormattedSelectText: (v: any) => v?.name ?? "",

        // TODO mock
        getFormattedInputText: (v: any) => v?.name ?? "",
    };

    public formValueToRequestValue(value: Full_Model): Full_Model {
        return {
            ...value,
            puphaX_ProfessionalExamCode: undefined,
            puphaX_ProfessionalExamCodeId: value?.puphaX_ProfessionalExamCode?.puphaX_ProfessionalExamCodeId,
        };
    }
}
