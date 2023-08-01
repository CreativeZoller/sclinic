import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { BehaviorSubject, concat, debounceTime, map, Observable, of, shareReplay, startWith, switchMap, tap } from "rxjs";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { Partner, Grid_Partner } from "../../models/partner.model";
import { PartnerTypeEnum } from "../../../../../../../api/enums";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";
import { MasterDataManagementService } from "../../../../../../../api/services";
import { ActivatedRoute } from "@angular/router";
import { InitPageData } from "../../../../../app-common/init-page-data-provider/models/init-page-data.model";
import { MaskPipe } from "ngx-mask";
import { CoreModelsMasterDataPartnerGetPartnerByConditionRequest } from "../../../../../../../api/models";
import { SelectFieldComponent } from "../../../../../app-common/select-field/components/select-field/select-field.component";
import { TextFieldComponent } from "../../../../../app-common/text-field/components/text-field/text-field.component";
import { PaginationConfig } from "../../../../../../components/table/pagination/pagination.component";


type Grid_Model = Grid_Partner;
type Full_Model = Partner;

type TabConfig = {
    id: number,
    title: string,
    filterData$: BehaviorSubject<any>,
    tableHeaders: TableHeader[],
    getTableData$: (pageConfig: PaginationConfig) => Observable<Grid_Model[]>

}

@UntilDestroy()
@Component({
    selector: "app-partner-list",
    templateUrl: "./partner-list.component.html",
    styleUrls: ["./partner-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnerListComponent {

    private masterDataManagementService = inject(MasterDataManagementService);
    private resourceService = inject(ResourceService);
    private activatedRoute = inject(ActivatedRoute);
    private maskPipe = inject(MaskPipe);

    private initData = this.activatedRoute.snapshot.data["init"] as InitPageData;

    public baseResourceKey = "partner";
    public tableIdProperty = "partnerId";

    public totalRecordCount$ = new BehaviorSubject<number>(0);
    public tabConfigs: TabConfig[] = (() => {
        const patientPartnerConfig: TabConfig = {
            id: 1,
            title: this.resourceService.resolve("partner.list.tabs.patient.title"),
            filterData$: new BehaviorSubject<CoreModelsMasterDataPartnerGetPartnerByConditionRequest>({}),
            tableHeaders: [
                {
                    name: this.resourceService.resolve("partner.list.tabs.patient.table.headers.patient.dC_TitleTypeId"),
                    attributeName: "patient.dC_TitleTypeId",
                    formatterFn: (v) => this.initData.dC_TitleTypeList.find((item) => item.value === v)?.name,
                    headerSearchComponent: SelectFieldComponent,
                    initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                        instance.placeholder = this.resourceService.resolve("general.action.label.search");
                        instance.classes = ["form-control--search"];
                        instance.options = this.initData.dC_TitleTypeList;
                        instance.writeValue(null);
                        instance.registerOnChange((v) => {
                            patientPartnerConfig.filterData$.next({
                                ...patientPartnerConfig.filterData$.value,
                                dC_TitleTypeId: v ?? undefined,
                            });
                        });
                    },
                },
                {
                    name: this.resourceService.resolve("partner.list.tabs.patient.table.headers.patient.surname"),
                    attributeName: "patient.surname",
                    headerSearchComponent: TextFieldComponent,
                    initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                        instance.placeholder = this.resourceService.resolve("general.action.label.search");
                        instance.classes = ["form-control--search"];
                        instance.registerOnChange((v) => {
                            patientPartnerConfig.filterData$.next({
                                ...patientPartnerConfig.filterData$.value,
                                surname: v ?? undefined,
                            });
                        });
                    },
                },
                {
                    name: this.resourceService.resolve("partner.list.tabs.patient.table.headers.patient.firstname"),
                    attributeName: "patient.firstname",
                    headerSearchComponent: TextFieldComponent,
                    initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                        instance.placeholder = this.resourceService.resolve("general.action.label.search");
                        instance.classes = ["form-control--search"];
                        instance.registerOnChange((v) => {
                            patientPartnerConfig.filterData$.next({
                                ...patientPartnerConfig.filterData$.value,
                                firstName: v ?? undefined,
                            });
                        });
                    },
                },
                {
                    name: this.resourceService.resolve("partner.list.tabs.patient.table.headers.patient.ssn"),
                    attributeName: "patient.ssn",
                    formatterFn: (value) => this.maskPipe.transform(value ?? "", "AAA-AAA-A*"),
                    headerSearchComponent: TextFieldComponent,
                    initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                        instance.placeholder = this.resourceService.resolve("general.action.label.search");
                        instance.classes = ["form-control--search"];
                        instance.registerOnChange((v) => {
                            patientPartnerConfig.filterData$.next({
                                ...patientPartnerConfig.filterData$.value,
                                socialSecurityNumber: v ?? undefined,
                            });
                        });
                    },
                },
            ],
            getTableData$: (pageConfig: PaginationConfig): Observable<Grid_Model[]> =>
                patientPartnerConfig.filterData$.pipe(
                    debounceTime(200),
                    switchMap((filterData) => {
                        return concat(
                            of(undefined as any),
                            this.masterDataManagementService.partnerGetPartnerByConditionPost({
                                ...filterData,
                                dC_PartnerTypeId: PartnerTypeEnum.PATIENT,
                                needDC_PartnerMode: true,// TODO review
                                needDC_PartnerType: true,// TODO review
                                needPartnerData: true,// TODO review
                                needPartnerXAddressDTO: true,// TODO review
                                needHeadquartersAddress: true,// TODO review
                                needPartnerXContact: true,// TODO review
                                needPatientXPatientIdType: true,// TODO review
                                needBisnode: false,
                            }).pipe(
                                map(res => res?.businessObjectList ?? []),
                            ),
                        );
                    }),
                ),
        };

        const companyPartnerConfig: TabConfig = {
            id: 2,
            title: this.resourceService.resolve("partner.list.tabs.company.title"),
            filterData$: new BehaviorSubject<CoreModelsMasterDataPartnerGetPartnerByConditionRequest>({}),
            tableHeaders: [
                {
                    name: this.resourceService.resolve("partner.list.tabs.company.table.headers.company.fullName"),
                    attributeName: "company.fullName",
                    headerSearchComponent: TextFieldComponent,
                    initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                        instance.placeholder = this.resourceService.resolve("general.action.label.search");
                        instance.classes = ["form-control--search"];
                        instance.registerOnChange((v) => {
                            companyPartnerConfig.filterData$.next({
                                ...companyPartnerConfig.filterData$.value,
                                companyName: v ?? undefined,
                            });
                        });
                    },
                },
                {
                    name: this.resourceService.resolve("partner.list.tabs.company.table.headers.company.dC_CompanyTypeId"),
                    attributeName: "company.dC_CompanyTypeId",
                    formatterFn: (v) => this.initData.dC_CompanyTypeList.find((item) => item.value === v)?.name,
                    headerSearchComponent: SelectFieldComponent,
                    initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                        instance.placeholder = this.resourceService.resolve("general.action.label.search");
                        instance.classes = ["form-control--search"];
                        instance.options = this.initData.dC_CompanyTypeList;
                        instance.writeValue(null);
                        instance.registerOnChange((v) => {
                            companyPartnerConfig.filterData$.next({
                                ...companyPartnerConfig.filterData$.value,
                                dC_CompanyTypeId: v ?? undefined,
                            });
                        });
                    },
                },
                {
                    name: this.resourceService.resolve("partner.list.tabs.company.table.headers.dC_PartnerModeId"),
                    attributeName: "dC_PartnerModeId",
                    formatterFn: (v) => this.initData.dC_PartnerModeList.find((item) => item.value === v)?.name,
                    headerSearchComponent: SelectFieldComponent,
                    initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                        instance.placeholder = this.resourceService.resolve("general.action.label.search");
                        instance.classes = ["form-control--search"];
                        instance.options = this.initData.dC_PartnerModeList;
                        instance.writeValue(null);
                        instance.registerOnChange((v) => {
                            companyPartnerConfig.filterData$.next({
                                ...companyPartnerConfig.filterData$.value,
                                dC_PartnerModeId: v ?? undefined,
                            });
                        });
                    },
                },
                {
                    name: this.resourceService.resolve("partner.list.tabs.company.table.headers.company.contactEmailAddress"),
                    attributeName: "company.contactEmailAddress",
                    headerSearchComponent: TextFieldComponent,
                    initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                        instance.placeholder = this.resourceService.resolve("general.action.label.search");
                        instance.classes = ["form-control--search"];
                        instance.registerOnChange((v) => {
                            companyPartnerConfig.filterData$.next({
                                ...companyPartnerConfig.filterData$.value,
                                companyEmail: v ?? undefined,
                            });
                        });
                    },
                },
            ],
            getTableData$: (pageConfig: PaginationConfig): Observable<Grid_Model[]> =>
                companyPartnerConfig.filterData$.pipe(
                    debounceTime(200),
                    switchMap((filterData) => {
                        return concat(
                            of(undefined as any),
                            this.masterDataManagementService.partnerGetPartnerByConditionPost({
                                ...filterData,
                                dC_PartnerTypeId: PartnerTypeEnum.COMPANY,
                                needDC_PartnerMode: true,// TODO review
                                needDC_PartnerType: true,// TODO review
                                needPartnerData: true,// TODO review
                                needPartnerXAddressDTO: true,// TODO review
                                needHeadquartersAddress: true,// TODO review
                                needCompanySite: true,// TODO review
                                needBisnode: false,
                                needCompanyInvoiceAddress: true,

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
            ),
        };

        return [patientPartnerConfig, companyPartnerConfig];
    })();

    private _activeTabConfigIndex$ = new BehaviorSubject<number>(0);

    public activeTabConfigIndex$ = this._activeTabConfigIndex$.asObservable().pipe(
        shareReplay(1),
    )

    public activeTabConfig$ = this._activeTabConfigIndex$.asObservable().pipe(
        map((index) => this.tabConfigs[index]),
        shareReplay(1),
    )

    public setActiveTabConfigByIndex(index: number) {
        if (this.tabConfigs[index] != null && this._activeTabConfigIndex$.value !== index) {
            this._activeTabConfigIndex$.next(index);
        }
    }

    public tableHeaders$ = this.activeTabConfig$.pipe(
        map(cfg => cfg.tableHeaders),
        shareReplay(1),
    );

    public getTableData$ = (pageConfig: PaginationConfig) => this.activeTabConfig$.pipe(
        switchMap(cfg => cfg.getTableData$(pageConfig).pipe(
            startWith(undefined),// Show loading
            shareReplay(1),
        )),
        shareReplay(1),
    );

    public handleSave$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any> = ({rowData, formValue}) => {
        return this.masterDataManagementService.partnerCreateOrUpdatePartnerPost({
            businessObjectList: [
                {
                    ...formValue,
                },
            ],
        }).pipe(
            map((res) => res.businessObjectList?.[0]),
            shareReplay(1),
        );
    }

    public handleDelete$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any> = ({gridRowData}) => {
        return this.masterDataManagementService.partnerDeletePartnerDelete({
            partnerIds: [ gridRowData?.partnerId! ],
        });
    }
}
