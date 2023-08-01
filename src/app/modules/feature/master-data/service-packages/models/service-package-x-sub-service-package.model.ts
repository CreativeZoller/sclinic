import { UnArray } from "../../../../core/utility/types/un-array";
import { ServicePackage } from "./service-package.model";


export type ServicePackageXSubServicePackage = UnArray<NonNullable<ServicePackage["servicePackageList"]>>;
export type SubServicePackage = NonNullable<ServicePackageXSubServicePackage["subServicePackage"]>;
