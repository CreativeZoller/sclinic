import { UnArray } from "src/app/modules/core/utility/types/un-array";
import { ScheduleTemplateSummary } from "./schedule-template-summary.model";

export type MedicalalEmployeeXService = UnArray<UnArray<ScheduleTemplateSummary["employeeDataList"]>["medicalEmployeeXService"]>;