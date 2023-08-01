import { Observable, of, shareReplay } from "rxjs";
import { Base64 } from 'js-base64';

export function binaryToBase64$(data: ArrayBuffer): Observable<string> {
    const uint8Array = new Uint8Array(data);

    return of(Base64.fromUint8Array(uint8Array)).pipe(
        shareReplay(1),
    );
}
