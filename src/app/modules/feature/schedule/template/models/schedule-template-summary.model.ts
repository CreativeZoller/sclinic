import { ResourceManagementService } from "src/api/services";
import { UnObservable } from "src/app/modules/core/utility/types/un-observable";
import { UnResponse } from "src/app/modules/core/utility/types/un-response";


export type ScheduleTemplateSummary = UnResponse<UnObservable<ReturnType<ResourceManagementService["scheduleTemplateGetScheduleTemplateSummaryPost"]>>>;