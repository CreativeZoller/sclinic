import { Pipe, PipeTransform } from "@angular/core";
import { stringJoin } from "../methods/string-join";


@Pipe({
    name: "stringJoin",
    pure: true
})
export class StringJoinPipe implements PipeTransform {

    transform(arr: Array<string | null | undefined>, delimeter: string): string {
        return stringJoin(arr, delimeter);
    }
}
