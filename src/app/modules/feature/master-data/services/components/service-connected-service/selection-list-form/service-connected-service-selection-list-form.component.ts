import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ServiceXConnectedService } from "../../../models/service-x-connected-service.model";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { ServiceXIncompatibleService } from "../../../models/service-x-incompatible-service.model";


export type FormModel = {
    selectedConnectedServices: NonNullable<ServiceXConnectedService["connectedService"]>[];
}

@UntilDestroy()
@Component({
    selector: "app-service-connected-service-selection-list-form",
    templateUrl: "./service-connected-service-selection-list-form.component.html",
    styleUrls: ["./service-connected-service-selection-list-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceConnectedServiceSelectionListFormComponent extends BaseFormComponent<FormModel> {

    public errorResourceKeyPrefix = "service.connected.service.form.errors";

    public form = new FormGroup({
        selectedConnectedServices: new FormControl<FormModel["selectedConnectedServices"]>([], { nonNullable: true, validators: []}),
    });

    public setFormValue() {
        this.form.reset();
        this.form.patchValue({
            selectedConnectedServices: this.allSelectedConnectedServices.map(sXcs => {
                return {
                    ...sXcs.connectedService,
                    serviceId: sXcs.connectedServiceId,
                };
            }),
        });
    };

    // Note: This method converts the junction table rows, not the form rows!
    public formValueToRequestValue(_value: any): any {
        const value = _value as ServiceXConnectedService;
        return { connectedServiceId: value.connectedServiceId } as ServiceXConnectedService;
    }

    @Input() currentServiceId: number | undefined;
    @Input() allSelectedConnectedServices: ServiceXConnectedService[] = [];
    @Input() allSelectedIncompatibleServices: ServiceXIncompatibleService[] | undefined = [];
}
