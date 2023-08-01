import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { map, shareReplay } from "rxjs";
import { MasterDataManagementService } from "../../../../../../api/services";
import { BaseInitPageResolver } from "../../../../app-common/init-page-data-provider/utility/base-init-page-resolver/base-init-page-resolver.directive";
import { InitPageData } from "../../../../app-common/init-page-data-provider/models/init-page-data.model";


@Injectable({ providedIn: "root" })
export class DocumentTemplatesInitPageResolver extends BaseInitPageResolver {

    private masterDataManagementService = inject(MasterDataManagementService);

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.masterDataManagementService.initPageGetDocumentTemplateInitPagePost({}).pipe(
            map((body) => {
                return <InitPageData>{
                    ...this.defaultInitPageData,

                    dC_DocumentTemplateCategoryList: (body?.dC_DocumentTemplateCategoryList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_DocumentTemplateCategoryId!, name: dto.name! })),
                };
            }),
            shareReplay(1),
        )
    }
}
