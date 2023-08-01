import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { BehaviorSubject, concat, debounceTime, map, Observable, of, shareReplay, switchMap, tap } from "rxjs";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { Role } from "../../models/role.model";
import { removeNullProperties } from "../../../../../core/utility/methods/remove-null-properties";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";
import { AuthenticationWebServiceService } from "../../../../../../../api/services";
import { CoreModelsAuthenticationRoleGetRoleByConditionRequest } from "../../../../../../../api/models";
import { SelectFieldComponent } from "../../../../../app-common/select-field/components/select-field/select-field.component";
import { TextFieldComponent } from "../../../../../app-common/text-field/components/text-field/text-field.component";
import { PaginationConfig } from "../../../../../../components/table/pagination/pagination.component";


type Full_Model = Role;

@UntilDestroy()
@Component({
    selector: "app-role-list",
    templateUrl: "./role-list.component.html",
    styleUrls: ["./role-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleListComponent {

    private authenticationWebServiceService = inject(AuthenticationWebServiceService);
    private resourceService = inject(ResourceService);

    public baseResourceKey = "role";
    public tableIdProperty = "roleId";

    private filterData$ = new BehaviorSubject<CoreModelsAuthenticationRoleGetRoleByConditionRequest>({});

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("role.list.table.headers.roleName"),
            attributeName: "roleName",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        roleName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("role.list.table.headers.technical"),
            attributeName: "technical",
            formatterFn: (value) => `<div class="form-check form-check-custom form-check-solid form-check-sm">
                <input type="checkbox" ${value ? "checked" : ""} disabled class="form-check-input">
            </div>`,
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = [
                    { name: this.resourceService.resolve("general.label.true"), value: true },
                    { name: this.resourceService.resolve("general.label.false"), value: false },
                ];
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        technical: v ?? undefined,
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
                    this.authenticationWebServiceService.roleGetRoleByConditionPost({
                        needRight: true,
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
                        shareReplay(1),
                    ),
                );
            }),
        );
    }

    public handleSave$?: (data: ListHandlerCallbackData<Full_Model, Full_Model>) => Observable<any> = ({rowData, formValue}) => {
        return this.authenticationWebServiceService.roleCreateOrUpdateRolePost({
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
        return this.authenticationWebServiceService.roleDeleteRoleDelete({
            roleIds:  [gridRowData?.roleId!],
        });
    }
}
