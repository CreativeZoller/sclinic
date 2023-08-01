import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ModalsModule } from "../../../_metronic/partials/layout/modals/modals.module";
import { InlineSVGModule } from "ng-inline-svg-2";

import { CoreModule } from "../../core/core.module";
import { AppCommonModule } from "../../app-common/app-common.module";
import { SharedModule } from "../../shared/shared.module";
import { LoginComponent } from "./components/login/login.component";
import { LoginLanguageSelectorComponent } from "./components/login-language-selector/login-language-selector.component";
import { ForgotPasswordFormComponent } from "./components/forgot-password/form/forgot-password-form.component";
import { ForgotPasswordFormModalComponent } from "./components/forgot-password/form-modal/forgot-password-form-modal.component";
import { NewPasswordFormComponent } from "./components/new-password/form/new-password-form.component";
import { NewPasswordFormModalComponent } from "./components/new-password/form-modal/new-password-form-modal.component";
import { LostTokenFormComponent } from "./components/lost-token/form/lost-token-form.component";
import { LostTokenFormModalComponent } from "./components/lost-token/form-modal/lost-token-form-modal.component";
import { RoleSelectComponent } from "./components/role-select/role-select.component";
import { LoginSecondFactorFormComponent } from "./components/login-second-factor-form/login-second-factor-form.component";


@NgModule({
    declarations: [
        LoginComponent,
        LoginSecondFactorFormComponent,
        LoginLanguageSelectorComponent,
        ForgotPasswordFormComponent,
        ForgotPasswordFormModalComponent,
        NewPasswordFormComponent,
        NewPasswordFormModalComponent,
        LostTokenFormComponent,
        LostTokenFormModalComponent,
        RoleSelectComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModalsModule,
        InlineSVGModule,
        SharedModule,
        CoreModule,
        AppCommonModule,
    ],
    exports: [
        LoginComponent,
        LoginSecondFactorFormComponent,
        LoginLanguageSelectorComponent,
        ForgotPasswordFormComponent,
        ForgotPasswordFormModalComponent,
        NewPasswordFormComponent,
        NewPasswordFormModalComponent,
        LostTokenFormComponent,
        LostTokenFormModalComponent,
        RoleSelectComponent,
    ],
})
export class LoginModule {}
