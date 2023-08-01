import { AbstractControl, FormArray, FormGroup } from "@angular/forms";


export function formUpdateValueAndValidityRecursively(
    ctrl: AbstractControl,
    options?: {
        emitEvent: boolean,
        onlySelf: boolean,
        updateDirection: "CHILD_FIRST" | "PARENT_FIRST"
    },
) {
    const updateDirection = options?.updateDirection ?? "CHILD_FIRST";

    const childControls: AbstractControl[] = [];
    if (ctrl instanceof FormGroup) childControls.push(...Object.values(ctrl.controls));
    if (ctrl instanceof FormArray) childControls.push(...ctrl.controls);

    if (updateDirection === "PARENT_FIRST") {
        ctrl.updateValueAndValidity({ onlySelf: options?.onlySelf ?? true, emitEvent: options?.emitEvent ?? true });
    }

    for(const childCtrl of childControls) {
        formUpdateValueAndValidityRecursively(childCtrl, options);
    }

    if (updateDirection === "CHILD_FIRST") {
        ctrl.updateValueAndValidity({ onlySelf: options?.onlySelf ?? true, emitEvent: options?.emitEvent ?? true });
    }
}
