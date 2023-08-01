import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BehaviorSubject, map, shareReplay, tap } from "rxjs";
import { PatientIdTypeEnum } from "../../../../../../../../api/enums/patientId-type.enum";
import { CoreModelsDTOsMasterDataMainTablesClinicRoomDTO } from "../../../../../../../../api/generated/authentication/model/coreModelsDTOsMasterDataMainTablesClinicRoomDTO";
import { CoreModelsDTOsMasterDataMainTablesPartnerDTO, CoreModelsMasterDataPatientCreateOrUpdatePatientResponse } from "../../../../../../../../api/models";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { BaseFormModalComponent } from "../../../../../../app-common/utility/base-form-modal/base-form-modal.directive";
import { UserLoginDataService } from "../../../../../../core/auth/services/user-login-data.service";
import { ObserveInput } from "../../../../../../core/utility/decorators/observe-input.decorator";
import { removeNullProperties } from "../../../../../../core/utility/methods/remove-null-properties";
import { CostBearerModel } from "../../../models/appointment-cost-bearer.model";
import { AppointmentModel, PatientManagementTableRowModel } from "../../../models/patient-management-table-row.model";


type Full_Model = PatientManagementTableRowModel;
type Full_Model_Appointment = NonNullable<Full_Model["appointment"]>;
type Full_Model_Patient = NonNullable<Full_Model["patient"]>;
type Full_Model_Patient_ID = NonNullable<Full_Model_Patient["patientXPatientIdType"]>[0];

@UntilDestroy()
@Component({
    selector: "app-reception-patient-arrival-management-form",
    templateUrl: "./reception-patient-arrival-management-form.component.html",
    styleUrls: ["./reception-patient-arrival-management-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceptionPatientArrivalManagementFormComponent extends BaseFormComponent<any> {

    public errorResourceKeyPrefix = "reception.tabs.patient.management.arrival.management.form.errors";

    private masterDataManagementService = inject(MasterDataManagementService);
    private userLoginDataService = inject(UserLoginDataService);

    public form = new FormGroup({
        patient: new FormGroup({
            // Azonosító
            patientId: new FormControl<Full_Model_Patient["patientId"]>(undefined, {nonNullable: true, validators: []}),

            // Páciens neve
            fullName: new FormControl<Full_Model_Patient["fullName"]>({ disabled: true, value: undefined }, {nonNullable: true, validators: []}),
            // *Páciens igazolványok
            patientXPatientIdType: new FormControl<Full_Model_Patient["patientXPatientIdType"]>({ disabled: true, value: [] }, {nonNullable: true, validators: []}),
            // Azonosító típusa
            patientIdTypeId: new FormControl<Full_Model_Patient_ID["dC_PatientIdTypeId"]>({ disabled: true, value: undefined }, {nonNullable: true, validators: []}),
            // Azonosító száma
            patientIdNumber: new FormControl<Full_Model_Patient_ID["number"]>({ disabled: true, value: undefined }, {nonNullable: true, validators: []}),

            // Születési hely
            placeOfBirth: new FormControl<Full_Model_Patient["placeOfBirth"]>({ disabled: true, value: undefined }, {nonNullable: true, validators: []}),
            // Születési dátum
            dateOfBirth: new FormControl<Full_Model_Patient["dateOfBirth"]>({ disabled: true, value: undefined }, {nonNullable: true, validators: []}),
            // Anyja neve
            motherName: new FormControl<Full_Model_Patient["motherName"]>({ disabled: true, value: undefined }, {nonNullable: true, validators: []}),
        }),

        appointment: new FormGroup({
            // Beküldő
            recommenderPartner: new FormControl<Full_Model_Appointment["recommenderPartner"]>({ disabled: false, value: undefined }, {nonNullable: true, validators: []}),
            // Foglaló rendszer
            dC_BookingAreaId: new FormControl<Full_Model_Appointment["dC_BookingAreaId"]>({ disabled: true, value: undefined }, {nonNullable: true, validators: []}),
            // Webshop számlaszám
            webshopInvoiceNumber: new FormControl<Full_Model_Appointment["webshopInvoiceNumber"]>({ disabled: true, value: undefined }, {nonNullable: true, validators: []}),
            // Webshopban már befizetett összeg
            webshopPaidAmount: new FormControl<Full_Model_Appointment["webshopPaidAmount"]>({ disabled: true, value: undefined }, {nonNullable: true, validators: []}),

            // Elkésett
            isLate: new FormControl<Full_Model_Appointment["isLate"]>({ disabled: false, value: false }, {nonNullable: true, validators: []}),
            // Előjegyzés nelkül érkezett
            isWithoutAppointment: new FormControl<Full_Model_Appointment["isWithoutAppointment"]>({ disabled: false, value: false }, {nonNullable: true, validators: []}),
            // Nem hozta a szükséges bizonylatot
            isWithoutRequiredReceipt: new FormControl<Full_Model_Appointment["isWithoutRequiredReceipt"]>({ disabled: false, value: false }, {nonNullable: true, validators: []}),
            // Hibás rögzítés
            isIncorrectRecording: new FormControl<Full_Model_Appointment["isIncorrectRecording"]>({ disabled: false, value: false }, {nonNullable: true, validators: []}),
            // Nem tudott többet várni
            isUnableToWait: new FormControl<Full_Model_Appointment["isUnableToWait"]>({ disabled: false, value: false }, {nonNullable: true, validators: []}),
            // Értékelhetetlen magatartású
            isIncomprehensibleBehaviour: new FormControl<Full_Model_Appointment["isIncomprehensibleBehaviour"]>({ disabled: false, value: false }, {nonNullable: true, validators: []}),

            // Megjegyzés
            remarks: new FormControl<Full_Model_Appointment["remarks"]>({ disabled: true, value: undefined }, {nonNullable: true, validators: []}),

            // Sorszám
            ticketNumber: new FormControl<Full_Model_Appointment["ticketNumber"]>({ disabled: true, value: undefined }, {nonNullable: true, validators: []}),
        }),

        appointmentList: new FormControl<Full_Model["_originalAppointmentList"]>([], {nonNullable: true, validators: []}),
    });

    partnerAutocomplete = {
        searhcFn$: (value: string) => {
            return this.masterDataManagementService.partnerGetPartnerByConditionPost({
                companyName: value,
                fullName: value,
                needPartnerData: true,
                needBisnode: false,
            }).pipe(
                map((res) => res?.businessObjectList ?? []),
                shareReplay(1),
            );
        },

        getFormattedSelectText: (v: CoreModelsDTOsMasterDataMainTablesPartnerDTO) => v?.company?.fullName ?? v?.patient?.fullName ?? "",

        getFormattedInputText: (v: CoreModelsDTOsMasterDataMainTablesPartnerDTO) => v?.company?.fullName ?? v?.patient?.fullName ?? "",
    };

    private lastEditorData: PatientManagementTableRowModel | undefined | null;
    @Input() public set editorData(data: PatientManagementTableRowModel | undefined | null) {
        this.lastEditorData = data;
        while (data?._parent != null) data = data._parent; // Get root node

        const patientIdSSN = data?.patient?.patientXPatientIdType?.find(pi => pi.dC_PatientIdTypeId === PatientIdTypeEnum.SocialSecurityNumber);

        super.editorData = <this["form"]["value"]>{
            ...data,
            patient: {
                ...data?.patient,
                patientIdNumber: patientIdSSN?.number,
                patientIdTypeId: patientIdSSN?.dC_PatientIdTypeId,
            },
            appointment: {
                ...data?._children?.[0]?.appointment,
                ticketNumber: data?._children?.[0]?.appointment?.ticketNumber?.ticketNumberValue,
            },
            appointmentList: data?._originalAppointmentList,
        };
    };

    public formValueToRequestValue(value: typeof this.form.value): AppointmentModel[] {
        return (value.appointmentList ?? []).map((updatedAppointment: AppointmentModel) => {
            const initialAppointment = (this.initialEditorData$.value._originalAppointmentList ?? []).find((ap: AppointmentModel) => ap.appointmentId === updatedAppointment?.appointmentId);

            return <AppointmentModel>{
                ...initialAppointment,
                ...updatedAppointment,
                recommenderPartner: undefined,
                recommenderPartnerId: value.appointment?.recommenderPartner?.partnerId,
                isLate: value.appointment?.isLate,
                isWithoutAppointment: value.appointment?.isWithoutAppointment,
                isWithoutRequiredReceipt: value.appointment?.isWithoutRequiredReceipt,
                isIncorrectRecording: value.appointment?.isIncorrectRecording,
                isUnableToWait: value.appointment?.isUnableToWait,
                isIncomprehensibleBehaviour: value.appointment?.isIncomprehensibleBehaviour,
                clinic: undefined,
                clinicId: this.userLoginDataService.getActiveClinicId(),
                patient: undefined,
                patientId: initialAppointment.patient?.patientId,
                _floorId: undefined,
                specialtyId: updatedAppointment?.specialty?.specialtyId,
                specialty: undefined,
                medicalEmployeeId: updatedAppointment?.medicalEmployee?.medicalEmployeeId,
                medicalEmployee: undefined,
                roomId: updatedAppointment?.room?.clinicRoomId,
                room: undefined,
                dC_AppointmentStatus: undefined,
                ticketNumber: undefined,
                appointmentCart: undefined,
                dC_BookingArea: undefined,
                appointmentServiceExtension: [{
                    ...initialAppointment?.appointmentServiceExtension?.[0],
                    ...updatedAppointment?.appointmentServiceExtension?.[0],
                    appointmentId: updatedAppointment?.appointmentId,
                    appointment: undefined,
                    consultation: undefined,
                    service: undefined,
                    servicePackage: undefined,
                    subServicePackage: undefined,
                    dC_AppointmentStatus: undefined,
                    dC_AppointmentCancellation: undefined,
                    dC_CancellationStatus: undefined,
                    subContractNumber: undefined,
                    accountTransaction: undefined,
                    accountBalance: (() => {
                        const _accountBalance = removeNullProperties({
                            ...initialAppointment?.appointmentServiceExtension?.[0]?.accountBalance,
                            ...updatedAppointment?.appointmentServiceExtension?.[0].accountBalance,
                        });

                        return Object.keys(_accountBalance).length > 0 ? _accountBalance : undefined;
                    })(),
                }],
                appointmentItem: undefined,
                appointmentDocument: undefined,
                appointmentCostBearer: (updatedAppointment?.appointmentCostBearer ?? []).map(updatedCostBearer => {
                    const initialCostBearer = (updatedAppointment?.appointmentCostBearer ?? []).find((cb: CostBearerModel) => cb.appointmentCostBearerId === updatedCostBearer?.appointmentCostBearerId);

                    return {
                        ...initialCostBearer,
                        ...updatedCostBearer,
                        appointmentId: updatedAppointment?.appointmentId,
                        partnerId: updatedCostBearer.partner?.partnerId,
                        partner: undefined,
                    };
                }),
            };
        });
    }

    @ViewChild("patientFormModal") protected patientFormModal: BaseFormModalComponent<any>;

    openPatientEditor() {
        const patientId = this.form.value.patient?.patientId;
        if (patientId != null && patientId > 0) {
            const patient$ = this.masterDataManagementService.patientGetPatientsByConditionPost({
                patientIds: [ this.form.value.patient?.patientId! ],
                needsPatientXPatient: true,
                needsPatientXAddress: true,
                needsPatientXContact: true,
                needsPatientXEmployment: true,
                needsPatientXDC_Language: true,
                needsPatientInsuranceDetail: true,
                needsPatientXPatientId: true,
            }).pipe(
                map(res => res.businessObjectList?.[0]),
            );

            const originalHandleSave$ = this.patientFormModal.formModalComponent.handleSave$;
            this.patientFormModal.formModalComponent.handleSave$ = (...args) => {
                return originalHandleSave$(...args).pipe(
                    tap((res: CoreModelsMasterDataPatientCreateOrUpdatePatientResponse) => {
                        const editorData = <PatientManagementTableRowModel>{ ...this.lastEditorData };
                        Object.assign(editorData.patient!, res.businessObjectList?.[0]);

                        this.editorData = editorData;

                        this.afterPatientSaved.emit();
                    }),
                    shareReplay(1),
                );
            }
            this.patientFormModal?.open(patient$);
        }
    }

    @Output() afterPatientSaved = new EventEmitter<void>();

    @Input() activeClinicRoomList: CoreModelsDTOsMasterDataMainTablesClinicRoomDTO[];
    @ObserveInput("activeClinicRoomList") activeClinicRoomList$: BehaviorSubject<typeof this.activeClinicRoomList>;
}
