export function stringJoin(arr: Array<string | null | undefined>, delimeter: string): string {
    return arr.filter(item => item != null && item !== "").join(delimeter);
}
