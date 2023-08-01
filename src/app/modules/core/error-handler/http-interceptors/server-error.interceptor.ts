import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { SERVER_ERROR_ROUTE } from "../../../../app.config";


@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

    private router = inject(Router);

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap({
                error: (error: HttpErrorResponse) => {
                    if (error.status > 499 && error.status < 600) {
                        this.router.navigate([SERVER_ERROR_ROUTE]);
                    }
                },
            }),
        );
    }
}
