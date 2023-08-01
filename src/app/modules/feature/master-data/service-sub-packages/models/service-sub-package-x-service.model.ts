import { UnArray } from "../../../../core/utility/types/un-array";
import { ServiceSubPackage } from "./service-sub-package.model";


export type ServiceSubPackageXService = UnArray<NonNullable<ServiceSubPackage["servicePackageXService"]>>;
export type ServicePackageXLabService = UnArray<NonNullable<ServiceSubPackage["servicePackageXLabService"]>>;
