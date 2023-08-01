import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnInit, ViewChild } from "@angular/core";
import { DocumentTemplate } from "../../models/document-template.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { distinctUntilChanged, map, shareReplay, startWith } from "rxjs";
import { FilePreviewModalComponent } from "../../../../../app-common/file-preview/components/file-preview-modal/file-preview-modal.component";
import { ResourceService } from "../../../../../core/resource/services/resource.service";


type Full_Model = DocumentTemplate;

@UntilDestroy()
@Component({
    selector: "app-document-template-form",
    templateUrl: "./document-template-form.component.html",
    styleUrls: ["./document-template-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentTemplateFormComponent extends BaseFormComponent<Full_Model> implements OnInit {

    private resourceService = inject(ResourceService);

    public errorResourceKeyPrefix = "document.template.form.errors";

    public form = new FormGroup({
        // Dokumentum sablon megnevezése
        name: new FormControl<Full_Model["name"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Dokumentum sablon leírása
        description: new FormControl<Full_Model["description"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Kategória
        dC_DocumentTemplateCategoryId: new FormControl<Full_Model["dC_DocumentTemplateCategoryId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Csatolmány
        documentJSON: new FormControl<Full_Model["documentJSON"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
    });

    public ngOnInit(): void {
        this.initialEditorData$.pipe(
            distinctUntilChanged(),
            untilDestroyed(this),
        ).subscribe((initialEditorData) => {
            if (initialEditorData != null) {
                if (!this.form.controls.name.disabled) this.form.controls.name.disable();
            } else {
                if (!this.form.controls.name.enabled) this.form.controls.name.enable();
            }
        })
    }

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
