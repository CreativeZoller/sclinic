import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Lab } from "../../models/lab.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";


type Full_Model = Lab;

@UntilDestroy()
@Component({
    selector: "app-lab-form",
    templateUrl: "./lab-form.component.html",
    styleUrls: ["./lab-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabFormComponent extends BaseFormComponent<Full_Model> {

    public errorResourceKeyPrefix = "lab.form.errors";

    public form = new FormGroup({
        // Marker név
        dC_MarkerId: new FormControl<Full_Model["dC_MarkerId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Synlab ID
        providerIdentificationNumber: new FormControl<Full_Model["providerIdentificationNumber"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Mintavétel típusa (string)
        dC_LabSamplingTypeId: new FormControl<Full_Model["dC_LabSamplingTypeId"]>(undefined, { nonNullable: false, validators: [] }), // Mintavétel típusa (string)
        // Vizsgálat ismértlésének gyakorisága (Időszakon belül nem ismételhető meg)
        dC_LabRepeatPeriodId: new FormControl<Full_Model["dC_LabRepeatPeriodId"]>(undefined, { nonNullable: false, validators: [] }),
        // Mintavételi eszköz
        dC_SamplingItemId: new FormControl<Full_Model["dC_SamplingItemId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        dC_LabProviderId: new FormControl<Full_Model["dC_LabProviderId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
    });
}
