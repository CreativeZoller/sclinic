import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Configuration, Grid_Configuration } from "../../models/configuration.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { isBetweenDateRange } from "../../../../../core/utility/validators/date.validator";


type Grid_Model = Grid_Configuration;
type Full_Model = Configuration;

@UntilDestroy()
@Component({
    selector: "app-configuration-form",
    templateUrl: "./configuration-form.component.html",
    styleUrls: ["./configuration-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurationFormComponent extends BaseFormComponent<Full_Model> {

    public errorResourceKeyPrefix = "configuration.form.errors";

    public form = new FormGroup({
        // Konfiguráció neve
        configurationName: new FormControl<Configuration["configurationName"]>({ value: undefined, disabled: true }, { nonNullable: true, validators: [Validators.required] }),
        // Konfigurációs érték
        configurationValue: new FormControl<Configuration["configurationValue"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Érvényesség kezdete
        validFrom: new FormControl<Configuration["validFrom"]>(undefined, { nonNullable: true, validators: [Validators.required, isBetweenDateRange(undefined, 'validTo')] }),
        // Érvényesség vége
        validTo: new FormControl<Configuration["validTo"]>(undefined, { nonNullable: true, validators: [Validators.required, isBetweenDateRange('validFrom', undefined)] }),
    });
}
