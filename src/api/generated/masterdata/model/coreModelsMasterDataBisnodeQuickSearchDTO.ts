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
import { CoreModelsMasterDataBisnodeBisnodeAddress } from './coreModelsMasterDataBisnodeBisnodeAddress';

export interface CoreModelsMasterDataBisnodeQuickSearchDTO { 
    address?: CoreModelsMasterDataBisnodeBisnodeAddress;
    matchingType?: string;
    reasonType?: string;
    detail?: string;
    dunsNumber?: string;
    groupTaxNumber?: string;
    isPartner?: boolean;
    legalForm?: string;
    legalFormCode?: number;
    name?: string;
    pcLink?: string;
    regnNbr?: string;
    shortName?: string;
    status?: string;
    taxNbr?: string;
}