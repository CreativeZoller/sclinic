import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, ViewChild } from '@angular/core';
import { UntilDestroy } from "@ngneat/until-destroy";
import { FileLike } from "../../models/file-like.model";
import { FilePreviewComponent } from "../file-preview/file-preview.component";
import { ModalComponent, ModalConfig } from "../../../../../_metronic/partials";
import { WithNgAfterViewInitSubject } from "../../../../core/utility/mixins/with-ng-after-view-init-subject.mixin";
import { map, Observable, shareReplay, switchMap } from "rxjs";
import { ResourceService } from "../../../../core/resource/services/resource.service";


@UntilDestroy()
@Component({
    selector: 'app-file-preview-modal',
    templateUrl: './file-preview-modal.component.html',
    styleUrls: ['./file-preview-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilePreviewModalComponent extends WithNgAfterViewInitSubject(class {}) {

    private cdr = inject(ChangeDetectorRef);
    private resourceService = inject(ResourceService);

    @Input() file: FileLike | null | undefined;

    @ViewChild("preview") previewComponent: FilePreviewComponent;
    @ViewChild("modal") modalComponent: ModalComponent;

    public isOpen = false;

    protected modalConfig$: Observable<ModalConfig> = this.ngAfterViewInit$.pipe(
        switchMap(() => this.previewComponent.loading$),
        map((loading) => {
            return <ModalConfig>{
                containerClasses: ["file-preview-modal-container"],
                hideDeleteButton: true,
                hideSaveButton: true,
                dismissButtonLabel: this.resourceService.resolve("general.action.label.close"),
                modalTitle: this.resourceService.resolve("general.action.label.preview"),
                loading: loading,
                onDismiss: (modal: ModalComponent) => {
                    modal.close();
                    this.isOpen = false;
                    this.cdr.markForCheck();
                },
            };
        }),
        shareReplay(1),
    );

    open() {
        this.modalComponent.open();
        this.isOpen = true;
        this.cdr.markForCheck();
    }
}
