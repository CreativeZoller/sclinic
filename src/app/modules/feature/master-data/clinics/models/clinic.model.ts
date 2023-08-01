import { MasterDataManagementService } from "../../../../../../api/services";
import { UnArray } from "../../../../core/utility/types/un-array";
import { UnObservable } from "../../../../core/utility/types/un-observable";
import { UnResponse } from "../../../../core/utility/types/un-response";


type ResponseModel = UnResponse<UnObservable<ReturnType<MasterDataManagementService["clinicGetClinicByConditionPost"]>>>
export type Clinic = UnArray<ResponseModel["businessObjectList"]>;
export type Clinic_Address = NonNullable<Clinic["address"]>;
