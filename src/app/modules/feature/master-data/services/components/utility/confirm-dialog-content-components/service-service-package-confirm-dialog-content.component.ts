import { ChangeDetectorRef, Component, inject, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { WithNgAfterViewInitSubject } from "../../../../../../core/utility/mixins/with-ng-after-view-init-subject.mixin";
import { Full_Model } from "../../form/service-form.component";
import { ServiceServicePackageListFieldComponent } from "../../service-service-package/list-field/service-service-package-list-field.component";


@UntilDestroy()
@Component({
    template: `
        <ng-container [formGroup]="form">
            <div class="d-flex flex-row gap-5 align-items-baseline">
                <div
                    class="flex-column-fluid overflow-hidden w-100 fw-bold"
                    [innerHTML]="'service.form.confirm.dialog.content.text.service.service.package' | resolveResource | safeHtml"
                ></div>
            </div>

            <div class="d-flex flex-row gap-5 mt-5 align-items-baseline">
                <div class="flex-column-fluid overflow-hidden w-100">
                    <app-service-service-package-list-field
                        formControlName="servicePackageXService"
                    ></app-service-service-package-list-field>
                </div>
            </div>

            <div class="d-flex flex-row gap-5 mt-5 align-items-baseline">
                <div
                    class="flex-column-fluid overflow-hidden w-100 fw-bold"
                    [innerHTML]="'general.confirm.dialog.message' | resolveResource | safeHtml"
                ></div>
            </div>
        </ng-container>
    `,
})
export class ServiceXServicePackageConfirmDialogContentComponent extends WithNgAfterViewInitSubject(class {}) {
    form = new FormGroup({
        servicePackageXService: new FormControl<Full_Model["servicePackageXService"]>([]),
    });

    public cdr = inject(ChangeDetectorRef);

    @ViewChild(ServiceServicePackageListFieldComponent)
    public listFieldComponent: ServiceServicePackageListFieldComponent;
}
