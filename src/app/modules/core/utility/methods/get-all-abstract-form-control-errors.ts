import { AbstractControl, FormArray, FormGroup } from "@angular/forms";


export function getAllAbstractFormControlErrors(sourceCtrl: AbstractControl, ignoreArrayIndexes: boolean = true, deduplicate: boolean = true): Record<string, object> {
    const allErrors: {key: string, params: object}[] = [];

    if (sourceCtrl != null) {
        const sourceErrors = sourceCtrl.errors || {};
        Object.keys(sourceErrors).forEach((errorKey) => allErrors.push({
            key: errorKey,
            params: sourceErrors[errorKey],
        }));

        if (sourceCtrl instanceof FormArray || sourceCtrl instanceof FormGroup) {
            const childControls: Record<string, AbstractControl> = sourceCtrl.controls as unknown as any;

            if (childControls != null) {
                Object.keys(childControls).forEach((childCtrlKey) => {
                    const ctrl: AbstractControl = childControls[childCtrlKey];

                    const childCtrlErrors = getAllAbstractFormControlErrors(ctrl);
                    Object.keys(childCtrlErrors).forEach((errorKey) => allErrors.push({
                        key: `${childCtrlKey}.${errorKey}`,
                        params: childCtrlErrors[errorKey],
                    }))
                });
            }
        }
    }

    const allErrorsObj: Record<string, object> = {};
    allErrors
        // A FormArray indexek eltávolítása, mert nincs szükségünk ennyire specifikus hibákra.
        .map((entry) => ({
            key: !ignoreArrayIndexes
                ? entry.key
                : entry.key.split(".").filter(part => !(/^[0-9]*$/.test(part))).join("."),
            params: entry.params,
        }))
        // A duplikált hibák kiszűrése
        .filter((entry, i, arr) => !deduplicate || arr.map(e => e.key).indexOf(entry.key) === i)
        .forEach((entry) => {
            allErrorsObj[entry.key] = entry.params;
        });

    return allErrorsObj;
}
