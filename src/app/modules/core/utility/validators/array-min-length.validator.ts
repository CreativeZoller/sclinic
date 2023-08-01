import { AbstractControl, ValidatorFn } from "@angular/forms";


/**
 * Validates (value) array length.
 *
 * Note: the builtin Validators.minLength() cannot be used allways,
 * because that allows strings and ignores empty arrays as well.
 */
export function arrayMinLength(requiredLength: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const value = control.getRawValue();
        if (Array.isArray(value) && value.length < requiredLength) {
            return {
                arrayMinLength: {
                    actual: value.length,
                    requiredLength: requiredLength,
                },
            };
        }

        return null;
    }
}
