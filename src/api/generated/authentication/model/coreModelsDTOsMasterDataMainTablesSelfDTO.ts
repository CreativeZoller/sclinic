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
import { CoreModelsDTOsMasterDataJunctionTablesClinicXSelfDTO } from './coreModelsDTOsMasterDataJunctionTablesClinicXSelfDTO';
import { CoreModelsDTOsMasterDataMainTablesPartnerDTO } from './coreModelsDTOsMasterDataMainTablesPartnerDTO';

export interface CoreModelsDTOsMasterDataMainTablesSelfDTO { 
    executingUserId?: number;
    selfId?: number;
    selfName?: string;
    nehiOrganizationId?: string;
    partnerId?: number;
    partner?: CoreModelsDTOsMasterDataMainTablesPartnerDTO;
    clinicXSelf?: Array<CoreModelsDTOsMasterDataJunctionTablesClinicXSelfDTO>;
}