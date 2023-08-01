import { MasterDataManagementService } from "../../../../../../api/services";
import { UnArray } from "../../../../core/utility/types/un-array";
import { UnObservable } from "../../../../core/utility/types/un-observable";
import { UnResponse } from "../../../../core/utility/types/un-response";


type ResponseModel = UnResponse<UnObservable<ReturnType<MasterDataManagementService["hSCOGetHSCOByConditionPost"]>>>
export type HSCO_Model = UnArray<ResponseModel["businessObjectList"]>;
export type Health_OccupationalHealth_Model = UnArray<HSCO_Model["occupationalHealth"]>;
