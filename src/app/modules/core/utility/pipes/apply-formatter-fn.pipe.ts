import { Pipe, PipeTransform } from "@angular/core";
import { applyFormatterFn } from "../methods/apply-formatter-fn";


@Pipe({
    name: "applyFormatterFnPure",
    pure: true,
})
export class ApplyFormatterFnPurePipe implements PipeTransform {

    transform<Value = any, Result = any, Row = any>(
        value: Value,
        formatterFn?: (value: Value, row?: Row, index?: number) => Result,
        row?: Row,
        index?: number,
    ): Value | Result {
        return applyFormatterFn(value, formatterFn, row, index);
    }
}


@Pipe({
    name: "applyFormatterFnImpure",
    pure: false,
})
export class ApplyFormatterFnImpurePipe implements PipeTransform {

    transform<Value = any, Result = any, Row = any>(
        value: Value,
        formatterFn?: (value: Value, row?: Row, index?: number) => Result,
        row?: Row,
        index?: number,
    ): Value | Result {
        return applyFormatterFn(value, formatterFn, row, index);
    }
}
