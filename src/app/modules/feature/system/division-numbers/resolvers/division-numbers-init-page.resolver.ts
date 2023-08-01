import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { combineLatest, map, shareReplay } from "rxjs";
import { BaseInitPageResolver } from "../../../../app-common/init-page-data-provider/utility/base-init-page-resolver/base-init-page-resolver.directive";
import { InitPageData } from "../../../../app-common/init-page-data-provider/models/init-page-data.model";
import { flattenObject } from "../../../../core/utility/methods/flatten-object";
import { API_TYPE_JS_TYPE_MAPPINGS } from "../../../../../app.config";
import { Base64 } from 'js-base64';
import { MasterDataManagementService } from "../../../../../../api/services";


@Injectable({ providedIn: "root" })
export class DivisionNumbersInitPageResolver extends BaseInitPageResolver {

    private masterDataManagementService = inject(MasterDataManagementService);

    private parseAdminExport(data?: string) {
        try {
            const json = JSON.parse(Base64.decode(data!))
            // Merge prop paths == flatten object
            const flatJson: Record<string, string> = flattenObject(json["MasterDataManagementEngine"]);
            const options = Object.entries(flatJson)
                .filter(e => e != null && e[0] != null && e[1] != null)
                .map(e => [e[0], e[1].toLowerCase()])
                // Kiszűrni a nem primitív értékeket
                .filter(e => Object.keys(API_TYPE_JS_TYPE_MAPPINGS).includes(e[1].replace(/nullable/g, "").trim()))
                .map(e => ({
                    name: e[0],
                    value: {
                        path: e[0],
                        type: API_TYPE_JS_TYPE_MAPPINGS[e[1].replace(/nullable/g, "").trim()],
                        nullable: e[1].includes("nullable"),
                    }
                }));

            return options;
        } catch(e) {
            return [];
        }
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return combineLatest([
            this.masterDataManagementService.initPageGetDivisionNumberInitPagePost({}),
            this.masterDataManagementService.adminExportMasterDataEndpointsPost({}),
        ]).pipe(
            map(([body1, body2]) => {
                const data2 = body2.businessObject?.exportJson;

                return <InitPageData>{
                    ...this.defaultInitPageData,

                    dC_StatusList: (body1?.dC_StatusList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_StatusId!, name: dto.name! })),

                    divisionNumberXFieldOptions: this.parseAdminExport(data2),
                };
            }),
            shareReplay(1),
        );
    }
}
