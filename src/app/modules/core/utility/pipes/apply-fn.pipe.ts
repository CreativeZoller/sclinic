import { Pipe, PipeTransform } from "@angular/core";
import { applyFn } from "../methods/apply-fn";


@Pipe({
    name: "applyFnPure",
    pure: true,
})
export class ApplyFnPurePipe implements PipeTransform {

    transform<ARGS extends [], RESULT>(
        fn?: (...args: ARGS) => RESULT,
        ...args: ARGS
    ): RESULT | undefined {
        return applyFn(fn, ...args);
    }
}


@Pipe({
    name: "applyFnImpure",
    pure: false,
})
export class ApplyFnImpurePipe implements PipeTransform {

    transform<ARGS extends [], RESULT>(
        fn?: (...args: ARGS) => RESULT,
        ...args: ARGS
    ): RESULT | undefined {
        return applyFn(fn, ...args);
    }
}
