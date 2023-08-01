import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { LOGIN_ROUTE, ROLE_SELECT_ROUTE } from "../../../app.config";
import { LoginComponent } from "./components/login/login.component";
import { RoleSelectComponent } from "./components/role-select/role-select.component";
import { HasMultipleActivatableRolesGuard } from "../../core/auth/guards/has-multiple-activatable-roles.guard";
import { LoggedInGuard } from "../../core/auth/guards/logged-in.guard";
import { LoggedOutGuard } from "../../core/auth/guards/logged-out.guard";
import { LoginModule } from "./login.module";


export const routes: Routes = [
    {
        path: LOGIN_ROUTE,
        component: LoginComponent,
        canActivate: [LoggedOutGuard],
    },
    {
        path: ROLE_SELECT_ROUTE,
        component: RoleSelectComponent,
        canActivate: [LoggedInGuard, HasMultipleActivatableRolesGuard],
    },
];

@NgModule({
    imports: [
        LoginModule,
    ],
    exports: [
        LoginModule,
    ],
})
export class LoginRoutingModule {}
