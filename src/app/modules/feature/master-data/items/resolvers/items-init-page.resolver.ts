import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { map, shareReplay } from "rxjs";
import { MasterDataManagementService } from "../../../../../../api/services";
import { BaseInitPageResolver } from "../../../../app-common/init-page-data-provider/utility/base-init-page-resolver/base-init-page-resolver.directive";
import { InitPageData } from "../../../../app-common/init-page-data-provider/models/init-page-data.model";


@Injectable({ providedIn: "root" })
export class ItemsInitPageResolver extends BaseInitPageResolver {

    private masterDataManagementService = inject(MasterDataManagementService);

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.masterDataManagementService.initPageGetItemInitPagePost({}).pipe(
            map((body) => {
                return <InitPageData>{
                    ...this.defaultInitPageData,

                    dC_ItemStatusList: (body?.dC_ItemStatusList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_ItemStatusId!, name: dto.name! })),

                    dC_ItemCategoryList: (body?.dC_ItemCategoryList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_ItemCategoryId!, name: dto.name! })),

                    dC_ItemTypeList: (body?.dC_ItemTypeList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_ItemTypeId!, name: dto.name! })),

                    dC_ItemProcurationalCategoryList: (body?.dC_ItemProcurationalCategoryList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_ItemProcurationalCategoryId!, name: dto.name! })),
                };
            }),
            shareReplay(1),
        )
    }
}
