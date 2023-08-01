import { AbstractControl, ValidatorFn } from "@angular/forms";


/**
 * Use in pair with CVA implementations: the child form errors are invisible to the parent form,
 * so we return null/undefined to the parent from the child when child is invalid.
 * By using this validator on the child's FormControl the parent will be invalid as well.
 *
 * Note: it is different form Validators.required because it allows empty arrays while the latter does not.
 */
export function notNullish(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (control.getRawValue() == null) {
            return { notNullish: true };
        }

        return null;
    }
}
