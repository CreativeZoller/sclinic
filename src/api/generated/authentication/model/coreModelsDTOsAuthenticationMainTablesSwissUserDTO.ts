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
import { CoreModelsDTOsAuthenticationMainTablesPasswordsDTO } from './coreModelsDTOsAuthenticationMainTablesPasswordsDTO';
import { CoreModelsDTOsMasterDataDCTablesDCTitleTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCTitleTypeDTO';

export interface CoreModelsDTOsAuthenticationMainTablesSwissUserDTO { 
    executingUserId?: number;
    swissUserId?: number;
    email?: string;
    password?: string;
    dC_TitleTypeId?: number;
    dC_TitleType?: CoreModelsDTOsMasterDataDCTablesDCTitleTypeDTO;
    firstName?: string;
    familyName?: string;
    phoneNumber?: string;
    dC_TwoFactorAuthenticationTypeId?: number;
    dC_UserStatusId?: number;
    dC_UserTypeId?: number;
    swissUserXRole?: Array<CoreModelsDTOsAuthenticationJunctionTablesSwissUserXRoleDTO>;
    passwords?: Array<CoreModelsDTOsAuthenticationMainTablesPasswordsDTO>;
}