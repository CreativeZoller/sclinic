import { MasterDataManagementService } from "../../../../../../api/services";
import { UnArray } from "../../../../core/utility/types/un-array";
import { UnObservable } from "../../../../core/utility/types/un-observable";
import { UnResponse } from "../../../../core/utility/types/un-response";


type ResponseModel = UnResponse<UnObservable<ReturnType<MasterDataManagementService["selfGetSelfByConditionPost"]>>>
export type Service_Provider_Entity = UnArray<ResponseModel["businessObjectList"]>;

export type Service_Provider_Entity_Partner = NonNullable<Service_Provider_Entity["partner"]>
export type Service_Provider_Entity_Partner_Company = NonNullable<Service_Provider_Entity_Partner["company"]>
export type Service_Provider_Entity_Partner_Company_Address = NonNullable<Service_Provider_Entity_Partner_Company ["headquartersAddress"]>
