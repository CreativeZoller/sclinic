import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { fullEmailValidator } from "../../../../../core/utility/validators/full-email.validator";
import { LostTokenFormData } from "../models/lost-token-form-data.model";


@UntilDestroy()
@Component({
    selector: "app-lost-token-form",
    templateUrl: "./lost-token-form.component.html",
    styleUrls: ["./lost-token-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LostTokenFormComponent extends BaseFormComponent<LostTokenFormData> {

    public errorResourceKeyPrefix = "lost.token.form.errors";

    public form = new FormGroup({
        // E-mail cím
        email: new FormControl<LostTokenFormData["email"]>(undefined, { nonNullable: true, validators: [
            Validators.required,
            Validators.minLength(3),
            fullEmailValidator,
        ]}),
        // EESZT-hez kér kódot?
        forEesztLogin: new FormControl<LostTokenFormData["forEesztLogin"]>(false, { nonNullable: true, validators: [] }),
    });
}
