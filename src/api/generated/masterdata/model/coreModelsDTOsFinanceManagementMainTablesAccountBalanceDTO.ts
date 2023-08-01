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
import { CoreModelsDTOsFinanceManagementMainTablesAccountDTO } from './coreModelsDTOsFinanceManagementMainTablesAccountDTO';
import { CoreModelsDTOsFinanceManagementMainTablesAccountTransactionDTO } from './coreModelsDTOsFinanceManagementMainTablesAccountTransactionDTO';

export interface CoreModelsDTOsFinanceManagementMainTablesAccountBalanceDTO { 
    accountBalanceId?: number;
    accountId?: number;
    account?: CoreModelsDTOsFinanceManagementMainTablesAccountDTO;
    serviceId?: number;
    servicePackageId?: number;
    subServicePackageId?: number;
    quantity?: number;
    amountHUF?: number;
    amountEUR?: number;
    appointmentId?: number;
    appointmentServiceExtensionId?: number;
    offerId?: number;
    offeredServiceId?: number;
    isRunOverEnabled?: boolean;
    freeQuantity?: number;
    expirationDate?: string;
    validFrom?: string;
    accountTransaction?: Array<CoreModelsDTOsFinanceManagementMainTablesAccountTransactionDTO>;
}