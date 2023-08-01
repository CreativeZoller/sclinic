import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { combineLatest, distinctUntilChanged, map, Observable, of, shareReplay } from "rxjs";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { SelectOption } from "../../../../../../core/utility/types/select-option";
import { arrayMinLength } from "../../../../../../core/utility/validators/array-min-length.validator";
import { UserXRole } from "../../../models/user-x-role.model";


type Full_Model = UserXRole;

@UntilDestroy()
@Component({
    selector: "app-user-role-form",
    templateUrl: "./user-role-form.component.html",
    styleUrls: ["./user-role-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRoleFormComponent extends BaseFormComponent<Full_Model> implements OnInit {

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

    public errorResourceKeyPrefix = "user.role.form.errors";

    public form = new FormGroup({
        // Szerepkör
        roleId: new FormControl<Full_Model["roleId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Jutalékhányad
        commissionPercentage: new FormControl<Full_Model["commissionPercentage"]>(0, { nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.max(100)] }),
        // Ellátóhelyek
        swissUserXRoleXClinic: new FormControl<Full_Model["swissUserXRoleXClinic"]>([], { nonNullable: true, validators: [arrayMinLength(1)] }),
    });
}
