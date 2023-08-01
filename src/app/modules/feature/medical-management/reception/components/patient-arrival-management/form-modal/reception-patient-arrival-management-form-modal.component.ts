import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BehaviorSubject, tap } from "rxjs";
import { CoreModelsDTOsMasterDataMainTablesClinicRoomDTO } from "../../../../../../../../api/generated/authentication/model/coreModelsDTOsMasterDataMainTablesClinicRoomDTO";
import { MedicalManagementService } from "../../../../../../../../api/services";
import { BaseFormModalComponent } from "../../../../../../app-common/utility/base-form-modal/base-form-modal.directive";
import { ObserveInput } from "../../../../../../core/utility/decorators/observe-input.decorator";
import { AppointmentModel, PatientManagementTableRowModel } from "../../../models/patient-management-table-row.model";


@UntilDestroy()
@Component({
    selector: "app-reception-patient-arrival-management-form-modal",
    templateUrl: "./reception-patient-arrival-management-form-modal.component.html",
    styleUrls: ["./reception-patient-arrival-management-form-modal.component.scss"],
})
export class ReceptionPatientArrivalManagementFormModalComponent extends BaseFormModalComponent {

    private medicalManagementService = inject(MedicalManagementService);

    @Output() afterSaved = new EventEmitter<void>();
    @Output() afterPatientSaved = new EventEmitter<void>();

    public handleSave$ = (appointmentList: AppointmentModel[]) => {
        const initFormValue: PatientManagementTableRowModel = this.formModalComponent.initFormValue;
        const appointmentIdListToDelete = initFormValue._originalAppointmentList
            .map(ap => ap.appointmentId!)
            .filter(appointmentId => !appointmentList.some(ap => ap.appointmentId === appointmentId));

        return this.medicalManagementService.appointmentArrivalSetArrivedPost({
            appointmentList: appointmentList,
            appointmentIdListToDelete: appointmentIdListToDelete,
        }).pipe(
            tap({
                next: () => this.afterSaved.next(),
            }),
        );
    }

    @Input() activeClinicRoomList: CoreModelsDTOsMasterDataMainTablesClinicRoomDTO[];
    @ObserveInput("activeClinicRoomList") activeClinicRoomList$: BehaviorSubject<typeof this.activeClinicRoomList>;
}
