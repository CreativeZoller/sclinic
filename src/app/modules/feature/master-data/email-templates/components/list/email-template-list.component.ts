import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { BehaviorSubject, concat, debounceTime, map, Observable, of, shareReplay, switchMap, tap } from "rxjs";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { EmailTemplate, Grid_EmailTemplate } from "../../models/email-template.model";
import { MasterDataManagementService } from "../../../../../../../api/services";
import { removeNullProperties } from "../../../../../core/utility/methods/remove-null-properties";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";
import { ActivatedRoute } from "@angular/router";
import { InitPageData } from "../../../../../app-common/init-page-data-provider/models/init-page-data.model";
import { CoreModelsMasterDataEmailTemplateGetEmailTemplateByConditionRequest } from "../../../../../../../api/models";
import { TextFieldComponent } from "../../../../../app-common/text-field/components/text-field/text-field.component";
import { SelectFieldComponent } from "../../../../../app-common/select-field/components/select-field/select-field.component";
import { PaginationConfig } from "../../../../../../components/table/pagination/pagination.component";


type Grid_Model = Grid_EmailTemplate;
type Full_Model = EmailTemplate;

@UntilDestroy()
@Component({
    selector: "app-email-template-list",
    templateUrl: "./email-template-list.component.html",
    styleUrls: ["./email-template-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailTemplateListComponent {

    private masterDataManagementService = inject(MasterDataManagementService);
    private resourceService = inject(ResourceService);
    private activatedRoute = inject(ActivatedRoute);

    private initData = this.activatedRoute.snapshot.data["init"] as InitPageData;

    public baseResourceKey = "email.template";
    public tableIdProperty = "emailTemplateId";

    private filterData$ = new BehaviorSubject<CoreModelsMasterDataEmailTemplateGetEmailTemplateByConditionRequest>({});

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("email.template.list.table.headers.emailTemplateName"),
            attributeName: "emailTemplateName",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        emailTemplateName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("email.template.list.table.headers.description"),
            attributeName: "description",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        description: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("email.template.list.table.headers.dC_EmailTemplateCategoryId"),
            attributeName: "dC_EmailTemplateCategoryId",
            formatterFn: (v) => this.initData.dC_EmailTemplateCategoryList.find((item) => item.value === v)?.name,
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.dC_EmailTemplateCategoryList;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        dC_EmailTemplateCategoryId: v ?? undefined,
                    });
                });
            },
        },
    ];

    public totalRecordCount$ = new BehaviorSubject<number>(0);
    public getTableData$: (pageConfig: PaginationConfig) => Observable<Grid_Model[]> = (pageConfig) => {
        return this.filterData$.pipe(
            debounceTime(200),
            switchMap((filterData) => {
                return concat(
                    of(undefined as any),
                    this.masterDataManagementService.emailTemplateGetEmailTemplateByConditionPost({
                        ...filterData,
                        needDCValue: false,// TODO review
                        needDocument: true,// TODO review

                        page: pageConfig.currentSelectedPage,
                        pageSize: pageConfig.rowsPerPage,
                    }).pipe(
                        tap(res => {
                            if (res && res.totalRecordCount != null) {
                                this.totalRecordCount$.next(res.totalRecordCount);
                            }
                        }),
                        map(res => res?.businessObjectList ?? []),
                    ),
                );
            }),
        );
    }

    public handleSave$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any> = ({rowData, formValue}) => {
        return this.masterDataManagementService.emailTemplateCreateOrUpdateEmailTemplatePost({
            businessObjectList: [
                removeNullProperties({
                    ...rowData,
                    ...formValue,
                }),
            ],
        }).pipe(
            map((res) => res.businessObject),
            shareReplay(1),
        );
    }

    public handleDelete$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any> = ({gridRowData}) => {
        return this.masterDataManagementService.emailTemplateDeleteEmailTemplateDelete({
            emailTemplateIds: [ gridRowData?.emailTemplateId! ],
        });
    }
}
