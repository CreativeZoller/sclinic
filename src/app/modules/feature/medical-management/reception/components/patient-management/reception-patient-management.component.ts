import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { addDays, addHours, addMinutes, startOfDay } from "date-fns";
import { ToastrService } from "ngx-toastr";
import { combineLatest, concat, debounceTime, map, Observable, of, shareReplay, startWith, switchMap, tap } from "rxjs";
import { $enum } from "ts-enum-util";
import { AppointmentStatusEnum, ContactTypeEnum } from "../../../../../../../api/enums";
import { VIPEnum } from "../../../../../../../api/enums/vip.enum";
import { CoreModelsDTOsMedicalManagementMainTablesAppointmentServiceExtensionDTO } from "../../../../../../../api/models";
import { InvoiceManagementService, MasterDataManagementService, MedicalManagementService } from "../../../../../../../api/services";
import { ExpandButtonComponent } from "../../../../../../components/table/expand-button/expand-button.component";
import { TableBulkAction } from "../../../../../../components/table/table/table-bulk-action";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { DatepickerFieldComponent } from "../../../../../app-common/datepicker-field/components/datepicker-field/datepicker-field.component";
import { InitPageDataProviderService } from "../../../../../app-common/init-page-data-provider/services/init-page-data-provider.service";
import { ListComponent } from "../../../../../app-common/list/components/list/list.component";
import { NumberFieldComponent } from "../../../../../app-common/number-field/components/number-field/number-field.component";
import { SelectFieldComponent } from "../../../../../app-common/select-field/components/select-field/select-field.component";
import { TextFieldComponent } from "../../../../../app-common/text-field/components/text-field/text-field.component";
import { TimepickerFieldComponent } from "../../../../../app-common/timepicker-field/components/timepicker-field/timepicker-field.component";
import { BaseFormModalComponent } from "../../../../../app-common/utility/base-form-modal/base-form-modal.directive";
import { UserLoginDataService } from "../../../../../core/auth/services/user-login-data.service";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { FormatTimePipe } from "../../../../../core/utility/pipes/format-time.pipe";
import { AppointmentModel, PatientManagementTableRowModel } from "../../models/patient-management-table-row.model";


@UntilDestroy()
@Component({
    selector: "app-reception-patient-management",
    templateUrl: "./reception-patient-management.component.html",
    styleUrls: ["./reception-patient-management.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceptionPatientManagementComponent {

    private medicalManagementService = inject(MedicalManagementService);
    private masterDataManagementService = inject(MasterDataManagementService);
    private invoiceManagementService = inject(InvoiceManagementService);
    private userLoginDataService = inject(UserLoginDataService);
    private resourceService = inject(ResourceService);
    private toastrService = inject(ToastrService);
    private datePipe = inject(DatePipe);
    private formatTimePipe = inject(FormatTimePipe);

    private initData = inject(InitPageDataProviderService).getInitData(inject(ActivatedRoute).snapshot);

    public baseResourceKey = "reception.tabs.patient.management";
    public tableIdProperty = "_rowId";

    private clinicAppointmentData$ = this.userLoginDataService.getActiveClinicId$().pipe(
        switchMap((clinicId) => {
            return this.medicalManagementService.appointmentGetAppointmentCountByClinicPost({
                clinicId: clinicId ?? undefined,
            });
        }),
        shareReplay(1),
    );

    protected patientCount$ = this.clinicAppointmentData$.pipe(
        map(clinicAppointmentData => clinicAppointmentData.patientCount?.toString()),
        shareReplay(1),
    );

    protected appointmentCount$ = this.clinicAppointmentData$.pipe(
        map(clinicAppointmentData => clinicAppointmentData.appointmentCount?.toString()),
        shareReplay(1),
    );

    protected activeClinicRoomList$ = this.userLoginDataService.getActiveClinicId$().pipe(
        switchMap((clinicId) => this.masterDataManagementService.clinicGetClinicByConditionPost({
            clinicIds: [clinicId!],
            needClinicRooms: true,
        })),
        map((res) => res.businessObjectList?.[0]?.clinicRooms ?? []),
        shareReplay(1),
    );

    @ViewChild("arrivalFormModal") protected arrivalFormModal: BaseFormModalComponent<any>;

    protected arrivalBulkAction: TableBulkAction<PatientManagementTableRowModel> = {
        label: this.resourceService.resolve("reception.tabs.patient.management.list.table.bulk.actions.arrival.management"),
        isHidden: ({ selectedRows }) => {
            return !(selectedRows
                .map(row => row?.patient?.patientId)
                .filter((v, i, arr) => arr.indexOf(v) === i)
                .length === 1
            );
        },
        onClick: ({ selectedRows }) => {
            const patient = selectedRows[0].patient!;

            const patientIsInDebt$ = this.invoiceManagementService.invoiceGetUnpaidInvoicesPost({
                patientId: patient.patientId,
            }).pipe(
                map(res => (res.businessObjectList?.length ?? 0) > 0),
                shareReplay(1),
            );

            const updatePatientIsInDebt$ = (isInDebt: boolean) => this.masterDataManagementService.patientCreateOrUpdatePatientPost({
                businessObjectList: [{ ...patient, isInDebt }],
            }).pipe(
                shareReplay(1),
            );

            this.arrivalFormModal.open(
                patientIsInDebt$.pipe(
                    switchMap((isInDebt) => {
                        if (isInDebt === patient.isInDebt) return of(isInDebt);

                        return updatePatientIsInDebt$(isInDebt).pipe(
                            tap(() => this.listComponent.refreshTableData()),
                            map(() => isInDebt),
                        );
                    }),
                    map((isInDebt) => {
                        patient.isInDebt = isInDebt;

                        if(!isInDebt) return selectedRows[0];

                        this.toastrService.error(
                            this.resourceService.resolve(
                                "reception.tabs.patient.management.arrival.management.form.errors.patient.in.debt.cannot.be.arrived"
                            )
                        );
                        throw new Error("Patient is in debt!");
                    }),
                    shareReplay(1),
                )
            );
        },
    };

    protected bulkActions: TableBulkAction<PatientManagementTableRowModel>[] = [
        this.arrivalBulkAction,
        {
            label: this.resourceService.resolve("reception.tabs.patient.management.list.table.bulk.actions.print.ticketNumber"),
            isHidden: ({ selectedRows }) => {
                return !(
                    selectedRows?.length === 1 && (
                        selectedRows[0].appointment?.ticketNumber?.ticketNumberValue != null
                        || selectedRows[0]._children?.[0]?.appointment?.ticketNumber?.ticketNumberValue != null
                    )
                );
            },
            onClick: ({ selectedRows }) => {
                /* TODO Sorszám nyomtatása */
            },
        },
        {
            label: this.resourceService.resolve("reception.tabs.patient.management.list.table.bulk.actions.history"),
            isHidden: ({ selectedRows }) => {
                // TODO "Előzmények" bulk action: isHidden
                return false;
            },
            onClick: ({ selectedRows }) => {
                // TODO "Előzmények" bulk action: onClick
            },
        },
        {
            label: this.resourceService.resolve("reception.tabs.patient.management.list.table.bulk.actions.contracts"),
            isHidden: ({ selectedRows }) => {
                // TODO "Jogviszonyok" bulk action: isHidden
                return false;
            },
            onClick: ({ selectedRows }) => {
                // TODO "Jogviszonyok" bulk action: onClick
            },
        },
        {
            label: this.resourceService.resolve("reception.tabs.patient.management.list.table.bulk.actions.cancel"),
            isHidden: ({ selectedRows }) => {
                // TODO "Lemondás" bulk action: isHidden
                return false;
            },
            onClick: ({ selectedRows }) => {
                // TODO "Lemondás" bulk action: onClick
            },
        },
        {
            label: this.resourceService.resolve("reception.tabs.patient.management.list.table.bulk.actions.departure.management"),
            isHidden: ({ selectedRows }) => {
                // TODO "Távoztatás" bulk action: isHidden
                return false;
            },
            onClick: ({ selectedRows }) => {
                // TODO "Távoztatás" bulk action: onClick
            },
        },
        {
            label: this.resourceService.resolve("reception.tabs.patient.management.list.table.bulk.actions.debt.settlement"),
            isHidden: ({ selectedRows }) => {
                return !(selectedRows?.length === 1 && selectedRows[0].patient?.isInDebt);
            },
            onClick: ({ selectedRows }) => {
                const patient = selectedRows[0].patient!;

                this.masterDataManagementService.patientCreateOrUpdatePatientPost({
                    businessObjectList: [{ ...patient, isInDebt: false }],
                }).pipe(
                    untilDestroyed(this),
                ).subscribe();
            },
        },
        {
            label: this.resourceService.resolve("reception.tabs.patient.management.list.table.bulk.actions.patient.call"),
            isHidden: ({ selectedRows }) => {
                // TODO "Ügyfélhívás" bulk action: isHidden
                return false;
            },
            onClick: ({ selectedRows }) => {
                // TODO "Ügyfélhívás" bulk action: onClick
            },
        },
    ];

    protected onTableRowClick(row: PatientManagementTableRowModel) {
        this.arrivalBulkAction.onClick?.({
            selectedRowIds: [row._rowId],
            selectedRows: [row],
        });
    }

    public refreshTableData() {
        this.listComponent.refreshTableData();
    }

    protected filterForm = new FormGroup({
        dC_AppointmentStatusIds: new FormGroup({
            [AppointmentStatusEnum.ABSENT]: new FormControl<boolean>(false, { nonNullable: true }),
            [AppointmentStatusEnum.CANCELLED]: new FormControl<boolean>(false, { nonNullable: true }),
            [AppointmentStatusEnum.ARRIVED]: new FormControl<boolean>(false, { nonNullable: true }),
            [AppointmentStatusEnum.BOOKED]: new FormControl<boolean>(false, { nonNullable: true }),
            [AppointmentStatusEnum.UNDER_EXAMINATION]: new FormControl<boolean>(false, { nonNullable: true }),
            [AppointmentStatusEnum.WAITING]: new FormControl<boolean>(false, { nonNullable: true }),
            [AppointmentStatusEnum.EXAMINATION_CLOSED]: new FormControl<boolean>(false, { nonNullable: true }),
            [AppointmentStatusEnum.ALL_EXAMINATION_CLOSED]: new FormControl<boolean>(false, { nonNullable: true }),
            [AppointmentStatusEnum.LEFT]: new FormControl<boolean>(false, { nonNullable: true }),
            [AppointmentStatusEnum.PRE_BOOKING]: new FormControl<boolean>(false, { nonNullable: true }),// Csak belső státusz
            [AppointmentStatusEnum.PRE_BOOKED]: new FormControl<boolean>(false, { nonNullable: true }),// Csak belső státusz
        }),
        startDate: new FormControl<string | undefined>(undefined, { nonNullable: true }),
        patientName: new FormControl<string | undefined>(undefined, { nonNullable: true }),
        patientDateOfBirth: new FormControl<string | undefined>(undefined, { nonNullable: true }),
        patientPhoneNumber: new FormControl<string | undefined>(undefined, { nonNullable: true }),
        patientEmail: new FormControl<string | undefined>(undefined, { nonNullable: true }),
        specialtyName: new FormControl<string | undefined>(undefined, { nonNullable: true }),
        serviceOrServicePackageName: new FormControl<string | undefined>(undefined, { nonNullable: true }),
        medicalEmployeeName: new FormControl<string | undefined>(undefined, { nonNullable: true }),
        servicePrice: new FormControl<number | undefined>(undefined, { nonNullable: true }),
        subContractNumberName: new FormControl<string | undefined>(undefined, { nonNullable: true }),
        floorId: new FormControl<number | undefined>(undefined, { nonNullable: true }),
        roomId: new FormControl<number | undefined>(undefined, { nonNullable: true }),
        ticketNumberValue: new FormControl<number | undefined>(undefined, { nonNullable: true }),
    });

    private filterFormValue$ = this.filterForm.valueChanges.pipe(
        startWith(this.filterForm.value),
        map((filterFormValue) => {
            return {
                ...filterFormValue,
                dC_AppointmentStatusIds: Object.entries(filterFormValue?.dC_AppointmentStatusIds ?? {}).filter(entry => entry[1] === true).map(entry => Number.parseInt(entry[0])),
            };
        }),
    );

    @ViewChild(ListComponent) private listComponent!: ListComponent<PatientManagementTableRowModel>;

    tableHeaders: TableHeader[] = [
        {
            name: "",
            cellComponent: ExpandButtonComponent,
            initCellComponentBindingsFactoryFn: (row: PatientManagementTableRowModel) => {
                return (instance: ExpandButtonComponent) => {
                    instance.expandable = this.getExpandedRowChildRows(row).length > 0;
                    instance.expanded = false;
                    instance.click.pipe(
                        untilDestroyed(this),
                        untilDestroyed(instance),
                    ).subscribe(() => {
                        this.listComponent.toggleExpandRow(row);
                        instance.expanded = !instance.expanded;
                    });
                };
            },
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.list.table.headers.isMissingPatientData"),
            formatterFn: (row: PatientManagementTableRowModel) => `<div class="form-check form-check-custom form-check-solid form-check-sm">
                <input type="checkbox" ${row?.patient?.isMissingPatientData ? "checked" : ""} disabled class="form-check-input">
            </div>`,
            // Not searchable
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.list.table.headers.flags"),
            formatterFn: (row: PatientManagementTableRowModel) => {
                const vipType = this.initData.dC_VIPList.find(item => item.value === row?.patient?.dC_VIPId);
                const vipIconCountMap: Record<VIPEnum, number> = {
                    [VIPEnum["VIP_+"]]: 1,
                    [VIPEnum["VIP_++"]]: 2,
                };
                const vipIconCount = vipIconCountMap[vipType?.value as VIPEnum] ?? 0;

                const isOverUser = row?.patient?.overuser ?? false;
                const isInDebt = row?.patient?.isInDebt ?? false;

                return `
                    <div class="d-flex flex-column gap-3">
                        <div class="d-flex flex-row gap-1 align-items-center">
                            ${Array(vipIconCount).fill(null).map(() => `<i class="bi bi-star-fill star-icon"></i>`).join("\n")}
                        </div>
                        ${!isOverUser ? "" : `
                            <div class="d-flex flex-row gap-1 align-items-center">
                                ${this.resourceService.resolve("reception.tabs.patient.management.list.table.labels.is.over.user")}
                            </div>
                        `}
                        ${!isInDebt ? "" : `
                            <div class="d-flex flex-row gap-1 align-items-center fw-bold text-red">
                                ${this.resourceService.resolve("reception.tabs.patient.management.list.table.labels.is.in.debt")}
                            </div>
                        `}
                    </div>
                `;
            },
            // Not searchable
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.list.table.headers.dC_AppointmentStatusId"),
            formatterFn: (row: PatientManagementTableRowModel) => {
                const dC_AppointmentStatusIdToImageMap: Record<AppointmentStatusEnum, string> = {
                    [AppointmentStatusEnum.ABSENT]: "reception_status_nem_jelent_meg.svg",
                    [AppointmentStatusEnum.CANCELLED]: "reception_status_lemondta.svg",
                    [AppointmentStatusEnum.ARRIVED]: "reception_status_megerkezett.svg",
                    [AppointmentStatusEnum.BOOKED]: "reception_status_elojegyezve.svg",
                    [AppointmentStatusEnum.UNDER_EXAMINATION]: "reception_status_vizsgalaton_van.svg",
                    [AppointmentStatusEnum.WAITING]: "reception_status_varakozo.svg",
                    [AppointmentStatusEnum.EXAMINATION_CLOSED]: "reception_status_vizsgalat_lezarva.svg",
                    [AppointmentStatusEnum.ALL_EXAMINATION_CLOSED]: "reception_status_osszes_vizsgalat_lezarva.svg",
                    [AppointmentStatusEnum.LEFT]: "reception_status_tavozott.svg",
                    [AppointmentStatusEnum.PRE_BOOKING]: "",// Csak belső státusz
                    [AppointmentStatusEnum.PRE_BOOKED]: "",// Csak belső státusz
                };

                const dC_AppointmentStatusId = row?._type === "SERVICE"
                    ? row?.serviceExtension?.dC_AppointmentStatusId
                    : row?.appointment?.dC_AppointmentStatusId;

                const imgFileName = dC_AppointmentStatusIdToImageMap[dC_AppointmentStatusId as AppointmentStatusEnum];

                return !imgFileName ? "" : `<img
                    class="ms-2 svg-icon svg-icon-1 status-icon"
                    src="/assets/images/icons/${imgFileName}"
                    title="${this.resourceService.resolve(`general.enum.img.tooltip.AppointmentStatus.${
                        $enum(AppointmentStatusEnum).getEntries().find(entry => entry[1] === dC_AppointmentStatusId)?.[0]
                    }`)}"
                />`
            },
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.list.table.headers.startDate"),
            formatterFn: (row: PatientManagementTableRowModel) => {
                const startDate = row?.appointment?.startDate
                    ?? row?._children?.[0]?.appointment?.startDate;

                return this.formatTimePipe.transform(startDate ?? "");
            },
            headerSearchComponent: TimepickerFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TimepickerFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterForm.patchValue({
                        startDate: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.list.table.headers.patientName"),
            formatterFn: (row: PatientManagementTableRowModel) => row?.patient?.fullName ?? "",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterForm.patchValue({
                        patientName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.list.table.headers.patientDateOfBirth"),
            formatterFn: (row: PatientManagementTableRowModel) => this.datePipe.transform(row?.patient?.dateOfBirth ?? ""),
            headerSearchComponent: DatepickerFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: DatepickerFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterForm.patchValue({
                        patientDateOfBirth: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.list.table.headers.patientPhoneNumber"),
            formatterFn: (row: PatientManagementTableRowModel) => row
                ?.patient
                ?.patientXContact
                ?.find(c => c.dC_ContactTypeId === ContactTypeEnum.PHONE_NUMBER_1 || c.dC_ContactTypeId === ContactTypeEnum.PHONE_NUMBER_2)
                ?.contactValue
                ?? "",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterForm.patchValue({
                        patientPhoneNumber: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.list.table.headers.patientEmail"),
            formatterFn: (row: PatientManagementTableRowModel) => row
                ?.patient
                ?.patientXContact
                ?.find(c => c.dC_ContactTypeId === ContactTypeEnum.EMAIL_1 || c.dC_ContactTypeId === ContactTypeEnum.EMAIL_2)
                ?.contactValue
                ?? "",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterForm.patchValue({
                        patientEmail: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.list.table.headers.specialtyName"),
            formatterFn: (row: PatientManagementTableRowModel) => row?.appointment?.specialty?.specialtyName ?? "",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterForm.patchValue({
                        specialtyName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.list.table.headers.serviceName"),
            formatterFn: (row: PatientManagementTableRowModel) => row._type === "SERVICE"
                ? row?.serviceExtension?.service?.serviceName : row._type === "SUB_PACKAGE"
                ? row?.subPackage?.servicePackageName : row._type === "PACKAGE"
                ? row?.package?.servicePackageName : "",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterForm.patchValue({
                        serviceOrServicePackageName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.list.table.headers.medicalEmployeeName"),
            formatterFn: (row: PatientManagementTableRowModel) => row?.appointment?.medicalEmployee?.fullName ?? "",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterForm.patchValue({
                        medicalEmployeeName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.list.table.headers.price"),
            formatterFn: (row: PatientManagementTableRowModel) => row.serviceExtension?.servicePrice,
            headerSearchComponent: NumberFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: NumberFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.hideStepping = true;
                instance.registerOnChange((v) => {
                    this.filterForm.patchValue({
                        servicePrice: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.list.table.headers.subContractNumberName"),
            formatterFn: (row: PatientManagementTableRowModel) => row.serviceExtension?.subContractNumber?.name,
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterForm.patchValue({
                        subContractNumberName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.list.table.headers.floor"),
            formatterFn: (row: PatientManagementTableRowModel) => this.initData.dC_FloorList.find(item => item.value === row?.appointment?.room?.dC_FloorId)?.name,
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = this.initData.dC_FloorList;
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterForm.patchValue({
                        floorId: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.list.table.headers.room"),
            formatterFn: (row: PatientManagementTableRowModel) => row?.appointment?.room?.roomNumber,
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                this.activeClinicRoomList$.pipe(
                    untilDestroyed(instance),
                    untilDestroyed(this),
                ).subscribe((activeClinicRoomList) => {
                    instance.options = activeClinicRoomList.map((dto) => ({
                        value: dto.clinicRoomId!,
                        name: dto.roomNumber?.toString()!,
                    })),
                    instance.cdr.markForCheck();
                });
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterForm.patchValue({
                        roomId: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.list.table.headers.ticketNumber"),
            formatterFn: (row: PatientManagementTableRowModel) => {
                return row?.appointment?.ticketNumber?.ticketNumberValue
                    ?? row?._children?.[0]?.appointment?.ticketNumber?.ticketNumberValue;
            },
            headerSearchComponent: NumberFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: NumberFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.hideStepping = true;
                instance.registerOnChange((v) => {
                    this.filterForm.patchValue({
                        ticketNumberValue: v ?? undefined,
                    });
                });
            },
        },
    ];

    public getExpandedRowChildRows = (row: PatientManagementTableRowModel): PatientManagementTableRowModel[]  => {
        return row._children ?? [];
    }

    public getRowClasses = (row: PatientManagementTableRowModel, expandedRows: PatientManagementTableRowModel[]): string[] => {
        if (row._level === 1 && !expandedRows.includes(row)) {
            return [];
        } else {
            return [`expanded-row-bg-color-lvl-${row._level}`];
        }
    }

    public getTableData$: () => Observable<PatientManagementTableRowModel[]> = () => {
        return combineLatest([
            this.filterFormValue$,
            this.userLoginDataService.getActiveClinicId$(),
        ]).pipe(
            debounceTime(200),
            switchMap(([filterData, clinicId]) => {
                const timeStr = filterData?.startDate?.match(/.*T(?<time>\d\d\:\d\d).*/)?.groups?.["time"];
                const hours = parseInt(timeStr?.split(":")[0] ?? "0")
                const minutes = parseInt(timeStr?.split(":")[1] ?? "0")

                const startDate = addMinutes(
                    addHours(
                        startOfDay(new Date()),
                        hours
                    ),
                    minutes,
                );
                const endDate = addDays(startDate, 1);

                return concat(
                    of(undefined as any),
                    this.medicalManagementService.appointmentGetAppointmentsByConditionWithPatientDataCheckPost({
                        ...filterData,
                        startDate: undefined,
                        intervalStartDate: startDate.toISOString(),
                        intervalEndDate: endDate.toISOString(),
                        clinicId: clinicId ?? undefined,
                        needClinic: true,
                        needService: true,
                        needServicePackage: true,
                        needRoom: true,
                        needAppointmentServiceExtension: true,
                        needMedicalEmployee: true,
                        needPatient: true,
                        needPatientXContact: true,
                        needSpecialty: true,
                        needsTicketNumber: true,
                        needSubContractNumber: true,
                    }).pipe(
                        map((res) => {
                            function getRowIdPart(node: PatientManagementTableRowModel) {
                                let id: any;

                                switch(node._type) {
                                    case "PATIENT":
                                        id = node.patient?.patientId;
                                        break;
                                    case "PACKAGE":
                                        id = node.package?.servicePackageId;
                                        break;
                                    case "SUB_PACKAGE":
                                        id = node.subPackage?.servicePackageId;
                                        break;
                                    case "SERVICE":
                                        id = node.serviceExtension?.serviceId;
                                        break;
                                }

                                return `${node._type}-${id}`;
                            }

                            function getRowId(node: PatientManagementTableRowModel) {
                                const rowIdParts: string[] = [];
                                while(node != null) {
                                    rowIdParts.push(getRowIdPart(node));

                                    node = node._parent!;
                                }

                                return rowIdParts.join("/");
                            }

                            function mapAppointmentServiceEntries(
                                serviceExtensionList: CoreModelsDTOsMedicalManagementMainTablesAppointmentServiceExtensionDTO[],
                                parentNode?: PatientManagementTableRowModel,
                            ): PatientManagementTableRowModel[] {
                                return serviceExtensionList.map((s) => {
                                    const node = <PatientManagementTableRowModel>{
                                        ...parentNode,
                                        _type: "SERVICE",
                                        _level: (parentNode?._level ?? 0) + 1,
                                        _children: [],
                                        _parent: parentNode,
                                        serviceExtension: s,
                                    };
                                    node._rowId = getRowId(node);

                                    return node;
                                });
                            }

                            function mapAppointmentSubServicePackageEntries(
                                serviceExtensionList: CoreModelsDTOsMedicalManagementMainTablesAppointmentServiceExtensionDTO[],
                                parentNode?: PatientManagementTableRowModel,
                            ): PatientManagementTableRowModel[] {
                                const subServicePackagesChildrenMap: Record<number, CoreModelsDTOsMedicalManagementMainTablesAppointmentServiceExtensionDTO[]> = {};

                                for(const s of serviceExtensionList) {
                                    subServicePackagesChildrenMap[s.subServicePackageId!] = [
                                        ...(subServicePackagesChildrenMap[s.subServicePackageId!] ?? []),
                                        s,
                                    ];
                                }

                                return Object.values(subServicePackagesChildrenMap).map((children) => {
                                    const subServicePackage = children[0].subServicePackage;

                                    const node = <PatientManagementTableRowModel>{
                                        ...parentNode,
                                        _type: "SUB_PACKAGE",
                                        _level: (parentNode?._level ?? 0) + 1,
                                        subPackage: subServicePackage,
                                        _children: [],
                                        _parent: parentNode,
                                    };
                                    node._rowId = getRowId(node);
                                    node._children = [
                                        ...mapAppointmentServiceEntries(children, node),
                                    ];

                                    return node;
                                });
                            }

                            function mapAppointmentServicePackageEntries(
                                serviceExtensionList: CoreModelsDTOsMedicalManagementMainTablesAppointmentServiceExtensionDTO[],
                                parentNode?: PatientManagementTableRowModel,
                            ): PatientManagementTableRowModel[] {
                                const servicePackagesChildrenMap: Record<number, CoreModelsDTOsMedicalManagementMainTablesAppointmentServiceExtensionDTO[]> = {};

                                for(const s of serviceExtensionList) {
                                    servicePackagesChildrenMap[s.servicePackageId!] = [
                                        ...(servicePackagesChildrenMap[s.servicePackageId!] ?? []),
                                        s,
                                    ];
                                }

                                return Object.values(servicePackagesChildrenMap).map((children) => {
                                    const servicePackage = children[0].servicePackage;

                                    const node = <PatientManagementTableRowModel>{
                                        ...parentNode,
                                        _type: "PACKAGE",
                                        _level: (parentNode?._level ?? 0) + 1,
                                        servicePackage: servicePackage,
                                        _children: [],
                                        _parent: parentNode,
                                    };
                                    node._rowId = getRowId(node);
                                    node._children = [
                                        ...mapAppointmentSubServicePackageEntries(
                                            children.filter(s => (s.subServicePackageId ?? 0) > 0),
                                            node,
                                        ),
                                        ...mapAppointmentServiceEntries(
                                            children.filter(s => (s.subServicePackageId ?? 0) === 0),
                                            node,
                                        ),
                                    ];

                                    return node;
                                });
                            }

                            const appointmentList = (res?.appointmentWithDataCheckList ?? [])
                                .sort((a, b) => {
                                    if (!a.appointment?.startDate || !b.appointment?.startDate) {
                                        return 0;
                                    }
                                    return new Date(a.appointment.startDate).getTime() - new Date(b.appointment.startDate).getTime();
                                })
                                .map(appointmentWithedDataCheck => ({
                                    ...appointmentWithedDataCheck.appointment,
                                    isMissingPatientData: appointmentWithedDataCheck.isMissingPatientData,
                                }));



                            const patientIdToAppointmentsMap: Record<number, AppointmentModel[]> = {};
                            for(const appointment of appointmentList) {
                                patientIdToAppointmentsMap[appointment.patientId!] = [
                                    ...(patientIdToAppointmentsMap[appointment.patientId!] ?? []),
                                    appointment,
                                ];
                            }

                            return Object.values(patientIdToAppointmentsMap).map((appointmentList) => {
                                const patient: AppointmentModel = appointmentList[0].patient!;
                                patient.isMissingPatientData = appointmentList.some(a => a.isMissingPatientData);

                                const patientNode = <PatientManagementTableRowModel>{
                                    _type: "PATIENT",
                                    _level: 1,
                                    _originalAppointmentList: appointmentList,
                                    patient: patient,
                                };
                                patientNode._rowId = getRowId(patientNode);

                                patientNode._children = appointmentList.flatMap((appointment) => {
                                    const appointmentNode = {
                                        ...patientNode,
                                        appointment: appointment,
                                    };

                                    return [
                                        ...mapAppointmentServicePackageEntries(
                                            (appointment.appointmentServiceExtension ?? []).filter(s => (s.servicePackageId ?? 0) > 0),
                                            appointmentNode,
                                        ),
                                        ...mapAppointmentSubServicePackageEntries(
                                            (appointment?.appointmentServiceExtension ?? []).filter(s => (s.servicePackageId ?? 0) === 0 && (s.subServicePackageId ?? 0) > 0),
                                            appointmentNode,
                                        ),
                                        ...mapAppointmentServiceEntries(
                                            (appointment?.appointmentServiceExtension ?? []).filter(s => (s.servicePackageId ?? 0) === 0 && (s.subServicePackageId ?? 0) === 0),
                                            appointmentNode,
                                        ),
                                    ];
                                });

                                // Nem kell group by patient ha csak 1 van alatta
                                return patientNode._children.length === 1
                                    ? patientNode._children[0]
                                    : patientNode;
                            });
                        }),
                    ),
                );
            }),
        );
    }

    public openEditorFor() {
        this.listComponent.openEditorFor();
    }

    constants = {
        AppointmentStatusEnum: AppointmentStatusEnum,
    }
}
