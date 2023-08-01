import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HasActivatedRoleGuard } from "./modules/core/auth/guards/has-activated-role.guard";
import { LoggedInGuard } from "./modules/core/auth/guards/logged-in.guard";
import { routes as loginRoutes } from "./modules/feature/login/login-routing.module";
import { LoginRoutingModule } from "./modules/feature/login/login-routing.module";
import { routes as errorsRoutes } from "./modules/feature/errors/errors-routing.module";
import { ErrorsRoutingModule } from "./modules/feature/errors/errors-routing.module";
import { GlobalInitPageResolver } from "./modules/app-common/init-page-data-provider/resolvers/global-init-page.resolvers";


export const routes: Routes = [
    {
        path: "",
        canActivate: [LoggedInGuard, HasActivatedRoleGuard],
        resolve: {
            init: GlobalInitPageResolver,
        },
        loadChildren: () => import("./_metronic/layout/layout.module").then((m) => m.LayoutModule),
    },
    ...loginRoutes,
    ...errorsRoutes,
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        LoginRoutingModule,
        ErrorsRoutingModule,
    ],
    exports: [
        RouterModule,
        LoginRoutingModule,
        ErrorsRoutingModule,
    ],
})
export class AppRoutingModule {}
