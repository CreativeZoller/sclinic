import { Pipe, PipeTransform } from "@angular/core";
import { getPathProperty } from "../methods/get-path-property";
import { FlattenObject } from "../types/flatten-object";


@Pipe({
    name: "getPathProperty",
    pure: true
})
export class GetPathPropertyPipe implements PipeTransform {

    /**
     * Gets the value from the object at the specified path
     *
     * @param object the object containing the needed value
     * @param path the path to the needed value in the format of `prop1.prop2.prop3`
     * @returns the
     */
    transform<
        T extends object,
        K extends keyof FlattenObject<T>,
    >(object: T, path: K): FlattenObject<T>[K] {
        return getPathProperty(object, path);
    }
}
