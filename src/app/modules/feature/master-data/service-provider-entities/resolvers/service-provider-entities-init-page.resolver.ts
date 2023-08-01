import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { map, shareReplay } from "rxjs";
import { MasterDataManagementService } from "../../../../../../api/services";
import { BaseInitPageResolver } from "../../../../app-common/init-page-data-provider/utility/base-init-page-resolver/base-init-page-resolver.directive";
import { InitPageData } from "../../../../app-common/init-page-data-provider/models/init-page-data.model";


@Injectable({ providedIn: "root" })
export class ServiceProviderEntitiesInitPageResolver extends BaseInitPageResolver {

    private masterDataManagementService = inject(MasterDataManagementService);

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.masterDataManagementService.selfGetSelfInitPagePost({}).pipe(
            map((body) => {
                return <InitPageData>{
                    ...this.defaultInitPageData,

                    dC_PartnerTypeList: (body?.dC_PartnerTypeList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_PartnerTypeId!, name: dto.name! })),

                    dC_PartnerModeList: (body?.dC_PartnerModeList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_PartnerModeId!, name: dto.name! })),

                    dC_CompanyTypeList: (body?.dC_CompanyTypeDTOList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_CompanyTypeId!, name: dto.name! })),

                    dC_InvoiceModeList: (body?.dC_InvoiceModeDTOList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_InvoiceModeId!, name: dto.name! })),

                    dC_PublicPlaceCategoryList: (body?.dC_PublicPlaceCategoryDTOList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_PublicPlaceCategoryId!, name: dto.name! })),
                };
            }),
            shareReplay(1),
        )
    }
}
