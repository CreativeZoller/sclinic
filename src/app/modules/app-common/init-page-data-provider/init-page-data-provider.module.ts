import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InitPageDataProviderService } from "./services/init-page-data-provider.service";


@NgModule({
    declarations: [
        // BaseInitPageResolver,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        // BaseInitPageResolver,
    ],
})
export class InitPageDataProviderModule {

    public static forRoot(): ModuleWithProviders<InitPageDataProviderModule> {
        return {
            ngModule: InitPageDataProviderModule,
            providers: [
                InitPageDataProviderService,
            ],
        };
    };
}
