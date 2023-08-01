import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from "@angular/router";
import { combineLatest, map } from "rxjs";
import { INSUFFICIENT_PERMISSIONS_ROUTE, ROUTE_PERMISSIONS_DATA_KEY } from "../../../../app.config";
import { PermissionService } from "../services/permission.service";


@Injectable()
export class HasPermissionGuard implements CanActivate, CanActivateChild {

    private router = inject(Router);
    private permissionService = inject(PermissionService);

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.canProceed(route, state);
    }

    public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.canProceed(childRoute.parent!, state);
    }

    protected canProceed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const allowedPermissions: string[] = route?.data?.[ROUTE_PERMISSIONS_DATA_KEY];

        if (allowedPermissions == null || allowedPermissions.length == 0) return true;

        return combineLatest([
            ...allowedPermissions.map((permission) => this.permissionService.hasPermission$(permission)),
        ]).pipe(
            map((results) => results.reduce((acc, curr) => acc || curr)),
            map((hasPermission) => hasPermission
                ? true
                : this.router.createUrlTree([INSUFFICIENT_PERMISSIONS_ROUTE])
            ),
        );
    }
}
