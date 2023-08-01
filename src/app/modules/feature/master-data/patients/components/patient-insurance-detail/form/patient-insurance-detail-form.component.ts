import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { map, shareReplay } from "rxjs";
import { CoreModelsDTOsMasterDataMainTablesPartnerDTO } from "../../../../../../../../api/models";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { PatientXInsuranceDetail } from "../../../models/patient-x-insurance-detail.model";


type Full_Model = PatientXInsuranceDetail;

@UntilDestroy()
@Component({
    selector: "app-patient-insurance-detail-form",
    templateUrl: "./patient-insurance-detail-form.component.html",
    styleUrls: ["./patient-insurance-detail-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientInsuranceDetailFormComponent extends BaseFormComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);

    public errorResourceKeyPrefix = "patient.insurance.detail.form.errors";

    public form = new FormGroup({
        // Biztosító neve
        partner: new FormControl<Full_Model["partner"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Biztosítási azonosító
        identificationNumber: new FormControl<Full_Model["identificationNumber"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Egészségpénztár?
        isEP: new FormControl<Full_Model["isEP"]>(false, { nonNullable: true, validators: [] }),
    });

    partnerSearhcFn = (value: string) => {
        return this.masterDataManagementService.partnerGetPartnerByConditionPost({
            needPartnerData: true,
            companyName: value || "",
            needBisnode: false,
        }).pipe(
            map((res) => res?.businessObjectList ?? []),
            shareReplay(1),
        );
    }

    formatPartnerForAutocompleteResult(v: CoreModelsDTOsMasterDataMainTablesPartnerDTO) {
        return v?.company?.fullName ?? "";
    }

    getPartnerName(v: CoreModelsDTOsMasterDataMainTablesPartnerDTO): string {
        return v?.company?.fullName ?? "";
    }

    public formValueToRequestValue(value: Full_Model): Full_Model {
        return {
            ...value,
            partner: undefined,
            partnerId : value?.partner?.partnerId,
        };
    }
}
