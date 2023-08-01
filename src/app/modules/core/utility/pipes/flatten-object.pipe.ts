import { Pipe, PipeTransform } from "@angular/core";
import { flattenObject } from "../methods/flatten-object";


@Pipe({
    name: "flattenObject",
    pure: true
})
export class FlattenObjectPipe implements PipeTransform {

    transform<T extends Record<string, any>>(object: T): Record<string, any> {
        return flattenObject(object);
    }
}
