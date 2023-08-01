import { Observable, of, shareReplay } from "rxjs";
import { Base64 } from 'js-base64';

export function stringToBase64$(str: string): Observable<string> {
    return of(Base64.encode(str, true)).pipe(
        shareReplay(1),
    );
}
