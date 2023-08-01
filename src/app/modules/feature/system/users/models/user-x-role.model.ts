import { UnArray } from "../../../../core/utility/types/un-array";
import { User } from "./user.model";


export type UserXRole = UnArray<NonNullable<User["swissUserXRole"]>>;
