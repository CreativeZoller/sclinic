import { ModuleWithProviders, NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { UnauthorizedInterceptor } from "../auth/http-interceptors/unauthorized.interceptor";
import { AuthRequestInterceptor } from "../auth/http-interceptors/auth-request.interceptor";
import { ServerErrorInterceptor } from "../error-handler/http-interceptors/server-error.interceptor";
import { RequestErrorInterceptor } from "../error-handler/http-interceptors/request-error.interceptor";
import { InsufficientPermissionsInterceptor } from "../auth/http-interceptors/insufficient-permissions.interceptor";
import { ResponseTransformerInterceptor } from "../auth/http-interceptors/response-transformer.interceptor";
import { CommonModule } from "@angular/common";


@NgModule({
    imports: [
        CommonModule,
    ],
})
export class HttpInterceptorModule {

    public static forRoot(): ModuleWithProviders<HttpInterceptorModule> {
        return {
            ngModule: HttpInterceptorModule,
            providers: [
                //Request handlers - executed from top to bottom
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthRequestInterceptor,
                    multi: true,
                },

                //Response handlers - executed from bottom to top
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: InsufficientPermissionsInterceptor,
                    multi: true,
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: UnauthorizedInterceptor,
                    multi: true,
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: RequestErrorInterceptor,
                    multi: true,
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: ServerErrorInterceptor,
                    multi: true,
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: ResponseTransformerInterceptor,
                    multi: true,
                },
            ],
        };
    };
}
