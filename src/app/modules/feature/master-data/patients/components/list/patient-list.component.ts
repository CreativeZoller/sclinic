import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { BehaviorSubject, concat, debounceTime, map, Observable, of, shareReplay, switchMap, tap } from "rxjs";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { Patient, Grid_Patient } from "../../models/patient.model";
import { MasterDataManagementService } from "../../../../../../../api/services";
import { removeNullProperties } from "../../../../../core/utility/methods/remove-null-properties";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";
import { ActivatedRoute } from "@angular/router";
import { InitPageData } from "../../../../../app-common/init-page-data-provider/models/init-page-data.model";
import { MaskPipe } from "ngx-mask";
import { DatePipe } from "@angular/common";
import { CoreModelsMasterDataPatientGetPatientsByConditionRequest } from "../../../../../../../api/models";
import { SelectFieldComponent } from "../../../../../app-common/select-field/components/select-field/select-field.component";
import { TextFieldComponent } from "../../../../../app-common/text-field/components/text-field/text-field.component";
import { DatepickerFieldComponent } from "../../../../../app-common/datepicker-field/components/datepicker-field/datepicker-field.component";
import { PaginationConfig } from "../../../../../../components/table/pagination/pagination.component";


type Grid_Model = Grid_Patient;
type Full_Model = Patient;

@UntilDestroy()
@Component({
    selector: "app-patient-list",
    templateUrl: "./patient-list.component.html",
    styleUrls: ["./patient-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientListComponent {

    private masterDataManagementService = inject(MasterDataManagementService);
    private resourceService = inject(ResourceService);
    private activatedRoute = inject(ActivatedRoute);
    private datePipe = inject(DatePipe);
    private maskPipe = inject(MaskPipe);

    private initData = this.activatedRoute.snapshot.data["init"] as InitPageData;

    public baseResourceKey = "patient";
    public tableIdProperty = "patientId";

    private filterData$ = new BehaviorSubject<CoreModelsMasterDataPatientGetPatientsByConditionRequest>({});

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("patient.list.table.headers.dC_TitleTypeId"),
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
            name: this.resourceService.resolve("patient.list.table.headers.surname"),
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
            name: this.resourceService.resolve("patient.list.table.headers.firstname"),
            attributeName: "firstname",
            formatterFn: (v, row: Grid_Patient) => {
                const isDeceased = row?.isDeceased ?? false;
                // TODO VIP státusz formázás: ezt rendesen is be kellene kötni, mert jelenleg nincs vizsgálva milyen VIP státuszban van, hanem mindegyiket egyformán kezeljük
                const vipType = this.initData.dC_VIPList.find(item => item.value === row?.dC_VIPId);
                const vipIconCount = vipType == null
                    ? 0
                    : vipType?.name?.includes("++")// TODO vip keyword
                        ? 2
                        : 1;

                return `
                    <div class="d-flex flex-row gap-3 align-items-center">
                        <span>${v ?? ""}</span>
                        <div class="d-flex flex-row gap-1 align-items-center">
                            ${!isDeceased ? `` : `<img class="grave-icon" src="/assets/images/icons/deceased.svg" />`}
                            ${isDeceased ? `` : Array(vipIconCount).fill(null).map(() => `<i class="bi bi-star-fill star-icon"></i>`).join("\n")}
                        </div>
                    </div>
                `;
            },
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
            name: this.resourceService.resolve("patient.list.table.headers.ssn"),
            attributeName: "ssn",
            formatterFn: (value) => this.maskPipe.transform(value ?? "", "AAA-AAA-A*"),
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        socialSecurityNumber: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("patient.list.table.headers.dateOfBirth"),
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
            name: this.resourceService.resolve("patient.list.table.headers.placeOfBirth"),
            attributeName: "placeOfBirth",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        placeOfBirth: v ?? undefined,
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

    public handleSave$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any> = ({rowData, formValue}) => {
        return this.masterDataManagementService.patientCreateOrUpdatePatientPost({
            businessObjectList: [
                removeNullProperties({
                    ...formValue,
                }),
            ],
        }).pipe(
            map((res) => res.businessObjectList?.[0]),
            shareReplay(1),
        );
    }

    public handleDelete$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any> = ({gridRowData}) => {
        return this.masterDataManagementService.patientDeletePatientDelete({
            patientIdList: [ gridRowData?.patientId! ],
        });
    }
}
