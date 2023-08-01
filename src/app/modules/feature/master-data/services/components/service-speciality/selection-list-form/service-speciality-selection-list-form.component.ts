import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ServiceXSpecialty } from "../../../models/service-x-specialty.model";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";


export type FormModel = {
    selectedSpecialities: NonNullable<ServiceXSpecialty["specialty"]>[];
}

@UntilDestroy()
@Component({
    selector: "app-service-speciality-selection-list-form",
    templateUrl: "./service-speciality-selection-list-form.component.html",
    styleUrls: ["./service-speciality-selection-list-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceSpecialitySelectionListFormComponent extends BaseFormComponent<FormModel> {

    public errorResourceKeyPrefix = "service.speciality.form.errors";

    public form = new FormGroup({
        selectedSpecialities: new FormControl<FormModel["selectedSpecialities"]>([], { nonNullable: true, validators: []}),
    });

    public setFormValue() {
        this.form.reset();
        this.form.patchValue({
            selectedSpecialities: this.allSelectedSpecialities.map(sXs => {
                return {
                    ...sXs.specialty,
                    specialtyId: sXs.specialtyId,
                };
            }),
        });
    };

    // Note: This method converts the junction table rows, not the form rows!
    public formValueToRequestValue(_value: any): any {
        const value = _value as ServiceXSpecialty;
        return { specialtyId: value.specialtyId } as ServiceXSpecialty;
    }

    @Input() allSelectedSpecialities: ServiceXSpecialty[] = [];
}
