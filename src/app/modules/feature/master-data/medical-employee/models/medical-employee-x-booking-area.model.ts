import { UnArray } from "../../../../core/utility/types/un-array";
import { MedicalEmployee } from "./medical-employee.model";


export type MedicalEmployeeXBookingArea = UnArray<NonNullable<MedicalEmployee["medicalEmployeeXDC_BookingArea"]>>;
