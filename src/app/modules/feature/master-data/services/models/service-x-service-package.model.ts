import { UnArray } from "../../../../core/utility/types/un-array";
import { Service } from "./service.model";


export type ServiceXServicePackage = UnArray<NonNullable<Service["servicePackageXService"]>>;
