// import { UnArray } from "../../../../core/utility/types/un-array";
// import { ServiceSubPackage } from "./service-sub-package.model";

// TODO review: amint a BE vissza tudja adni a csomagok-hoz tartozó szerződéseket
// export type ServiceSubPackageXContract = UnArray<NonNullable<ServiceSubPackage["servicePackageXContract"]>>;
export type ServiceSubPackageXContract = {
    companyName?: string;
    contractName?: string;
    contractNumber?: string;
    isPriorityPartner?: boolean;
}
