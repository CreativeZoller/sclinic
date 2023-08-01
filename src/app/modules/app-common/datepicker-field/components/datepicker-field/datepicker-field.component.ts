import { Component, ElementRef, HostBinding, Input, ViewChild } from '@angular/core';
import { FieldErrorComponent } from "../../../field-error/components/field-error/field-error.component";
import { BaseControlValueAccessor } from "../../../utility/base-control-value-acessor/base-control-value-acessor.directive";
import { DateFilterPipe } from '../../../../core/utility/pipes/date-filter.pipe';


@Component({
    selector: 'app-datepicker-field',
    templateUrl: './datepicker-field.component.html',
    styleUrls: ['./datepicker-field.component.scss'],
})
export class DatepickerFieldComponent extends BaseControlValueAccessor<string> {
    @Input() label: string;
    @Input() placeholder: string = "";
    @Input() classes?: string[] = [];

    @HostBinding("class.is-invalid")
    get withIsInvalidClass() { return this.ngControl?.invalid && (this.ngControl?.touched || this.ngControl?.dirty); }
    @HostBinding("class.disabled")
    get withDisabledClass() { return this.isDisabled; }

    @Input() errorResourceKeyPrefix?: FieldErrorComponent["resourceKeyPrefix"];
    @Input() errorAddControlNameToResourceKeyPrefix?: FieldErrorComponent["addControlNameToResourceKeyPrefix"];
    @Input() errorShowErrorsMethod?: FieldErrorComponent["showErrorsMethod"];
    @Input() errorResourceOverrides?: FieldErrorComponent["resourceOverrides"];
    @Input() errorResourceOverridesMethod?: FieldErrorComponent["resourceOverridesMethod"];

    @ViewChild("input") private inputElement: ElementRef;
    public onInputBlur() {
        // Reset field displayed value if necessary
        if (this.value == null) this.inputElement.nativeElement.value = "";
    }


    @Input() minDate: Date | string | undefined;
    @Input() maxDate: Date | string | undefined;

    dateFilterPipe: DateFilterPipe = new DateFilterPipe();
    filterDates = (d: Date | null): boolean => {
        return this.dateFilterPipe.transform(d, this.minDate, this.maxDate);
    }

    changeValue(value: string): void {
        if (value) {
            // Parse the string into a Date object.
            let dateValue = new Date(value);

            // Check if the date is valid.
            if (isNaN(dateValue.getTime())) {
                console.error('Invalid date:', value);
                return;
            }

            // The offset is in minutes -- convert it to milliseconds.
            var offsetMs = dateValue.getTimezoneOffset() * 60 * 1000;

            // getTime() gives the UTC timestamp -- subtract the offset to get the local timestamp.
            var localDate = new Date(dateValue.getTime() - offsetMs);

            // Convert the date back to a string in 'YYYY-MM-DD' format.
            var dateString = localDate.toISOString().split('T')[0];

            // Pass the string to the super method.
            super.changeValue(dateString);
        }
    }
}
