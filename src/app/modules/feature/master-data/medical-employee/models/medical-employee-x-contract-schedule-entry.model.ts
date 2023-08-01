import { UnArray } from "../../../../core/utility/types/un-array";
import { MedicalEmployeeXContract } from "./medical-employee-x-contract.model";


export type MedicalEmployeeXContractScheduleEntry = Pick<
    UnArray<MedicalEmployeeXContract["medicalContractPeriod"]>,
    "startTime" | "endTime" | "amount" | "dC_ScheduleSpecialTypeId"
>;
