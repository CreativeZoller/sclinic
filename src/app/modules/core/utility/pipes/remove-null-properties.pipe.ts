import { Pipe, PipeTransform } from "@angular/core";
import { removeNullProperties } from "../methods/remove-null-properties";


@Pipe({
    name: "removeNullProperties",
    pure: true
})
export class RemoveNullPropertiesPipe implements PipeTransform {

    transform<T extends Record<string, unknown>>(obj: T): T {
        return removeNullProperties(obj);
    }
}
