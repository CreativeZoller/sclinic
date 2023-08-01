import { Observable, of, shareReplay } from "rxjs";
import { Base64 } from 'js-base64';

export function stringFromBase64$(strBase64: string): Observable<string> {
    return of(Base64.decode(strBase64)).pipe(
        shareReplay(1),
    );
}
