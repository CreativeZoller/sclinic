import { MasterDataManagementService } from "../../../../../../api/services";
import { UnArray } from "../../../../core/utility/types/un-array";
import { UnObservable } from "../../../../core/utility/types/un-observable";
import { UnResponse } from "../../../../core/utility/types/un-response";


type ResponseModel = UnResponse<UnObservable<ReturnType<MasterDataManagementService["priceTableGetPriceTableByConditionPost"]>>>
export type PriceTable = UnArray<ResponseModel["businessObjectList"]>;
export type PriceTableStatus = NonNullable<PriceTable["dC_PriceTableStatus"]>;
