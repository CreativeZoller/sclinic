import { ChangeDetectorRef, Directive, inject, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NgControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { combineLatest, distinctUntilChanged, map, tap } from "rxjs";
import { controlExtractTouchedChanges$ } from "../../../core/utility/methods/control-extract-touched-changes";
import { SKIP_SETTING_VALUE_ACCESSOR_TOKEN } from "../base-control-value-acessor/base-control-value-acessor.directive";


/**
 * See: https://medium.com/angular-in-depth/angular-nested-reactive-forms-using-cvas-b394ba2e5d0d
 */
@UntilDestroy()
@Directive()
export abstract class BaseControlValueAccessorWithForm<T = any> implements ControlValueAccessor, OnInit {

    protected cdr = inject(ChangeDetectorRef);
    public skipSettingValueAccessor = inject(SKIP_SETTING_VALUE_ACCESSOR_TOKEN, { optional: true, self: true }) ?? false;
    public skipSettingValueAccessorParent = inject(SKIP_SETTING_VALUE_ACCESSOR_TOKEN, { optional: true, skipSelf: true, host: true }) ?? false;
    public ngControl?: NgControl | null | undefined = inject(NgControl, { optional: true, self: !this.skipSettingValueAccessorParent });

    public abstract form: FormGroup | FormArray | FormControl;

    /**
     * Use to get the form value which will be passed to the parent form group (through ControlValueAccessor)
     */
    public abstract readValue(): T;

    /**
     * Use to set the form value from the parent form group (through ControlValueAccessor)
     */
    public abstract writeValue(value?: T): void;

    constructor() {
        if (this.ngControl != null && !this.skipSettingValueAccessor) {
            this.ngControl.valueAccessor = this;
        }
    }

    /**
     * Controls when to emit touched event:
     * - "NEVER" -> never
     * - "VALUE_CHANGES" -> when the form value changes
     * - "UTILS_TOUCHED_CHANGES$" -> when the inner form's touched value changes
     */
    @Input()
    public emitOnTouchedWhen: "VALUE_CHANGES" | "NEVER" | "UTILS_TOUCHED_CHANGES$" = "UTILS_TOUCHED_CHANGES$";

    private validatorFn = () => this.form.valid ? null : { invalid: true };

    public ngOnInit(): void {
        if (this.ngControl?.control != null) {
            if (!this.ngControl.control.hasValidator(this.validatorFn)) {
                this.ngControl.control.addValidators(this.validatorFn);
            }

            this.ngControl.control.updateValueAndValidity();

            controlExtractTouchedChanges$(this.ngControl.control).pipe(
                untilDestroyed(this),
            ).subscribe(() => {
                this.form.markAllAsTouched();
                this.cdr.markForCheck();
            });
        }

        combineLatest([
            this.form.valueChanges.pipe(distinctUntilChanged()),
            // this.form.statusChanges.pipe(distinctUntilChanged()),
        ]).pipe(
            tap(() => this.form.updateValueAndValidity({ emitEvent: false })),
            map(() => this.readValue()),
            distinctUntilChanged(),
            untilDestroyed(this),
        ).subscribe((value) => {
            this.onChange?.(value)
            this.cdr.markForCheck();
        });

        if (this.emitOnTouchedWhen === "VALUE_CHANGES") {
            this.form.valueChanges.pipe(
                untilDestroyed(this),
            ).subscribe(() => {
                this.onTouched?.();
                this.cdr.markForCheck();
            });
        }

        if (this.emitOnTouchedWhen === "UTILS_TOUCHED_CHANGES$") {
            controlExtractTouchedChanges$(this.form).pipe(
                untilDestroyed(this),
            ).subscribe((touched) => {
                if (touched) this.onTouched?.();
                this.cdr.markForCheck();
            });
        }
    }

    private onChange: (value: T) => void = () => {};
    public registerOnChange(fn: (value: T) => void): void {
        this.onChange = fn;
        this.form.updateValueAndValidity();
        this.cdr.markForCheck();
    }

    private onTouched: () => void = () => {};
    public registerOnTouched(onTouched: () => void): void {
        this.onTouched = onTouched;
        this.cdr.markForCheck();
    }

    public setDisabledState(isDisabled: boolean): void {
        if(isDisabled) {
            if(!this.form.disabled) this.form.disable();
        } else {
            if(!this.form.enabled) this.form.enable();
        }
        this.cdr.markForCheck();
    }
}
