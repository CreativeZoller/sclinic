import { Partner } from "../../partners/models/partner.model";
import { UnArray } from "../../../../core/utility/types/un-array";


type Company = NonNullable<Partner["company"]>;
export type CompanySite = UnArray<NonNullable<Company["companySite"]>>;
