import { LoginSecondFactorFormValue } from "./login-second-factor-form-value.model";


export type UserLoginDataState = {
    selectedClinicId?: LoginSecondFactorFormValue["clinicId"];
    selectedPraxisId?: LoginSecondFactorFormValue["praxisId"];
}
