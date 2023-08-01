import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { map, shareReplay } from "rxjs";
import { MasterDataManagementService } from "../../../../../../api/services";
import { InitPageData } from "../../../../app-common/init-page-data-provider/models/init-page-data.model";
import { BaseInitPageResolver } from "../../../../app-common/init-page-data-provider/utility/base-init-page-resolver/base-init-page-resolver.directive";


@Injectable({ providedIn: "root" })
export class PriceTablesInitPageResolver extends BaseInitPageResolver {

    private masterDataManagementService = inject(MasterDataManagementService);

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.masterDataManagementService.priceTableGetPriceTableInitPagePost({}).pipe(
            map((body) => {
                return <InitPageData>{
                    ...this.defaultInitPageData,

                    dC_PriceTableStatusList: (body?.dC_PriceTableStatusList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_PriceTableStatusId!, name: dto.name! })),
                };
            }),
            shareReplay(1),
        )
    }
}
