import { AbstractControl, ValidationErrors } from '@angular/forms';

export function divisibleByValidator(divisor: number, errorKey = 'divisibleBy'): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const isDivisible = value % divisor === 0;
    const errorValue = { value: control.value, divisor };

    return isDivisible ? null : { [errorKey]: errorValue };
  };
}
