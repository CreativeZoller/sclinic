export function flattenObject<T extends Record<string, any>>(object: T): Record<string, any> {
    const resultObject: Record<string, any> = {};

    for (const key in object) {
        if (!object.hasOwnProperty(key)) continue;

        if (object[key] != null) {
            if ((typeof object[key]) === "object" || Array.isArray(object[key])) {
                const childResultObj = flattenObject(object[key]);
                for (const childKey in childResultObj) {
                    if (!childResultObj.hasOwnProperty(childKey)) continue;

                    resultObject[`${key}.${childKey}`] = childResultObj[childKey];
                }
            } else {
                resultObject[key] = object[key];
            }
        }
    }

    return resultObject;
}
