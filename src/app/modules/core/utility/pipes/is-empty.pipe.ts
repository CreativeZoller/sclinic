import { Pipe, PipeTransform } from "@angular/core";
import { isEmpty } from "../methods/is-empty";


@Pipe({
    name: "isEmpty",
    pure: true
})
export class IsEmptyPipe implements PipeTransform {

    transform(value: any): boolean {
        return isEmpty(value);
    }
}
