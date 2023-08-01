import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { ErrorsModule } from "./errors.module";
import { INSUFFICIENT_PERMISSIONS_ROUTE, PAGE_NOT_FOUND_ROUTE, SERVER_ERROR_ROUTE } from "../../../app.config";
import { ErrorsComponent } from "./components/errors/errors.component";
import { ErrorPageNotFoundComponent } from "./components/error-page-not-found/error-page-not-found.component";
import { ErrorServerErrorComponent } from "./components/error-server-error/error-server-error.component";
import { ErrorInsufficientPermissionsComponent } from "./components/error-insufficient-permissions/error-insufficient-permissions.component";


export const routes: Routes = [
    {
        path: PAGE_NOT_FOUND_ROUTE,
        pathMatch: "full",
        component: ErrorsComponent,
        children: [
            {
                path: "",
                component: ErrorPageNotFoundComponent,
            },
        ],
    },
    {
        path: SERVER_ERROR_ROUTE,
        pathMatch: "full",
        component: ErrorsComponent,
        children: [
            {
                path: "",
                component: ErrorServerErrorComponent,
            },
        ],
    },
    {
        path: INSUFFICIENT_PERMISSIONS_ROUTE,
        pathMatch: "full",
        component: ErrorsComponent,
        children: [
            {
                path: "",
                component: ErrorInsufficientPermissionsComponent,
            },
        ],
    },
    { path: "**", redirectTo: PAGE_NOT_FOUND_ROUTE, pathMatch: "full" },
];

@NgModule({
    imports: [
        ErrorsModule,
    ],
    exports: [
        ErrorsModule,
    ],
})
export class ErrorsRoutingModule { }
