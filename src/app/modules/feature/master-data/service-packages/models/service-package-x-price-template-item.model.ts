import { UnArray } from "../../../../core/utility/types/un-array";
import { ServicePackage } from "./service-package.model";


export type ServicePackageXPriceTemplateItem = UnArray<NonNullable<ServicePackage["priceTemplateItem"]>>;
