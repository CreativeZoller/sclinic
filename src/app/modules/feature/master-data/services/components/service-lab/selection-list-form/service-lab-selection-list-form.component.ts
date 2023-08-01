import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ServiceXLab } from "../../../models/service-x-lab.model";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";


export type FormModel = {
    selectedLabs: NonNullable<ServiceXLab["lab"]>[];
}

@UntilDestroy()
@Component({
    selector: "app-service-lab-selection-list-form",
    templateUrl: "./service-lab-selection-list-form.component.html",
    styleUrls: ["./service-lab-selection-list-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceLabSelectionListFormComponent extends BaseFormComponent<FormModel> {

    public errorResourceKeyPrefix = "service.lab.form.errors";

    public form = new FormGroup({
        selectedLabs: new FormControl<FormModel["selectedLabs"]>([], { nonNullable: true, validators: []}),
    });

    public setFormValue() {
        this.form.reset();
        this.form.patchValue({
            selectedLabs: this.allSelectedLabs.map(sXl => {
                return {
                    ...sXl.lab,
                    serviceId: sXl.labId,
                };
            }),
        });
    };

    // Note: This method converts the junction table rows, not the form rows!
    public formValueToRequestValue(_value: any): any {
        const value = _value as ServiceXLab;
        return { labId: value.labId } as ServiceXLab;
    }

    @Input() allSelectedLabs: ServiceXLab[] = [];
}
