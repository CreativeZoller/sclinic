import { UnArray } from "../../../../core/utility/types/un-array";
import { Patient } from "./patient.model";


export type PatientXInsuranceDetail = UnArray<NonNullable<Patient["patientInsuranceDetail"]>>;
