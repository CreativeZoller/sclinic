import { Pipe, PipeTransform } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { getAllAbstractFormControlErrors } from "../methods/get-all-abstract-form-control-errors";


@Pipe({
    name: "getAllAbstractFormControlErrors",
    pure: false
})
export class GetAllAbstractFormControlErrorsPipe implements PipeTransform {

    transform(sourceCtrl: AbstractControl, ignoreArrayIndexes: boolean = true, deduplicate: boolean = true): Record<string, object> {
        return getAllAbstractFormControlErrors(sourceCtrl, ignoreArrayIndexes, deduplicate);
    }
}
