import mammoth from "mammoth/mammoth.browser";
import { from, map, Observable, of, shareReplay } from "rxjs";
import { FilePreviewService } from "../models/file-preview-service.interface";


export class FilePreviewDocxService implements FilePreviewService {

    public readonly allowedExtension = ["docx"];

    public arrayBufferToHtml$(buff: ArrayBuffer): Observable<string> {
        if (buff == null) return of("");

        return from(mammoth.convertToHtml({ arrayBuffer: buff })).pipe(
            map((result) => result.value),
            shareReplay(1),
        );
    }
}
