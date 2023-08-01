import { UnArray } from "../../../../core/utility/types/un-array";
import { Service } from "./service.model";


export type ServiceXMedicalEmployee = UnArray<NonNullable<Service["medicalEmployeeXService"]>>;
export type Service_MedicalEmployee = NonNullable<UnArray<NonNullable<Service["medicalEmployeeXService"]>>["medicalEmployee"]>;
