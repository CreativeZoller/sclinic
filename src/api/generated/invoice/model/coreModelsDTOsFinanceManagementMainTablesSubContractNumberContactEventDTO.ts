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
import { CoreModelsDTOsFinanceManagementMainTablesSentEventDataDTO } from './coreModelsDTOsFinanceManagementMainTablesSentEventDataDTO';
import { CoreModelsDTOsFinanceManagementMainTablesSubContractNumberInsideContactDTO } from './coreModelsDTOsFinanceManagementMainTablesSubContractNumberInsideContactDTO';
import { CoreModelsDTOsFinanceManagementMainTablesSubContractNumberOutsideContactDTO } from './coreModelsDTOsFinanceManagementMainTablesSubContractNumberOutsideContactDTO';

export interface CoreModelsDTOsFinanceManagementMainTablesSubContractNumberContactEventDTO { 
    subContractNumberContactEventId?: number;
    subContractNumberInsideContactId?: number;
    subContractNumberInsideContact?: CoreModelsDTOsFinanceManagementMainTablesSubContractNumberInsideContactDTO;
    subContractNumberOutsideContactId?: number;
    subContractNumberOutsideContact?: CoreModelsDTOsFinanceManagementMainTablesSubContractNumberOutsideContactDTO;
    emailTemplateId?: number;
    notificationDay?: string;
    dC_EventActivationId?: number;
    dC_EventFrequencyId?: number;
    dC_ContractEventId?: number;
    sentEventData?: Array<CoreModelsDTOsFinanceManagementMainTablesSentEventDataDTO>;
}