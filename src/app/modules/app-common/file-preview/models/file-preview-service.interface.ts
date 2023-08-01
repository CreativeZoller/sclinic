import { Observable } from "rxjs";

export interface FilePreviewService {
    readonly allowedExtension: string[];
    arrayBufferToHtml$(buff: ArrayBuffer): Observable<string>;
}
