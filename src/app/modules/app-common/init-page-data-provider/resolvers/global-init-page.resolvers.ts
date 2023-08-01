import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { BaseInitPageResolver } from "../utility/base-init-page-resolver/base-init-page-resolver.directive";


@Injectable({ providedIn: "root" })
export class GlobalInitPageResolver extends BaseInitPageResolver {

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.resolveDcTables$([
            "DC_TitleTypeDTO",
        ]);
    }
}
