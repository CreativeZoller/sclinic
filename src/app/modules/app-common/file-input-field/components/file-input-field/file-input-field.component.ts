import { Component, HostBinding, inject, Input } from "@angular/core";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ToastrService } from "ngx-toastr";
import { combineLatest, from, map, Observable, shareReplay, switchMap } from "rxjs";
import { binaryToBase64$ } from "../../../../core/utility/methods/binary-to-base64";
import { binaryFromBase64$ } from "../../../../core/utility/methods/binary-from-base64";
import { FieldErrorComponent } from "../../../field-error/components/field-error/field-error.component";
import { BaseControlValueAccessor } from "../../../utility/base-control-value-acessor/base-control-value-acessor.directive";
import { saveAs } from 'file-saver';


type FileData = {
    name: string;
    base64Content: string;
}

@UntilDestroy()
@Component({
    selector: "app-file-input-field",
    templateUrl: "file-input-field.component.html",
    styleUrls: ["file-input-field.component.scss"],
})
export class FileInputFieldComponent extends BaseControlValueAccessor<string[] | string | undefined, FileData[] | FileData | undefined> {

    private toastrService = inject(ToastrService);

    @Input() multiple: boolean = false;
    /**
     * Accepted extensions and/or MIME-types
     * (If left empty all file types and extensions are allowed)
     */
    @Input() accepts: string[] = []

    @Input() buttonMode: "MERGE" | "OVERWRITE" = "OVERWRITE";

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

    files$ = this.getValue$().pipe(
        map((value) => {
            if (value == null) return [];
            if (!Array.isArray(value)) return [value];

            return value;
        }),
        shareReplay(1),
    );

    onFileInputChange(e: Event) {
        try {
            const fileList = (e.target as HTMLInputElement)?.files;
            const files = Array.from(fileList ?? []);

            if (files.some(file => !this.accepts.includes(file.type))) {
                this.toastrService.error("Nem megfelelő fájltípus!");// TODO nyelviesítés
                return;
            }

            if (!this.multiple) {
                const file = files[0];

                if (this.buttonMode === "MERGE") {
                    if (this.value == null && file != null) {
                        this.fileToFileData$(file).pipe(
                            untilDestroyed(this),
                        ).subscribe((fileData) => {
                            super.changeValue(fileData);
                        });
                    }
                } else {
                    if (file == null) {
                        super.changeValue(undefined);
                    } else {
                        this.fileToFileData$(file).pipe(
                            untilDestroyed(this),
                        ).subscribe((fileData) => {
                            super.changeValue(fileData);
                        });
                    }
                }
            } else {
                if (this.buttonMode === "MERGE") {
                    // Add
                    if (files?.length > 0) {
                        combineLatest([
                            ...files.map(f => this.fileToFileData$(f))
                        ]).pipe(
                            untilDestroyed(this),
                        ).subscribe((fileDataList) => {
                            super.changeValue([
                                ...(this.value ?? []) as FileData[],
                                ...fileDataList,
                            ].filter((v, i, arr) => arr.map(e => e.base64Content).indexOf(v.base64Content) === i));// Deduplicate
                        });
                    }
                } else {
                    // Overwrite
                    if (files?.length === 0) {
                        super.changeValue([]);
                    } else {
                        combineLatest([
                            ...files.map(f => this.fileToFileData$(f))
                        ]).pipe(
                            untilDestroyed(this),
                        ).subscribe((fileDataList) => {
                            super.changeValue(fileDataList);
                        });
                    }
                }
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
        if (this.multiple) {
            super.changeValue((this.value as FileData[]).filter((f) => f !== fileData));
        } else {
            if (this.value === fileData) super.changeValue(undefined);
        }
    }

    writeValue(value: string[] | string | undefined): void {
        if (value == null) {
            this.value = undefined;
        } else if (!Array.isArray(value)) {
            if (Array.isArray(this.value) || this.value?.base64Content !== value) {
                this.value = {
                    name: "uploaded-file",
                    base64Content: value,
                };
            }
        } else {
            const prevValue = Array.isArray(this.value) ? this.value : [];
            const newValue: FileData[] = [
                ...prevValue,
                ...value.map((v, i) => (<FileData>{
                    name: `uploaded-file-${i}`,
                    base64Content: v,
                })),
            ].filter((v) => {
                // Remove the unneded ones
                return value.some(vv => vv === v.base64Content);
            }).filter((v, i, arr) => {
                // Remove the duplicates
                return arr.map(vv => vv.base64Content).indexOf(v.base64Content) === i;
            });

            this.value = newValue;
        }

        this.cdr.markForCheck();
    }

    readValue(value: FileData | FileData[] | undefined): string[] | string | undefined {
        if (value == null) return undefined;
        if (!Array.isArray(value)) return value.base64Content;

        return value.map((v) => v.base64Content);
    }
}
