export function applyFormatterFn<Value = any, Result = any, Row = any>(
    value: Value,
    formatterFn?: (value: Value, row?: Row, index?: number) => Result,
    row?: Row,
    index?: number,
): Value | Result {
    if (formatterFn == null) return value;

    return formatterFn(value, row, index);
}
