/**
 * InvoiceManagementController
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { CoreModelsDTOsMasterDataDCTablesDCItemConsumerTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCItemConsumerTypeDTO';
import { CoreModelsDTOsMasterDataMainTablesItemDTO } from './coreModelsDTOsMasterDataMainTablesItemDTO';
import { CoreModelsDTOsMasterDataMainTablesServiceDTO } from './coreModelsDTOsMasterDataMainTablesServiceDTO';

export interface CoreModelsDTOsMasterDataJunctionTablesServiceXItemDTO { 
    executingUserId?: number;
    serviceXItemId?: number;
    serviceId?: number;
    service?: CoreModelsDTOsMasterDataMainTablesServiceDTO;
    itemId?: number;
    item?: CoreModelsDTOsMasterDataMainTablesItemDTO;
    dC_ItemConsumerTypeId?: number;
    dC_ItemConsumerType?: CoreModelsDTOsMasterDataDCTablesDCItemConsumerTypeDTO;
    itemConsumption?: number;
    isRetailable?: boolean;
}