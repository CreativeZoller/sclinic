import { from, map, Observable, of, shareReplay } from "rxjs";
import SHA256 from "crypto-js/sha256";

export function stringToSha256$(str: string): Observable<string> {
    if (crypto?.subtle?.digest == null) {
        return of(SHA256(str).toString()).pipe(
            shareReplay(1),
        );
    }

    const msgBuffer = new TextEncoder().encode(str);

    return from(crypto.subtle.digest("SHA-256", msgBuffer)).pipe(
        map((hashBuffer) => {
            return Array
                .from(new Uint8Array(hashBuffer))
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");
        }),
        shareReplay(1),
    );
}
