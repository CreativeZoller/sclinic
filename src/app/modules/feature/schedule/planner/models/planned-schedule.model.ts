import { ResourceManagementService } from "src/api/services";
import { UnArray } from "src/app/modules/core/utility/types/un-array";
import { UnObservable } from "src/app/modules/core/utility/types/un-observable";
import { UnResponse } from "src/app/modules/core/utility/types/un-response";


type ResponseModel = UnResponse<UnObservable<ReturnType<ResourceManagementService["plannedScheduleGetPlannedScheduleByConditionPost"]>>>;
export type PlannedSchedule = UnArray<ResponseModel["plannedScheduleList"]>;