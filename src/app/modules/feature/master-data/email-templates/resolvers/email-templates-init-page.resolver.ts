import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { map, shareReplay } from "rxjs";
import { MasterDataManagementService } from "../../../../../../api/services";
import { BaseInitPageResolver } from "../../../../app-common/init-page-data-provider/utility/base-init-page-resolver/base-init-page-resolver.directive";
import { InitPageData } from "../../../../app-common/init-page-data-provider/models/init-page-data.model";


@Injectable({ providedIn: "root" })
export class EmailTemplatesInitPageResolver extends BaseInitPageResolver {

    private MasterDataManagementService = inject(MasterDataManagementService);

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.MasterDataManagementService.initPageGetEmailTemplateInitPagePost({}).pipe(
            map((body) => {
                return <InitPageData>{
                    ...this.defaultInitPageData,

                    dC_EmailTemplateCategoryList: (body?.dC_EmailTemplateCategoryList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_EmailTemplateCategoryId!, name: dto.name! })),
                };
            }),
            shareReplay(1),
        )
    }
}
