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
import { CoreModelsDTOsFinanceManagementMainTablesAccountBalanceDTO } from './coreModelsDTOsFinanceManagementMainTablesAccountBalanceDTO';
import { CoreModelsDTOsFinanceManagementMainTablesSubContractNumberDTO } from './coreModelsDTOsFinanceManagementMainTablesSubContractNumberDTO';
import { CoreModelsDTOsFinanceManagementMainTablesSubContractNumberGroupDTO } from './coreModelsDTOsFinanceManagementMainTablesSubContractNumberGroupDTO';

export interface CoreModelsDTOsFinanceManagementMainTablesAccountDTO { 
    accountId?: number;
    patientId?: number;
    subContractNumberId?: number;
    subContractNumber?: CoreModelsDTOsFinanceManagementMainTablesSubContractNumberDTO;
    subContractNumberGroupId?: number;
    subContractNumberGroup?: CoreModelsDTOsFinanceManagementMainTablesSubContractNumberGroupDTO;
    swissUserId?: number;
    accountBalance?: Array<CoreModelsDTOsFinanceManagementMainTablesAccountBalanceDTO>;
}