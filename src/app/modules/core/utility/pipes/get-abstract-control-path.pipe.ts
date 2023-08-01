import { Pipe, PipeTransform } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { getAbstractFormControlPath } from "../methods/get-abstract-form-control-path";


@Pipe({
    name: "getAbstractControlPath",
    pure: true
})
export class GetAbstractControlPathPipe implements PipeTransform {

    transform(ctrl: AbstractControl, ignoreArrayIndexes: boolean = true): string {
        return getAbstractFormControlPath(ctrl, ignoreArrayIndexes);
    }
}
