import { AbstractControl } from "@angular/forms";
import { BehaviorSubject, distinctUntilChanged, Observable, shareReplay } from "rxjs";


/**
 * Extract a dirty changed observable from an abstract control
 * @param control AbstractControl
 */
export function controlExtractDirtyChanges$(control: AbstractControl, onlyDistinct = true): Observable<boolean> {
    const prevMarkAsDirty = control.markAsDirty.bind(control);
    const prevMarkAsPristine = control.markAsPristine.bind(control);

    const dirtyChanges$ = new BehaviorSubject<boolean>(control.dirty);

    function nextMarkAsDirty(...args: Parameters<AbstractControl["markAsDirty"]>) {
        prevMarkAsDirty(...args);
        dirtyChanges$.next(true);
    }

    function nextMarkAsPristine(...args: Parameters<AbstractControl["markAsPristine"]>) {
        prevMarkAsPristine(...args);
        dirtyChanges$.next(false);
    }

    control.markAsDirty = nextMarkAsDirty;
    control.markAsPristine = nextMarkAsPristine;

    return dirtyChanges$.pipe(
        onlyDistinct ? distinctUntilChanged() : (x) => x,
        shareReplay(1),
    );
}
