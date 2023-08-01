import { inject, Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";


@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {

    private authService = inject(AuthService);

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap({
                error: (error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        this.authService.logout(true);
                    }
                },
            }),
        );
    }
}
