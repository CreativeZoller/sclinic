import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { map, shareReplay } from "rxjs";
import { BaseInitPageResolver } from "src/app/modules/app-common/init-page-data-provider/utility/base-init-page-resolver/base-init-page-resolver.directive";
import { DictionaryProviderWebServiceService } from "../../../../../../api/services";
import { InitPageData } from "../../../../app-common/init-page-data-provider/models/init-page-data.model";


@Injectable({providedIn: "root"})
export class CitiesInitPageResolver extends BaseInitPageResolver {

    protected dictionaryProviderWebServiceService = inject(DictionaryProviderWebServiceService);

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.dictionaryProviderWebServiceService.cityGetDCCityInitPagePost({}).pipe(
            map((body) => {
                return <InitPageData>{
                    ...this.defaultInitPageData,

                    dC_CountyList: (body?.dC_CountyList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_CountyId!, name: dto.name! })),

                    dC_CountryList: (body?.dC_CountryList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_CountryId!, name: dto.name! })),
                };
            }),
            shareReplay(1),
        )
      }
}
