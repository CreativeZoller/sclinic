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
import { CoreModelsDTOsFinanceManagementMainTablesAccountBalanceDTO } from './coreModelsDTOsFinanceManagementMainTablesAccountBalanceDTO';
import { CoreModelsEnumsFinanceManagementAccountTransactionStatusEnum } from './coreModelsEnumsFinanceManagementAccountTransactionStatusEnum';
import { CoreModelsEnumsFinanceManagementAccountTransactionTypeEnum } from './coreModelsEnumsFinanceManagementAccountTransactionTypeEnum';

export interface CoreModelsDTOsFinanceManagementMainTablesAccountTransactionDTO { 
    rowVersion?: string;
    creationDate?: string;
    createdBy?: number;
    lastModifiedDate?: string;
    lastModifiedBy?: number;
    deletedDate?: string;
    deletedBy?: number;
    accountTransactionId?: number;
    accountBalanceId?: number;
    accountBalance?: CoreModelsDTOsFinanceManagementMainTablesAccountBalanceDTO;
    appointmentId?: number;
    appointmentServiceExtensionId?: number;
    emergencyId?: number;
    serviceId?: number;
    servicePackageId?: number;
    subServicePackageId?: number;
    quantity?: number;
    amountHUF?: number;
    amountEUR?: number;
    accountTransactionType?: CoreModelsEnumsFinanceManagementAccountTransactionTypeEnum;
    accountTransactionStatus?: CoreModelsEnumsFinanceManagementAccountTransactionStatusEnum;
    freeQuantity?: number;
    itemQuantity?: number;
    itemUnitPrice?: number;
}