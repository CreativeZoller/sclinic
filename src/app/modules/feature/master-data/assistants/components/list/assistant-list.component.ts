import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, concat, debounceTime, map, Observable, of, shareReplay, switchMap, tap } from "rxjs";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { MedicalEmployee } from "../../../medical-employee/models/medical-employee.model";
import { MedicalEmployeeTypeEnum, ContactTypeEnum } from "../../../../../../../api/enums";
import { MasterDataManagementService } from "../../../../../../../api/services";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";
import { InitPageData } from "../../../../../app-common/init-page-data-provider/models/init-page-data.model";
import { MedicalEmployeeXContact } from "../../../medical-employee/models/medical-employee-x-contact.model";
import { MedicalEmployeeXContract } from "../../../medical-employee/models/medical-employee-x-contract.model";
import { CoreModelsMasterDataMedicalEmployeeGetMedicalEmployeeByConditionRequest } from "../../../../../../../api/models";
import { TextFieldComponent } from "../../../../../app-common/text-field/components/text-field/text-field.component";
import { SelectFieldComponent } from "../../../../../app-common/select-field/components/select-field/select-field.component";
import { isEmpty } from "../../../../../core/utility/methods/is-empty";
import { NumberFieldComponent } from "../../../../../app-common/number-field/components/number-field/number-field.component";
import { PaginationConfig } from "../../../../../../components/table/pagination/pagination.component";


type Full_Model = MedicalEmployee;

@UntilDestroy()
@Component({
    selector: "app-assistant-list",
    templateUrl: "./assistant-list.component.html",
    styleUrls: ["./assistant-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssistantListComponent {

    private masterDataManagementService = inject(MasterDataManagementService);
    private resourceService = inject(ResourceService);
    private activatedRoute = inject(ActivatedRoute);

    private initData = this.activatedRoute.snapshot.data["init"] as InitPageData;

    public baseResourceKey = "assistant";
    public tableIdProperty = "medicalEmployeeId";

    private filterData$ = new BehaviorSubject<CoreModelsMasterDataMedicalEmployeeGetMedicalEmployeeByConditionRequest>({});

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("assistant.list.table.headers.dC_TitleTypeId"),
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
                        dC_TitleTypeIdList: isEmpty(v) ? [] : [v],
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("assistant.list.table.headers.lastName"),
            attributeName: "lastName",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        lastName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("assistant.list.table.headers.firstName"),
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
            name: this.resourceService.resolve("assistant.list.table.headers.medicalEmployeeXContact.phoneNumber"),
            attributeName: "medicalEmployeeXContact",
            formatterFn: (v: MedicalEmployeeXContact[]) => {
                v = v ?? [];

                const phoneNumberContactObj = v.find(vv => vv.dC_ContactTypeId === ContactTypeEnum.PHONE_NUMBER_1)
                    ?? v.find(vv => vv.dC_ContactTypeId === ContactTypeEnum.PHONE_NUMBER_2);

                return phoneNumberContactObj?.contactValue;
            },
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        phoneNumber: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("assistant.list.table.headers.nehiIdentifier"),
            attributeName: "nehiIdentifier",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        nehiIdentifier: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("assistant.list.table.headers.medicalContract.medicalContractPeriod.dC_JobTypeId"),
            attributeName: "medicalContract",
            formatterFn: (v: MedicalEmployeeXContract[] | undefined) => {
              const jobTypeLabels = [];

              if (v?.some(x => x.medicalContractPeriod?.some(y => y.isEmployee))) {
                jobTypeLabels.push(this.resourceService.resolve("assistant.list.table.headers.medicalContract.medicalContractPeriod.isEmployee"));
              }

              if (v?.some(x => x.medicalContractPeriod?.some(y => y.isHourlyRate))) {
                jobTypeLabels.push(this.resourceService.resolve("assistant.list.table.headers.medicalContract.medicalContractPeriod.isHourlyRate"));
              }

              const jobType = jobTypeLabels.join(" | ");
              return jobType;
            },
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = [
                    {
                        name: this.resourceService.resolve("assistant.list.table.headers.medicalContract.medicalContractPeriod.isEmployee"),
                        value: true,
                    },
                    {
                        name: this.resourceService.resolve("assistant.list.table.headers.medicalContract.medicalContractPeriod.isHourlyRate"),
                        value: false,
                    },
                ];
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        isEmployee: v === true || undefined,
                        isHourlyRate: v === false || undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("assistant.list.table.headers.numberOfDaysOff"),
            attributeName: "numberOfDaysOff",
            headerSearchComponent: NumberFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: NumberFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.hideStepping = true;
                instance.minNumber = 0;
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        numberOfDaysOff: v ?? undefined,
                    });
                });
            },
        },
    ];

    public readonly medicalEmployeeType = MedicalEmployeeTypeEnum.ASSISTANT;

    public totalRecordCount$ = new BehaviorSubject<number>(0);
    public getTableData$: (pageConfig: PaginationConfig) => Observable<Full_Model[]> = (pageConfig) => {
        return this.filterData$.pipe(
            debounceTime(200),
            switchMap((filterData) => {
                return concat(
                    of(undefined as any),
                    this.masterDataManagementService.medicalEmployeeGetMedicalEmployeeByConditionPost({
                        ...filterData,
                        needBookingArea: true,
                        needMedicalCinicDetail: true,
                        needMedicalEmployeeXContact: true,
                        needMedicalEmployeeXDC_Language: true,
                        needMedicalEmployeeXService: true,
                        needPUPHAX_ProfessionalExamCode: true,
                        needMedicalContract: true,
                        needAddress: true,
                        needSubstituteMedicalEmployee: true,
                        needAssistant: true,
                        dC_MedicalEmployeeTypeId: this.medicalEmployeeType,

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

    public handleSave$?: (data: ListHandlerCallbackData<Full_Model, Full_Model>) => Observable<any> = ({rowData, formValue}) => {
        return this.masterDataManagementService.medicalEmployeeCreateOrUpdateMedicalEmployeePost({
            businessObjectList: [ formValue ],
        }).pipe(
            map((res) => res.businessObjectList),
            shareReplay(1),
        );
    }

    public handleDelete$?: (data: ListHandlerCallbackData<Full_Model, Full_Model>) => Observable<any> = ({gridRowData}) => {
        return this.masterDataManagementService.medicalEmployeeDeleteMedicalEmployeeDelete({
            businessObjectList: [ gridRowData?.medicalEmployeeId! ],
        });
    }
}
