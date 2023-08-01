import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { map, shareReplay } from "rxjs";
import { MasterDataManagementService } from "../../../../../../api/services";
import { BaseInitPageResolver } from "../../../../app-common/init-page-data-provider/utility/base-init-page-resolver/base-init-page-resolver.directive";
import { InitPageData } from "../../../../app-common/init-page-data-provider/models/init-page-data.model";


@Injectable({ providedIn: "root" })
export class MedicalEmployeesInitPageResolver extends BaseInitPageResolver {

    private masterDataManagementService = inject(MasterDataManagementService);

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.masterDataManagementService.initPageGetMedicalEmployeeInitPagePost({}).pipe(
            map((body) => {
                return <InitPageData>{
                    ...this.defaultInitPageData,

                    dC_TitleTypeList: (body?.dC_TitleTypeDTOList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_TitleTypeId!, name: dto.name! })),

                    dC_LanguageList: (body?.dC_LanguageDTOList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_LanguageId!, name: dto.name! })),

                    dC_BookingAreaList: (body?.dC_BookingAreaList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_BookingAreaId!, name: dto.name! })),

                    dC_ContactTypeList: (body?.dC_ContactTypeList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_ContactTypeId!, name: dto.name! })),

                    dC_PublicPlaceCategoryList: (body?.dC_PublicPlaceCategoryList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_PublicPlaceCategoryId!, name: dto.name! })),

                    dC_WeekTypeList: (body?.dC_WeekTypeList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_WeekTypeId!, name: dto.name! })),

                    dC_DayList: (body?.dC_DayList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_DayId!, name: dto.name! })),

                    dC_ScheduleSpecialTypeList: (body?.dC_ScheduleSpecialTypeList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_ScheduleSpecialTypeId!, name: dto.name! })),
                };
            }),
            shareReplay(1),
        )
    }
}
