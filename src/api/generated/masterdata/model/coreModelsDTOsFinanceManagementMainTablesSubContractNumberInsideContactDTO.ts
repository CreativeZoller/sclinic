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
import { CoreModelsDTOsFinanceManagementMainTablesSentEventDataDTO } from './coreModelsDTOsFinanceManagementMainTablesSentEventDataDTO';
import { CoreModelsDTOsFinanceManagementMainTablesSubContractNumberContactEventDTO } from './coreModelsDTOsFinanceManagementMainTablesSubContractNumberContactEventDTO';
import { CoreModelsDTOsFinanceManagementMainTablesSubContractNumberDTO } from './coreModelsDTOsFinanceManagementMainTablesSubContractNumberDTO';

export interface CoreModelsDTOsFinanceManagementMainTablesSubContractNumberInsideContactDTO { 
    subContractNumberInsideContactId?: number;
    subContractNumberId?: number;
    subContractNumber?: CoreModelsDTOsFinanceManagementMainTablesSubContractNumberDTO;
    roleId?: number;
    userId?: number;
    subContractNumberContactEvent?: Array<CoreModelsDTOsFinanceManagementMainTablesSubContractNumberContactEventDTO>;
    sentEventData?: Array<CoreModelsDTOsFinanceManagementMainTablesSentEventDataDTO>;
}