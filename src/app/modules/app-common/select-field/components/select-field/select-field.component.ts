import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, shareReplay } from "rxjs";
import { isComplexSelectOption, SelectOption } from "../../../../core/utility/types/select-option";
import { FieldErrorComponent } from "../../../field-error/components/field-error/field-error.component";
import { BaseControlValueAccessor } from "../../../utility/base-control-value-acessor/base-control-value-acessor.directive";


type SelectOptionWithFlag<T = any> = SelectOption<T> & { selected: boolean };

@Component({
    selector: 'app-select-field',
    templateUrl: "select-field.component.html",
    styleUrls: ["./select-field.component.scss"],
})
export class SelectFieldComponent extends BaseControlValueAccessor {
    @Input() label: string;
    @Input() hideLabel = false;
    @Input() placeholder: string = "";
    @Input() classes?: string[] = [];

    private _options$ = new BehaviorSubject<SelectOption[]>([]);
    @Input() set options(options: SelectOption[] | null | undefined) {
        this._options$.next(options ?? []);
    };
    protected options$: Observable<SelectOptionWithFlag[]> = combineLatest([
        this._options$,
        this.getValue$(),
    ]).pipe(
        map(([options, value]) => (options ?? [])?.map((o) => {
            return <SelectOptionWithFlag>{
                ...o,
                selected: !isComplexSelectOption(o)
                    ? this.value === o.value
                    : this.value?.[o.idProperty] === o.value?.[o.idProperty],
            };
        })),
        shareReplay(1),
    );

    @Input() hideDefaultOption?: boolean = false;

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
