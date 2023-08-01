import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseListFieldComponent } from "../../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { AppointmentModel } from "../../../../models/patient-management-table-row.model";
import { FormatTimePipe } from "../../../../../../../core/utility/pipes/format-time.pipe";
import { CoreModelsDTOsMasterDataMainTablesClinicRoomDTO, CoreModelsDTOsMasterDataMainTablesPatientDTO } from "../../../../../../../../../api/models";
import { ObserveInput } from "../../../../../../../core/utility/decorators/observe-input.decorator";
import { BehaviorSubject } from "rxjs";


type Full_Model = AppointmentModel;

@UntilDestroy()
@Component({
    selector: "app-reception-patient-arrival-management-appointment-service-list-field",
    templateUrl: "./reception-patient-arrival-management-appointment-service-list-field.component.html",
    styleUrls: ["./reception-patient-arrival-management-appointment-service-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ReceptionPatientArrivalManagementAppointmentServiceListFieldComponent extends BaseListFieldComponent<Full_Model> {

    private formatTimePipe = inject(FormatTimePipe);

    public baseResourceKey = "reception.tabs.patient.management.arrival.management.appointment.service";
    public tableIdProperty = "appointmentId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.arrival.management.appointment.service.list.table.headers.startDate"),
            formatterFn: (row: Full_Model) => this.formatTimePipe.transform(row?.startDate ?? ""),
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.arrival.management.appointment.service.list.table.headers.floor"),
            formatterFn: (row: Full_Model) => this.initData.dC_FloorList.find(item => item.value === row?.room?.dC_FloorId)?.name,
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.arrival.management.appointment.service.list.table.headers.room"),
            formatterFn: (row: Full_Model) => row?.room?.roomNumber,
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.arrival.management.appointment.service.list.table.headers.isNotCompleted"),
            formatterFn: (row: Full_Model) => `<div class="form-check form-check-custom form-check-solid form-check-sm">
                <input type="checkbox" ${row?.appointmentServiceExtension?.[0]?.isCompleted === false ? "checked" : ""} disabled class="form-check-input">
            </div>`,
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.arrival.management.appointment.service.list.table.headers.specialtyName"),
            formatterFn: (row: Full_Model) => row?.specialty?.specialtyName ?? "",
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.arrival.management.appointment.service.list.table.headers.serviceName"),
            formatterFn: (row: Full_Model) => row?.appointmentServiceExtension?.[0]?.service?.serviceName,
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.arrival.management.appointment.service.list.table.headers.medicalEmployeeName"),
            formatterFn: (row: Full_Model) => row?.medicalEmployee?.fullName,
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.arrival.management.appointment.service.list.table.headers.price"),
            formatterFn: (row: Full_Model) => row?.appointmentServiceExtension?.[0]?.servicePrice,
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.arrival.management.appointment.service.list.table.headers.subContractNumberName"),
            formatterFn: (row: Full_Model) => row?.appointmentServiceExtension?.[0]?.subContractNumber?.name,
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.arrival.management.appointment.service.list.table.headers.costBearer.partner"),
            formatterFn: (row: Full_Model) => row.appointmentCostBearer?.map(c => c?.partner?.partnerName)?.join(", "),
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.arrival.management.appointment.service.list.table.headers.costBearer.number"),
            formatterFn: (row: Full_Model) => row.appointmentCostBearer?.map(c => c?.costBearerNumber)?.join(", "),
        },
    ];

    @Input() activeClinicRoomList: CoreModelsDTOsMasterDataMainTablesClinicRoomDTO[];
    @ObserveInput("activeClinicRoomList") activeClinicRoomList$: BehaviorSubject<typeof this.activeClinicRoomList>;

    @Input() patient: CoreModelsDTOsMasterDataMainTablesPatientDTO;
    @ObserveInput("patient") patient$: BehaviorSubject<typeof this.patient>;
}
