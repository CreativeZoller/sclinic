
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";


const emailValidatorRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function fullEmailValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const valid = emailValidatorRegex.test(value);
    return valid ? null : { 'email': { value: value } };
}
