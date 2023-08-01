import { AfterViewInit, Directive, inject, Input, OnInit, ViewChild } from "@angular/core";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BaseControlValueAccessor } from "../base-control-value-acessor/base-control-value-acessor.directive";
import { ActivatedRoute } from "@angular/router";
import { ResourceService } from "../../../core/resource/services/resource.service";
import { InitPageData } from "../../init-page-data-provider/models/init-page-data.model";
import { FieldErrorComponent } from "../../field-error/components/field-error/field-error.component";
import { SelectionListFieldComponent } from "../../selection-list-field/components/selection-list-field/selection-list-field.component";
import { controlExtractDirtyChanges$ } from "../../../core/utility/methods/control-extract-dirty-changes";
import { controlExtractTouchedChanges$ } from "../../../core/utility/methods/control-extract-touched-changes";


@UntilDestroy()
@Directive({})
export class BaseSelectionListFieldComponent<Model extends object = any> extends BaseControlValueAccessor<Model[]> implements OnInit, AfterViewInit {

    public activatedRoute = inject(ActivatedRoute);
    public resourceService = inject(ResourceService);

    public initData = this.activatedRoute.snapshot.data["init"] as InitPageData;

    forceSyncModelWithControl = false

    @Input() errorResourceKeyPrefix?: FieldErrorComponent["resourceKeyPrefix"];
    @Input() errorAddControlNameToResourceKeyPrefix?: FieldErrorComponent["addControlNameToResourceKeyPrefix"];
    @Input() errorShowErrorsMethod?: FieldErrorComponent["showErrorsMethod"];
    @Input() errorResourceOverrides?: FieldErrorComponent["resourceOverrides"];
    @Input() errorResourceOverridesMethod?: FieldErrorComponent["resourceOverridesMethod"];

    @ViewChild(SelectionListFieldComponent) selectionListFieldComponent!: SelectionListFieldComponent<Model>;
    ngAfterViewInit() {
        const ctrl = this.ngControl?.control;

        if (this.selectionListFieldComponent != null) {
            //Copy the value form the inner list field component to this component for easier use
            this.selectionListFieldComponent.getValue$().pipe(
                untilDestroyed(this),
            ).subscribe((v) => {
                this.value = v ?? [];

                this.selectionListFieldComponent.cdr.markForCheck();
                this.cdr.markForCheck();
            })

            if (ctrl != null) {
                // Copy the errors from here to the inner list field component
                ctrl.statusChanges?.pipe(
                    untilDestroyed(this),
                ).subscribe(() => {
                    this.selectionListFieldComponent.ngControl?.control?.setErrors(ctrl.errors ?? null, { emitEvent: false });

                    this.selectionListFieldComponent.cdr.markForCheck();
                    this.cdr.markForCheck();
                })

                // Copy other status flags
                controlExtractDirtyChanges$(ctrl).pipe(
                    untilDestroyed(this),
                ).subscribe((isDirty) => {
                    if (isDirty) this.selectionListFieldComponent.ngControl?.control?.markAsDirty();
                    else this.selectionListFieldComponent.ngControl?.control?.markAsPristine();

                    this.selectionListFieldComponent.cdr.markForCheck();
                    this.cdr.markForCheck();
                });

                controlExtractTouchedChanges$(ctrl).pipe(
                    untilDestroyed(this),
                ).subscribe((isTouched) => {
                    if (isTouched) this.selectionListFieldComponent.ngControl?.control?.markAsTouched();
                    else this.selectionListFieldComponent.ngControl?.control?.markAsUntouched();

                    this.selectionListFieldComponent.cdr.markForCheck();
                    this.cdr.markForCheck();
                });
            }
        }
    }
}
