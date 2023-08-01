import { Component, ContentChild, HostBinding, Input, TemplateRef, HostListener } from "@angular/core";
import { FieldAutoSizeConfig } from "../../../field-autosize-placeholder/components/field-autosize-placeholder/field-autosize-placeholder.component";
import { FieldErrorComponent } from "../../../field-error/components/field-error/field-error.component";
import { BaseControlValueAccessor } from "../../../utility/base-control-value-acessor/base-control-value-acessor.directive";
import { Maximum_Allowed_Int32_Number, Minimum_Allowed_Int32_Number } from "../../../../../app.config";



@Component({
    selector: "app-number-field",
    templateUrl: "number-field.component.html",
    styleUrls: ["number-field.component.scss"],
})
export class NumberFieldComponent extends BaseControlValueAccessor {
    @Input() type: string = "number";
    @Input() label: string;
    @Input() hideLabel = false;
    @Input() placeholder: string = "";
    @Input() classes?: string[] = [];
    @Input() mask: string;
    @Input() maskSuffix: string;
    @Input() maskPrefix: string;
    @Input() maskDropSpecialCharacters: boolean;
    @Input() step: number = 1;
    @Input() hideStepping: boolean = false;


    private _minNumber: number = Minimum_Allowed_Int32_Number; // Min Int32 number
    private _maxNumber: number = Maximum_Allowed_Int32_Number; // Max Int32 number

    @Input()
    set minNumber(value: number) {
        this._minNumber = value;
    }

    get minNumber(): number {
        return Math.ceil(this._minNumber / this.step) * this.step;
    }

    @Input()
    set maxNumber(value: number) {
        this._maxNumber = value;
    }

    get maxNumber(): number {
        return Math.floor(this._maxNumber / this.step) * this.step;
    }

    @HostBinding("class.is-invalid")
    get withIsInvalidClass() { return this.ngControl?.invalid && (this.ngControl?.touched || this.ngControl?.dirty); }
    @HostBinding("class.disabled")
    get withDisabledClass() { return this.isDisabled; }

    @Input() errorResourceKeyPrefix?: FieldErrorComponent["resourceKeyPrefix"];
    @Input() errorAddControlNameToResourceKeyPrefix?: FieldErrorComponent["addControlNameToResourceKeyPrefix"];
    @Input() errorShowErrorsMethod?: FieldErrorComponent["showErrorsMethod"];
    @Input() errorResourceOverrides?: FieldErrorComponent["resourceOverrides"];
    @Input() errorResourceOverridesMethod?: FieldErrorComponent["resourceOverridesMethod"];

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

    autoSizeConfig: FieldAutoSizeConfig = {
        offsetCount: 2,
    };
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input("autoSizeConfig") set _autoSizeConfig(cfg: FieldAutoSizeConfig) {
        this.autoSizeConfig = {
            ...this.autoSizeConfig,
            ...cfg,
            offsetCount: 2,
        }
    };

    @Input() forceSyncModelWithControl = false;

    writeValue(value: number | string | undefined): void {
        if (typeof value === "string") {
            this.value = value;
        } else if (typeof value === "number") {
            if (Number.isNaN(value)) this.value = undefined;
            else this.value = value.toString();
        } else {
            this.value = value;
        }
        this.cdr.markForCheck();
    }

    changeValue(value: number | string | undefined): void {
        if (!this.isDisabled) {
            let numericValue: number | undefined;

            if (typeof value === "string") {
                value = value.replace(/\,/g, ".");
                numericValue = Number.parseFloat(value);
            } else if (typeof value === "number") {
                numericValue = value;
            }

            if (numericValue === undefined || Number.isNaN(numericValue)) {
                this.value = undefined;
            } else {
                // Enforce min and max.

                this.value = numericValue.toString();
            }

            this.onChange?.(numericValue);
            this.cdr.markForCheck();
        }
    }

    @HostListener('wheel', ['$event'])
    onWheel(event: WheelEvent) {
        if (!this.isFocused) {
            return;
        }

        event.preventDefault();

        const numericValue = parseFloat(this.value);
        if (isNaN(numericValue)) {
            return;
        }

        const divisionResult = numericValue / this.step;
        let roundedValue: number;

        if (Number.isInteger(divisionResult)) {
            // If divisionResult is an integer, directly increase or decrease the value by the step
            roundedValue = numericValue + (event.deltaY < 0 ? this.step : -this.step);
        } else {
            // Otherwise, round the value
            roundedValue = (event.deltaY > 0 ? Math.floor(divisionResult) : Math.ceil(divisionResult)) * this.step;
        }

        this.changeValue(roundedValue.toString());
    }


}
