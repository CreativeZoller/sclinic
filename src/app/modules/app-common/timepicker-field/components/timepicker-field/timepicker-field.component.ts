import { AfterViewInit, Component, HostBinding, Input, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { addHours, addMinutes } from "date-fns";
import { NgxMatTimepickerComponent } from "ngx-mat-timepicker";
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, map, shareReplay, startWith, tap } from "rxjs";
import { isEmpty } from "../../../../core/utility/methods/is-empty";
import { FieldErrorComponent } from "../../../field-error/components/field-error/field-error.component";
import { BaseControlValueAccessor } from "../../../utility/base-control-value-acessor/base-control-value-acessor.directive";


@UntilDestroy()
@Component({
    selector: 'app-timepicker-field',
    templateUrl: './timepicker-field.component.html',
    styleUrls: ['./timepicker-field.component.scss'],
})
export class TimepickerFieldComponent extends BaseControlValueAccessor<string | null> implements AfterViewInit {
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

    @ViewChild("picker") picker: NgxMatTimepickerComponent;

    public timepickerValue$ = this.getValue$().pipe(
        map((fullDateStr) => {
            return (fullDateStr ?? "").match(/.*T(?<time>\d\d\:\d\d).*/)?.groups?.["time"] ?? "";
        }),
        distinctUntilChanged(),
        shareReplay(1),
    );

    public ngAfterViewInit() {
        this.timepickerValue$.pipe(untilDestroyed(this)).subscribe(v => this.picker?.updateTime(v));
    }

    private pickerOpened = false;
    public onTimepickerOpened() {
        this.pickerOpened = true;
    }

    public onTimepickerClosed() {
        this.pickerOpened = false;
        super.onBlur();
    }

    private forceSyncInputValue$ = new BehaviorSubject(false);
    public inputValue$ = combineLatest([
        this.timepickerValue$,
        this.forceSyncInputValue$.asObservable().pipe(distinctUntilChanged()),
    ]).pipe(
        filter(([value, force]) => force || !isEmpty(value)),
        map(([value]) => value),
        tap(() => this.forceSyncInputValue$.next(false)),
        startWith(""),
        shareReplay(1),
    )

    public changeValue(value: string) {
        const timeStr = (value ?? "").match(/^(?<time>\d\d\:\d\d)$/)?.groups?.["time"];

        if(isEmpty(timeStr)) return super.changeValue(null);

        const hours = Number.parseFloat(timeStr?.split(":")[0] ?? "");
        const minutes = Number.parseFloat(timeStr?.split(":")[1] ?? "");

        if (Number.isNaN(hours) || Number.isNaN(minutes)) return super.changeValue(null);

        let date = new Date(0)
        date = addHours(date, hours);
        date = addMinutes(date, minutes);

        return super.changeValue(date.toISOString());
    }

    public onInputBlur() {
        this.forceSyncInputValue$.next(true);
    }

    private openPickerIfPossible() {
        if (!this.pickerOpened && (!this.isDisabled || false)) {
            this.pickerOpened = true;
            this.picker.open();
        }
    }

    public onInputFocus() {
        this.openPickerIfPossible();
    }

    public onIconClick(e: Event) {
        e.preventDefault();
        e.stopPropagation();

        this.openPickerIfPossible();
    }

    public writeValue(value: string | null): void {
        super.writeValue(value);
        this.forceSyncInputValue$.next(true);
    }
}
