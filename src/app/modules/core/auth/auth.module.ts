import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HasPermissionPipe } from "./pipes/has-permission-pipe";

import { AuthService } from "./services/auth.service";
import { UserDataService } from "./services/user-data.service";
import { UserLoginDataService } from "./services/user-login-data.service";
import { RoleService } from "./services/role.service";
import { PermissionService } from "./services/permission.service";
import { LoggedInGuard } from "./guards/logged-in.guard";
import { LoggedOutGuard } from "./guards/logged-out.guard";
import { HasPermissionGuard } from "./guards/has-permission.guard";
import { HasActivatedRoleGuard } from "./guards/has-activated-role.guard";
import { HasMultipleActivatableRolesGuard } from "./guards/has-multiple-activatable-roles.guard";


@NgModule({
    declarations: [
        HasPermissionPipe,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        HasPermissionPipe,
    ],
})
export class AuthModule {

    public static forRoot(): ModuleWithProviders<AuthModule> {
        return {
            ngModule: AuthModule,
            providers: [
                AuthService,
                UserDataService,
                UserLoginDataService,
                RoleService,
                PermissionService,
                LoggedInGuard,
                LoggedOutGuard,
                HasPermissionGuard,
                HasActivatedRoleGuard,
                HasMultipleActivatableRolesGuard,
            ],
        };
    };
}
