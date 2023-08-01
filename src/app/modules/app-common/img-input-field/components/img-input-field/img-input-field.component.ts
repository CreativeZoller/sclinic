import { Component, HostBinding, inject, Input } from "@angular/core";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, combineLatest, from, map, Observable, shareReplay, switchMap } from "rxjs";
import { binaryToBase64$ } from "../../../../core/utility/methods/binary-to-base64";
import { binaryFromBase64$ } from "../../../../core/utility/methods/binary-from-base64";
import { FieldErrorComponent } from "../../../field-error/components/field-error/field-error.component";
import { BaseControlValueAccessor } from "../../../utility/base-control-value-acessor/base-control-value-acessor.directive";
import { saveAs } from 'file-saver';
import { isEmpty } from "../../../../core/utility/methods/is-empty";


type FileData = {
    name: string;
    base64Content: string;
}

@UntilDestroy()
@Component({
    selector: "app-img-input-field",
    templateUrl: "img-input-field.component.html",
    styleUrls: ["img-input-field.component.scss"],
})
export class ImgInputFieldComponent extends BaseControlValueAccessor<string | undefined, FileData | undefined> {

    private toastrService = inject(ToastrService);

    @Input() label: string;
    /**
     * Accepted extensions and/or MIME-types
     * (If left empty all file types and extensions are allowed)
     *
     * default: ["image/jpeg", "image/png"]
     */
    @Input() accepts: string[] = ["image/jpeg", "image/png"];

    // TODO "assets/media/svg/files/blank-image.svg"
    private defaultImgSrc$ = new BehaviorSubject<string>("assets/media/avatars/blank.png");
    @Input() set defaultImgSrc(src: string) { this.defaultImgSrc$.next(src); }

    @HostBinding("class.is-invalid")
    get withIsInvalidClass() { return this.ngControl?.invalid && (this.ngControl?.touched || this.ngControl?.dirty); }
    @HostBinding("class.disabled")
    get withDisabledClass() { return this.isDisabled; }

    @Input() errorResourceKeyPrefix?: FieldErrorComponent["resourceKeyPrefix"];
    @Input() errorAddControlNameToResourceKeyPrefix?: FieldErrorComponent["addControlNameToResourceKeyPrefix"];
    @Input() errorShowErrorsMethod?: FieldErrorComponent["showErrorsMethod"];
    @Input() errorResourceOverrides?: FieldErrorComponent["resourceOverrides"];
    @Input() errorResourceOverridesMethod?: FieldErrorComponent["resourceOverridesMethod"];

    forceSyncModelWithControl = false;

    private fileToFileData$(file: File): Observable<FileData> {
        if (file == null) throw new Error("File must not be null!");

        return from(file.arrayBuffer()).pipe(
            switchMap((textContents) => combineLatest([
                binaryToBase64$(textContents),
            ])),
            map(([base64Content]) => {
                return <FileData>{
                    name: file.name,
                    base64Content,
                }
            }),
            shareReplay(1),
        );
    }

    onFileInputChange(e: Event) {
        try {
            const fileList = (e.target as HTMLInputElement)?.files;
            const files = Array.from(fileList ?? []);

            const file = files[0];

            if (file == null) {
                super.changeValue(undefined);
            } else {
                this.fileToFileData$(file).pipe(
                    untilDestroyed(this),
                ).subscribe((fileData) => {
                    super.changeValue(fileData);
                });
            }
        } catch(err) {
            this.toastrService.error("A fájlt nem sikerült feldolgozni, kérjük probálja újra!");// TODO hibakód lefordítása
        }

        // Reset field value (needed because without it the change won't emit if we select the previous file(s) again)
        (e.target as HTMLInputElement).value = "";
    }

    downloadFile(fileData: FileData) {
        binaryFromBase64$(fileData.base64Content).pipe(
            untilDestroyed(this),
        ).subscribe((data) => {
            saveAs(new Blob([data], {type: "application/octet-stream"}), fileData.name);
        });
    }

    deleteFile(fileData: FileData) {
        if (this.value === fileData) super.changeValue(undefined);
    }

    writeValue(value: string | undefined): void {
        if (value == null) {
            this.value = undefined;
        } else {
            if (this.value?.base64Content !== value) {
                this.value = {
                    name: "uploaded-img",
                    base64Content: value,
                };
            }
        }

        this.cdr.markForCheck();
    }

    readValue(value: FileData | undefined): string | undefined {
        if (value == null) return undefined;

        return value.base64Content;
    }

    imgPreviewSrc$ = combineLatest([
        this.defaultImgSrc$,
        this.getValue$(),
    ]).pipe(
        map(([defaultImgSrc, value]) => {
            if (isEmpty(value?.base64Content)) return defaultImgSrc;

            return `data:image;charset=utf-8;base64,${value!.base64Content}`
        }),
        shareReplay(1),
    );
}
