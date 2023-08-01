import { APP_INITIALIZER, ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ResourceService } from "./services/resource.service";
import { ResolveResourcePipe } from "./pipes/resolve-resource.pipe";
import { CanResolveResourcePipe } from "./pipes/can-resolve-resource.pipe";
import { LanguageModule } from "../language/language.module";


@NgModule({
    declarations: [
        ResolveResourcePipe,
        CanResolveResourcePipe,
    ],
    imports: [
        CommonModule,
        LanguageModule,
    ],
    exports: [
        ResolveResourcePipe,
        CanResolveResourcePipe,
    ],
})
export class ResourceModule {

    static forRoot(): ModuleWithProviders<ResourceModule> {
        return {
            ngModule: ResourceModule,
            providers: [
                ResourceService,
                {
                    provide: APP_INITIALIZER,
                    useFactory: (resourceService: ResourceService) => {
                        return () => {
                            return resourceService.waitLoadingResources$();
                        };
                    },
                    multi: true,
                    deps: [ResourceService],
                },
            ]
        };
    }
}
