import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, from, Observable, of, shareReplay, switchMap, tap, zip } from "rxjs";
import { binaryFromBase64$ } from "../../../../core/utility/methods/binary-from-base64";
import { UntilDestroy } from "@ngneat/until-destroy";
import { FileLike } from "../../models/file-like.model";
import { fileTypeFromBuffer } from 'file-type';
import { FILE_PREVIEW_SERVICES_TOKEN } from "../../models/file-preview-services.injection.token";


@UntilDestroy()
@Component({
    selector: 'app-file-preview',
    templateUrl: './file-preview.component.html',
    styleUrls: ['./file-preview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilePreviewComponent {

    private filePreviewServices = inject(FILE_PREVIEW_SERVICES_TOKEN);

    private fileLike$ = new BehaviorSubject<FileLike | null>(null);
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input("file") set setFile(fileLike: FileLike | null | undefined) {
        this.fileLike$.next(fileLike ?? null);
    }

    protected fileArrayBuffer$ = this.fileLike$.pipe(
        switchMap((fileLike) => {
            if (fileLike == null) return of(null);
            else return this.fileLikeToArrayBuffer$(fileLike);
        }),
        shareReplay(1),
    );

    protected fileType$ = this.fileArrayBuffer$.pipe(
        switchMap((arrayBuffer) => {
            if (arrayBuffer == null) return of(null);
            else return from(fileTypeFromBuffer(arrayBuffer));
        }),
        shareReplay(1),
    );

    public loading$ = new BehaviorSubject<boolean>(false);

    protected htmlContent$ = zip(
        this.fileType$,
        this.fileArrayBuffer$,
    ).pipe(
        distinctUntilChanged(),
        tap(() => this.loading$.next(true)),
        switchMap(([fileType, fileArrayBuffer]) => {
            if (fileType == null || fileArrayBuffer == null) return of("");

            const svc = this.filePreviewServices.find(c => c.allowedExtension.includes(fileType.ext));
            if (svc == null) return of("");

            return svc.arrayBufferToHtml$(fileArrayBuffer);
        }),
        tap(() => this.loading$.next(false)),
        shareReplay(1),
    )

    private fileLikeToArrayBuffer$(fileLike: FileLike): Observable<ArrayBuffer> {
        if (fileLike instanceof File || fileLike instanceof Blob) {
            return from(fileLike.arrayBuffer()).pipe(shareReplay(1));
        }

        if (fileLike instanceof ArrayBuffer) return of(fileLike).pipe(shareReplay(1));

        return binaryFromBase64$(fileLike).pipe(shareReplay(1));
    }
}
