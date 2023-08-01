import { TwoFactorAuthenticationTypeEnum } from "../../../../../api/enums";


export type LoginSecondFactorFormValue = {
    authTypeId: TwoFactorAuthenticationTypeEnum;
    hardToken?: string;
    twoFactorCode?: string;
    useEesztLogin?: boolean;
    eesztUsername?: string;
    clinicId?: number | null;
    praxisId?: number | null;
};
