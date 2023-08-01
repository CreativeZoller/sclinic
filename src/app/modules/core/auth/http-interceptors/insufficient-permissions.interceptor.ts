import { inject, Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { INSUFFICIENT_PERMISSIONS_ROUTE } from "../../../../app.config";


@Injectable()
export class InsufficientPermissionsInterceptor implements HttpInterceptor {

    private router = inject(Router);

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap({
                error: (error: HttpErrorResponse) => {
                    if (error.status === 403) {
                        this.router.navigate([INSUFFICIENT_PERMISSIONS_ROUTE]);
                    }
                },
            }),
        );
    }
}
