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
import { CoreModelsDTOsAuthenticationJunctionTablesSwissUserXRoleXClinicDTO } from './coreModelsDTOsAuthenticationJunctionTablesSwissUserXRoleXClinicDTO';
import { CoreModelsDTOsAuthenticationMainTablesRoleDTO } from './coreModelsDTOsAuthenticationMainTablesRoleDTO';
import { CoreModelsDTOsAuthenticationMainTablesSwissUserDTO } from './coreModelsDTOsAuthenticationMainTablesSwissUserDTO';

export interface CoreModelsDTOsAuthenticationJunctionTablesSwissUserXRoleDTO { 
    executingUserId?: number;
    swissUserXRoleId?: number;
    roleId?: number;
    role?: CoreModelsDTOsAuthenticationMainTablesRoleDTO;
    swissUserId?: number;
    swissUser?: CoreModelsDTOsAuthenticationMainTablesSwissUserDTO;
    commissionPercentage?: number;
    swissUserXRoleXClinic?: Array<CoreModelsDTOsAuthenticationJunctionTablesSwissUserXRoleXClinicDTO>;
}