/**
 * MasterDataManagementController
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { CoreModelsMasterDataSelfSmallSelfPartnerDTO } from './coreModelsMasterDataSelfSmallSelfPartnerDTO';

export interface CoreModelsMasterDataSelfSelfDataSheet { 
    executingUserId?: number;
    selfId?: number;
    selfName?: string;
    nehiOrganizationId?: string;
    partnerId?: number;
    partner?: CoreModelsMasterDataSelfSmallSelfPartnerDTO;
}