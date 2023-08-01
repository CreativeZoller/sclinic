import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { map, shareReplay } from "rxjs";
import { MasterDataManagementService } from "src/api/services";
import { BaseInitPageResolver } from "src/app/modules/app-common/init-page-data-provider/utility/base-init-page-resolver/base-init-page-resolver.directive";
import { InitPageData } from "../../../../app-common/init-page-data-provider/models/init-page-data.model";


@Injectable({providedIn: "root"})
export class LabsInitPageResolver extends BaseInitPageResolver {

    private masterDataManagementService = inject(MasterDataManagementService);

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.masterDataManagementService.initPageGetLabInitPagePost({}).pipe(
            map((body) => {
                return <InitPageData>{
                    ...this.defaultInitPageData,

                    dC_MarkerList: (body?.dC_MarkerList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_MarkerId!, name: dto.name! })),

                    dC_SamplingItemList: (body?.dC_SamplingItemList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_SamplingItemId!, name: dto.name! })),

                    dC_LabRepeatPeriodList: (body?.dC_LabRepeatPeriodList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_LabRepeatPeriodId!, name: dto.name! })),

                    dC_LabSamplingTypeList: (body?.dC_LabSamplingTypeList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_LabSamplingTypeId!, name: dto.name! })),

                    dC_LabProviderList: (body?.dC_LabProviderList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_LabProviderId!, name: dto.name! })),
                };
            }),
            shareReplay(1),
        )
      }
}
