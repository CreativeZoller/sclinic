import { Component, inject } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { AuthenticationWebServiceService } from "../../../../../../../api/services";
import { NewPasswordFormData } from "../models/new-password-form-data.model";
import { BaseFormModalComponent } from "../../../../../app-common/utility/base-form-modal/base-form-modal.directive";
import { ActivatedRoute } from "@angular/router";
import { ROUTE_NEW_PASSWORD_TOKEN_QUERY_PARAM_KEY } from "../../../../../../app.config";


@UntilDestroy()
@Component({
    selector: "app-new-password-form-modal",
    templateUrl: "./new-password-form-modal.component.html",
    styleUrls: ["./new-password-form-modal.component.scss"],
})
export class NewPasswordFormModalComponent extends BaseFormModalComponent<NewPasswordFormData> {

    private activatedRoute = inject(ActivatedRoute);
    private authenticationWebServiceService = inject(AuthenticationWebServiceService);

    public handleSave$ = (formValue: NewPasswordFormData) => {
        return this.authenticationWebServiceService.userSetPasswordPost({
            setPasswordToken: this.activatedRoute.snapshot.queryParams[ROUTE_NEW_PASSWORD_TOKEN_QUERY_PARAM_KEY],
            newPassword: {
                password: formValue.newPassword!
            },
        });
    }
}
