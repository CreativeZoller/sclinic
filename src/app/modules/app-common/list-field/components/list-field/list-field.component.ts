import { ChangeDetectionStrategy, Component, ContentChild, Input, ViewChild } from "@angular/core";
import { map, Observable, of } from "rxjs";
import { UntilDestroy } from "@ngneat/until-destroy";
import { TableHeader } from "../../../../../components/table/table/table-header";
import { BaseControlValueAccessor } from "../../../utility/base-control-value-acessor/base-control-value-acessor.directive";
import { ListComponent, ListHandlerCallbackData } from "../../../list/components/list/list.component";
import { FieldErrorComponent } from "../../../field-error/components/field-error/field-error.component";
import { BaseFormComponent } from "../../../utility/base-form-component/base-form-component.directive";
import { FormControl } from "@angular/forms";
import { CdkDragDrop } from "@angular/cdk/drag-drop";


@UntilDestroy()
@Component({
    selector: "app-list-field",
    templateUrl: "./list-field.component.html",
    styleUrls: ["./list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListFieldComponent<OuterModel = any, InnerModel = OuterModel> extends BaseControlValueAccessor<OuterModel[], InnerModel[]> {

    @Input() public canCreate: boolean = true;
    @Input() public canUpdate: boolean = true;
    @Input() public canDelete: boolean = true;

    @Input() public baseResourceKey: string;
    @Input() public tableIdProperty: string;
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean = false;

    @Input() public tableHeaders: TableHeader[] = [];

    forceSyncModelWithControl = false

    constructor() {
        super();
        // Default value
        this.value = [];
    }

    public getTableData$: () => Observable<InnerModel[]> = () => {
        return this.getValue$().pipe(
            map(v => v == null ? [] : v),
            map((v) => v.map((vv, i) => ({_index: i, ...vv}))),
        )
    }

    @Input() public getFullModelFromGridModel$ = (gridRowData: InnerModel): Observable<any> => of(gridRowData);

    @Input() public handleSave$?: (data: ListHandlerCallbackData<InnerModel, InnerModel>) => Observable<any> = ({rowData, formValue}) => {
        const value = this.value ?? [];

        const indexToUpdate = (rowData as any)?._index as number | undefined;
        if (indexToUpdate != null) {
            this.changeValue(
                value.map((v, i) => {
                    return i !== (rowData as any)?._index
                        ? v
                        : formValue as InnerModel;
                })
            );
        } else {
            this.changeValue([
                ...value,
                formValue as InnerModel,
            ]);
        }

        return of(null);
    }

    @Input() public handleDelete$?: (data: ListHandlerCallbackData<InnerModel, InnerModel>) => Observable<any> = ({rowData}) => {
        const value = this.value ?? [];

        this.changeValue(
            value.filter((_, i) => i !== (rowData as any)?._index)
        );

        return of(null);
    }

    @Input() errorResourceKeyPrefix?: FieldErrorComponent["resourceKeyPrefix"];
    @Input() errorAddControlNameToResourceKeyPrefix?: FieldErrorComponent["addControlNameToResourceKeyPrefix"];
    @Input() errorShowErrorsMethod?: FieldErrorComponent["showErrorsMethod"];
    @Input() errorResourceOverrides?: FieldErrorComponent["resourceOverrides"];
    @Input() errorResourceOverridesMethod?: FieldErrorComponent["resourceOverridesMethod"];

    @Input() valueToFormValue: (value: OuterModel[]) => InnerModel[] = (value: OuterModel[]) => {
        if (!Array.isArray(value)) return [];
        if (this.editorForm == null) return value as unknown as InnerModel[];

        return value.map((v) => {
            this.editorForm.setFormValue(v as any);
            return this.editorForm.getFormValue(true);
        })
    };

    readValue(value: InnerModel[]): OuterModel[] {
        if (!Array.isArray(value)) return [];
        return value.map((v) => (this.editorForm?.formValueToRequestValue(v) ?? v) as unknown as OuterModel);
    }

    writeValue(value: OuterModel[]) {
        if (!Array.isArray(value)) value = [];
        this.value = this.valueToFormValue(value);
        if (this.ngControl?.control != null) {
            (this.ngControl?.control as FormControl).setValue(
                this.readValue(this.value),
                {emitEvent: false, emitModelToViewChange: false, emitViewToModelChange: false},
            );
        }
        this.cdr.markForCheck();
    }

    @ContentChild("editorForm") public editorForm: BaseFormComponent<InnerModel>;

    @Input() dragAndDropConfig?: {
        enabled: boolean,
        onDrop: (event: CdkDragDrop<InnerModel[]>) => any,
    };

    @Input() virtualScrollConfig?: {
        enabled?: boolean,
        maxHeightPx?: number,
    }

    @Input() getExpandedRowChildRows: (row: InnerModel) => InnerModel[];
    @ViewChild(ListComponent) public listComponent: ListComponent<InnerModel>;

    @Input() public getEditorModalTitle: (gridRowData?: InnerModel) => string;
    @Input() public totalRecordCount: number;
    @Input() public allowPaging: boolean = false;
}

