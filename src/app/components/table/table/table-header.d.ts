export type TableHeader<T = any, CellComponent = any, HeaderComponent = any, HeaderSearchComponent = any> = {
    // TODO remove id property
    id?: number,
    name?: string,
    attributeName?: string,
    formatterFn?: (value: any, row?: any, index?: number) => any,
    cellClasses?: string[],
    cellComponent?: CellComponent,
    initCellComponentBindingsFactoryFn?: (value: any, row?: any, index?: number) => (instance: CellComponent) => void,
    headerClasses?: string[],
    headerComponent?: HeaderComponent,
    initHeaderComponentBindingsFn?: (instance: HeaderComponent) => void,
    headerSearchComponent?: HeaderSearchComponent,
    initHeaderSearchComponentBindingsFn?: (instance: HeaderSearchComponent) => void,
};
