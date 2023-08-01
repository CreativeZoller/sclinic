import { Directive, inject, Input, OnInit, Type, ViewContainerRef } from "@angular/core";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject, combineLatest } from "rxjs";
import { DynamicComponentDirective } from "../../dynamic-component/directives/dynamic-component.directive";
import { TableHeader } from "./table-header";


type CellFactoryFnType<T> = TableHeader<any, T, T>["initCellComponentBindingsFactoryFn"]

// TODO move it to the app common module
@UntilDestroy()
@Directive({
    selector: '[appDynamicTableCellComponent]'
})
export class DynamicTableCellComponentDirective<T> extends DynamicComponentDirective<T> {

    constructor() {
        super();

        combineLatest([
            this.initComponentBindingFnFactory$,
            this.value$,
            this.row$,
            this.rowIndex$,
        ]).pipe(
            untilDestroyed(this),
        ).subscribe(([factoryFn, value, row, rowIndex]) => {
            if (factoryFn != null) this.initComponentBindingFn$.next(factoryFn(value, row, rowIndex));
        });
    }

    protected initComponentBindingFnFactory$ = new BehaviorSubject<CellFactoryFnType<T>>(undefined);
    @Input() set initComponentBindingFnFactory(initComponentBindingFnFactory: CellFactoryFnType<T> | undefined) {
        this.initComponentBindingFnFactory$.next(initComponentBindingFnFactory);
    }

    protected value$ = new BehaviorSubject<any>(undefined);
    @Input() set value(value: any) {
        this.value$.next(value);
    }

    protected row$ = new BehaviorSubject<any>(undefined);
    @Input() set row(row: any) {
        this.row$.next(row);
    }

    protected rowIndex$ = new BehaviorSubject<number | undefined>(undefined);
    @Input() set rowIndex(rowIndex: number | undefined) {
        this.rowIndex$.next(rowIndex);
    }
}
