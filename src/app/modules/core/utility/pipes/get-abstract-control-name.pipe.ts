import { Pipe, PipeTransform } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { getAbstractFormControlName } from "../methods/get-abstract-form-control-name";


@Pipe({
    name: "getAbstractControlName",
    pure: true
})
export class GetAbstractControlNamePipe implements PipeTransform {

    transform(ctrl: AbstractControl): string {
        return getAbstractFormControlName(ctrl);
    }
}
