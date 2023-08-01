import { APP_INITIALIZER, ModuleWithProviders, NgModule } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Meta } from "@angular/platform-browser";
import { AuthModule } from "./auth/auth.module";
import { ErrorHandlerModule } from "./error-handler/error-handler.module";
import { HttpInterceptorModule } from "./http-interceptors/http-interceptors.module";
import { LanguageModule } from "./language/language.module";
import { ResourceModule } from "./resource/resource.module";
import { UtilityModule } from "./utility/utility.module";


@NgModule({
    imports: [
        AuthModule,
        ErrorHandlerModule,
        HttpInterceptorModule,
        LanguageModule,
        ResourceModule,
        UtilityModule,
    ],
    exports: [
        AuthModule,
        ErrorHandlerModule,
        HttpInterceptorModule,
        LanguageModule,
        ResourceModule,
        UtilityModule,
    ],
})
export class CoreModule {

    public static forRoot(): ModuleWithProviders<CoreModule> {
        return {
            ngModule: CoreModule,
            providers: [
                {
                    provide: APP_INITIALIZER,
                    useFactory: (meta: Meta) => {
                        return () => {
                            // A frontendi alkalmazás verziójának hozzáadása mint meta tag
                            if (meta != null) {
                                if (environment.appVersion != null)
                                    meta.addTag({ id: "appVersion", name: "appVersion", content: environment.appVersion });
                                if (environment.appBuildDateTime != null)
                                    meta.addTag({ id: "appBuildDateTime", name: "appBuildDateTime", content: environment.appBuildDateTime });
                            }
                        }
                    },
                    multi: true,
                    deps: [Meta],
                },
                ...AuthModule.forRoot().providers ?? [],
                ...ErrorHandlerModule.forRoot().providers ?? [],
                ...HttpInterceptorModule.forRoot().providers ?? [],
                ...LanguageModule.forRoot().providers ?? [],
                ...ResourceModule.forRoot().providers ?? [],
                ...UtilityModule.forRoot().providers ?? [],
            ],
        };
    }
}
