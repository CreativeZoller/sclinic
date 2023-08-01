// import { UnArray } from "../../../../core/utility/types/un-array";
// import { ServicePackage } from "./service--package.model";

// TODO review: amint a BE vissza tudja adni a csomagok-hoz tartozó szerződéseket
// export type ServicePackageXContract = UnArray<NonNullable<ServicePackage["servicePackageXContract"]>>;
export type ServicePackageXContract = {
    companyName?: string;
    contractName?: string;
    contractNumber?: string;
    isPriorityPartner?: boolean;
}
