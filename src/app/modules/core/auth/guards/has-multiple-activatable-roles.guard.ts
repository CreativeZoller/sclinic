import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from "@angular/router";
import { combineLatest, map } from "rxjs";
import { DASHBOARD_ROUTE, ROUTE_RETURN_URL_QUERY_PARAM_KEY } from "../../../../app.config";
import { RoleService } from "../services/role.service";


@Injectable()
export class HasMultipleActivatableRolesGuard implements CanActivate, CanActivateChild {

    private roleService = inject(RoleService);
    private router = inject(Router);

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.canProceed(route, state);
    }

    public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.canProceed(childRoute.parent!, state);
    }

    protected canProceed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return combineLatest([
            this.roleService.getActiveRole$(),
            this.roleService.getRoles$(true),
        ]).pipe(
            map(([activeRole, roles]) => {
                const hasMultipleActivatableRoles = roles?.length > 1;
                const hasActiveRole = activeRole != null;

                if(!hasMultipleActivatableRoles) {
                    return (hasActiveRole)
                        ? this.router.createUrlTree([route.queryParams[ROUTE_RETURN_URL_QUERY_PARAM_KEY] || DASHBOARD_ROUTE])
                        : false;
                }

                return true;
            }),
        );
    }
}
