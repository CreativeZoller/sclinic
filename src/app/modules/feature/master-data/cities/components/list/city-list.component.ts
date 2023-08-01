import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { BehaviorSubject, concat, debounceTime, map, Observable, of, shareReplay, switchMap } from "rxjs";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { removeNullProperties } from "../../../../../core/utility/methods/remove-null-properties";
import { ActivatedRoute } from "@angular/router";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";
import { InitPageData } from "../../../../../app-common/init-page-data-provider/models/init-page-data.model";
import { City, Grid_City } from "../../models/city.model";
import { DictionaryProviderWebServiceService } from "../../../../../../../api/services";
import { CoreModelsDictionaryDCCityGetDCCitiesByConditionRequest } from "../../../../../../../api/models";
import { SelectFieldComponent } from "../../../../../app-common/select-field/components/select-field/select-field.component";
import { TextFieldComponent } from "../../../../../app-common/text-field/components/text-field/text-field.component";


type Grid_Model = Grid_City;
type Full_Model = City;

@UntilDestroy()
@Component({
    selector: "app-city-list",
    templateUrl: "./city-list.component.html",
    styleUrls: ["./city-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityListComponent {

    private dictionaryProviderWebServiceService = inject(DictionaryProviderWebServiceService);
    private activatedRoute = inject(ActivatedRoute);
    private resourceService = inject(ResourceService);

    private initData = this.activatedRoute.snapshot.data["init"] as InitPageData;

    public baseResourceKey = "city";
    public tableIdProperty = "dC_CityId";

    private filterData$ = new BehaviorSubject<CoreModelsDictionaryDCCityGetDCCitiesByConditionRequest>({});

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("city.list.table.headers.name"),
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
            name: this.resourceService.resolve("city.list.table.headers.dC_CountyId"),
            attributeName: "dC_CountyId",
            formatterFn: (v) => this.initData.dC_CountyList.find((item) => item.value === v)?.name,
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.dC_CountyList;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        dC_CountyId: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("city.list.table.headers.postCode"),
            attributeName: "postCode",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        postCode: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("city.list.table.headers.dC_CountryId"),
            attributeName: "dC_CountyId",
            formatterFn: (v) => {
                const dC_CountryId = this.initData.dC_CountyList.find((item) => item.value === v)?.dto.dC_CountryId;
                return this.initData.dC_CountryList.find((item) => item.value === dC_CountryId)?.name;
            },
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.dC_CountryList;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        dC_CountryId: v ?? undefined,
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
                    this.dictionaryProviderWebServiceService.cityGetDCCitiesByConditionPost({ ...filterData }).pipe(
                        map(res => res?.businessObjectList ?? [])
                    ),
                );
            }),
        );
    }

    public handleSave$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any> = ({rowData, formValue}) => {
        return this.dictionaryProviderWebServiceService.cityCreateOrUpdateDCCityPost({
            businessObjectList: [
                removeNullProperties({
                    ...rowData,
                    ...formValue,
                }),
            ]
        }).pipe(
            map((res) => res.businessObjectList?.[0]),
            shareReplay(1),
        );
    }

    public handleDelete$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any> = ({gridRowData}) => {
        return this.dictionaryProviderWebServiceService.cityDeleteDCCityDelete({
            dC_CityIds: [gridRowData?.dC_CityId!],
        });
    }
}
