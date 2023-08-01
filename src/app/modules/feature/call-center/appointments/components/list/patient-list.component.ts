import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from "@angular/core";
import { BehaviorSubject, catchError, concat, debounceTime, map, Observable, of, shareReplay, switchMap, tap } from "rxjs";
import { UntilDestroy } from "@ngneat/until-destroy";
import { DatePipe } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { removeNullProperties } from "src/app/modules/core/utility/methods/remove-null-properties";
import { MasterDataManagementService, MedicalManagementService } from "src/api/services";
import { Grid_Patient, Patient } from "src/app/modules/feature/master-data/patients/models/patient.model";
import { ResourceService } from "src/app/modules/core/resource/services/resource.service";
import { TableHeader } from "src/app/components/table/table/table-header";
import { InitPageData } from "src/app/modules/app-common/init-page-data-provider/models/init-page-data.model";
import { CheckboxFieldComponent } from "src/app/modules/app-common/checkbox-field/components/checkbox-field/checkbox-field.component";
import { ListHandlerCallbackData } from "src/app/modules/app-common/list/components/list/list.component";
import { ActivatedRoute } from "@angular/router";
import { InitPageDataProviderService } from "src/app/modules/app-common/init-page-data-provider/services/init-page-data-provider.service";
import { PaginationConfig } from "src/app/components/table/pagination/pagination.component";
import { CoreModelsMasterDataPatientGetPatientsByConditionRequest } from "src/api/models";
import { SelectFieldComponent } from "src/app/modules/app-common/select-field/components/select-field/select-field.component";
import { TextFieldComponent } from "src/app/modules/app-common/text-field/components/text-field/text-field.component";
import { DatepickerFieldComponent } from "src/app/modules/app-common/datepicker-field/components/datepicker-field/datepicker-field.component";
import { ContactTypeEnum } from "src/api/enums";
import { AppointmentCartStatusEnum } from "src/api/enums/appointment-cart-status.enum";

type Grid_Model = Grid_Patient;
type Full_Model = Patient;

@UntilDestroy()
@Component({
    selector: "app-cc-patient-list",
    templateUrl: "./patient-list.component.html",
    styleUrls: ["./patient-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CcPatientListComponent {
    @Output() rowChecked = new EventEmitter();

    private toastrService = inject(ToastrService);
    private masterDataManagementService = inject(MasterDataManagementService);
    private resourceService = inject(ResourceService);
    private activatedRoute = inject(ActivatedRoute);
    private datePipe = inject(DatePipe);
    public baseResourceKey = "patient";
    public tableIdProperty = "patientId";
    private initPageDataProviderService = inject(InitPageDataProviderService);
    public initData: InitPageData = this.initPageDataProviderService.getInitData(this.activatedRoute.snapshot);

    private medicalManagementService = inject(MedicalManagementService);
    public showDetails(gridRowData: Grid_Model) {
        if (Object.keys(gridRowData).length != 0) {
            this.getSelectedPatientCartStatus(gridRowData);
        }
    }

    public getSelectedPatientCartStatus(patient: any): void {
        if (patient.patientId === undefined) return;
        this.rowChecked.emit(patient);
        this.medicalManagementService.appointmentCartGetAppointmentCartsByConditionPost({
            patientIds: [patient.patientId],
            needDC_AppointmentCartStatus: true
        }).subscribe(res => {
            if(res.appointmentCarts?.length == 0) {
                this.medicalManagementService.appointmentCartCreateOrUpdateAppointmentCartPost({
                    appointmentCart: {
                        dC_AppointmentCartStatusId: AppointmentCartStatusEnum.ACTIVE,
                        patientId: patient.patientId,
                        validityDate: "2029-05-30T11:22:42.975Z"
                    }
                })
                // .subscribe(res => {
                // if (res.errorMessage == null) // todo: emit to show cart icon in the header menu
                // })
            } else {
                const activeCart = res.appointmentCarts?.filter(
                    (element) => element?.dC_AppointmentCartStatusId == 1
                );
                // if (activeCart && activeCart.length > 0) // todo: emit to show cart icon in the header menu
            }
        })
    }

    public totalRecordCount$ = new BehaviorSubject<number>(0);
    public getTableData$: (pageConfig: PaginationConfig) => Observable<Grid_Model[]> = (pageConfig) => {
        return this.filterData$.pipe(
            debounceTime(200),
            switchMap((filterData) => {
                return concat(
                    of(undefined as any),
                    this.masterDataManagementService.patientGetPatientsByConditionPost({
                        ...filterData,
                        needsPatientXPatient: true,
                        needsPatientXAddress: true,
                        needsPatientXContact: true,
                        needsPatientXEmployment: true,
                        needsPatientXDC_Language: true,
                        needsPatientInsuranceDetail: true,
                        needsPatientXPatientId: true,

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

    private filterData$ = new BehaviorSubject<CoreModelsMasterDataPatientGetPatientsByConditionRequest>({});
    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("cc.list.table.headers.title"),
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
            name: this.resourceService.resolve("cc.list.table.headers.surName"),
            attributeName: "surname",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        surname: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("cc.list.table.headers.firstName"),
            attributeName: "firstname",
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
            name: this.resourceService.resolve("cc.list.table.headers.dateOfBirth"),
            attributeName: "dateOfBirth",
            formatterFn: (v) => this.datePipe.transform(v),
            headerSearchComponent: DatepickerFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: DatepickerFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        birthDate: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("cc.list.table.headers.phoneNumbers"),
            formatterFn: (row: any) => row
                ?.patient
                ?.patientXContact
                ?.find((c: { dC_ContactTypeId: ContactTypeEnum; }) => c.dC_ContactTypeId === ContactTypeEnum.PHONE_NUMBER_1 || c.dC_ContactTypeId === ContactTypeEnum.PHONE_NUMBER_2)
                ?.contactValue
                ?? "",
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
            name: this.resourceService.resolve("cc.list.table.headers.emailAddress"),
            attributeName: "invoiceEmail",
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
        // {
        //     name: this.resourceService.resolve("cc.list.table.headers.companyName"),
        //     attributeName: "companyName",
        // },
        {
            name: this.resourceService.resolve("cc.list.table.headers.permissions"),
            attributeName: "permissions",
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.rightList;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        rights: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("cc.list.table.headers.notCompleted"),
            attributeName: "notCompletedExemination",
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
            name: this.resourceService.resolve("cc.list.table.headers.hasDebts"),
            attributeName: "isInDebt",
            cellComponent: CheckboxFieldComponent,
            initCellComponentBindingsFactoryFn: (value, row: Full_Model) =>
                (comp: CheckboxFieldComponent) => comp.writeValue(!!row.isInDebt),
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.isInDebt;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        isInDebt: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("cc.list.table.headers.isBanned"),
            attributeName: "isBanned",
            cellComponent: CheckboxFieldComponent,
            initCellComponentBindingsFactoryFn: (value, row: Full_Model) =>
                (comp: CheckboxFieldComponent) => comp.writeValue(!!row.isBanned),
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.isBanned;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        isBanned: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("cc.list.table.headers.isOverused"),
            attributeName: "overuser",
            cellComponent: CheckboxFieldComponent,
            initCellComponentBindingsFactoryFn: (value, row: Full_Model) =>
                (comp: CheckboxFieldComponent) => comp.writeValue(!!row.overuser),
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.overuser;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        overuser: v ?? undefined,
                    });
                });
            },
        },
    ];

    public handleSave$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any> = ({rowData, formValue}) => {
        return this.masterDataManagementService.patientCreateOrUpdatePatientPost({
            businessObjectList: [
                removeNullProperties({
                    ...formValue,
                }),
            ]
        }).pipe(
            map((res) => {
                if (res?.errorMessage) {
                    this.toastrService.error(res?.errorMessage);
                    return [];
                }
                return res.businessObjectList?.[0];
            }),
            catchError((error) => {
                this.toastrService.error(error.message);
                return [];
            }),
            shareReplay(1),
        );
    }

    public handleDelete$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any> = ({gridRowData}) => {
        return this.masterDataManagementService.patientDeletePatientDelete({
            patientIdList: [gridRowData?.patientId!],
        });
    }
}
