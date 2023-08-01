import { UnArray } from "../../../../core/utility/types/un-array";
import { Clinic } from "./clinic.model";


export type Full_Model_ClinicRoom = UnArray<NonNullable<Clinic["clinicRooms"]>>;
