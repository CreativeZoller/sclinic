import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { TableHeader } from "../../../../../components/table/table/table-header";
import { CheckboxFieldComponent } from "../../../checkbox-field/components/checkbox-field/checkbox-field.component";
import { SelectionListFieldComponent } from "../../../selection-list-field/components/selection-list-field/selection-list-field.component";


@UntilDestroy()
@Component({
    selector: "app-single-selection-list-field",
    templateUrl: "../../../selection-list-field/components/selection-list-field/selection-list-field.component.html",
    styleUrls: [ "../../../selection-list-field/components/selection-list-field/selection-list-field.component.scss" ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleSelectionListFieldComponent<T extends Object> extends SelectionListFieldComponent<T> {

    public writeValue(_service: any) {
        const serviceOrArray = _service as T | T[];

        if (serviceOrArray == null) return super.writeValue([]);
        if (!Array.isArray(serviceOrArray)) return super.writeValue([ serviceOrArray ]);
        if (serviceOrArray.length > 1) return super.writeValue([ serviceOrArray[0] ]);

        return super.writeValue(serviceOrArray);
    }

    public readValue(value: T[]): any {
        return value[0] ?? undefined;
    }

    protected toggleSelectRow(row: T) {
        const idToToggle = row[this.tableIdProperty as keyof T];
        if (this.selectedRowIds$.value.includes(idToToggle)) {
            this.selectedRowIds$.next([])
        } else {
            this.selectedRowIds$.next([idToToggle]);
        }
    }

    protected selectionColumn: TableHeader = {
        id: 0,
        name: this.resourceService.resolve("general.selection.list.headers.selection"),
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
    };
}

