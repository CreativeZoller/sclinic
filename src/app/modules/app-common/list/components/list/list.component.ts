import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, EventEmitter, inject, Input, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";
import { BehaviorSubject, combineLatest, filter, finalize, map, Observable, of, shareReplay, startWith, switchMap, tap } from "rxjs";
import { ModalComponent, ModalConfig } from "../../../../../_metronic/partials";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../utility/base-form-component/base-form-component.directive";
import { ConfirmDialogService } from "../../../confirm-dialog/services/confirm-dialog.service";
import { ResourceService } from "../../../../core/resource/services/resource.service";
import { TableHeader } from "../../../../../components/table/table/table-header";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { PaginationConfig } from "../../../../../components/table/pagination/pagination.component";
import { TableBulkAction } from "../../../../../components/table/table/table-bulk-action";
import { TableComponent } from "../../../../../components/table/table/table.component";


export type ListHandlerCallbackData<Grid_Model, Full_Model> = {
    gridRowData?: Grid_Model,
    rowData?: Full_Model,
    formValue: Partial<Full_Model>,
    modal: ModalComponent,
};

@UntilDestroy()
@Component({
    selector: "app-list",
    templateUrl: "./list.component.html",
    styleUrls: ["./list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent<Grid_Model, Full_Model = Grid_Model> implements OnInit, AfterContentInit {

    private confirmDialogService = inject(ConfirmDialogService);
    private resourceService = inject(ResourceService);
    private cdr = inject(ChangeDetectorRef);

    @Output() rowChecked = new EventEmitter();
    @Input() public baseResourceKey: string;
    @Input() public tableTitle: string;
    @Input() public tableHeaders: TableHeader[];
    @Input() public tableIdProperty: string;
    @Input() public getTableData$: (pageConfig: PaginationConfig) => Observable<Grid_Model[] | undefined>;
    @Input() public enableEditor: boolean = true;
    @Input() public singleSelecting: boolean = false;
    @Input() public openRowEditorOverride: boolean = false;
    @Input() public allowPaging: boolean = true;


    @Input() public convertFormValueToRequestValueBeforeHandlers: boolean = true;

    private refreshTableData$ = new BehaviorSubject<void>(undefined);
    public pageConfig$ = new BehaviorSubject<PaginationConfig>(new PaginationConfig(1, 10));

    protected expandedRows$ = new BehaviorSubject<Grid_Model[]>([]);

    public tableData$: Observable<Grid_Model[] | undefined> = combineLatest([
        this.refreshTableData$.pipe(startWith(null)),
        this.pageConfig$
    ]).pipe(
        switchMap(([_, pageConfig]) => this.getTableData$(pageConfig)),
        tap(() => this.expandedRows$.next([])),
        shareReplay(1),
    );

    public expandedTableData$ = combineLatest([
        this.tableData$,
        this.expandedRows$,
    ]).pipe(
        map(([tableData, expandedRows]) => {
            if (tableData != null) {
                type Grid_Model_WithClasses = Grid_Model & { _classes?: string[] };
                const rows: Grid_Model_WithClasses[] = [ ...(tableData ?? []) ] as Grid_Model_WithClasses[];
                for (let i = 0; i < rows.length; ++i) {
                    const row = rows[i];

                    if (this.getRowClasses != null) {
                        row._classes = this.getRowClasses(row, expandedRows);
                    }

                    if (this.getExpandedRowChildRows != null) {
                        if (expandedRows.includes(row)) {
                            rows.splice(i+1, 0, ...this.getExpandedRowChildRows(row) as Grid_Model_WithClasses[]);
                        }
                    }
                }

                return rows;
            } else {
                return tableData;
            }
        }),
        shareReplay(1),
    )

    public toggleExpandRow(row: Grid_Model) {
        if (this.getExpandedRowChildRows != null) {
            if (this.expandedRows$.value.includes(row)) {
                this.expandedRows$.next(this.expandedRows$.value.filter(r => r !== row));
            } else {
                this.expandedRows$.next([...this.expandedRows$.value, row]);
            }
        }
    }

    public refreshTableData() {
        this.refreshTableData$.next();
    }

    @Input() getExpandedRowChildRows: (row: Grid_Model) => Grid_Model[];
    @Input() getRowClasses: (row: Grid_Model, expandedRows: Grid_Model[]) => string[];

    @ViewChild(TableComponent) private tableComponent: TableComponent<any>;
    manualUpdateTableRows(updateFn: (rows: Grid_Model[] | undefined) => Grid_Model[] | undefined) {
        this.tableComponent?.manualUpdateRows(updateFn);
    }

    public editorModalConfig$ = new BehaviorSubject<ModalConfig | undefined>(undefined);
    private editorData$ = new BehaviorSubject<Full_Model | undefined>(undefined);

    @ViewChild("editorModal") private editorModal: ModalComponent;
    public editorForm: BaseFormComponent<Full_Model>;
    @ContentChild("editorForm") set editorFormByContent(editorForm: BaseFormComponent<Full_Model>) {
        if (this.editorForm == null) this.editorForm = editorForm;
    }
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input("editorForm") set editorFormByInput(editorForm: BaseFormComponent<Full_Model>) {
        if (this.editorForm == null) this.editorForm = editorForm;
    }
    @Input() titleRowTemplate: TemplateRef<any>;
    @Input() titleRowCreateButtonTemplate: TemplateRef<any>;;
    @Input() extraTitleRowPreButtonsTemplate: TemplateRef<any>;
    @Input() extraTitleRowPostButtonsTemplate: TemplateRef<any>;

    @Input() showLoading: boolean = false;

    @Input() bulkActionsLabel?: string;
    @Input() bulkActions: TableBulkAction[] = [];

    public ngOnInit() {
        if (this.tableTitle == null) {
            if (this.baseResourceKey == null) throw new Error("Missing input \"resourceKey\"!");

            this.tableTitle = this.resourceService.resolve(`${this.baseResourceKey}.list.table.title`);
        }
    }

    public ngAfterContentInit() {
        this.editorData$.pipe(
            untilDestroyed(this),
        ).subscribe((editorData) => {
            if (this.editorForm != null) {
                this.editorForm.editorData = editorData;
                this.editorForm.updateView();
                this.cdr.markForCheck();
            }
        })
    }

    private disabledEditorButtons() {
        this.editorModalConfig$.next(
            this.editorModalConfig$.value == null
                ? undefined
                : {
                    ...this.editorModalConfig$.value,
                    disableSaveButton: true,
                    disableDeleteButton: true,
                    disableDismissButton: true,
                }
        );
    }

    private enableEditorButtons() {
        this.editorModalConfig$.next(
            this.editorModalConfig$.value == null
                ? undefined
                : {
                    ...this.editorModalConfig$.value,
                    disableSaveButton: false,
                    disableDeleteButton: false,
                    disableDismissButton: false,
                }
        );
    }

    @Input() public skipDisablingButtonsDuringHandlers: boolean = false;
    @Input() public skipScrollToFirstInvalid: boolean = false;
    @Input() public canCreate: boolean = true;
    @Input() public canUpdate: boolean = true;
    @Input() public canDelete: boolean = true;
    @Input() public canRead: boolean = false;
    @Input() public handleSave$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any>;
    @Input() public skipConfirmDeletion: boolean = false;
    @Input() public handleDelete$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any>;

    @Input() public getFullModelFromGridModel$: (gridRowData: Grid_Model) => Observable<Full_Model> = (gridRowData) => {
        return of(gridRowData as unknown as Full_Model);
    }

    private defaultGetEditorModalTitle: (gridRowData?: Grid_Model) => string = (gridRowData) => {
        if (this.baseResourceKey == null) throw new Error("Missing input \"resourceKey\"!");

        return this.resourceService.resolve(
            `${this.baseResourceKey}.editor.title.${(gridRowData ? (this.handleDelete$ == null ? "edit" : "editOrDelete") : "create")}`,
        );
    }
    public _getEditorModalTitle = this.defaultGetEditorModalTitle;
    @Input() public set getEditorModalTitle(fn: (gridRowData?: Grid_Model) => string) {
        this._getEditorModalTitle = (fn != null) ? fn : this.defaultGetEditorModalTitle;
    }
    public get getEditorModalTitle() {
        return this._getEditorModalTitle;
    }

    public openDetails(gridRowData?: Grid_Model) {
        if (this.singleSelecting === true) this.rowChecked.emit(gridRowData);
    }

    @Output() rowClick = new EventEmitter<Grid_Model>();

    public openEditorFor(gridRowData?: Grid_Model) {
        if (!this.enableEditor) return;
        if (gridRowData == null && (this.handleSave$ == null || !this.canCreate)) return;
        if (gridRowData != null && (this.handleSave$ == null || !this.canUpdate) && (this.handleDelete$ == null || !this.canDelete) && !this.canRead) return;

        if (this.editorForm == null) throw new Error("No editor form found!");

        const rowData$: Observable<Full_Model | undefined> = (gridRowData == null)
            ? of(undefined)
            : this.getFullModelFromGridModel$(gridRowData);

        this.editorModalConfig$.next({
            modalTitle: this.getEditorModalTitle(gridRowData),
            hideDeleteButton: this.handleDelete$ == null || gridRowData == null || !this.canDelete,
            hideSaveButton: this.handleSave$ == null || (
                (gridRowData == null && !this.canCreate)
                || (gridRowData != null && !this.canUpdate)
            ),
            loading: true,
        })

        const extraButtonsConfigSubscription = this.editorForm.getExtraButtonsConfig$(this.editorModal).subscribe((extraButtonsConfigs) => {
            this.editorModalConfig$.next({
                ...this.editorModalConfig$.value,
                extraButtonsConfigs: extraButtonsConfigs,
            })
        })

        rowData$.pipe(
            untilDestroyed(this),
            finalize(() => {
                this.editorModalConfig$.next({
                    ...this.editorModalConfig$.value,
                    loading: false,
                })
            }),
        ).subscribe((rowData?: Full_Model) => {
            this.editorForm.form.reset();
            this.editorData$.next(rowData == null ? undefined : {...rowData});
            this.editorModalConfig$.next({
                ...this.editorModalConfig$.value,
                onSave: (modal) => {
                    this.editorForm.form.markAllAsTouched();
                    this.editorForm.form.updateValueAndValidity()
                    if (this.editorForm.form.valid) {
                        if (!this.skipDisablingButtonsDuringHandlers) {
                            this.disabledEditorButtons();
                        }
                        const handleSave$ = this.handleSave$ ?? (() => of());

                        let formValue = this.editorForm.getFormValue(true);
                        if (this.convertFormValueToRequestValueBeforeHandlers) formValue = this.editorForm.formValueToRequestValue(formValue);

                        handleSave$({gridRowData, rowData, modal, formValue }).pipe(
                            finalize(() => {
                                if (!this.skipDisablingButtonsDuringHandlers) {
                                    this.enableEditorButtons();
                                }
                            }),
                        ).subscribe({
                            // Success, close modal
                            next: () => {
                                modal.close();
                                extraButtonsConfigSubscription.unsubscribe();
                                this.refreshTableData$.next();
                            },
                        })
                    } else {
                        if (this.skipScrollToFirstInvalid === false) {
                            const firstInvalidElement = this.editorForm.getElementRef().nativeElement?.querySelector?.(".ng-invalid") as HTMLElement;
                            if (firstInvalidElement) firstInvalidElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
                        }
                    }

                    this.editorForm.updateView();
                },
                onDelete: (modal) => {
                    const confirmed$ = this.skipConfirmDeletion
                        ? of(true)
                        : this.confirmDialogService.confirm();

                    confirmed$.pipe(
                        filter((confirmed) => confirmed),// Csak ha megerősítette
                    ).subscribe(() => {
                        if (!this.skipDisablingButtonsDuringHandlers) {
                            this.disabledEditorButtons();
                        }
                        const handleDelete$ = this.handleDelete$ ?? (() => of());

                        let formValue = this.editorForm.getFormValue(true);
                        if (this.convertFormValueToRequestValueBeforeHandlers) formValue = this.editorForm.formValueToRequestValue(formValue);

                        handleDelete$({gridRowData, rowData, modal, formValue }).pipe(
                            finalize(() => {
                                if (!this.skipDisablingButtonsDuringHandlers) {
                                    this.enableEditorButtons();
                                }
                            }),
                        ).subscribe({
                            // Success, close modal
                            next: () => {
                                modal.close();
                                extraButtonsConfigSubscription.unsubscribe();
                                this.refreshTableData$.next();
                            },
                        })

                        this.editorForm.updateView();
                    });
                },
            });
        });

        this.editorModal.open();
    }

    @Input() dragAndDropConfig?: {
        enabled: boolean,
        onDrop: (event: CdkDragDrop<Grid_Model[]>) => any,
    };

    @Input() virtualScrollConfig?: {
        enabled?: boolean,
        maxHeightPx?: number,
    }

    public totalRecordCount$ = new BehaviorSubject<number>(10);

    @Input() set totalRecordCount(value: number) {
        this.totalRecordCount$.next(value);
    }

    onPageConfigurationChanged(config: PaginationConfig) {
        this.pageConfig$.next(config);
    }
}
