import { AbstractControl, ValidatorFn } from "@angular/forms";
import { isAfter, isBefore, isFuture, isPast } from "date-fns";
import { isEmpty } from "../../utility/methods/is-empty";


const unixEpoch = new Date(0); // January 1, 1970
export function isBetweenDateRange(minDateControlName: string | undefined, maxDateControlName: string | undefined): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {

        const minDate = minDateControlName
            ? new Date(control.parent?.get(minDateControlName)?.value)
            : null;

        const maxDate = maxDateControlName
            ? new Date(control.parent?.get(maxDateControlName)?.value)
            : null;

        if (!isEmpty(control.value)) {
            const dateValue = new Date(control.value);

            if (minDate && minDate > unixEpoch && isBefore(dateValue, minDate)) return {
                greaterThan: {
                    value: minDate.toLocaleDateString(),
                },
            };

            if (maxDate && maxDate > unixEpoch && isAfter(dateValue, maxDate)) return {
                smallerThan: {
                    value: maxDate.toLocaleDateString(),
                },
            };
        }

        return null;
    };
}

export function isFutureDate(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (!isEmpty(control.value)) {
            const dateValue = new Date(control.value);

            if (!isPast(dateValue)) return {
                futureDateNotAllowed: true,
            };
        }

        return null;
    };
}

export function isPastDate(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (!isEmpty(control.value)) {
            const dateValue = new Date(control.value);

            if (!isFuture(dateValue)) return {
                pastDateNotAllowed: true,
            };
        }

        return null;
    };
}

export function isGreaterThanDateTime(
    dateTimeString: string | undefined,
    allowPastDate: boolean) : ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (!dateTimeString) return null;

        const _date = new Date(dateTimeString);

        if (control.value) {
            const dateValue = new Date(control.value);

            if (!allowPastDate && isPast(dateValue)) return {
                pastDateNotAllowed: true,
            };

            if (dateValue <= _date) return {
                greaterThan: {
                    value: _date.toLocaleDateString(),
                },
            };
        }

        return null;
    };
}

export function isSmallerThanDateTime(dateTimeString: string | undefined, allowPastDate: boolean): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (!dateTimeString) return null;

        const _date = new Date(dateTimeString);

        if (control.value) {
            const dateValue = new Date(control.value);

            if (!allowPastDate && isPast(dateValue)) return {
                pastDateNotAllowed: true,
            };

            if (dateValue <= _date) return {
                smallerThan: {
                    value: _date.toLocaleDateString(),
                },
            };
        }

        return null;
    };
}
