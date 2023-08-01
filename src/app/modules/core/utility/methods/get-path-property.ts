import { FlattenObject } from "../types/flatten-object";


/**
 * Gets the value from the object at the specified path
 *
 * @param object the object containing the needed value
 * @param path the path to the needed value in the format of `prop1.prop2.prop3`
 * @returns the
 */
export function getPathProperty<
    T extends object,
    K extends keyof FlattenObject<T>,
>(object: T, path: K): FlattenObject<T>[K] {
    let value: any = object;

    const keys = (path as string ?? "")
        .split(".")
        .filter(v => v != null && v !== "");

    for (const key of keys) {
        value = value?.[key];
    }

    return value;
}
