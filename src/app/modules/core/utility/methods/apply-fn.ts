export function applyFn<ARGS extends [], RESULT>(
    fn?: (...args: ARGS) => RESULT,
    ...args: ARGS
): RESULT | undefined {
    if (fn == null) return undefined;

    return fn(...args);
}
