import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { map, shareReplay } from "rxjs";
import { BaseInitPageResolver } from "../../../../app-common/init-page-data-provider/utility/base-init-page-resolver/base-init-page-resolver.directive";
import { InitPageData } from "../../../../app-common/init-page-data-provider/models/init-page-data.model";
import { MasterDataManagementService } from "../../../../../../api/services";


@Injectable({providedIn: "root"})
export class ServicePackagesInitPageResolver extends BaseInitPageResolver {

    private masterDataManagementService = inject(MasterDataManagementService);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.masterDataManagementService.servicePackageGetServicePackageInitPagePost({}).pipe(
        map((body) => {
            return <InitPageData>{
                ...this.defaultInitPageData,

                dC_ServicePackageCategoryList: (body?.dC_ServicePackageCategoryList || [])
                    .map((dto) => ({ dto: dto, value: dto.dC_ServicePackageCategoryId!, name: dto.name!})),

                dC_BookingAreaList: (body?.dC_BookingAreaList || [])
                    .map((dto) => ({ dto: dto, value: dto.dC_BookingAreaId!, name: dto.name!})),

                dC_ServicePackageTypeList: (body?.dC_ServicePackageTypeList || [])
                    .map((dto) => ({ dto: dto, value: dto.dC_ServicePackageTypeId!, name: dto.name!})),

                dC_StatusList: (body?.dC_StatusList || [])
                    .map((dto) => ({ dto: dto, value: dto.dC_StatusId!, name: dto.name!})),

                roles: (body?.roleList || [])
                    .map((dto) => ({ dto: dto, value: dto.roleId!, name: dto.roleName!})),

            }
        }),
        shareReplay(1),
    )
  }
}
