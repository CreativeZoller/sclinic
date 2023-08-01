import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { Service_MedicalEmployee } from "../../../models/service-x-medical-emplyoee.model";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";


export type FormModel = {
    selectedSpecialtyDoctors: Service_MedicalEmployee[];
}

@UntilDestroy()
@Component({
    selector: "app-service-specialty-doctor-selection-list-form",
    templateUrl: "./service-specialty-doctor-selection-list-form.component.html",
    styleUrls: ["./service-specialty-doctor-selection-list-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceSpecialtyDoctorSelectionListFormComponent  extends BaseFormComponent<FormModel> {

    public errorResourceKeyPrefix = "service.specialty.doctor.form.errors";

    public form = new FormGroup({
        selectedSpecialtyDoctors: new FormControl<FormModel["selectedSpecialtyDoctors"]>([], { nonNullable: true, validators: []}),
    });

    public setFormValue() {
        this.form.reset();
        this.form.patchValue({
            selectedSpecialtyDoctors: this.allSelectedSpecialtyDoctors
        });
    };

    public formValueToRequestValue(value: any): any {
        return { medicalEmployeeId: value.medicalEmployeeId } as Service_MedicalEmployee;
    }

    @Input() allSpecialtyDoctors: Service_MedicalEmployee[] = [];
    @Input() allSelectedSpecialtyDoctors: Service_MedicalEmployee[] = [];
}
