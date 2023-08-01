import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";

import { ErrorsComponent } from './components/errors/errors.component';
import { ErrorPageNotFoundComponent } from "./components/error-page-not-found/error-page-not-found.component";
import { ErrorServerErrorComponent } from "./components/error-server-error/error-server-error.component";
import { ErrorInsufficientPermissionsComponent } from "./components/error-insufficient-permissions/error-insufficient-permissions.component";


@NgModule({
    declarations: [
        ErrorsComponent,
        ErrorPageNotFoundComponent,
        ErrorServerErrorComponent,
        ErrorInsufficientPermissionsComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
    ],
    exports: [
        ErrorsComponent,
        ErrorPageNotFoundComponent,
        ErrorServerErrorComponent,
        ErrorInsufficientPermissionsComponent,
    ],
})
export class ErrorsModule {}
