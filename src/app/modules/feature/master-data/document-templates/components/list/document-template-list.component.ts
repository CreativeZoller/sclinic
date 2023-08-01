import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { BehaviorSubject, concat, debounceTime, map, Observable, of, shareReplay, switchMap, tap } from "rxjs";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { DocumentTemplate, Grid_DocumentTemplate } from "../../models/document-template.model";
import { removeNullProperties } from "../../../../../core/utility/methods/remove-null-properties";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";
import { ActivatedRoute } from "@angular/router";
import { InitPageData } from "../../../../../app-common/init-page-data-provider/models/init-page-data.model";
import { MasterDataManagementService } from "../../../../../../../api/services";
import { CoreModelsMasterDataDocumentTemplateGetDocumentTemplatesByConditionRequest } from "../../../../../../../api/models";
import { TextFieldComponent } from "../../../../../app-common/text-field/components/text-field/text-field.component";
import { SelectFieldComponent } from "../../../../../app-common/select-field/components/select-field/select-field.component";
import { PaginationConfig } from "../../../../../../components/table/pagination/pagination.component";


type Grid_Model = Grid_DocumentTemplate;
type Full_Model = DocumentTemplate;

@UntilDestroy()
@Component({
    selector: "app-document-template-list",
    templateUrl: "./document-template-list.component.html",
    styleUrls: ["./document-template-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentTemplateListComponent {

    private masterDataManagementService = inject(MasterDataManagementService);
    private resourceService = inject(ResourceService);
    private activatedRoute = inject(ActivatedRoute);

    private initData = this.activatedRoute.snapshot.data["init"] as InitPageData;

    public baseResourceKey = "document.template";
    public tableIdProperty = "documentTemplateId";

    private filterData$ = new BehaviorSubject<CoreModelsMasterDataDocumentTemplateGetDocumentTemplatesByConditionRequest>({});

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("document.template.list.table.headers.name"),
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
            name: this.resourceService.resolve("document.template.list.table.headers.description"),
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
            name: this.resourceService.resolve("document.template.list.table.headers.dC_DocumentTemplateCategoryId"),
            attributeName: "dC_DocumentTemplateCategoryId",
            formatterFn: (v) => this.initData.dC_DocumentTemplateCategoryList.find((item) => item.value === v)?.name,
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.dC_DocumentTemplateCategoryList;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        dC_DocumentTemplateCategoryId: v ?? undefined,
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
                    this.masterDataManagementService.documentTemplateGetDocumentTemplatesByConditionPost({
                        ...filterData,

                        page: pageConfig.currentSelectedPage,
                        pageSize: pageConfig.rowsPerPage,
                    }).pipe(
                        tap(res => {
                            if (res && res.totalRecordCount != null) {
                                this.totalRecordCount$.next(res.totalRecordCount);
                            }
                        }),
                        map((res) => res?.businessObjectList ?? []),
                    ),
                );
            }),
        );
    }

    public handleSave$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any> = ({rowData, formValue}) => {
        return this.masterDataManagementService.documentTemplateCreateOrUpdateDocumentTemplatePost({
            businessObjectList: [
                removeNullProperties({
                    ...rowData,
                    ...formValue,
                    documentTemplatePlaceholder: [],// TODO hotfix
                }),
            ],
        }).pipe(
            map((res) => res.businessObject),
            shareReplay(1),
        );
    }

    public handleDelete$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any> = ({gridRowData}) => {
        return this.masterDataManagementService.documentTemplateDeleteDocumentTemplateDelete({
            documentTemplateIds: [ gridRowData?.documentTemplateId! ],
        });
    }
}
