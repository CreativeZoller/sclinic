import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BehaviorSubject, filter, map, Observable, of, shareReplay, switchMap, take, zip } from "rxjs";
import { DictionaryProviderWebServiceService } from "../../../../../../../api/services";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { DictionaryEntry } from "../../models/dictionary-entry.model";
import { DictionaryEntryFormModel } from "../form/dictionary-entry-form.component";
import { getDcTableIdPropertyName } from "../../../../../app-common/init-page-data-provider/utility/helpers/dc-table.helpers";
import { DcTableName } from "../../../../../app-common/init-page-data-provider/models/dc-table.model";


@UntilDestroy()
@Component({
    selector: "app-dictionary-entry-list",
    templateUrl: "./dictionary-entry-list.component.html",
    styleUrls: ["./dictionary-entry-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictionaryEntryListComponent {

    private dictionaryProviderWebServiceService = inject(DictionaryProviderWebServiceService);
    private resourceService = inject(ResourceService);

    /**
     * The selected table type name, for ex.: DC_CityDto
     */
    selectedTypeName$ = new BehaviorSubject<DictionaryEntry["typeName"] | undefined>(undefined);
    @Input() set typeName(typeName: DictionaryEntry["typeName"] | undefined) {
        this.selectedTypeName$.next(typeName);
    }

    entityIdProperty$ = this.selectedTypeName$.pipe(
        filter((typeName): typeName is string => typeName != null),
        map((typeName) => getDcTableIdPropertyName(typeName as DcTableName)),
        shareReplay(1),
    )

    private getEntityNameProperty<T extends {}>(entity: T): string {
        const entityProperties = Object.keys(entity);

        if (entityProperties.some(prop => prop === "name")) return "name";

        return entityProperties.find(prop => prop.includes("Name")) ?? "name";
    }

    public baseResourceKey = "dictionary.entry";

    public tableHeaders: TableHeader[] = [
        {
            id: 1,
            name: this.resourceService.resolve("dictionary.entry.list.table.headers.name"),
            attributeName: "",
            formatterFn: (v, row) => row?.[this.getEntityNameProperty(row)] ?? "",
        }
    ];

    public getTableData$: () => Observable<any[]> = () => {
        return this.selectedTypeName$.pipe(
            switchMap((selectedTypeName) => {
                if (selectedTypeName == null) return of([]);

                return this.dictionaryProviderWebServiceService.dCGetDCTableDTOPost({
                    tableName: selectedTypeName,
                }).pipe(
                    map((response) => response?.dcList ?? []),
                )
            }),
        );
    }

    public getFullModelFromGridModel$ = (row: any): Observable<DictionaryEntryFormModel> => {
        return of(<DictionaryEntryFormModel>{
            name: row?.[this.getEntityNameProperty(row)] ?? "",
        });
    }

    private _save$ = ({gridRowData, formValue}: ListHandlerCallbackData<any, DictionaryEntryFormModel>, isDelete: boolean = false): Observable<any> => {
        return zip(
            this.selectedTypeName$,
            this.entityIdProperty$,
        ).pipe(
            take(1),
            switchMap(([typeName, idProperty]) => {
                const value = { ...gridRowData, ...formValue };

                return this.dictionaryProviderWebServiceService.dCCreateOrUpdateDictionaryEntriesPost({
                    dictionaryEntries: [{
                        typeName: typeName + "DTO",
                        dictionaryEntity: {
                            rowId: value?.[idProperty] ?? 0,
                            entityObject: {
                                [idProperty]: value?.[idProperty] ?? 0,
                                isActive: !isDelete,
                                ...(isDelete ? {} : {
                                    [this.getEntityNameProperty(formValue)]: formValue?.name,
                                }),
                            },
                        },
                    }],
                }).pipe(
                    map((res) => res.isSuccessful),
                    shareReplay(1),
                );
            }),
        );
    }

    public handleSave$ = (data: ListHandlerCallbackData<any, DictionaryEntryFormModel>) => this._save$(data, false);
    public handleDelete$ = (data: ListHandlerCallbackData<any, DictionaryEntryFormModel>) => this._save$(data, true);
}
