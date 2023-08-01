import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, of, shareReplay, startWith, switchMap } from "rxjs";
import { MedicalEmployeeTypeEnum } from "../../../../../../../../../api/enums";
import { CoreModelsDTOsFinanceManagementMainTablesSubContractNumberDTO, CoreModelsDTOsMasterDataMainTablesClinicRoomDTO, CoreModelsDTOsMasterDataMainTablesMedicalEmployeeDTO, CoreModelsDTOsMasterDataMainTablesPatientDTO, CoreModelsDTOsMasterDataMainTablesServiceDTO, CoreModelsDTOsMasterDataMainTablesSpecialtyDTO } from "../../../../../../../../../api/models";
import { MasterDataManagementService } from "../../../../../../../../../api/services";
import { BaseFormComponent } from "../../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { ObserveInput } from "../../../../../../../core/utility/decorators/observe-input.decorator";
import { SelectOption } from "../../../../../../../core/utility/types/select-option";
import { UnArray } from "../../../../../../../core/utility/types/un-array";
import { AppointmentModel } from "../../../../models/patient-management-table-row.model";


type Full_Model = AppointmentModel;
type Full_Model_Room = NonNullable<Full_Model["room"]>;
type Full_Model_ServiceExtension = UnArray<Full_Model["appointmentServiceExtension"]>;
type Full_Model_ServiceExtension_AccountBalance = NonNullable<Full_Model_ServiceExtension["accountBalance"]>;

@UntilDestroy()
@Component({
    selector: "app-reception-patient-arrival-management-appointment-service-form",
    templateUrl: "./reception-patient-arrival-management-appointment-service-form.component.html",
    styleUrls: ["./reception-patient-arrival-management-appointment-service-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceptionPatientArrivalManagementAppointmentServiceFormComponent extends BaseFormComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);

    @Input() activeClinicRoomList: CoreModelsDTOsMasterDataMainTablesClinicRoomDTO[];
    @ObserveInput("activeClinicRoomList") activeClinicRoomList$!: BehaviorSubject<typeof this.activeClinicRoomList>;

    @Input() patient: CoreModelsDTOsMasterDataMainTablesPatientDTO;
    @ObserveInput("patient") patient$!: BehaviorSubject<typeof this.patient>;

    public errorResourceKeyPrefix = "reception.tabs.patient.management.arrival.management.appointment.service.form.errors";

    public form = new FormGroup({
        appointmentId: new FormControl<Full_Model["appointmentId"]>(0, { nonNullable: true, validators: []}),
        // Szakma
        specialty: new FormControl<Full_Model["specialty"]>(undefined, { nonNullable: true, validators: [Validators.required]}),
        // Orvos
        medicalEmployee: new FormControl<Full_Model["medicalEmployee"]>(undefined, { nonNullable: true, validators: [Validators.required]}),
        // Idő
        startDate: new FormControl<Full_Model["startDate"]>(undefined, { nonNullable: true, validators: [Validators.required]}),
        // Emelet
        _floorId: new FormControl<Full_Model_Room["dC_FloorId"]>(undefined, { nonNullable: true, validators: [Validators.required]}),
        // Szoba
        room: new FormControl<Full_Model["room"]>(undefined, { nonNullable: true, validators: [Validators.required]}),

        appointmentServiceExtension: new FormArray([
            new FormGroup({
                appointmentServiceExtensionId: new FormControl<Full_Model_ServiceExtension["appointmentServiceExtensionId"]>(undefined, { nonNullable: true, validators: []}),
                // Szolgáltatás
                service: new FormControl<Full_Model_ServiceExtension["service"]>(undefined, { nonNullable: true, validators: [Validators.required]}),
                // Szerződés
                subContractNumber: new FormControl<Full_Model_ServiceExtension["subContractNumber"]>(undefined, { nonNullable: true, validators: []}),
                // Ár
                servicePrice: new FormControl<Full_Model_ServiceExtension["servicePrice"]>(undefined, { nonNullable: true, validators: []}),
                // Érv.
                isValid: new FormControl(false, { nonNullable: true, validators: []}),
                accountBalance: new FormGroup({
                    accountBalanceId: new FormControl<Full_Model_ServiceExtension_AccountBalance["accountBalanceId"]>(undefined, { nonNullable: true, validators: []}),
                    // Egyenleg
                    quantity: new FormControl<Full_Model_ServiceExtension_AccountBalance["quantity"]>(undefined, { nonNullable: true, validators: []}),
                }),
                // El végzett?
                isCompleted: new FormControl<Full_Model_ServiceExtension["isCompleted"]>(undefined, { nonNullable: true, validators: []}),
            }),
        ]),

        // Költségátvállalók
        appointmentCostBearer: new FormControl<Full_Model["appointmentCostBearer"]>([], { nonNullable: true, validators: [] }),
    });

    floorOptions$ = this.activeClinicRoomList$.pipe(
        map((rooms) => rooms
            .flatMap(r => r.dC_FloorId)
            .filter((v, i, arr) => arr.indexOf(v) === i)
            .map((floorId) => this.initData.dC_FloorList.find((item) => item.value === floorId)!),
        ),
        shareReplay(1),
    );
    roomOptions$ = combineLatest([
        this.activeClinicRoomList$,
        this.form.controls._floorId.valueChanges.pipe(
            startWith(this.form.controls._floorId.value),
        ),
    ]).pipe(
        map(([rooms, selectedFloorId]) => rooms
            .filter(r => r.dC_FloorId === selectedFloorId)
            .map(r => (<SelectOption>{
                name: r.name,
                value: r,
                idProperty: "clinicRoomId",
            }))
        ),
        shareReplay(1),
    )

    private patientSubContractNumberList$ = this.patient$.pipe(
        switchMap((patient) => {
            const patientId = patient?.patientId;

            if (patientId == null) return of([]);
            else return this.masterDataManagementService.partnerGetSubContractNumbersForPartnerPost({
                patientId: patient.patientId,
            }).pipe(
                map((res) => res?.businessObjectList ?? []),
                shareReplay(1),
            );
        }),
        shareReplay(1),
    );
    subContractNumberAutocomplete = {
        searchFn: (value: string) => {
            return this.patientSubContractNumberList$.pipe(
                map((list) => list.filter(row => row.name?.toLowerCase().includes(value.toLowerCase()))),
                shareReplay(1),
            );
        },

        getFormattedSelectText: (v: CoreModelsDTOsFinanceManagementMainTablesSubContractNumberDTO) => v?.name ?? "",

        getFormattedInputText: (v: CoreModelsDTOsFinanceManagementMainTablesSubContractNumberDTO) => v?.name ?? "",
    }

    specialtyAutocomplete = {
        searchFn: (value: string) => {
            return this.masterDataManagementService.specialtyGetSpecialtyByConditionPost({
                specialtyName: value,
            }).pipe(
                map((res) => res?.businessObjectList ?? []),
                shareReplay(1),
            );
        },

        getFormattedSelectText: (v: CoreModelsDTOsMasterDataMainTablesSpecialtyDTO) => v?.specialtyName ?? "",

        getFormattedInputText: (v: CoreModelsDTOsMasterDataMainTablesSpecialtyDTO) => v?.specialtyName ?? "",
    }

    serviceAutocomplete = {
        searchFn: (value: string) => {
            return this.masterDataManagementService.specialtyGetSpecialtyByConditionPost({
                specialtyIds: [ this.form.value.specialty?.specialtyId! ],
                needsServices: true,
            }).pipe(
                map((res) => res?.businessObjectList ?? []),
                map((specialtyList) => {
                    return specialtyList
                        .flatMap(specialty => specialty.specialtyXService ?? [])
                        .map(v => v.service!)
                        .filter((v, i, arr) => arr.findIndex(v2 => v2?.serviceId === v?.serviceId) === i)
                        .filter(v => v?.serviceName?.toLowerCase()?.includes(value.toLowerCase()))
                }),
                shareReplay(1),
            );
        },

        getFormattedSelectText: (v: CoreModelsDTOsMasterDataMainTablesServiceDTO) => v?.serviceName ?? "",

        getFormattedInputText: (v: CoreModelsDTOsMasterDataMainTablesServiceDTO) => v?.serviceName ?? "",
    }

    medicalEmployeeAutocomplete = {
        searchFn: (value: string) => {
            return this.masterDataManagementService.medicalEmployeeGetMedicalEmployeeByConditionPost({
                fullName: value,
                serviceIdList: [ this.form.value.appointmentServiceExtension?.[0]?.service?.serviceId! ],
                dC_MedicalEmployeeTypeId: MedicalEmployeeTypeEnum.DOCTOR,
            }).pipe(
                map(res => res?.businessObjectList ?? []),
                shareReplay(1),
            );
        },

        getFormattedSelectText: (v: CoreModelsDTOsMasterDataMainTablesMedicalEmployeeDTO) => v?.fullName ?? "",

        getFormattedInputText: (v: CoreModelsDTOsMasterDataMainTablesMedicalEmployeeDTO) => v?.fullName ?? "",
    };

    constructor() {
        super();

        this.form.controls.specialty.valueChanges.pipe(
            distinctUntilChanged((a, b) => a?.specialtyId === b?.specialtyId),
            untilDestroyed(this),
        ).subscribe((specialty) => {
            const serviceControl = this.form.controls.appointmentServiceExtension.controls[0].controls.service;
            if (!this.skipResetingFields) serviceControl.reset();

            if (specialty == null) {
                if (!serviceControl.disabled) serviceControl.disable();
            } else {
                if (!serviceControl.enabled) serviceControl.enable();
            }
        });

        this.form.controls.appointmentServiceExtension.controls[0].controls.service.valueChanges.pipe(
            distinctUntilChanged((a, b) => a?.serviceId === b?.serviceId),
            untilDestroyed(this),
        ).subscribe((service) => {
            const medicalEmployeeControl = this.form.controls.medicalEmployee;
            if (!this.skipResetingFields) medicalEmployeeControl.reset();

            if (service == null) {
                if (!medicalEmployeeControl.disabled) medicalEmployeeControl.disable();
            } else {
                if (!medicalEmployeeControl.enabled) medicalEmployeeControl.enable();
            }
        });

        this.form.controls._floorId.valueChanges.pipe(
            distinctUntilChanged(),
            untilDestroyed(this),
        ).subscribe((floorId) => {
            const roomControl = this.form.controls.room;
            if (!this.skipResetingFields) roomControl.reset();

            if (floorId == null) {
                if (!roomControl.disabled) roomControl.disable();
            } else {
                if (!roomControl.enabled) roomControl.enable();
            }
        });
    }

    public setFormValue(data: Full_Model | null | undefined): void {
        super.setFormValue(<Full_Model>{
            ...data,
            _floorId: data?.room?.dC_FloorId,
        });
    }

    openCalendarView() {
        // TODO open calendar view
    }
}
