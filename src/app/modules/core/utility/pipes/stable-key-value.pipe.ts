import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
    name: "stableKeyValue",
    pure: false
})
export class StableKeyValuePipe implements PipeTransform {

    transform<T = any>(object: Record<string, T>): { key: string, value: T }[] {
        if (object == null) return [];

        return Object.entries(object).map((entry) => ({
            key: entry[0],
            value: entry[1],
        }));
    }
}
