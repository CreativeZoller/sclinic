import { DictionaryProviderWebServiceService } from "../../../../../../api/services";
import { UnArray } from "../../../../core/utility/types/un-array";
import { UnObservable } from "../../../../core/utility/types/un-observable";
import { UnResponse } from "../../../../core/utility/types/un-response";


type ResponseModel = UnResponse<UnObservable<ReturnType<DictionaryProviderWebServiceService["cityGetDCCitiesByConditionPost"]>>>
export type City = UnArray<ResponseModel["businessObjectList"]>;
export type Grid_City = City;
