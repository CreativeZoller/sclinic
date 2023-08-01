import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { combineLatest, distinctUntilChanged, map, Observable, of, shareReplay } from "rxjs";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { SelectOption } from "../../../../../../core/utility/types/select-option";
import { ServicePackageXRole } from "../../../models/service-package-x-role.model";


type Full_Model = ServicePackageXRole;

@UntilDestroy()
@Component({
    selector: "app-service-package-role-form",
    templateUrl: "./service-package-role-form.component.html",
    styleUrls: ["./service-package-role-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicePackageRoleFormComponent extends BaseFormComponent<Full_Model> implements OnInit {

    public errorResourceKeyPrefix = "service.package.role.form.errors";

    @Input() public allSelectedRoleIds$: Observable<NonNullable<Full_Model["roleId"]>[]> = of([]);

    public roleOptions$: Observable<SelectOption<NonNullable<Full_Model["roleId"]>>[]> = of([]);

    public ngOnInit(): void {
        this.roleOptions$ = combineLatest([
            (this.allSelectedRoleIds$ ?? of([])),
            this.initialEditorData$,
        ]).pipe(
            map(([allSelectedRoleIds, initialEditorData]) => {
                return this.initData.roles.filter((opt) => {
                    return !allSelectedRoleIds.includes(opt.value)
                        || initialEditorData?.roleId === opt.value
                })
            }),
            distinctUntilChanged(),
            shareReplay(1),
        )
    }

    public form = new FormGroup({
        // Értékesítő
        roleId: new FormControl<Full_Model["roleId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Jutalék százalék
        percentage: new FormControl<Full_Model["percentage"]>(0, { nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.max(100)] }),
    });
}
