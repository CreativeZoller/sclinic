import { UnArray } from "../../../../core/utility/types/un-array";
import { Patient } from "./patient.model";


export type PatientXId = UnArray<NonNullable<Patient["patientXPatientIdType"]>>;
