import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ToastrModule } from "ngx-toastr";


@NgModule({
    imports: [
        CommonModule,
        ToastrModule,
    ],
})
export class ErrorHandlerModule {

    public static forRoot(): ModuleWithProviders<ErrorHandlerModule> {
        return {
            ngModule: ErrorHandlerModule,
            providers: [
                ...ToastrModule.forRoot({
                    disableTimeOut: true,
                    positionClass: "toast-bottom-left",
                }).providers ?? [],
            ],
        };
    };
}
