import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { BehaviorSubject, concat, debounceTime, map, Observable, of, shareReplay, switchMap, tap } from "rxjs";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { Function } from "../../models/function.model";
import { removeNullProperties } from "../../../../../core/utility/methods/remove-null-properties";
import { ActivatedRoute } from "@angular/router";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";
import { InitPageData } from "../../../../../app-common/init-page-data-provider/models/init-page-data.model";
import { AuthenticationWebServiceService } from "../../../../../../../api/services";
import { CoreModelsAuthenticationFunctionGetFunctionByConditionRequest } from "../../../../../../../api/models";
import { TextFieldComponent } from "../../../../../app-common/text-field/components/text-field/text-field.component";
import { SelectFieldComponent } from "../../../../../app-common/select-field/components/select-field/select-field.component";
import { PaginationConfig } from "../../../../../../components/table/pagination/pagination.component";


type Full_Model = Function;

@UntilDestroy()
@Component({
    selector: "app-function-list",
    templateUrl: "./function-list.component.html",
    styleUrls: ["./function-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FunctionListComponent {

    private authenticationWebServiceService = inject(AuthenticationWebServiceService);
    private activatedRoute = inject(ActivatedRoute);
    private resourceService = inject(ResourceService);

    private initData = this.activatedRoute.snapshot.data["init"] as InitPageData;

    public tableDataSnapshot: Full_Model[] = [];

    public baseResourceKey = "function";
    public tableIdProperty = "functionId";

    private filterData$ = new BehaviorSubject<CoreModelsAuthenticationFunctionGetFunctionByConditionRequest>({});

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("function.list.table.headers.functionName"),
            attributeName: "functionName",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        functionName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("function.list.table.headers.parentFunction.functionName"),
            attributeName: "parentFunction.functionName",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        parentFunctionName: v ?? undefined,
                    });
                });
            },
        },

        {
            name: this.resourceService.resolve("function.list.table.headers.dC_FunctionTypeId"),
            attributeName: "dC_FunctionTypeId",
            formatterFn: (v) => this.initData.dC_FunctionTypeList.find((item) => item.value === v)?.name,
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.dC_FunctionTypeList;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        dC_FunctionTypeId: v ?? undefined,
                    });
                });
            },
        },
    ];

    public totalRecordCount: number;
    public getTableData$: (pageConfig: PaginationConfig) => Observable<Full_Model[]> = (pageConfig) => {
        return this.filterData$.pipe(
            debounceTime(200),
            switchMap((filterData) => {
                return concat(
                    of(undefined as any),
                    this.authenticationWebServiceService.functionGetFunctionByConditionPost({
                        ...filterData,
                        page: pageConfig.currentSelectedPage,
                        pageSize: pageConfig.rowsPerPage,
                    }).pipe(
                        tap(res => {
                            if (res && res.totalRecordCount != null) {
                                this.totalRecordCount = res.totalRecordCount;
                            }
                        }),
                        map(res => res?.businessObjectList ?? []),
                        tap((data) => this.tableDataSnapshot = data),// TODO paginated lekérdezésnél ez el fog romlani!
                        shareReplay(1),
                    ),
                );
            }),
        );
    }

    public handleSave$?: (data: ListHandlerCallbackData<Full_Model, Full_Model>) => Observable<any> = ({rowData, formValue}) => {
        return this.authenticationWebServiceService.functionCreateOrUpdateFunctionPost({
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

    public handleDelete$?: (data: ListHandlerCallbackData<Full_Model, Full_Model>) => Observable<any> = ({gridRowData}) => {
        return this.authenticationWebServiceService.userDeleteFunctionDelete({
            functionIds: [gridRowData?.functionId!],
        });
    }
}
