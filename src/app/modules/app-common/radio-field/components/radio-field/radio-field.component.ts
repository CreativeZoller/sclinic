import { AfterContentInit, Component, ContentChildren, HostBinding, Input, QueryList } from "@angular/core";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject, combineLatest, startWith } from "rxjs";
import { FieldErrorComponent } from "../../../field-error/components/field-error/field-error.component";
import { BaseControlValueAccessor } from "../../../utility/base-control-value-acessor/base-control-value-acessor.directive";
import { RadioFieldOptionComponent } from "../radio-field-option/radio-field-option.component";


@UntilDestroy()
@Component({
    selector: "app-radio-field",
    templateUrl: "radio-field.component.html",
    styleUrls: ["radio-field.component.scss"],
})
export class RadioFieldComponent<T> extends BaseControlValueAccessor<T> implements AfterContentInit {
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

    @ContentChildren(RadioFieldOptionComponent, { descendants: true }) optionComponents: QueryList<RadioFieldOptionComponent<T>>;

    public ngAfterContentInit() {
        combineLatest([
            this.isDisabled$,
            this.getValue$(),
            this.optionComponents.changes.pipe(startWith(null)),
        ]).pipe(
            untilDestroyed(this),
        ).subscribe(([isDisabled, currentValue]) => {
            for (const option of this.optionComponents.toArray()) {
                option.isDisabled = isDisabled;
                option.isChecked = option.optionValue === currentValue;

                option.onBlur = () => {
                    this.onBlur();
                    this.cdr.markForCheck();
                };
                option.onClick = () => {
                    this.changeValue(option.optionValue);
                    this.cdr.markForCheck();
                };

                this.cdr.markForCheck();
            }
        });
    }

    private isDisabled$ = new BehaviorSubject<boolean>(false);
    setDisabledState(isDisabled: boolean): void {
        this.isDisabled$.next(isDisabled);
        super.setDisabledState(isDisabled);
    }
}
