import { Component, HostBinding, Input } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { FieldErrorComponent } from "../../../field-error/components/field-error/field-error.component";
import { BaseControlValueAccessor } from "../../../utility/base-control-value-acessor/base-control-value-acessor.directive";


@UntilDestroy()
@Component({
    selector: "app-checkbox-field",
    templateUrl: "checkbox-field.component.html",
    styleUrls: ["checkbox-field.component.scss"],
})
export class CheckboxFieldComponent extends BaseControlValueAccessor<boolean> {
    @Input() label: string;
    @Input() boldLabel?: boolean = true;
    @Input() useAlignBaselineFix: boolean = false;

    @HostBinding("class.is-invalid")
    get withIsInvalidClass() { return this.ngControl?.invalid && (this.ngControl?.touched || this.ngControl?.dirty); }
    @HostBinding("class.disabled")
    get withDisabledClass() { return this.isDisabled; }

    @Input() errorResourceKeyPrefix?: FieldErrorComponent["resourceKeyPrefix"];
    @Input() errorAddControlNameToResourceKeyPrefix?: FieldErrorComponent["addControlNameToResourceKeyPrefix"];
    @Input() errorShowErrorsMethod?: FieldErrorComponent["showErrorsMethod"];
    @Input() errorResourceOverrides?: FieldErrorComponent["resourceOverrides"];
    @Input() errorResourceOverridesMethod?: FieldErrorComponent["resourceOverridesMethod"];
}
