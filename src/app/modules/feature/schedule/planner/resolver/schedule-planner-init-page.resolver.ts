import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { map, shareReplay, switchMap } from "rxjs";
import { MasterDataManagementService, ResourceManagementService } from "../../../../../../api/services";
import { InitPageData } from "../../../../app-common/init-page-data-provider/models/init-page-data.model";
import { BaseInitPageResolver } from "../../../../app-common/init-page-data-provider/utility/base-init-page-resolver/base-init-page-resolver.directive";


@Injectable({ providedIn: "root" })
export class SchedulePlannerInitPageResolver extends BaseInitPageResolver {

    private resourceManagementService = inject(ResourceManagementService);
    private masterDataManagementService = inject(MasterDataManagementService);

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.resourceManagementService.initPageGetPlannedScheduleInitPagePost({})
            .pipe(
                switchMap((value) => {
                    return this.masterDataManagementService.initPageGetClinicInitPagePost({}).pipe(
                    map((body) => {
                        return <InitPageData>{
                            ...this.defaultInitPageData,

                            dC_ClinicRoomStateList: (body?.dC_ClinicRoomStateDTOList || [])
                                .map((dto) => ({ dto: dto, value: dto.dC_ClinicRoomStateId!, name: dto.name!})),

                            dC_ClinicTypeList: (body?.dC_ClinicTypeDTOList || [])
                                .map((dto) => ({ dto: dto, value: dto.dC_ClinicTypeId!, name: dto.name!})),

                            dC_DayList: (body?.dC_DayDTOList || [])
                                .map((dto) => ({ dto: dto, value: dto.dC_DayId!, name: dto.name!})),

                            dC_WeekTypeList: (body?.dC_WeekTypeDTOList || [])
                                .map((dto) => ({ dto: dto, value: dto.dC_WeekTypeId!, name: dto.name!})),

                            dC_BookingAreaList: (body?.dC_BookingAreaList || [])
                                .map((dto) => ({ dto: dto, value: dto.dC_BookingAreaId!, name: dto.name!})),

                            dC_NEHIProvisionTypeList: (body?.nehI_ProvisionTypeDTOList || [])
                                .map((dto) => ({ dto: dto, value: dto.nehI_ProvisionTypeId!, name: dto.name!})),

                            dC_CountryList: (body?.dC_CountryDTOList || [])
                                .map((dto) => ({ dto: dto, value: dto.dC_CountryId!, name: dto.name!})),

                            dC_CountyList: (body?.dC_CountyDTOList || [])
                                .map((dto) => ({ dto: dto, value: dto.dC_CountyId!, name: dto.name!})),

                            dC_CityList: (body?.dC_CityDTOList || [])
                                .map((dto) => ({ dto: dto, value: dto.dC_CityId!, name: dto.name!})),

                            dC_PublicPlaceCategoryList: (body?.dC_PublicPlaceCategoryList || [])
                                .map((dto) => ({ dto: dto, value: dto.dC_PublicPlaceCategoryId!, name: dto.name!})),

                            dC_FloorList: (body?.dC_FloorList || [])
                                .map((dto) => ({ dto: dto, value: dto.dC_FloorId!, name: dto.name!})),



                            dC_MedicalEmployeeScheduleTypeList: (value?.dC_MedicalEmployeeScheduleTypeList || [])
                                .map((dto) => ({ dto: dto, value: dto.dC_MedicalEmployeeScheduleTypeId!, name: dto.name! })),

                            dC_ScheduleSpecialTypeList: (value?.dC_ScheduleSpecialTypeList || [])
                                .map((dto) => ({ dto: dto, value: dto.dC_ScheduleSpecialTypeId!, name: dto.name! })),

                        }
                    }),
                    shareReplay(1),
                )}),
                shareReplay(1),
            )
    }
}
