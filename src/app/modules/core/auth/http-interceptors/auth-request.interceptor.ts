import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AUTH_TOKEN_HTTP_HEADER } from "../../../../app.config";
import { AuthService } from "../services/auth.service";


@Injectable()
export class AuthRequestInterceptor implements HttpInterceptor {

    private authService = inject(AuthService);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let headers = req.headers
        let body = req.body;

        //Note: Nincs executing userid az alábbi kéréseknél, de ez nem okoz problémát
            // POST /DC/GetDCTableDTO
            // POST /DC/CreateOrUpdateDictionaryEntries
            // GET /Macro/GetMacroByID

        // Set JWT token
        const token = this.authService.getToken();
        if (token != null) headers = headers.set(AUTH_TOKEN_HTTP_HEADER, token);

        // Set executing user id
        if (req.method.toUpperCase() !== "GET" && req.body != null) {
            const userId = this.authService.getUserId();
            if (userId != null) body = { executingUserId: userId, ...body };
        }

        return next.handle(
            req.clone({ withCredentials: true, headers: headers, body: body })
        );
    }
}
