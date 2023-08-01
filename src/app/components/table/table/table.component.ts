import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject, Observable, of, shareReplay, Subject, switchMap, take } from 'rxjs';
import { PaginationConfig } from 'src/app/components/table/pagination/pagination.component';
import { TableHeader } from './table-header';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { TableBulkAction } from "./table-bulk-action";


@UntilDestroy()
@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent<T extends {}> implements OnInit {
    selectedRowIds: any[] = [];
    selectedRows: T[] = [];

    @Input() singleSelecting: boolean = true;
    @Input() enableBulkActions: boolean = true;
    @Input() bulkActionsLabel?: string;
    @Input() bulkActions: TableBulkAction[] = [];
    get hasAnyVisibleBulkAction(): boolean {
        return this.bulkActions.some(ba => !ba.isHidden?.({
            selectedRowIds: this.selectedRowIds,
            selectedRows: this.selectedRows,
        }));
    }
    bulkActionOpened: boolean = false;

    @Input() titleRowTemplate: TemplateRef<any>;
    @Input() titleRowButtonsTemplate: TemplateRef<any>;

    private _data$$ = new BehaviorSubject<Observable<T[] | (T & { _classes?: string[] })[] | undefined> | undefined>(undefined);
    @Input() set data$(data$: Observable<T[] | undefined>) {
        this._data$$.next(data$)
    }

    private unwrappedData$ = this._data$$.pipe(
        switchMap(data$ => data$ != null
            ? data$.pipe(shareReplay(1))
            : of(undefined)
        ),
        shareReplay(1),
    );

    rows$ = new BehaviorSubject<T[] | (T & { _classes?: string[] })[] | undefined>(undefined);

    @Input() idProperty: keyof T = "id" as any;
    @Input() tableHeaders: TableHeader<T>[];

    @Input() title: string;
    @Input() showTitleHeader: boolean = true;

    @Input() showLoading: boolean = false;
    @Input() allowPaging: boolean = true;

    @Output() rowClick = new EventEmitter<T>();
    @Output() rowChecked = new EventEmitter<T>();

    @ViewChild(MatMenuTrigger, { static: false, read: ElementRef })
    userMenu: ElementRef<HTMLElement>;

    private pipeObservableIntoSubject<T>(o$: Observable<T>, s$: Subject<T> | BehaviorSubject<T>) {
        o$.pipe(untilDestroyed(this)).subscribe(s$);
    }

    ngOnInit() {
        this.pipeObservableIntoSubject(this.unwrappedData$, this.rows$);

        this.rows$.pipe(
            untilDestroyed(this),
        ).subscribe((allRows) => {
            if (allRows == null) return;

            this.selectedRows = allRows.filter(row => this.selectedRowIds.includes(row?.[this.idProperty]));
            this.selectedRowIds = this.selectedRows.map(row => row?.[this.idProperty]);
        });
    }

    manualUpdateRows(updateFn: (rows: T[] | undefined) => T[] | undefined) {
        this.rows$.next(updateFn(this.rows$.value));
    }

    selectAllRow() {
        this.rows$.pipe(
            take(1),
            untilDestroyed(this),
        ).subscribe((allRows) => {
            allRows = allRows ?? [];
            const allRowIds = allRows?.map(row => row?.[this.idProperty]) ?? [];

            if (this.selectedRowIds.length !== allRowIds.length){
                this.selectedRowIds = [...allRowIds];
                this.selectedRows = [...allRows];
            } else {
                this.selectedRowIds = [];
                this.selectedRows = [];
            }
        });
    }

    selectRow(event: Event, row: T) {
        const checkbox = event.target as HTMLInputElement;

        if (this.singleSelecting) {
            if(checkbox.checked) {
                this.selectedRowIds.push(row[this.idProperty]);
                this.selectedRows.push(row);
                this.disableRowClick(true);
            } else {
                this.selectedRowIds = [];
                this.selectedRows = [];
                this.disableRowClick(false);
            }
        } else {
            if(checkbox.checked) {
                this.selectedRowIds.push(row[this.idProperty]);
                this.selectedRows.push(row);
            } else {
                const indexToRemove = this.selectedRowIds.indexOf(row[this.idProperty]);
                this.selectedRowIds.splice(indexToRemove, 1);
                this.selectedRows.splice(indexToRemove, 1);
            }
        }
    }

    disableRowClick(disableCheckboxes: boolean): void {
        const allCheckbox = document.querySelectorAll('.w-20px > .form-check-custom > .form-check-input:not(:checked):not(#form-checkbox)');
        if (disableCheckboxes) {
            allCheckbox.forEach((box: any) =>  box.disabled = true);
        } else {
            allCheckbox.forEach((box: any) =>  box.disabled = false);
        }
    }

    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

    menuOpened() {
        if(this.trigger.menuOpened) {
            this.bulkActionOpened = true;
        }
    }

    menuClosed(event: any) {
        if (!event) {
            this.bulkActionOpened = false;
        }
    }

    get userMenuData() {
        return {
            menuWidth: this.userMenu?.nativeElement?.clientWidth
        };
    }

    @Input() dragAndDropConfig?: {
        enabled: boolean,
        onDrop: (event: CdkDragDrop<T[]>) => any,
    };

    protected get isDragAndDropEnabled() {
        return this.dragAndDropConfig?.enabled ?? false
    }

    protected handleDropForDragAndDrop(event: CdkDragDrop<T[]>) {
        this.dragAndDropConfig?.onDrop?.(event);
    }

    @Input() virtualScrollConfig?: {
        enabled?: boolean,
        maxHeightPx?: number,
    }

    public totalRecordCount$ = new BehaviorSubject<number>(10);

    @Input() set totalRecordCount(value: number) {
        this.totalRecordCount$.next(value);
    }

    @Output() public pageConfigChanged = new EventEmitter<PaginationConfig>();

    onPageConfigurationChanged(pConfig: PaginationConfig): void {
        this.pageConfigChanged.emit(pConfig);
    }

}
