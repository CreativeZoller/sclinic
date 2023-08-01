import { ChangeDetectorRef, Component, inject, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { WithNgAfterViewInitSubject } from "../../../../../../core/utility/mixins/with-ng-after-view-init-subject.mixin";
import { Full_Model } from "../../form/service-sub-package-form.component";
import { ServiceSubPackageServicePackageListFieldComponent } from "../../service-sub-package-service-package/list-field/service-sub-package-service-package-list-field.component";


@UntilDestroy()
@Component({
    template: `
        <ng-container [formGroup]="form">
            <div class="d-flex flex-row gap-5 align-items-baseline">
                <div
                    class="flex-column-fluid overflow-hidden w-100 fw-bold"
                    [innerHTML]="'service.sub.package.form.confirm.dialog.content.text.service.sub.package.service.package' | resolveResource | safeHtml"
                ></div>
            </div>

            <div class="d-flex flex-row gap-5 mt-5 align-items-baseline">
                <div class="flex-column-fluid overflow-hidden w-100">
                    <app-service-sub-package-service-package-list-field
                        formControlName="servicePackageList"
                    ></app-service-sub-package-service-package-list-field>
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
export class ServiceSubPackageXServicePackageConfirmDialogContentComponent extends WithNgAfterViewInitSubject(class {}) {
    public form = new FormGroup({
        servicePackageList: new FormControl<Full_Model["servicePackageList"]>([]),
    });

    public cdr = inject(ChangeDetectorRef);

    @ViewChild(ServiceSubPackageServicePackageListFieldComponent)
    public listFieldComponent: ServiceSubPackageServicePackageListFieldComponent;
}
