import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { fieldsEqual } from "../../../../../core/utility/validators/fields-equal.validator";
import { hasUppercaseCharacter } from "../../../../../core/utility/validators/has-uppercase-character.validator";
import { NewPasswordFormData } from "../models/new-password-form-data.model";


@UntilDestroy()
@Component({
    selector: "app-new-password-form",
    templateUrl: "./new-password-form.component.html",
    styleUrls: ["./new-password-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPasswordFormComponent extends BaseFormComponent<NewPasswordFormData> {

    public errorResourceKeyPrefix = "new.password.form.errors";

    public form = new FormGroup({
        // Új jelszó
        newPassword: new FormControl<NewPasswordFormData["newPassword"]>(undefined, { nonNullable: true, validators: [
            Validators.required,
            Validators.minLength(8),
            hasUppercaseCharacter(),
        ]}),
        // Új jelszó ismételten
        newPasswordAgain: new FormControl<NewPasswordFormData["newPasswordAgain"]>(undefined, { nonNullable: true, validators: [
            Validators.required,
            Validators.minLength(8),
            hasUppercaseCharacter(),
        ]}),
    }, [
        fieldsEqual(["newPassword", "newPasswordAgain"]),
    ]);
}
