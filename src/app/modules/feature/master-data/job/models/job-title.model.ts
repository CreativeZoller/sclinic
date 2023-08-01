import { MasterDataManagementService } from "../../../../../../api/services";
import { UnArray } from "../../../../core/utility/types/un-array";
import { UnObservable } from "../../../../core/utility/types/un-observable";
import { UnResponse } from "../../../../core/utility/types/un-response";


type ResponseModel = UnResponse<UnObservable<ReturnType<MasterDataManagementService["jobTitleGetJobTitleByConditionPost"]>>>
export type JobTitle = UnArray<ResponseModel["businessObjectList"]>;
export type Full_Model_OccupationalHealth = UnArray<JobTitle["occupationalHealth"]>;
