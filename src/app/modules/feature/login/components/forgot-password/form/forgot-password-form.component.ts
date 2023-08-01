import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { fullEmailValidator } from "../../../../../core/utility/validators/full-email.validator";
import { ForgotPasswordFormData } from "../models/forgot-password-form-data.model";


@UntilDestroy()
@Component({
    selector: "app-forgot-password-form",
    templateUrl: "./forgot-password-form.component.html",
    styleUrls: ["./forgot-password-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordFormComponent extends BaseFormComponent<ForgotPasswordFormData> {

    public errorResourceKeyPrefix = "forgot.password.form.errors";

    public form = new FormGroup({
        // E-mail cím
        userEmail: new FormControl<ForgotPasswordFormData["userEmail"]>(undefined, { nonNullable: true, validators: [
            Validators.required,
            fullEmailValidator,
            Validators.minLength(3),
        ]}),
    });
}
