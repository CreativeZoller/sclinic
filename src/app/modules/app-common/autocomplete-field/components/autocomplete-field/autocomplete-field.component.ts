import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostBinding, inject, Input, ViewChild } from "@angular/core";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { catchError, debounceTime, distinctUntilChanged, map, merge, Observable, of, OperatorFunction, shareReplay, Subject, switchMap, takeUntil, tap } from "rxjs";
import { ResourceService } from "../../../../core/resource/services/resource.service";
import { controlExtractDirtyChanges$ } from "../../../../core/utility/methods/control-extract-dirty-changes";
import { controlExtractTouchedChanges$ } from "../../../../core/utility/methods/control-extract-touched-changes";
import { isEmpty } from "../../../../core/utility/methods/is-empty";
import { FieldErrorComponent } from "../../../field-error/components/field-error/field-error.component";
import { BaseControlValueAccessor } from "../../../utility/base-control-value-acessor/base-control-value-acessor.directive";


@UntilDestroy()
@Component({
    selector: "app-autocomplete-field",
    templateUrl: "autocomplete-field.component.html",
    styleUrls: ["autocomplete-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteFieldComponent<T = any> extends BaseControlValueAccessor implements AfterViewInit {

    private resourceService = inject(ResourceService);

    @HostBinding("class.is-invalid")
    get withIsInvalidClass() { return this.ngControl?.invalid && (this.ngControl?.touched || this.ngControl?.dirty); }
    @HostBinding("class.disabled")
    get withDisabledClass() { return this.isDisabled; }

    @Input() errorResourceKeyPrefix?: FieldErrorComponent["resourceKeyPrefix"];
    @Input() errorAddControlNameToResourceKeyPrefix?: FieldErrorComponent["addControlNameToResourceKeyPrefix"];
    @Input() errorShowErrorsMethod?: FieldErrorComponent["showErrorsMethod"];
    @Input() errorResourceOverrides?: FieldErrorComponent["resourceOverrides"];
    @Input() errorResourceOverridesMethod?: FieldErrorComponent["resourceOverridesMethod"];

    isLoading: boolean = false;

    @Input() label: string;
    @Input() editable: boolean = false;
    @Input() focusFirst: boolean = false;
    @Input() showHint: boolean = false;
    @Input() popupClass: string = "z-index-fix";
    @Input() emptyResultListText: string = this.resourceService.resolve("general.form.errors.empty.result.list");

    @Input() inputFormatter: (value: T) => string = v => `${v ?? ""}`;
    @Input() resultFormatter: (value: T) => string = v => `${v ?? ""}`;

    @Input() searchFn$: (term: string) => Observable<readonly T[]> = () => of([]);

    ngbTypeaheadSearch: OperatorFunction<string, readonly T[]> = (text$: Observable<string>) => text$.pipe(
        debounceTime(200),
        tap(() => {
            this.isLoading = true;
            this.cdr.markForCheck();
        }),
        switchMap((term) => (term.length < 2)
            ? of([])
            : this.searchFn$(term).pipe(
                takeUntil(this.cancelSearch$),
                catchError(() => of([])),
            ).pipe(
                map((resultList) => {
                    if (resultList.length > 0) return resultList;

                    return [{ __NO_RESULT__: true } as unknown as T];
                }),
            )
        ),
        tap(() => {
            this.isLoading = false;
            this.cdr.markForCheck();
        }),
        distinctUntilChanged(),
        shareReplay(1)
    );

    private cancelSearch$ = new Subject<void>();

    private cancelSearch() {
        this.cancelSearch$.next();
        this.isLoading = false;
        this.cdr.markForCheck();
    }

    @ViewChild("input") private inputElement: ElementRef;
    @ViewChild(NgbTypeahead) private ngbTypeahead: NgbTypeahead;

    private forceSelectValidValue() {
        // Reset field displayeed value if necessary
        if (this.inputElement.nativeElement.value !== this.inputFormatter(this.value)) {
            this.inputElement.nativeElement.value = this.inputFormatter(this.value)
        }
    }

    onBlur() {
        this.cancelSearch();
        this.forceSelectValidValue();
        this.ngbTypeahead.dismissPopup();

        super.onBlur();
    }

    changeValue(value: any): void {
        // Prevent emitting value change if the old value and the new value are both types of empty values (empty string, null or undefined)
        if (isEmpty(value) !== isEmpty(this.value) && !value?.__NO_RESULT__) {
            super.changeValue(value)
        }
    }

    ngAfterViewInit() {
        if (this.ngControl?.control != null) {
            this.ngControl.control.valueChanges.pipe(
                untilDestroyed(this),
            ).subscribe(() => {
                // Only reset if field not focused (beeing edited)
                if (this.inputElement.nativeElement !== document.activeElement) {
                    this.forceSelectValidValue();
                }
                this.cdr.markForCheck();
            });

            merge(
                this.ngControl.control.statusChanges,
                controlExtractDirtyChanges$(this.ngControl.control),
                controlExtractTouchedChanges$(this.ngControl.control),
            ).pipe(
                untilDestroyed(this),
            ).subscribe(() => {
                this.cdr.markForCheck();
            });
        }
    }
}
