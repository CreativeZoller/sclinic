import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { getReasonPhrase } from 'http-status-codes';


@Injectable()
export class ResponseTransformerInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            tap({
                next: (event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        // Get the HTTP code form the error message if any
                        let statusCode: number = Number.parseInt(
                            event?.body?.errorMessage?.match(/\[HTTP-(?<code>\d{3})\]/)?.groups?.code
                        );

                        if (statusCode == null || Number.isNaN(statusCode)) {
                            statusCode = (event?.body?.errorMessage == null) ? (event?.status ?? 200) : (400);
                        }

                        function convertResponseToError<T>(resp: HttpResponse<T>, status: number, statusText?: string) {
                            return new HttpErrorResponse({
                                error: resp.body,
                                url: resp.url ?? undefined,
                                statusText: statusText ?? getReasonPhrase(status),
                                headers: resp.headers,
                                status: status ?? resp.status,
                            });
                        }

                        if (statusCode >= 400) {
                            throw convertResponseToError(event, statusCode);
                        }
                    }
                },
            }),
        );
    }
}
