import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { map, shareReplay } from "rxjs";
import { BaseInitPageResolver } from "../../../../app-common/init-page-data-provider/utility/base-init-page-resolver/base-init-page-resolver.directive";
import { InitPageData } from "../../../../app-common/init-page-data-provider/models/init-page-data.model";
import { MasterDataManagementService } from "../../../../../../api/services";


@Injectable({providedIn: "root"})
export class ServicesInitPageResolver extends BaseInitPageResolver {

    private masterDataManagementService = inject(MasterDataManagementService);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.masterDataManagementService.initPageGetServiceInitPagePost({}).pipe(
        map((body) => {
            return <InitPageData>{
                ...this.defaultInitPageData,

                dC_ServiceCategoryList: (body?.dC_ServiceCategoryList || [])
                    .map((dto) => ({ dto: dto, value: dto.dC_ServiceCategoryId!, name: dto.name!})),

                dC_BookingAreaList: (body?.dC_BookingAreaList || [])
                    .map((dto) => ({ dto: dto, value: dto.dC_BookingAreaId!, name: dto.name!})),

                dC_ServiceTypeList: (body?.dC_ServiceTypeList || [])
                    .map((dto) => ({ dto: dto, value: dto.dC_ServiceTypeId!, name: dto.name!})),

                dC_StatusList: (body?.dC_StatusList || [])
                    .map((dto) => ({ dto: dto, value: dto.dC_StatusId!, name: dto.name!})),

                dC_ItemTypeList: (body?.dC_ItemTypeList || [])
                    .map((dto) => ({ dto: dto, value: dto.dC_ItemTypeId!, name: dto.name!})),

                dC_ItemConsumerTypeList: (body?.dC_ItemConsumerTypeList || [])
                    .map((dto) => ({ dto: dto, value: dto.dC_ItemConsumerTypeId!, name: dto.name!})),

                dC_LabProviderList: (body?.dC_LabProviderList || [])
                    .map((dto) => ({ dto: dto, value: dto.dC_LabProviderId!, name: dto.name!})),

                dC_MarkerList: (body?.dC_MarkerList || [])
                    .map((dto) => ({ dto: dto, value: dto.dC_MarkerId!, name: dto.name!})),

                roles: (body?.roleList || [])
                    .map((dto) => ({ dto: dto, value: dto.roleId!, name: dto.roleName!})),

                dC_ServicePackageCategoryList: (body?.dC_ServicePackageCategoryList || [])
                    .map((dto) => ({ dto: dto, value: dto.dC_ServicePackageCategoryId!, name: dto.name!})),

                dC_ServicePackageTypeList: (body?.dC_ServicePackageTypeList || [])
                    .map((dto) => ({ dto: dto, value: dto.dC_ServicePackageTypeId!, name: dto.name!})),
            }
        }),
        shareReplay(1),
    )
  }
}
