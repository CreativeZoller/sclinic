import { UnArray } from "../../../../core/utility/types/un-array";
import { MedicalEmployee } from "./medical-employee.model";


export type MedicalEmployeeXContract = UnArray<NonNullable<MedicalEmployee["medicalContract"]>>;
