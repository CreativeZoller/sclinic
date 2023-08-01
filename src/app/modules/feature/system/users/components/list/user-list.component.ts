import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, concat, debounceTime, map, Observable, of, shareReplay, switchMap, tap } from "rxjs";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { User } from "../../models/user.model";
import { removeNullProperties } from "../../../../../core/utility/methods/remove-null-properties";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";
import { InitPageData } from "../../../../../app-common/init-page-data-provider/models/init-page-data.model";
import { AuthenticationWebServiceService } from "../../../../../../../api/services";
import { CoreModelsAuthenticationUserGetSwissUserByConditionRequest } from "../../../../../../../api/models";
import { TextFieldComponent } from "../../../../../app-common/text-field/components/text-field/text-field.component";
import { SelectFieldComponent } from "../../../../../app-common/select-field/components/select-field/select-field.component";
import { PaginationConfig } from "../../../../../../components/table/pagination/pagination.component";


type Full_Model = User;

@UntilDestroy()
@Component({
    selector: "app-user-list",
    templateUrl: "./user-list.component.html",
    styleUrls: ["./user-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {

    private authenticationWebServiceService = inject(AuthenticationWebServiceService);
    private resourceService = inject(ResourceService);
    private activatedRoute = inject(ActivatedRoute);

    private initData = this.activatedRoute.snapshot.data["init"] as InitPageData;

    public baseResourceKey = "user";
    public tableIdProperty = "swissUserId";

    private filterData$ = new BehaviorSubject<CoreModelsAuthenticationUserGetSwissUserByConditionRequest>({});

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("user.list.table.headers.dC_TitleTypeId"),
            attributeName: "dC_TitleTypeId",
            formatterFn: (v) => this.initData.dC_TitleTypeList.find((item) => item.value === v)?.name,
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.dC_TitleTypeList;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        dC_TitleTypeId: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("user.list.table.headers.familyName"),
            attributeName: "familyName",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        familyName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("user.list.table.headers.firstName"),
            attributeName: "firstName",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        firstName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("user.list.table.headers.email"),
            attributeName: "email",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        email: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("user.list.table.headers.phoneNumber"),
            attributeName: "phoneNumber",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        phoneNumber: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("user.list.table.headers.dC_TwoFactorAuthenticationTypeId"),
            attributeName: "dC_TwoFactorAuthenticationTypeId",
            formatterFn: (v) => this.initData.dC_TwoFactorAuthenticationTypeList.find((item) => item.value === v)?.name,
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.dC_TwoFactorAuthenticationTypeList;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        dC_TwoFactorAuthenticationTypeId: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("user.list.table.headers.dC_UserStatusId"),
            attributeName: "dC_UserStatusId",
            formatterFn: (v) => this.initData.dC_UserStatusList.find((item) => item.value === v)?.name,
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.dC_UserStatusList;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        dC_UserStatusId: v ?? undefined,
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
                    this.authenticationWebServiceService.userGetSwissUserByConditionPost({
                        needAddress: true,
                        needSwissUserXRole: true,
                        needDeleted: true,
                        ...filterData,

                        page: pageConfig.currentSelectedPage,
                        pageSize: pageConfig.rowsPerPage,
                    }).pipe(
                        tap(res => {
                            if (res && res.totalRecordCount != null) {
                                this.totalRecordCount = res.totalRecordCount;
                            }
                        }),
                        map((res) => res?.businessObjectList ?? []),
                        shareReplay(1),
                    ),
                );
            }),
        );
    }

    public handleSave$?: (data: ListHandlerCallbackData<Full_Model, Full_Model>) => Observable<any> = ({rowData, formValue}) => {
        return this.authenticationWebServiceService.userCreateOrUpdateSwissUserPost({
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
        return this.authenticationWebServiceService.userDeleteUserDelete({
            swissUserIds: [gridRowData?.swissUserId!],
        });
    }
}
