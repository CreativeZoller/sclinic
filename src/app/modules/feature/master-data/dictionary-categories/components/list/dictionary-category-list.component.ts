import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { BehaviorSubject, concat, debounceTime, map, Observable, of, switchMap } from "rxjs";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";
import { DictionaryCategory } from "../../models/dictionary-category.model";
import { DictionaryProviderWebServiceService } from "../../../../../../../api/services";
import { CoreModelsDictionaryDCDictionaryCategoryGetDCDictionaryCategoryByConditionRequest } from "../../../../../../../api/models";
import { TextFieldComponent } from "../../../../../app-common/text-field/components/text-field/text-field.component";


type Full_Model = DictionaryCategory;
type Grid_Model = Full_Model;

@UntilDestroy()
@Component({
    selector: "app-dictionary-category-list",
    templateUrl: "./dictionary-category-list.component.html",
    styleUrls: ["./dictionary-category-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictionaryCategoryListComponent {

    private dictionaryProviderWebServiceService = inject(DictionaryProviderWebServiceService);
    private resourceService = inject(ResourceService);

    public baseResourceKey = "dictionary.category";
    public tableIdProperty = "dC_DictionaryCategoryId";

    private filterData$ = new BehaviorSubject<CoreModelsDictionaryDCDictionaryCategoryGetDCDictionaryCategoryByConditionRequest>({});

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("dictionary.category.list.table.headers.name"),
            attributeName: "name",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        name: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("dictionary.category.list.table.headers.categoryName"),
            attributeName: "categoryName",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        categoryName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("dictionary.category.list.table.headers.remarks"),
            attributeName: "remarks",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        remarks: v ?? undefined,
                    });
                });
            },
        },
    ];

    public getTableData$: () => Observable<Grid_Model[]> = () => {
        return this.filterData$.pipe(
            debounceTime(200),
            switchMap((filterData) => {
                return concat(
                    of(undefined as any),
                    this.dictionaryProviderWebServiceService.dictionaryCategoryGetDCDictionaryCategoryByConditionPost({
                        ...filterData,
                    }).pipe(
                        map(res => res?.dC_DictionaryCategoryList?.sort((a, b) => (!!a?.name > !!b?.name) ? 1 : -1) ?? []),
                    ),
                );
            }),
        );
    }

    public handleSave$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any> = ({ rowData, formValue }) => {
        return this.dictionaryProviderWebServiceService.dictionaryCategoryUpdateDCDictionaryCategoryPost({
            dC_DictionaryCategory: {...formValue, dC_DictionaryCategoryId : rowData?.dC_DictionaryCategoryId, isActive: rowData?.isActive},
        });
    }
}
