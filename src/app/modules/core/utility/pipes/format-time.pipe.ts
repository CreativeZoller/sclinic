
import { Pipe, PipeTransform } from "@angular/core";
import { formatTime } from "../methods/format-time-fn";


@Pipe({
    name: "formatTime",
    pure: true
})
export class FormatTimePipe implements PipeTransform {

    transform(value: string | Date): string {
        return formatTime(value);
    }
}
