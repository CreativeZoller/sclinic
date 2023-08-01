import { AbstractControl } from "@angular/forms";
import { BehaviorSubject, distinctUntilChanged, Observable, shareReplay } from "rxjs";


/**
 * Extract a touched changed observable from an abstract control
 * @param control AbstractControl
 */
export function controlExtractTouchedChanges$(control: AbstractControl, onlyDistinct = true): Observable<boolean> {
    const prevMarkAllAsTouched = control.markAllAsTouched.bind(control);
    const prevMarkAsTouched = control.markAsTouched.bind(control);
    const prevMarkAsUntouched = control.markAsUntouched.bind(control);

    const touchedChanges$ = new BehaviorSubject<boolean>(control.touched);

    function nextMarkAllAsTouched(...args: Parameters<AbstractControl["markAllAsTouched"]>) {
        prevMarkAllAsTouched(...args);
        touchedChanges$.next(true);
    }

    function nextMarkAsTouched(...args: Parameters<AbstractControl["markAsTouched"]>) {
        prevMarkAsTouched(...args);
        touchedChanges$.next(true);
    }

    function nextMarkAsUntouched(...args: Parameters<AbstractControl["markAsUntouched"]>) {
        prevMarkAsUntouched(...args);
        touchedChanges$.next(false);
    }

    control.markAllAsTouched = nextMarkAllAsTouched;
    control.markAsTouched = nextMarkAsTouched;
    control.markAsUntouched = nextMarkAsUntouched;

    return touchedChanges$.pipe(
        onlyDistinct ? distinctUntilChanged() : (x) => x,
        shareReplay(1),
    );
}
