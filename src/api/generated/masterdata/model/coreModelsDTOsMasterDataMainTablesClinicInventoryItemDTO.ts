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
import { CoreModelsDTOsMasterDataMainTablesClinicDTO } from './coreModelsDTOsMasterDataMainTablesClinicDTO';
import { CoreModelsDTOsMasterDataMainTablesItemDTO } from './coreModelsDTOsMasterDataMainTablesItemDTO';

export interface CoreModelsDTOsMasterDataMainTablesClinicInventoryItemDTO { 
    executingUserId?: number;
    clinicInventoryItemId?: number;
    clinicId?: number;
    clinic?: CoreModelsDTOsMasterDataMainTablesClinicDTO;
    itemId?: number;
    item?: CoreModelsDTOsMasterDataMainTablesItemDTO;
    itemUniqueName?: string;
    dC_ClinicInventoryItemStatusId?: number;
    validityDate?: string;
    expirationDate?: string;
    reservationDate?: string;
    plannedReturnDate?: string;
    pufferHour?: number;
    takeAwayDate?: string;
    returnDate?: string;
    criticalQuantity?: number;
    quantity?: number;
    manufacturingNumber?: string;
}