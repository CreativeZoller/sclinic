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
import { CoreModelsDTOsFinanceManagementMainTablesSubContractNumberGroupContactEventDTO } from './coreModelsDTOsFinanceManagementMainTablesSubContractNumberGroupContactEventDTO';
import { CoreModelsDTOsFinanceManagementMainTablesSubContractNumberGroupDTO } from './coreModelsDTOsFinanceManagementMainTablesSubContractNumberGroupDTO';

export interface CoreModelsDTOsFinanceManagementMainTablesSubContractNumberGroupOutsideContactDTO { 
    subContractNumberGroupOutsideContactId?: number;
    subContractNumberGroupId?: number;
    subContractNumberGroup?: CoreModelsDTOsFinanceManagementMainTablesSubContractNumberGroupDTO;
    role?: string;
    dC_TitleTypeId?: number;
    surname?: string;
    forename?: string;
    email?: string;
    sentEventData?: Array<CoreModelsDTOsFinanceManagementMainTablesSentEventDataDTO>;
    subContractNumberGroupContactEvent?: Array<CoreModelsDTOsFinanceManagementMainTablesSubContractNumberGroupContactEventDTO>;
}