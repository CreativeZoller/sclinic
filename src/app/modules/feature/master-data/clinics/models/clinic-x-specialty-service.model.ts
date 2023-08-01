import { UnArray } from "../../../../core/utility/types/un-array";
import { Clinic } from "./clinic.model";


export type ClinicXSpecialtyService = UnArray<NonNullable<Clinic["clinicXSpecialtyXService"]>>;
