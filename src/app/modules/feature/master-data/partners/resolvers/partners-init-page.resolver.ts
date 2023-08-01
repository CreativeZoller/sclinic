import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { map, shareReplay } from "rxjs";
import { MasterDataManagementService } from "../../../../../../api/services";
import { BaseInitPageResolver } from "../../../../app-common/init-page-data-provider/utility/base-init-page-resolver/base-init-page-resolver.directive";
import { InitPageData } from "../../../../app-common/init-page-data-provider/models/init-page-data.model";


@Injectable({ providedIn: "root" })
export class PartnersInitPageResolver extends BaseInitPageResolver {

    private masterDataManagementService = inject(MasterDataManagementService);

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.masterDataManagementService.initPageGetPartnerInitPagePost({}).pipe(
            map((body) => {
                return <InitPageData>{
                    ...this.defaultInitPageData,

                    dC_TitleTypeList: (body?.dC_TitleTypeDTOList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_TitleTypeId!, name: dto.name! })),

                    dC_CompanyTypeList: (body?.dC_CompanyTypeDTOList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_CompanyTypeId!, name: dto.name! })),

                    dC_PartnerTypeList: (body?.dC_PartnerTypeDTOList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_PartnerTypeId!, name: dto.name! })),

                    dC_PartnerModeList: (body?.dC_PartnerModeList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_PartnerModeId!, name: dto.name! })),

                    dC_InvoiceModeList: (body?.dC_InvoiceModeDTOList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_InvoiceModeId!, name: dto.name! })),

                    dC_PatientAddressTypeList: (body?.dC_PatientAddressTypeList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_PatientAddressTypeId!, name: dto.name! })),

                    dC_PublicPlaceCategoryList: (body?.dC_PublicPlaceCategoryList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_PublicPlaceCategoryId!, name: dto.name! })),

                    dC_ContactTypeList: (body?.dC_ContactTypeList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_ContactTypeId!, name: dto.name! })),

                    dC_PatientIdTypeList: (body?.dC_PatientIdTypeDTOList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_PatientIdTypeId!, name: dto.name! })),

                    dC_PatientIdTypeCategoryList: (body?.dC_PatientIdTypeCategoryList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_PatientIdTypeCategoryId!, name: dto.name! })),
                };
            }),
            shareReplay(1),
        )
    }
}
