import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ServiceXIncompatibleService } from "../../../models/service-x-incompatible-service.model";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { BehaviorSubject } from "rxjs";
import { ServiceXConnectedService } from "../../../models/service-x-connected-service.model";


export type FormModel = {
    selectedIncompatibleServices: NonNullable<ServiceXIncompatibleService["incompatibleService"]>[];
}

@UntilDestroy()
@Component({
    selector: "app-service-incompatible-service-selection-list-form",
    templateUrl: "./service-incompatible-service-selection-list-form.component.html",
    styleUrls: ["./service-incompatible-service-selection-list-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceIncompatibleServiceSelectionListFormComponent extends BaseFormComponent<FormModel> {

    public errorResourceKeyPrefix = "service.incompatible.service.form.errors";

    @Input() currentServiceId: number | undefined;

    public form = new FormGroup({
        selectedIncompatibleServices: new FormControl<FormModel["selectedIncompatibleServices"]>([], { nonNullable: true, validators: []}),
    });

    public setFormValue() {
        this.form.reset();
        this.form.patchValue({
            selectedIncompatibleServices: this.allSelectedIncompatibleServices.map(sXis => {
                return {
                    ...sXis.incompatibleService,
                    serviceId: sXis.incompatibleServiceId,
                };
            }),
        });
    };

    // Note: This method converts the junction table rows, not the form rows!
    public formValueToRequestValue(_value: any): any {
        const value = _value as ServiceXIncompatibleService;
        return { incompatibleServiceId: value.incompatibleServiceId } as ServiceXIncompatibleService;
    }

    @Input() allSelectedIncompatibleServices: ServiceXIncompatibleService[] = [];
    @Input() allSelectedConnectedServices: ServiceXConnectedService[] | undefined = [];
}
