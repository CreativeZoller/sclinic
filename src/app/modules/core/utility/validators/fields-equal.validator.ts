import { AbstractControl, ValidatorFn } from "@angular/forms";
import { getPathProperty } from "../methods/get-path-property";
import { isEmpty } from "../methods/is-empty";

export function fieldsEqual(fieldPaths: string[], strict: boolean = false): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (fieldPaths?.length > 0) {
            const formValue = control.getRawValue();
            const valueToMatch = getPathProperty(formValue, fieldPaths[0]);
            for (let i = 1; i < fieldPaths.length; ++i) {
                const value = getPathProperty(formValue, fieldPaths[i]);
                const bothIsEmpty = isEmpty(valueToMatch) && isEmpty(value);
                if ((strict && valueToMatch !== value)
                    || (!strict && !bothIsEmpty && valueToMatch != value)
                ) {
                    return { fieldsEqual: true };
                }
            }
        }

        return null;
    }
}
