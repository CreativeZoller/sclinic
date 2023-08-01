import { Component, Input } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";


@UntilDestroy()
@Component({
    selector: "app-radio-field-option",
    templateUrl: "radio-field-option.component.html",
    styleUrls: ["radio-field-option.component.scss"],
})
export class RadioFieldOptionComponent<T> {
    @Input() label: string;
    @Input() optionValue: T;
    @Input() boldLabel?: boolean = true;
    @Input() useAlignBaselineFix: boolean = false;

    isDisabled: boolean = false;
    isChecked: boolean = false;

    onBlur?: () => void;
    protected _onBlur() {
        this.onBlur?.();
    }
    onClick?: () => void;
    protected _onClick(e: Event) {
        e.stopPropagation();
        this.onClick?.();
    }
}
