import { ModalComponent } from "./modal/modal.component";

export interface ModalConfig {
    modalTitle?: string;
    classSmall?: boolean;
    containerClasses?: string[];
    loading?: boolean;

    dismissButtonLabel?: string;
    hideDismissButton?: boolean;
    disableDismissButton?: boolean;
    onDismiss?: (modal: ModalComponent) => void;

    saveButtonLabel?: string;
    hideSaveButton?: boolean;
    disableSaveButton?: boolean;
    onSave?: (modal: ModalComponent) => void;

    deleteButtonLabel?: string;
    hideDeleteButton?: boolean;
    disableDeleteButton?: boolean;
    onDelete?: (modal: ModalComponent) => void;

    extraButtonsConfigs?: {
        component?: any,
        initComponentBindingFn?: (instance: any) => void,
    }[]
}
