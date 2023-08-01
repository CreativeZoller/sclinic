export function removeNullProperties<T extends Record<string, unknown>>(obj: T): T {
    obj = {...obj};
    for (const key of Object.keys(obj)) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key] == null) delete obj[key];
        }
    }

    return obj
}
