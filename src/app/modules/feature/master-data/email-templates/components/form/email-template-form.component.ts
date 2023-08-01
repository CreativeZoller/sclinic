import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnInit, ViewChild } from "@angular/core";
import { EmailTemplate, Grid_EmailTemplate } from "../../models/email-template.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { distinctUntilChanged, map, shareReplay, startWith } from "rxjs";
import { FilePreviewModalComponent } from "../../../../../app-common/file-preview/components/file-preview-modal/file-preview-modal.component";
import { ResourceService } from "../../../../../core/resource/services/resource.service";


type Full_Model = EmailTemplate;

@UntilDestroy()
@Component({
    selector: "app-email-template-form",
    templateUrl: "./email-template-form.component.html",
    styleUrls: ["./email-template-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailTemplateFormComponent extends BaseFormComponent<Full_Model> implements OnInit {

    private resourceService = inject(ResourceService);

    public errorResourceKeyPrefix = "email.template.form.errors";

    public form = new FormGroup({
        // Email sablon megnevezése
        emailTemplateName: new FormControl<Full_Model["emailTemplateName"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Email sablon leírása
        description: new FormControl<Full_Model["description"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Tárgy
        subject: new FormControl<Full_Model["subject"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Email szövege
        body: new FormControl<Full_Model["body"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Kategória
        dC_EmailTemplateCategoryId: new FormControl<Full_Model["dC_EmailTemplateCategoryId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Csatolmány
        documentJSON: new FormControl<string | undefined>(undefined, { nonNullable: true, validators: [Validators.required] }),
    });

    public ngOnInit(): void {
        this.initialEditorData$.pipe(
            distinctUntilChanged(),
            untilDestroyed(this),
        ).subscribe((initialEditorData) => {
            if (initialEditorData != null) {
                if (!this.form.controls.emailTemplateName.disabled) this.form.controls.emailTemplateName.disable();
            } else {
                if (!this.form.controls.emailTemplateName.enabled) this.form.controls.emailTemplateName.enable();
            }
        })
    }

    public setFormValue(data: Full_Model | undefined | null) {
        super.setFormValue(<any>{
            ...data,
            // TODO review this
            documentJSON: data?.emailTemplateXDocumentTemplate?.[0]?.documentTemplate?.documentJSON,
        })
    };

    public getFormValue(raw?: boolean): Full_Model {
        const { documentJSON, ...restValue } = raw ? this.form.getRawValue() : this.form.value;

        return {
            ...restValue,
            emailTemplateXDocumentTemplate: documentJSON == null ? [] : [{
                documentTemplate: {
                    // TODO review this
                    documentJSON: documentJSON,
                },
            }],
        }
    };

    @ViewChild("filePreviewModal") private filePreviewModal: FilePreviewModalComponent;

    getExtraButtonsConfig$ = () => this.form.controls.documentJSON.valueChanges.pipe(
        startWith(this.form.value.documentJSON),
        map((documentJSON) => (documentJSON == null || true /* TODO ah kell a CR bemehet */) ? [] : [{
            component: ButtonComponent,
            initComponentBindingFn: (instance: ButtonComponent) => {
                instance.label = this.resourceService.resolve("general.action.label.preview");
                instance.click.pipe(untilDestroyed(this)).subscribe(() => this.filePreviewModal?.open());
            },
        }]),
        shareReplay(1),
    );
}


@Component({
    standalone: true,
    template: `
        <button
            type="button"
            class="btn customBtn--secondary"
            (click)="click.emit()"
            [disabled]="disabled"
        >
            {{ label }}
        </button>
    `,
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        class: "order-2"
    }
})
class ButtonComponent {
    label: string = "";
    click = new EventEmitter<void>();
    disabled = false;
}
