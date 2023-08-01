import { Observable, of, shareReplay } from "rxjs";
import { Base64 } from 'js-base64';

export function binaryFromBase64$(strBase64: string): Observable<ArrayBuffer> {
    return of(Base64.toUint8Array(strBase64).buffer).pipe(
        shareReplay(1),
    );
}
