import { UnArray } from "../../../../core/utility/types/un-array";
import { MedicalEmployee } from "./medical-employee.model";


export type MedicalEmployeeXContact = UnArray<NonNullable<MedicalEmployee["medicalEmployeeXContact"]>>;
