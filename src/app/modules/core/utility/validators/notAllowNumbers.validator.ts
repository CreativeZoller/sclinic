import { AbstractControl } from '@angular/forms';


export function cannotContainNumbers(control: AbstractControl) {
  const value = control.value;
  // Regular Expression to test if the string contains numbers
  const hasNumber = /\d/.test(value);

  // Returns an error object if the test fails, otherwise null.
  if (hasNumber) {
    return { 'cannotContainNumbers': true };
  }
  return null;
}
