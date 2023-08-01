import { ChangeDetectionStrategy, Component, ContentChild, inject, Input, OnInit, Type, ViewChild } from "@angular/core";
import { BehaviorSubject, combineLatest, map, Observable, shareReplay, switchMap, take, tap } from "rxjs";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { TableHeader } from "../../../../../components/table/table/table-header";
import { BaseControlValueAccessor } from "../../../utility/base-control-value-acessor/base-control-value-acessor.directive";
import { ListComponent, ListHandlerCallbackData } from "../../../list/components/list/list.component";
import { FieldErrorComponent } from "../../../field-error/components/field-error/field-error.component";
import { BaseFormComponent } from "../../../utility/base-form-component/base-form-component.directive";
import { CheckboxFieldComponent } from "../../../checkbox-field/components/checkbox-field/checkbox-field.component";
import { WithNgAfterViewInitSubject } from "../../../../core/utility/mixins/with-ng-after-view-init-subject.mixin";
import { FormControl } from "@angular/forms";
import { ResourceService } from "../../../../core/resource/services/resource.service";
import { DynamicComponentModule } from "../../../../../components/dynamic-component/dynamic-component.module";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { PaginationConfig } from "../../../../../components/table/pagination/pagination.component";


@UntilDestroy()
@Component({
    selector: "app-selection-list-field",
    templateUrl: "./selection-list-field.component.html",
    styleUrls: ["./selection-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
// TODO fix: BaseControlValueAccessor<any[]> -> BaseControlValueAccessor<T[]>
    // Error: Base class expressions cannot reference class type parameters. ts(2562)
export class SelectionListFieldComponent<T extends Object> extends WithNgAfterViewInitSubject(BaseControlValueAccessor<any[]>) implements OnInit {

    protected resourceService = inject(ResourceService);

    forceSyncModelWithControl = false

    @Input() public baseResourceKey: string;
    @Input() public tableIdProperty: string;
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean = false;
    @Input() public allowPaging: boolean = false;

    @Input() public getTableData$: () => Observable<T[] | undefined>;
    @ViewChild(ListComponent) listComponent!: ListComponent<T>;
    protected refreshingTableData$ = this.ngAfterViewInit$.pipe(
        switchMap(() => this.listComponent.tableData$.pipe(
            map((rows) => rows ?? []),
        )),
        shareReplay(1),
    );
    @Input() public handleSave$?: (data: ListHandlerCallbackData<T, T>) => Observable<any>;
    @Input() public handleDelete$?: (data: ListHandlerCallbackData<T, T>) => Observable<any>;

    @Input() errorResourceKeyPrefix?: FieldErrorComponent["resourceKeyPrefix"];
    @Input() errorAddControlNameToResourceKeyPrefix?: FieldErrorComponent["addControlNameToResourceKeyPrefix"];
    @Input() errorShowErrorsMethod?: FieldErrorComponent["showErrorsMethod"];
    @Input() errorResourceOverrides?: FieldErrorComponent["resourceOverrides"];
    @Input() errorResourceOverridesMethod?: FieldErrorComponent["resourceOverridesMethod"];

    @ContentChild("editorForm") public editorForm: BaseFormComponent<T>;


    /**
     * Controls wether the FormControl value should keep the all the object properties or only the id property
     */
    @Input() public valueKeepOnlyIdProperty: boolean = true;
    @Input() public rowTransformerFn?: (row: T) => T;

    // Should not call this.changeValue for initial value, because it will mark the form touched and dirty!
    // So we keep track of the initial state for the refreshable table and writeValue
    protected isInitial = true;
    public initialData$ = new BehaviorSubject<T[]>([]);

    constructor() {
        super();
        // Default value
        this.value = [];
    }

    public ngOnInit() {
        super.ngOnInit();

        combineLatest([
            this.refreshingTableData$.pipe(
                tap(() => this.isInitial = true),
            ),
            this.selectedRowIds$,
        ]).pipe(
            untilDestroyed(this),
        ).subscribe(([rows, selectedRowIds]) => {
            const selectedRows = rows
                .filter(row => selectedRowIds.includes(row[this.tableIdProperty as keyof T]))
                .map((row) => {
                    if (this.rowTransformerFn != null) return this.rowTransformerFn(row);
                    if (!this.valueKeepOnlyIdProperty) return row;

                    return { [this.tableIdProperty]: row[this.tableIdProperty as keyof T] } as any;
                });

            if (this.isInitial) {
                (this.ngControl?.control as FormControl)?.markAsUntouched();
                (this.ngControl?.control as FormControl)?.markAsPristine();
                this.value = selectedRows;
                (this.ngControl?.control as FormControl)?.setValue(
                    this.readValue(this.value),
                    {emitEvent: false, emitModelToViewChange: false, emitViewToModelChange: false},
                );
            } else {
                this.changeValue(selectedRows);
            }

            this.isInitial = false;
        });
    }

    public selectedRowIds$ = new BehaviorSubject<any[]>([]);

    public writeValue(newSelectedRows: T[]) {
        if (!Array.isArray(newSelectedRows)) newSelectedRows = [];
        this.initialData$.next(newSelectedRows);
        const newSelectedIds = newSelectedRows.map(row => row[this.tableIdProperty as keyof T]);

        this.isInitial = true;
        this.selectedRowIds$.next(newSelectedIds);
        if (this.ngControl?.control != null) {
            (this.ngControl?.control as FormControl).setValue(
                this.readValue(this.value),
                {emitEvent: false, emitModelToViewChange: false, emitViewToModelChange: false},
            );
        }

        this.cdr.markForCheck();
    }

    protected toggleSelectRow(row: T) {
        const idToToggle = row[this.tableIdProperty as keyof T];
        if (this.selectedRowIds$.value.includes(idToToggle)) {
            this.selectedRowIds$.next(this.selectedRowIds$.value.filter((id) => id !== idToToggle));
        } else {
            this.selectedRowIds$.next([...this.selectedRowIds$.value, idToToggle]);
        }
    }

    protected toggleSelectAllRows() {
        this.refreshingTableData$.pipe(
            take(1),
            untilDestroyed(this),
        ).subscribe((rows) => {
            if (this.selectedRowIds$.value.length === rows.length) {
                this.selectedRowIds$.next([]);
            } else {
                this.selectedRowIds$.next(rows.map(row => row[this.tableIdProperty as keyof T]));
            }
        });
    }

    protected selectionColumn: TableHeader = {
        id: 0,
        cellComponent: CheckboxFieldComponent,
        initCellComponentBindingsFactoryFn: (value, row) => {
            return (comp: CheckboxFieldComponent) => {
                this.selectedRowIds$.pipe(
                    untilDestroyed(this),
                    untilDestroyed(comp),
                ).subscribe((selectedRowIds) => {
                    const oldValue = comp.value;
                    const newValue = selectedRowIds.includes(row[this.tableIdProperty as keyof T]);

                    if (oldValue !== newValue) comp.writeValue(newValue);
                });

                comp.registerOnChange(() => this.toggleSelectRow(row))
            }
        },
        headerClasses: ["w-20px"],
        headerComponent: LabelWrapperComponent,
        initHeaderComponentBindingsFn: (wrapperComp: LabelWrapperComponent) => {
            wrapperComp.label = this.resourceService.resolve("general.selection.list.headers.selection");

            wrapperComp.component = CheckboxFieldComponent;
            wrapperComp.initComponentBindingFn = (comp: CheckboxFieldComponent) => {
                combineLatest([
                    this.selectedRowIds$,
                    this.refreshingTableData$,
                ]).pipe(
                    untilDestroyed(this),
                    untilDestroyed(comp),
                ).subscribe(([selectedRowIds, rows]) => {
                    const oldValue = comp.value;
                    const newValue = selectedRowIds.length === rows.length;

                    if (oldValue !== newValue) comp.writeValue(newValue);
                });

                comp.registerOnChange(() => this.toggleSelectAllRows())
            };
        },
    };
    protected tableHeadersWithSelectionColumn: TableHeader[] = [ this.selectionColumn ];
    @Input() public set tableHeaders(headers: TableHeader[]) {
        this.tableHeadersWithSelectionColumn = [
            this.selectionColumn,
            ...headers,
        ]
    };

    @Input() public enableEditor: boolean = true;

    @Input() dragAndDropConfig?: {
        enabled: boolean,
        onDrop: (event: CdkDragDrop<T[]>) => any,
    };

    @Input() virtualScrollConfig?: {
        enabled?: boolean,
        maxHeightPx?: number,
    }
}

@Component({
    standalone: true,
    imports: [DynamicComponentModule],
    template: `
        <div class="mb-3">{{label}}</div>
        <ng-template
            appDynamicComponent
            [component]="component"
            [initComponentBindingFn]="initComponentBindingFn"
        ></ng-template>
    `,
})
class LabelWrapperComponent<T = any> {
    @Input() label: string = "";
    @Input() component: Type<T>;
    @Input() initComponentBindingFn?: (instance: T) => void;
}
