export type TableBulkAction<T = any, ID = any> = {
    label: string;
    onClick?: (args: {selectedRowIds: ID[], selectedRows: T[]}) => any;
    isHidden?: (args: {selectedRowIds: ID[], selectedRows: T[]}) => boolean;
    isDisabled?: (args: {selectedRowIds: ID[], selectedRows: T[]}) => boolean;
};
