import { Component, HostBinding, Input } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FieldAutoSizeConfig } from "../../../field-autosize-placeholder/components/field-autosize-placeholder/field-autosize-placeholder.component";
import { FieldErrorComponent } from "../../../field-error/components/field-error/field-error.component";
import { BaseControlValueAccessor, SkipSettingValueAccessorProviders } from "../../../utility/base-control-value-acessor/base-control-value-acessor.directive";


@Component({
    selector: "app-showable-password-field",
    templateUrl: "showable-password-field.component.html",
    styleUrls: ["showable-password-field.component.scss"],
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ShowablePasswordFieldComponent extends BaseControlValueAccessor {
    type: string = "password";
    @Input() label: string;
    @Input() mask: string;
    @Input() maskSuffix: string;
    @Input() maskPrefix: string;

    @HostBinding("class.is-invalid")
    get withIsInvalidClass() { return this.ngControl?.invalid && (this.ngControl?.touched || this.ngControl?.dirty); }
    @HostBinding("class.disabled")
    get withDisabledClass() { return this.isDisabled; }

    forceSyncModelWithControl = false;

    @Input() errorResourceKeyPrefix?: FieldErrorComponent["resourceKeyPrefix"];
    @Input() errorAddControlNameToResourceKeyPrefix?: FieldErrorComponent["addControlNameToResourceKeyPrefix"];
    @Input() errorShowErrorsMethod?: FieldErrorComponent["showErrorsMethod"];
    @Input() errorResourceOverrides?: FieldErrorComponent["resourceOverrides"];
    @Input() errorResourceOverridesMethod?: FieldErrorComponent["resourceOverridesMethod"];

    autoSizeConfig: FieldAutoSizeConfig = {
        keepOriginalCharacters: this.type !== "password",
        fillChar: this.type !== "password" ? "0" : "*",
    }
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input("autoSizeConfig") set _autoSizeConfig(cfg: FieldAutoSizeConfig) {
        this.autoSizeConfig = {
            ...this.autoSizeConfig,
            ...cfg,
            keepOriginalCharacters: this.type !== "password",
            fillChar: this.type !== "password" ? "0" : "*",
        }
    };

    public togglePasswordVisibility() {
        this.type = (this.type === "password") ? "text" : "password";
        this._autoSizeConfig = {};
    }
}
