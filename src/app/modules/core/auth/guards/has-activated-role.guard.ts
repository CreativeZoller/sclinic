import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from "@angular/router";
import { map } from "rxjs";
import { ROLE_SELECT_ROUTE, ROUTE_RETURN_URL_QUERY_PARAM_KEY } from "../../../../app.config";
import { RoleService } from "../services/role.service";


@Injectable()
export class HasActivatedRoleGuard implements CanActivate, CanActivateChild {

    private roleService = inject(RoleService);
    private router = inject(Router);

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.canProceed(route, state);
    }

    public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.canProceed(childRoute.parent!, state);
    }

    protected canProceed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.roleService.getActiveRole$().pipe(
            map((activeRole) => {
                const hasActivatedRole = activeRole != null;

                if (!hasActivatedRole) {
                    return this.router.createUrlTree([ROLE_SELECT_ROUTE], { queryParams: {
                        [ROUTE_RETURN_URL_QUERY_PARAM_KEY]: route.queryParams[ROUTE_RETURN_URL_QUERY_PARAM_KEY] || state.url,
                    }});
                }

                return true;
            }),
        );
    }
}
