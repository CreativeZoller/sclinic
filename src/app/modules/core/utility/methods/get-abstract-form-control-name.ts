import { AbstractControl } from "@angular/forms";


export function getAbstractFormControlName(ctrl: AbstractControl): string {
    let name = "";
    if (ctrl?.parent?.controls != null) {
        const parentControls: Record<string, AbstractControl> = ctrl.parent.controls as unknown as any;
        name = Object.keys(parentControls).find((key) => parentControls[key] === ctrl) ?? "";
    }

    return name;
}
