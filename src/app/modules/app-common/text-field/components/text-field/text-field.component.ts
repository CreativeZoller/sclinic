import { Component, ContentChild, HostBinding, Input, TemplateRef } from "@angular/core";
import { FieldAutoSizeConfig } from "../../../field-autosize-placeholder/components/field-autosize-placeholder/field-autosize-placeholder.component";
import { FieldErrorComponent } from "../../../field-error/components/field-error/field-error.component";
import { BaseControlValueAccessor } from "../../../utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BaseFormComponent } from "../../../utility/base-form-component/base-form-component.directive";


@Component({
    selector: "app-text-field",
    templateUrl: "text-field.component.html",
    styleUrls: ["text-field.component.scss"],
})
export class TextFieldComponent extends BaseControlValueAccessor {
    @Input() label: string;
    @Input() hideLabel = false;
    @Input() type: string = "text";
    @Input() placeholder: string = "";
    @Input() classes?: string[] = [];
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
    @Input() autoSizeConfig: FieldAutoSizeConfig;


    public fieldSuffixTemplate: TemplateRef<any>;
    public fieldPrefixTemplate: TemplateRef<any>;
    @ContentChild("fieldSuffixTemplate") public set suffixTemplateByContent(formComponent: TemplateRef<any>) {
        if (this.fieldSuffixTemplate == null) this.fieldSuffixTemplate = formComponent;
    }
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input("fieldSuffixTemplate") public set suffixTemplateByInput(formComponent: TemplateRef<any>) {
        if (this.fieldSuffixTemplate == null) this.fieldSuffixTemplate = formComponent;
    }
    @ContentChild("fieldPrefixTemplate") public set prefixTemplateByContent(formComponent: TemplateRef<any>) {
        if (this.fieldPrefixTemplate == null) this.fieldPrefixTemplate = formComponent;
    }
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input("fieldPrefixTemplate") public set prefixTemplateByInput(formComponent: TemplateRef<any>) {
        if (this.fieldPrefixTemplate == null) this.fieldPrefixTemplate = formComponent;
    }
}
