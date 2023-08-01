import { inject, Injectable, Type } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { map, Observable } from "rxjs";
import { ResourceService } from "../../../core/resource/services/resource.service";
import { ConfirmDialogComponent } from "../components/confirm-dialog.component";


@Injectable()
export class ConfirmDialogService {

    private matDialog = inject(MatDialog);
    private resourceService = inject(ResourceService);

    confirm<T>(
        overrides?: {
            titleResourceKey?: string,
            messageResourceKey?: string,
            messageComponent?: Type<T>,
            initMessageComponentBindingsFn?: (instance: T) => void,
            yesButtonCaptionResourceKey?: string,
            cancelButtonCaptionResourceKey?: string,
        }
    ): Observable<boolean> {
        const title = this.resourceService.resolve(
            overrides?.titleResourceKey || "general.confirm.dialog.title"
        );
        const message = this.resourceService.resolve(
            overrides?.messageResourceKey || "general.confirm.dialog.message"
        );
        const yesButtonCaption = this.resourceService.resolve(
            overrides?.yesButtonCaptionResourceKey || "general.confirm.dialog.yesButtonCaption"
        );
        const cancelButtonCaption = this.resourceService.resolve(
            overrides?.cancelButtonCaptionResourceKey || "general.confirm.dialog.cancelButtonCaption"
        );

        const dialogConfig: MatDialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = false;

        const dialogRef = this.matDialog.open(ConfirmDialogComponent, dialogConfig);
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;
        dialogRef.componentInstance.messageComponent = overrides?.messageComponent;
        dialogRef.componentInstance.initMessageComponentBindingsFn = overrides?.initMessageComponentBindingsFn;
        dialogRef.componentInstance.cancelButtonCaption = cancelButtonCaption;
        dialogRef.componentInstance.yesButtonCaption = yesButtonCaption;

        return dialogRef.afterClosed().pipe(
            map((confirmed) => !!confirmed),// Convert undefined -> false
        );
    }
}
