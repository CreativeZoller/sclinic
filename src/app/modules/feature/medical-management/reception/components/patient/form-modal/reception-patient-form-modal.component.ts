import { Component, inject } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { Observable } from "rxjs";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { ModalComponent } from "../../../../../../../_metronic/partials";
import { BaseFormModalComponent } from "../../../../../../app-common/utility/base-form-modal/base-form-modal.directive";


@UntilDestroy()
@Component({
    selector: "app-reception-patient-form-modal",
    templateUrl: "./reception-patient-form-modal.component.html",
    styleUrls: ["./reception-patient-form-modal.component.scss"],
})
export class ReceptionPatientFormModalComponent extends BaseFormModalComponent {

    private masterDataManagementService = inject(MasterDataManagementService);

    public handleSave$ = (formValue: any, modal: ModalComponent) => {
        return this.masterDataManagementService.patientCreateOrUpdatePatientPost({
            businessObjectList: [ formValue ],
        });
    }
}
