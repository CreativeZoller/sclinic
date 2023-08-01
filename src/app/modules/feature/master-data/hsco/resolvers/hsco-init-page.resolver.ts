import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { map, shareReplay } from "rxjs";
import { MasterDataManagementService } from "src/api/services";
import { BaseInitPageResolver } from "src/app/modules/app-common/init-page-data-provider/utility/base-init-page-resolver/base-init-page-resolver.directive";
import { InitPageData } from "../../../../app-common/init-page-data-provider/models/init-page-data.model";


@Injectable({ providedIn: "root" })
export class HSCOInitPageResolver extends BaseInitPageResolver {

    private masterDataManagementService = inject(MasterDataManagementService);

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.masterDataManagementService.initPageGetOccupationalHealthInitPagePost({}).pipe(
            map((body) => {
                return <InitPageData>{
                    ...this.defaultInitPageData,

                    dC_ExposureFrequencyList: (body?.dC_ExposureFrequencyList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_ExposureFrequencyId!, name: dto.name! })),

                    dC_OccupationalHealthTypeList: (body?.dC_OccupationalHealthTypeList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_OccupationalHealthTypeId!, name: dto.name! })),

                    dC_OccupationalHealthPriceCategoryList: (body?.dC_OccupationalHealthPriceCategoryList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_OccupationalHealthPriceCategoryId!, name: dto.name! })),

                    dC_OccupationalHealthClassificationList: (body?.dC_OccupationalHealthClassificationList || [])
                            .map((dto) => ({ dto: dto, value: dto.dC_OccupationalHealthClassificationId!, name: dto.name! })),
                };
            }),
            shareReplay(1),
        )
    }
}
