import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { take } from "rxjs";
import { CoreModelsDTOsAuthenticationMainTablesRoleDTO } from "../../../../../../api/models";
import { DASHBOARD_ROUTE, ROUTE_RETURN_URL_QUERY_PARAM_KEY } from "../../../../../app.config";
import { RoleService } from "../../../../core/auth/services/role.service";


@Component({
    selector: "app-role-select",
    templateUrl: "./role-select.component.html",
    styleUrls: ["./role-select.component.scss"],
})
export class RoleSelectComponent {

    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private roleService = inject(RoleService);

    public roles$ = this.roleService.getRoles$(true);

    public form = new FormGroup({
        activatedRoleId: new FormControl<CoreModelsDTOsAuthenticationMainTablesRoleDTO['roleId'] | null>(null, { nonNullable: true, validators: [Validators.required ]}),
    });

    constructor() {
        this.roleService.getActiveRole$().pipe(
            take(1),
        ).subscribe((activatedRole) => {
            this.form.patchValue({
                activatedRoleId: activatedRole?.roleId
            })
        })
    }

    public submit() {
        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();
        if (this.form.valid) {
            this.activateRoleById(this.form.value.activatedRoleId!);
        }
    }

    public activateRoleById(roleId: CoreModelsDTOsAuthenticationMainTablesRoleDTO['roleId']): void {
        this.roleService.activateRoleById(roleId);

        const returnUrl = this.activatedRoute.snapshot.queryParams[ROUTE_RETURN_URL_QUERY_PARAM_KEY];
        this.router.navigate([returnUrl || DASHBOARD_ROUTE]);
    }

}
