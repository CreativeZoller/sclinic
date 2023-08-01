import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { UntilDestroy } from "@ngneat/until-destroy"
import { RoleState } from "../models/role-state.model";
import { RoleService } from "./role.service";


@UntilDestroy()
@Injectable()
export class PermissionService {

    private roleService = inject(RoleService);

    private _hasPermission(activeRole: RoleState['activeRole'] | null, permission: string): boolean {
        // TODO permission-ök kezelésének implementálása
        const rights = (activeRole?.roleXRight ?? [])
            .filter(right => right?.right != null)
            .map(right => right.right!);

        return rights.some((right) => right?.rightXFunction?.some?.((func) => func?.function?.uiComponentName === permission));
    }

    public hasPermission(permission: string): boolean {
        return this._hasPermission(this.roleService.getActiveRole(), permission);
    }

    public hasPermission$(permission: string): Observable<boolean> {
        return this.roleService.getActiveRole$().pipe(
            map((activeRole) => this._hasPermission(activeRole, permission)),
        );
    }
}
