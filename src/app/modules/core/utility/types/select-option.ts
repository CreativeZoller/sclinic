export type SelectOption<T = any> = T extends (string | number) ? PrimitiveSelectOption<T> : ComplexSelectOption<T>;

export type PrimitiveSelectOption<T extends (string | number)> = {
    value: T,
    name: string,
};

export type ComplexSelectOption<T = any> = {
    value: T,
    name: string,
    /**
     * If T is not pimitive we need an ID property to help comparing values with different references but same id
     */
    idProperty: keyof T,
}

export function isComplexSelectOption<T>(v: PrimitiveSelectOption<string | number> | ComplexSelectOption<T>): v is ComplexSelectOption<T> {
    return (v as ComplexSelectOption<T>)?.idProperty !== undefined;
}
