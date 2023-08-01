import { AuthenticationWebServiceService } from "../../../../../../../api/services";


type RequestModel = NonNullable<Parameters<AuthenticationWebServiceService["userCreateOrUpdatePasswordChangeRequestPost"]>[0]>
export type ForgotPasswordFormData = RequestModel
