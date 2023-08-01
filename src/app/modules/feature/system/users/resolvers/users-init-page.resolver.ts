import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { map, shareReplay } from "rxjs";
import { BaseInitPageResolver } from "../../../../app-common/init-page-data-provider/utility/base-init-page-resolver/base-init-page-resolver.directive";
import { InitPageData } from "../../../../app-common/init-page-data-provider/models/init-page-data.model";
import { AuthenticationWebServiceService } from "../../../../../../api/services";


@Injectable({ providedIn: "root" })
export class UsersInitPageResolver extends BaseInitPageResolver {

    private authenticationWebServiceService = inject(AuthenticationWebServiceService);

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authenticationWebServiceService.initPageGetSwissUserInitPagePost({}).pipe(
            map((body) => {
                return <InitPageData>{
                    ...this.defaultInitPageData,

                    dC_TitleTypeList: (body?.dC_TitleTypeDTOList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_TitleTypeId!, name: dto.name! })),

                    dC_TwoFactorAuthenticationTypeList: (body?.dC_TwoFactorAuthenticationTypeDTOList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_TwoFactorAuthenticationTypeId!, name: dto.name! })),

                    dC_UserStatusList: (body?.dC_UserStatusDTOList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_UserStatusId!, name: dto.name! })),

                    dC_UserTypeList: (body?.dC_UserTypeDTOList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_UserTypeId!, name: dto.name! })),

                    roles: (body?.roles || [])
                        .map((dto) => ({ dto: dto, value: dto.roleId!, name: dto.roleName! })),
                };
            }),
            shareReplay(1),
        )
    }
}
