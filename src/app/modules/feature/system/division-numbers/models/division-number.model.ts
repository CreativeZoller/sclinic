import { MasterDataManagementService } from "../../../../../../api/services";
import { UnArray } from "../../../../core/utility/types/un-array";
import { UnObservable } from "../../../../core/utility/types/un-observable";
import { UnResponse } from "../../../../core/utility/types/un-response";


type ResponseModel = UnResponse<UnObservable<ReturnType<MasterDataManagementService["divisionNumberGetDivisionNumbersByConditionPost"]>>>
export type DivisionNumber = UnArray<ResponseModel["businessObjectList"]>;
export type Grid_DivisionNumber = DivisionNumber;
