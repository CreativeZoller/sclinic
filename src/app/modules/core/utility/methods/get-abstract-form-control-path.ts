import { AbstractControl } from "@angular/forms";
import { getAbstractFormControlName } from "./get-abstract-form-control-name";


export function getAbstractFormControlPath(ctrl: AbstractControl, ignoreArrayIndexes: boolean = true): string {
    if (ctrl?.parent == null) return "";

    const name = getAbstractFormControlName(ctrl);
    const parentPath = getAbstractFormControlPath(ctrl.parent, ignoreArrayIndexes);

    const path = (parentPath === "") ? name : `${parentPath}.${name}`

    return !ignoreArrayIndexes
        ? path
        // A FormArray indexek eltávolítása, mert nincs szükségünk ennyire specifikus hibákra.
        : path.split(".").filter(p => !(/^[0-9]*$/.test(p))).join(".");
}
