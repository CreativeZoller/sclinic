import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseListFieldComponent } from "../../../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { CostBearerModel } from "../../../../../models/appointment-cost-bearer.model";


type Full_Model = CostBearerModel;

@UntilDestroy()
@Component({
    selector: "app-reception-patient-arrival-management-appointment-service-cost-bearer-list-field",
    templateUrl: "./reception-patient-arrival-management-appointment-service-cost-bearer-list-field.component.html",
    styleUrls: ["./reception-patient-arrival-management-appointment-service-cost-bearer-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ReceptionPatientArrivalManagementAppointmentServiceCostBearerListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "reception.tabs.patient.management.arrival.management.appointment.service.cost.bearer";
    public tableIdProperty = "appointmentCostBearerId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.arrival.management.appointment.service.cost.bearer.list.table.headers.partner"),
            formatterFn: (row: Full_Model) => row?.partner?.partnerName,
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.arrival.management.appointment.service.cost.bearer.list.table.headers.costBearerNumber"),
            formatterFn: (row: Full_Model) => row?.costBearerNumber,
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.arrival.management.appointment.service.cost.bearer.list.table.headers.amount"),
            formatterFn: (row: Full_Model) => `${row?.amount} ${this.resourceService.resolve("general.currency.HUF")}`,
        },
    ];
}
