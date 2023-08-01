import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { BehaviorSubject, concat, debounceTime, map, Observable, of, shareReplay, switchMap, tap } from "rxjs";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { Authority } from "../../models/authority.model";
import { removeNullProperties } from "../../../../../core/utility/methods/remove-null-properties";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";
import { AuthenticationWebServiceService } from "../../../../../../../api/services";
import { CoreModelsAuthenticationRightGetRightByConditionRequest } from "../../../../../../../api/models";
import { TextFieldComponent } from "../../../../../app-common/text-field/components/text-field/text-field.component";
import { PaginationConfig } from "../../../../../../components/table/pagination/pagination.component";


type Full_Model = Authority;

@UntilDestroy()
@Component({
    selector: "app-authority-list",
    templateUrl: "./authority-list.component.html",
    styleUrls: ["./authority-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorityListComponent {

    private authenticationWebServiceService = inject(AuthenticationWebServiceService);
    private resourceService = inject(ResourceService);

    public baseResourceKey = "authority";
    public tableIdProperty = "rightId";

    private filterData$ = new BehaviorSubject<CoreModelsAuthenticationRightGetRightByConditionRequest>({});

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("authority.list.table.headers.name"),
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
    ];

    public totalRecordCount$ = new BehaviorSubject<number>(0);
    public getTableData$: (pageConfig: PaginationConfig) => Observable<Full_Model[]> = (pageConfig) => {
        return this.filterData$.pipe(
            debounceTime(200),
            switchMap((filterData) => {
                return concat(
                    of(undefined as any),
                    this.authenticationWebServiceService.rightGetRightByConditionPost({
                        needFunction: true,
                        ...filterData,
                        page: pageConfig.currentSelectedPage,
                        pageSize: pageConfig.rowsPerPage,
                    }).pipe(
                        tap(res => {
                            if (res && res.totalRecordCount != null) {
                                this.totalRecordCount$.next(res.totalRecordCount);
                            }
                        }),
                        map(res => res?.businessObjectList ?? []),
                    )
                );
            }),
        );
    }

    public handleSave$?: (data: ListHandlerCallbackData<Full_Model, Full_Model>) => Observable<any> = ({rowData, formValue}) => {
        return this.authenticationWebServiceService.rightCreateOrUpdateRightPost({
            businessObject: removeNullProperties({
                ...rowData,
                ...formValue,
            }),
        }).pipe(
            map((res) => res.businessObject),
            shareReplay(1),
        );
    }

    public handleDelete$?: (data: ListHandlerCallbackData<Full_Model, Full_Model>) => Observable<any> = ({gridRowData}) => {
        return this.authenticationWebServiceService.rightDeleteRightDelete({
            rightIds: [gridRowData?.rightId!],
        });
    }
}
