import { Component, inject } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { AuthenticationWebServiceService } from "../../../../../../../api/services";
import { LostTokenFormData } from "../models/lost-token-form-data.model";
import { BaseFormModalComponent } from "../../../../../app-common/utility/base-form-modal/base-form-modal.directive";


@UntilDestroy()
@Component({
    selector: "app-lost-token-form-modal",
    templateUrl: "./lost-token-form-modal.component.html",
    styleUrls: ["./lost-token-form-modal.component.scss"],
})
export class LostTokenFormModalComponent extends BaseFormModalComponent<LostTokenFormData> {

    private authenticationWebServiceService = inject(AuthenticationWebServiceService);

    public handleSave$ = (formValue: LostTokenFormData) => {
        return this.authenticationWebServiceService.googleAuthenticatorCreateGoogleAuthenticatorTokenPost({
            ...formValue
        });
    }
}
