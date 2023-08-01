import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { map, Observable, shareReplay } from "rxjs";
import { InitPageData } from "../../models/init-page-data.model";
import { DcTableInitPagePropertyName, DcTableName, dcTableNameList } from "../../models/dc-table.model";
import { getDcTableIdPropertyName, getDcTableInitPagePropertyName } from "../helpers/dc-table.helpers";
import { DictionaryProviderWebServiceService } from "../../../../../../api/services";
import { inject } from "@angular/core";


export abstract class BaseInitPageResolver implements Resolve<InitPageData> {

    abstract resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InitPageData>;

    protected dictionaryProviderWebServiceService = inject(DictionaryProviderWebServiceService);

    protected defaultInitPageData: InitPageData = {
        overuser: [],
        isInDebt: [],
        isBanned: [],
        rightList: [],
        dC_FunctionTypeList: [],
        roles: [],
        divisionNumberXFieldOptions: [],

        ...this.mergeObjects(
            dcTableNameList.map((dcTableName) => {
                return {
                    [getDcTableInitPagePropertyName(dcTableName)]: [] as any[],
                } as Record<DcTableInitPagePropertyName, any[]>;
            })
        ),
    }

    protected mergeObjects<T extends {}>(objList: T[]): T {
        return (objList ?? []).reduce((pv, cv) => ({...cv, ...pv}), {}) as T;
    }

    protected resolveDcTables$(dcTableNameList: DcTableName[]): Observable<InitPageData> {
        return this.dictionaryProviderWebServiceService.dCGetDCTableDTOListPost({
            tableNameList: dcTableNameList
        }).pipe(
            map((res: any) => {
                let initPageData = <InitPageData>{ ...this.defaultInitPageData };

                for(const row of (res?.businessObjectList ?? [])) {
                    const initPageProp = getDcTableInitPagePropertyName(row?.tableName);
                    const idProp = getDcTableIdPropertyName(row?.tableName);

                    if (row?.tableName && initPageProp && idProp) {
                        initPageData[initPageProp as keyof InitPageData] = [
                            ...(row?.dcList ?? []).map((dto: any) => ({
                                dto: dto,
                                value: dto[idProp]!,
                                name: dto.name,
                            })),
                        ]
                    }
                }

                return initPageData;
            }),
            shareReplay(1),
        )
    }
}
