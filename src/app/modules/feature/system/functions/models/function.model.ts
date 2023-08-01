import { AuthenticationWebServiceService } from "../../../../../../api/services";
import { UnArray } from "../../../../core/utility/types/un-array";
import { UnObservable } from "../../../../core/utility/types/un-observable";
import { UnResponse } from "../../../../core/utility/types/un-response";


type ResponseModel = UnResponse<UnObservable<ReturnType<AuthenticationWebServiceService["functionGetFunctionByConditionPost"]>>>
export type Function = UnArray<ResponseModel["businessObjectList"]>;
