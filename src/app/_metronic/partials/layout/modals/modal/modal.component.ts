import { Component, inject, Input, TemplateRef, ViewChild } from '@angular/core';
import { ModalConfig } from '../modal.config';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {

    private modalService = inject(NgbModal);

    get containerClasses() {
        return [
            "modalContainer",
            ...(this.config.classSmall ? ["modalContainer--small"] : []),
            ...(this.config.containerClasses ?? []),
        ];
    }

    config: ModalConfig
    @Input() public set modalConfig(config: ModalConfig | undefined | null) {
        this.config = {
            // Default values
            modalTitle: "Modal cím",
            classSmall: false,
            loading: false,

            dismissButtonLabel: "Mégsem",
            hideDismissButton: false,
            disableDismissButton: false,
            onDismiss: (modal: ModalComponent) => modal.close(),

            saveButtonLabel: "Mentés",
            hideSaveButton: false,
            disableSaveButton: false,
            onSave: (modal: ModalComponent) => modal.close(),

            deleteButtonLabel: "Törlés",
            hideDeleteButton: false,
            disableDeleteButton: false,
            onDelete: (modal: ModalComponent) => modal.close(),

            // Input values
            ...config,
        }
    }
    @ViewChild('modal') private modalContent: TemplateRef<ModalComponent>;
    private modalRef: NgbModalRef;

    open(): void {
        this.modalRef = this.modalService.open(this.modalContent);
    }

    close() {
        this.modalRef?.close?.();
    }
}
