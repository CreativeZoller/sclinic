import { AbstractControl, ValidatorFn } from "@angular/forms";

export function hasUppercaseCharacter(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const hasUpper = /[A-Z]/.test(control.value);

        if (!hasUpper) {
            return { hasUppercaseCharacter: true };
        }

        return null;
    }
}
