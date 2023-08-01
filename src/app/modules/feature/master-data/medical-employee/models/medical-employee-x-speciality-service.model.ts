import { UnArray } from "../../../../core/utility/types/un-array";
import { MedicalEmployee } from "./medical-employee.model";


export type MedicalEmployeeXSpecialityService = UnArray<NonNullable<MedicalEmployee["medicalEmployeeXService"]>>;
