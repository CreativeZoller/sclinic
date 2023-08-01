import { Component, ContentChild, HostBinding, Input, TemplateRef } from "@angular/core";
import { FieldAutoSizeConfig } from "../../../field-autosize-placeholder/components/field-autosize-placeholder/field-autosize-placeholder.component";
import { FieldErrorComponent } from "../../../field-error/components/field-error/field-error.component";
import { BaseControlValueAccessor } from "../../../utility/base-control-value-acessor/base-control-value-acessor.directive";


@Component({
    selector: "app-text-area-field",
    templateUrl: "text-area-field.component.html",
    styleUrls: ["text-area-field.component.scss"],
})
export class TextAreaFieldComponent extends BaseControlValueAccessor {
    @Input() label: string;
    @Input() hideLabel = false;
    @Input() rows = 3;
    @Input() mask?: string;
    @Input() maskSuffix: string;
    @Input() maskPrefix: string;

    @HostBinding("class.is-invalid")
    get withIsInvalidClass() { return this.ngControl?.invalid && (this.ngControl?.touched || this.ngControl?.dirty); }
    @HostBinding("class.disabled")
    get withDisabledClass() { return this.isDisabled; }

    @Input() errorResourceKeyPrefix?: FieldErrorComponent["resourceKeyPrefix"];
    @Input() errorAddControlNameToResourceKeyPrefix?: FieldErrorComponent["addControlNameToResourceKeyPrefix"];
    @Input() errorShowErrorsMethod?: FieldErrorComponent["showErrorsMethod"];
    @Input() errorResourceOverrides?: FieldErrorComponent["resourceOverrides"];
    @Input() errorResourceOverridesMethod?: FieldErrorComponent["resourceOverridesMethod"];

    @ContentChild("fieldSuffixTemplate", { static: true }) fieldSuffixTemplate: TemplateRef<any>;
    @ContentChild("fieldPrefixTemplate", { static: true }) fieldPrefixTemplate: TemplateRef<any>;
    @Input() autoSizeConfig: FieldAutoSizeConfig;
}
