/**
 * AuthenticationWebService
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { CoreModelsDTOsAuthenticationJunctionTablesSwissUserXRoleDTO } from './coreModelsDTOsAuthenticationJunctionTablesSwissUserXRoleDTO';

export interface CoreModelsAuthenticationAuthenticationAuthenticationResponse { 
    errorMessage?: string;
    swissUserId?: number;
    medicalEmployeeId?: number;
    firstFactorAuthenticationToken?: string;
    realName?: string;
    dC_UserTypeId?: number;
    dC_TwoFactorAuthenticationTypeId?: number;
    swissUserXRole?: Array<CoreModelsDTOsAuthenticationJunctionTablesSwissUserXRoleDTO>;
}