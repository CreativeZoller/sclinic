import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { map, shareReplay } from "rxjs";
import { MasterDataManagementService } from "../../../../../../../../../../api/services";
import { BaseFormComponent } from "../../../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { CostBearerModel } from "../../../../../models/appointment-cost-bearer.model";


type Full_Model = CostBearerModel;

@UntilDestroy()
@Component({
    selector: "app-reception-patient-arrival-management-appointment-service-cost-bearer-form",
    templateUrl: "./reception-patient-arrival-management-appointment-service-cost-bearer-form.component.html",
    styleUrls: ["./reception-patient-arrival-management-appointment-service-cost-bearer-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceptionPatientArrivalManagementAppointmentServiceCostBearerFormComponent extends BaseFormComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);

    public errorResourceKeyPrefix = "reception.tabs.patient.management.arrival.management.appointment.service.cost.bearer.form.errors";

    public form = new FormGroup({
        appointmentCostBearerId: new FormControl<Full_Model["appointmentCostBearerId"]>(0, { nonNullable: true, validators: []}),
        appointmentId: new FormControl<Full_Model["appointmentId"]>(undefined, { nonNullable: true, validators: []}),
        partnerId: new FormControl<Full_Model["partnerId"]>(undefined, { nonNullable: true, validators: []}),
        // Biztosító
        partner: new FormControl<Full_Model["partner"]>(undefined, { nonNullable: true, validators: [Validators.required]}),
        // Költségátvállaló száma
        costBearerNumber: new FormControl<Full_Model["costBearerNumber"]>(undefined, { nonNullable: true, validators: [Validators.required]}),
        // Összeg
        amount: new FormControl<Full_Model["amount"]>(undefined, { nonNullable: true, validators: [Validators.required]}),
    });

    partnerAutocomplete = {
        searchFn$: (value: string) => {
            return this.masterDataManagementService.partnerGetPartnerByConditionPost({
                companyName: value,
                fullName: value,
                needPartnerData: true,
                needBisnode: false,
            }).pipe(
                map((res) => res?.businessObjectList?.map(row => {
                    return <NonNullable<Full_Model["partner"]>>{
                        ...row,
                        partnerName: row.company?.fullName ?? row.patient?.fullName ?? "",
                    };
                }) ?? []),
                shareReplay(1),
            );
        },

        getFormattedSelectText: (v: NonNullable<Full_Model["partner"]>) => v?.partnerName ?? "",

        getFormattedInputText: (v: NonNullable<Full_Model["partner"]>) => v?.partnerName ?? "",
    };

    public formValueToRequestValue(_value: Full_Model): Full_Model {
        const value: this["form"]["value"] = _value;

        return {
            ...this.initialEditorData$.value,
            ...value,
        }
    }
}
