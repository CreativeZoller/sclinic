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
import { CoreModelsDTOsMasterDataDCTablesDCPriceTableStatusDTO } from './coreModelsDTOsMasterDataDCTablesDCPriceTableStatusDTO';
import { CoreModelsDTOsMasterDataMainTablesPriceTemplateDTO } from './coreModelsDTOsMasterDataMainTablesPriceTemplateDTO';

export interface CoreModelsDTOsMasterDataMainTablesPriceTableDTO { 
    executingUserId?: number;
    priceTableId?: number;
    priceTableIdentifier?: string;
    priceTableName?: string;
    startDate?: string;
    endDate?: string;
    continuous?: boolean;
    dC_PriceTableStatusId?: number;
    dC_PriceTableStatus?: CoreModelsDTOsMasterDataDCTablesDCPriceTableStatusDTO;
    description?: string;
    parentPriceTableId?: number;
    parentPriceTable?: CoreModelsDTOsMasterDataMainTablesPriceTableDTO;
    priceTemplate?: Array<CoreModelsDTOsMasterDataMainTablesPriceTemplateDTO>;
}