import { UnArray } from "../../../../core/utility/types/un-array";
import { Patient } from "./patient.model";


export type PatientXEmployment = UnArray<NonNullable<Patient["patientXEmployment"]>>;
