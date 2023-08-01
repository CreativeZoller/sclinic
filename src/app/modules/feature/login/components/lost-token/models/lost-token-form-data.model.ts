import { AuthenticationWebServiceService } from "../../../../../../../api/services";


type RequestModel = NonNullable<Parameters<AuthenticationWebServiceService["googleAuthenticatorCreateGoogleAuthenticatorTokenPost"]>[0]>
export type LostTokenFormData = RequestModel & {forEesztLogin?: boolean}// TODO request model
