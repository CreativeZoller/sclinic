import { Component, inject } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { AuthenticationWebServiceService } from "../../../../../../../api/services";
import { ForgotPasswordFormData } from "../models/forgot-password-form-data.model";
import { BaseFormModalComponent } from "../../../../../app-common/utility/base-form-modal/base-form-modal.directive";
import { map, shareReplay } from "rxjs";


@UntilDestroy()
@Component({
    selector: "app-forgot-password-form-modal",
    templateUrl: "./forgot-password-form-modal.component.html",
    styleUrls: ["./forgot-password-form-modal.component.scss"],
})
export class ForgotPasswordFormModalComponent extends BaseFormModalComponent<ForgotPasswordFormData> {

    private authenticationWebServiceService = inject(AuthenticationWebServiceService);

    public handleSave$ = (formValue: ForgotPasswordFormData) => {
        return this.authenticationWebServiceService.userCreateOrUpdatePasswordChangeRequestPost({
            ...formValue
        }).pipe(
            map((res) => res.success),
            shareReplay(1),
        );
    }
}
