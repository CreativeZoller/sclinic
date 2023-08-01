import { MasterDataManagementService } from "../../../../../../api/services";
import { UnArray } from "../../../../core/utility/types/un-array";
import { UnObservable } from "../../../../core/utility/types/un-observable";
import { UnResponse } from "../../../../core/utility/types/un-response";


type ResponseModel = UnResponse<UnObservable<ReturnType<MasterDataManagementService["hSCOGetHSCOTreeListPost"]>>>
export type HSCO_Data_Model = UnArray<ResponseModel["businessObjectList"]>;

export interface SelectedHSCO {
    depth: number;
    hscoId: number | undefined;
}
