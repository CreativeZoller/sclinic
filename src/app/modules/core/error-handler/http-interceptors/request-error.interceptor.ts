import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";


@Injectable()
export class RequestErrorInterceptor implements HttpInterceptor {

    private toastrService = inject(ToastrService);

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const requestErrorCodes = [
            400, // Bad request
        ];

        return next.handle(request).pipe(
            tap({
                error: (error: HttpErrorResponse) => {
                    if (requestErrorCodes.includes(error.status)) {
                        this.toastrService.error(error.error.errorMessage);
                    }
                },
            }),
        );
    }
}
