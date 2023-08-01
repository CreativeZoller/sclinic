import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AUTHORITIES_ROUTE, CONFIGURATIONS_ROUTE, DIVISION_NUMBERS_ROUTE, FUNCTIONS_ROUTE, ROLES_ROUTE, USERS_ROUTE } from "../../../app.config";
import { SystemModule } from "./system.module";
import { UserListComponent } from "./users/components/list/user-list.component";
import { UsersInitPageResolver } from "./users/resolvers/users-init-page.resolver";
import { RoleListComponent } from "./roles/components/list/role-list.component";
import { AuthorityListComponent } from "./authorities/components/list/authority-list.component";
import { FunctionListComponent } from "./functions/components/list/function-list.component";
import { FunctionsInitPageResolver } from "./functions/resolvers/functions-init-page.resolver";
import { ConfigurationListComponent } from "./configurations/components/list/configuration-list.component";
import { DivisionNumberListComponent } from "./division-numbers/components/list/division-number-list.component";
import { DivisionNumbersInitPageResolver } from "./division-numbers/resolvers/division-numbers-init-page.resolver";


const routes: Routes = [
    {
        path: USERS_ROUTE,
        component: UserListComponent,
        resolve: {
            init: UsersInitPageResolver,
        },
    },
    {
        path: ROLES_ROUTE,
        component: RoleListComponent,
    },
    {
        path: AUTHORITIES_ROUTE,
        component: AuthorityListComponent,
    },
    {
        path: FUNCTIONS_ROUTE,
        component: FunctionListComponent,
        resolve: {
            init: FunctionsInitPageResolver,
        },
    },
    {
        path: CONFIGURATIONS_ROUTE,
        component: ConfigurationListComponent,
    },
    {
        path: DIVISION_NUMBERS_ROUTE,
        component: DivisionNumberListComponent,
        resolve: {
            init: DivisionNumbersInitPageResolver,
        },
    },
];

@NgModule({
    imports: [
        SystemModule,
        RouterModule.forChild(routes),
    ],
    exports: [
        SystemModule,
        RouterModule,
    ],
})
export class SystemRoutingModule { }
