import { UnArray } from "../../../../core/utility/types/un-array";
import { ServiceSubPackage } from "./service-sub-package.model";


export type ServiceSubPackageXServicePackage = UnArray<NonNullable<ServiceSubPackage["servicePackageList"]>>;
