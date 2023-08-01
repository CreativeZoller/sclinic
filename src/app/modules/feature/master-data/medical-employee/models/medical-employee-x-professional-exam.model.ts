import { UnArray } from "../../../../core/utility/types/un-array";
import { MedicalEmployee } from "./medical-employee.model";


export type MedicalEmployeeXProfessionalExam = UnArray<NonNullable<MedicalEmployee["medicalEmployeeXPUPHAX_ProfessionalExamCode"]>>;
