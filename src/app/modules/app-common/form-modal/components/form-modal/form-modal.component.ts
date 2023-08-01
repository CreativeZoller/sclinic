import { ChangeDetectionStrategy, Component, ContentChild, inject, Input, ViewChild } from "@angular/core";
import { BehaviorSubject, finalize, Observable } from "rxjs";
import { ModalConfig, ModalComponent } from "../../../../../_metronic/partials";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../utility/base-form-component/base-form-component.directive";
import { ResourceService } from "../../../../core/resource/services/resource.service";


@UntilDestroy()
@Component({
    selector: "app-form-modal",
    templateUrl: "./form-modal.component.html",
    styleUrls: ["./form-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormModalComponent<FormModel>  {

    private resourceService = inject(ResourceService);

    @Input() public modalTitle: string = ""
    @Input() public saveButtonLabel : string = this.resourceService.resolve("general.action.label.send");
    @Input() public dismissButtonLabel: string = this.resourceService.resolve("general.action.label.back");
    @Input() public handleSave$: (formValue: FormModel, modal: ModalComponent) => Observable<any>;

    @ViewChild("modalComponent") private modalComponent: ModalComponent;
    public formComponent: BaseFormComponent<FormModel>;
    @ContentChild("formComponent") public set formComponentByContent(formComponent: BaseFormComponent<FormModel>) {
        if (this.formComponent == null) this.formComponent = formComponent;
    }
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input("formComponent") public set formComponentByInput(formComponent: BaseFormComponent<FormModel>) {
        if (this.formComponent == null) this.formComponent = formComponent;
    }

    protected modalConfig$ = new BehaviorSubject<ModalConfig | undefined>(undefined);

    // Rarely needed inputs
    private _initFormValue?: FormModel;
    @Input() public set initFormValue(initFormValue: FormModel | null | undefined) {
        this._initFormValue = initFormValue ?? undefined;
        this.formComponent.editorData = this.initFormValue ?? null;
    }
    public get initFormValue(): FormModel | undefined {
        return this._initFormValue;
    }
    @Input() public convertFormValueToRequestValueBeforeHandlers: boolean = true;
    @Input() public skipDisablingButtonsDuringHandlers: boolean = false;
    @Input() public skipScrollToFirstInvalid: boolean = false;

    @Input() public set loading(loading: boolean) {
        this.modalConfig$.next({
            ...this.modalConfig$.value,
            loading: loading,
        })
    }

    public open() {
        if (this.formComponent === null) throw new Error("No form component found!");
        if (this.handleSave$ === null) throw new Error("No handleSave$ input binding found!");

        this.formComponent.editorData = this.initFormValue ?? null;
        this.modalConfig$.next({
            ...this.modalConfig$.value,
            hideDeleteButton: true,
            modalTitle: this.modalTitle,
            saveButtonLabel: this.saveButtonLabel,
            dismissButtonLabel: this.dismissButtonLabel,
            onSave: (modal) => {
                this.formComponent.form.markAllAsTouched();
                this.formComponent.form.updateValueAndValidity()
                if (this.formComponent.form.valid) {
                    if (!this.skipDisablingButtonsDuringHandlers) this.disabledEditorButtons();

                    let formValue = this.formComponent.getFormValue(true);
                    if (this.convertFormValueToRequestValueBeforeHandlers) formValue = this.formComponent.formValueToRequestValue(formValue);

                    this.handleSave$(formValue, modal).pipe(
                        finalize(() => {
                            if (!this.skipDisablingButtonsDuringHandlers) this.enableEditorButtons();
                        }),
                    ).subscribe({
                        // Success, close modal
                        next: () => { modal.close(); },
                    })
                } else {
                    if (this.skipScrollToFirstInvalid === false) {
                        const firstInvalidElement = this.formComponent.getElementRef().nativeElement?.querySelector?.(".ng-invalid") as HTMLElement;
                        if (firstInvalidElement) firstInvalidElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
                    }
                }

                this.formComponent.updateView();
            },
        });

        this.modalComponent.open();
    }

    public close() {
        this.modalComponent.close();
    }

    private disabledEditorButtons() {
        this.modalConfig$.next(
            this.modalConfig$.value == null
                ? undefined
                : {
                    ...this.modalConfig$.value,
                    disableSaveButton: true,
                    disableDeleteButton: true,
                    disableDismissButton: true,
                }
        );
    }

    private enableEditorButtons() {
        this.modalConfig$.next(
            this.modalConfig$.value == null
                ? undefined
                : {
                    ...this.modalConfig$.value,
                    disableSaveButton: false,
                    disableDeleteButton: false,
                    disableDismissButton: false,
                }
        );
    }
}
