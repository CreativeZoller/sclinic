import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { UntilDestroy } from "@ngneat/until-destroy";
import { Observable, of } from "rxjs";
import { BaseInitPageResolver } from "../utility/base-init-page-resolver/base-init-page-resolver.directive";
import { InitPageData } from "../models/init-page-data.model";


@UntilDestroy()
@Injectable()
export class InitPageDataProviderService extends BaseInitPageResolver {

    public getInitData(_activatedRouteSnapshot: ActivatedRouteSnapshot) {
        let initPageData: InitPageData = { ...this.defaultInitPageData };

        for (const activatedRouteSnapshot of _activatedRouteSnapshot.pathFromRoot) {
            initPageData = {
                ...initPageData,
                ...activatedRouteSnapshot?.data?.["init"],
            };
        }

        return initPageData;
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InitPageData> {
        return of(this.getInitData(route));
    }
}
