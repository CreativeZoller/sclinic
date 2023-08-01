import { ModuleWithProviders, NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { ConfirmDialogComponent } from "./components/confirm-dialog.component";
import { ConfirmDialogService } from "./services/confirm-dialog.service";
import { CommonModule } from "@angular/common";
import { DynamicComponentModule } from "../../../components/dynamic-component/dynamic-component.module";


@NgModule({
    declarations: [
        ConfirmDialogComponent,
    ],
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        DynamicComponentModule,
    ],
    exports: [
        ConfirmDialogComponent,
    ],
})
export class ConfirmDialogModule {

    public static forRoot(): ModuleWithProviders<ConfirmDialogModule> {
        return {
            ngModule: ConfirmDialogModule,
            providers: [
                ConfirmDialogService,
            ],
        };
    }
}
