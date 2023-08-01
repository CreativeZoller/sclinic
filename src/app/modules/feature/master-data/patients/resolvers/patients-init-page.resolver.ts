import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { map, shareReplay } from "rxjs";
import { MasterDataManagementService } from "../../../../../../api/services";
import { BaseInitPageResolver } from "../../../../app-common/init-page-data-provider/utility/base-init-page-resolver/base-init-page-resolver.directive";
import { InitPageData } from "../../../../app-common/init-page-data-provider/models/init-page-data.model";


@Injectable({providedIn: "root"})
export class PatientsInitPageResolver extends BaseInitPageResolver {

    private masterDataManagementService = inject(MasterDataManagementService);

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.masterDataManagementService.initPageGetPatientInitPagePost({}).pipe(
            map((body) => {
                return <InitPageData>{
                    ...this.defaultInitPageData,

                    dC_LanguageList: (body?.dC_LanguageList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_LanguageId!, name: dto.name! })),

                    dC_TitleTypeList: (body?.dC_TitleTypeList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_TitleTypeId!, name: dto.name! })),

                    dC_PatientIdTypeList: (body?.dC_PatientIdTypeList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_PatientIdTypeId!, name: dto.name! })),

                    dC_PatientAddressTypeList: (body?.dC_PatientAddressTypeList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_PatientAddressTypeId!, name: dto.name! })),

                    dC_VIPList: (body?.dC_VIPList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_VIPId!, name: dto.name! })),

                    dC_NationalityList: (body?.dC_NationalityList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_NationalityId!, name: dto.name! })),

                    dC_GenderList: (body?.dC_GenderList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_GenderId!, name: dto.name! })),

                    dC_PublicPlaceCategoryList: (body?.dC_PublicPlaceCategoryList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_PublicPlaceCategoryId!, name: dto.name! })),

                    dC_ContactTypeList: (body?.dC_ContactTypeList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_ContactTypeId!, name: dto.name! })),

                    dC_PatientIdTypeCategoryList: (body?.dC_PatientIdTypeCategoryList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_PatientIdTypeCategoryId!, name: dto.name! })),

                    dC_StatusList: (body?.dC_StatusList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_StatusId!, name: dto.name! })),

                    dC_OccupationalHealthClassificationList: (body?.dC_OccupationalHealthClassificationList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_OccupationalHealthClassificationId!, name: dto.name! })),
                }
            }),
            shareReplay(1),
        )
    }
}
