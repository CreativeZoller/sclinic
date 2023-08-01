import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { map, shareReplay } from "rxjs";
import { ResourceManagementService } from "../../../../../../api/services";
import { InitPageData } from "../../../../app-common/init-page-data-provider/models/init-page-data.model";
import { BaseInitPageResolver } from "../../../../app-common/init-page-data-provider/utility/base-init-page-resolver/base-init-page-resolver.directive";


@Injectable({ providedIn: "root" })
export class ScheduleGenerateInitPageResolver extends BaseInitPageResolver {

    private resourceManagementService = inject(ResourceManagementService);

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.resourceManagementService.initPageGetPlannedScheduleInitPagePost({}).pipe(
            map((body) => {
                return <InitPageData>{
                    ...this.defaultInitPageData,

                    dC_WeekTypeList: (body?.dC_WeekTypeList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_WeekTypeId!, name: dto.name! })),

                    dC_BookingAreaList: (body?.dC_BookingAreaList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_BookingAreaId!, name: dto.name! })),
                };
            }),
            shareReplay(1),
        )
    }
}
