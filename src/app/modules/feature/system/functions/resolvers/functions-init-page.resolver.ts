import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { map, shareReplay } from "rxjs";
import { BaseInitPageResolver } from "../../../../app-common/init-page-data-provider/utility/base-init-page-resolver/base-init-page-resolver.directive";
import { InitPageData } from "../../../../app-common/init-page-data-provider/models/init-page-data.model";
import { AuthenticationWebServiceService } from "../../../../../../api/services";


@Injectable({ providedIn: "root" })
export class FunctionsInitPageResolver extends BaseInitPageResolver {

    private authenticationWebServiceService = inject(AuthenticationWebServiceService);

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authenticationWebServiceService.initPageGetFunctionInitPagePost({}).pipe(
            map((body) => {
                return <InitPageData>{
                    ...this.defaultInitPageData,

                    dC_FunctionTypeList: (body?.dC_FunctionTypeDTOList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_FunctionTypeId!, name: dto.functionTypeName! })),
                };
            }),
            shareReplay(1),
        )
    }
}
