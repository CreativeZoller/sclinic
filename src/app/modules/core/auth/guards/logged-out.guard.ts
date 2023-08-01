import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from "@angular/router";
import { map } from "rxjs";
import { ROLE_SELECT_ROUTE, ROUTE_RETURN_URL_QUERY_PARAM_KEY } from "../../../../app.config";
import { AuthService } from "../services/auth.service";


@Injectable()
export class LoggedOutGuard implements CanActivate, CanActivateChild {

    private authService = inject(AuthService);
    private router = inject(Router);

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.canProceed(route, state);
    }

    public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.canProceed(childRoute.parent!, state);
    }

    protected canProceed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authService.isLoggedIn$().pipe(
            map((isLoggedIn) => {
                const isLoggedOut = !isLoggedIn;

                if (!isLoggedOut) return this.router.createUrlTree([
                    route.queryParams[ROUTE_RETURN_URL_QUERY_PARAM_KEY] || ROLE_SELECT_ROUTE
                ]);

                return true;
            }),
        );
    }
}
