import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, concat, debounceTime, map, Observable, of, shareReplay, switchMap,tap } from "rxjs";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { MedicalEmployee } from "../../../medical-employee/models/medical-employee.model";
import { MedicalEmployeeTypeEnum } from "../../../../../../../api/enums";
import { MasterDataManagementService } from "../../../../../../../api/services";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";
import { InitPageData } from "../../../../../app-common/init-page-data-provider/models/init-page-data.model";
import { CoreModelsMasterDataMedicalEmployeeGetMedicalEmployeeByConditionRequest } from "../../../../../../../api/models";
import { SelectFieldComponent } from "../../../../../app-common/select-field/components/select-field/select-field.component";
import { isEmpty } from "../../../../../core/utility/methods/is-empty";
import { TextFieldComponent } from "../../../../../app-common/text-field/components/text-field/text-field.component";
import { NumberFieldComponent } from "../../../../../app-common/number-field/components/number-field/number-field.component";
import { PaginationConfig } from "../../../../../../components/table/pagination/pagination.component";


type Full_Model = MedicalEmployee;

@UntilDestroy()
@Component({
    selector: "app-doctor-list",
    templateUrl: "./doctor-list.component.html",
    styleUrls: ["./doctor-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorListComponent {

    private masterDataManagementService = inject(MasterDataManagementService);
    private resourceService = inject(ResourceService);
    private activatedRoute = inject(ActivatedRoute);

    private initData = this.activatedRoute.snapshot.data["init"] as InitPageData;

    public baseResourceKey = "doctor";
    public tableIdProperty = "medicalEmployeeId";

    private filterData$ = new BehaviorSubject<CoreModelsMasterDataMedicalEmployeeGetMedicalEmployeeByConditionRequest>({});

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("doctor.list.table.headers.dC_TitleTypeId"),
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
            name: this.resourceService.resolve("doctor.list.table.headers.lastName"),
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
            name: this.resourceService.resolve("doctor.list.table.headers.firstName"),
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
            name: this.resourceService.resolve("doctor.list.table.headers.stampNumber"),
            attributeName: "stampNumber",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        stampNumber: v ?? undefined,
                    });
                });
            },
        },
        {
            // TODO property neve
            name: this.resourceService.resolve("doctor.list.table.headers.TODO_clinic"),
            attributeName: "TODO_clinic",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        clinicName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("doctor.list.table.headers.medicalEmployeeXService.specialty.specialtyName"),
            attributeName: "medicalEmployeeXService",
            formatterFn: (v: Full_Model["medicalEmployeeXService"]) => v?.[0]?.specialty?.specialtyName,
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        specialtyName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("doctor.list.table.headers.medicalEmployeeXDC_Language.dC_LanguageId"),
            attributeName: "medicalEmployeeXDC_Language",
            formatterFn: (v: Full_Model["medicalEmployeeXDC_Language"]) => this.initData.dC_LanguageList.find((item) => item.value === v?.[0]?.dC_LanguageId)?.name,
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.dC_LanguageList;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        dC_LanguageIdList: isEmpty(v) ? [] : [v],
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("doctor.list.table.headers.medicalEmployeeXService.ageFrom"),
            attributeName: "medicalEmployeeXService",
            formatterFn: (v: Full_Model["medicalEmployeeXService"]) => v?.[0]?.ageFrom,
            headerSearchComponent: NumberFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: NumberFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.hideStepping = true;
                instance.minNumber = 0;
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        ageFrom: v ?? undefined,
                    });
                });
            },
        },
    ];

    public readonly medicalEmployeeType = MedicalEmployeeTypeEnum.DOCTOR;

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
