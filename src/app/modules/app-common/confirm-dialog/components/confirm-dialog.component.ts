import { Component, inject, Type } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";


@Component({
    selector: "app-confirm-dialog",
    templateUrl: "./confirm-dialog.component.html",
    styleUrls: ["./confirm-dialog.component.scss"]
})
export class ConfirmDialogComponent<T = any> {

    public dialogRef = inject(MatDialogRef<ConfirmDialogComponent<T>>);

    public title: string;
    public message: string;
    public yesButtonCaption: string;
    public cancelButtonCaption: string;

    public messageComponent: Type<T> | undefined = undefined;
    public initMessageComponentBindingsFn?: (instance: T) => void = () => void 0;

    constructor() {
        this.dialogRef.disableClose = true;
    }
}
