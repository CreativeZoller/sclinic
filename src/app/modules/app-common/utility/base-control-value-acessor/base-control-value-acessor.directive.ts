import { ChangeDetectorRef, Directive, HostListener, inject, InjectionToken, Input, OnInit, Provider } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject, filter, shareReplay } from "rxjs";

export const SKIP_SETTING_VALUE_ACCESSOR_TOKEN = new InjectionToken<boolean>("SKIP_SETTING_VALUE_ACCESSOR_TOKEN");

export const SkipSettingValueAccessorProviders: Provider[] = [
    { provide: SKIP_SETTING_VALUE_ACCESSOR_TOKEN, useValue: true },
]

/**
 * See: https://medium.com/angular-in-depth/angular-nested-reactive-forms-using-cvas-b394ba2e5d0d
 */
@UntilDestroy()
@Directive({})
export class BaseControlValueAccessor<OuterModel = any, InnerModel = OuterModel> implements ControlValueAccessor, OnInit {

    public cdr = inject(ChangeDetectorRef);
    public skipSettingValueAccessor = inject(SKIP_SETTING_VALUE_ACCESSOR_TOKEN, { optional: true, self: true }) ?? false;
    public skipSettingValueAccessorParent = inject(SKIP_SETTING_VALUE_ACCESSOR_TOKEN, { optional: true, skipSelf: true, host: true }) ?? false;
    public ngControl?: NgControl | null | undefined = inject(NgControl, { optional: true, self: !this.skipSettingValueAccessorParent });

    @Input() set disabled(isDisabled: boolean) {
        this.setDisabledState(isDisabled)
    }

    @Input() set control(ctrl: AbstractControl) {
        this.ngControl = new Proxy(ctrl, {
            get(target, name, receiver) {
                if (name === "control") return target;
                return Reflect.get(target, name, receiver);
            }
        }) as unknown as NgControl;
    }

    constructor() {
        if (this.ngControl != null && !this.skipSettingValueAccessor) {
            this.ngControl.valueAccessor = this;
        }
    }

    @Input() public forceSyncModelWithControl: boolean = true;
    ngOnInit() {
        if (this.forceSyncModelWithControl) {
            if (this.ngControl != null) {
                this.ngControl.valueChanges?.pipe?.(
                    untilDestroyed(this),
                )?.subscribe?.((value) => {
                    this.value = value;
                })
            }
        }
    }

    public getValue$() {
        return this._getValue$;
    }

    private value$ = new BehaviorSubject<InnerModel | undefined>(undefined);
    public skipNextGetValue$Emit: boolean = false;
    private _getValue$ = this.value$.asObservable().pipe(
        filter(() => {
            const skipNext = this.skipNextGetValue$Emit;
            this.skipNextGetValue$Emit = false;

            return !skipNext;
        }),
        shareReplay(1),
    );
    get value(): InnerModel {
        return this.value$.value as InnerModel;
    }
    protected set value(value: InnerModel) {
        this.value$.next(value);
    }

    writeValue(value: OuterModel): void {
        this.value = value as unknown as InnerModel;
        this.cdr.markForCheck();
    }
    readValue(value: InnerModel): OuterModel {
        return value as unknown as OuterModel;
    }
    changeValue(value: InnerModel, markTouched = true): void {
        if (!this.isDisabled) {
            this.value = value;
            if (markTouched) this.onTouched?.();
            this.onChange?.(
                this.readValue(this.value)
            );
        }
        this.cdr.markForCheck();
    }
    onChange: (value: OuterModel) => void = () => {};
    registerOnChange(onChange: (value: OuterModel) => void): void {
        this.onChange = onChange;
        this.cdr.markForCheck();
    }

    onBlur() {
        this.isFocused = false;
        this.onTouched?.();
        this.cdr.markForCheck();
    }

    isTouched = false;
    onTouched: () => void = () => {};
    registerOnTouched(onTouched: () => void): void {
        this.onTouched = onTouched;
        this.cdr.markForCheck();
    }

    isDisabled = false;
    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
        if (this.isDisabled) {
            if (!this.ngControl?.control?.disabled) this.ngControl?.control?.disable();
        } else {
            if (!this.ngControl?.control?.enabled) this.ngControl?.control?.enable();
        }
        this.cdr.markForCheck();
    }

    isFocused = false;
    onFocus() {
        console.log("onFocus");
        this.isFocused = true;
    }
}
