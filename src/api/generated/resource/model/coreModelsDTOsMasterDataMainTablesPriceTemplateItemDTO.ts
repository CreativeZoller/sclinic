/**
 * ResourceManagementController
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { CoreModelsDTOsMasterDataMainTablesItemDTO } from './coreModelsDTOsMasterDataMainTablesItemDTO';
import { CoreModelsDTOsMasterDataMainTablesPriceTemplateDTO } from './coreModelsDTOsMasterDataMainTablesPriceTemplateDTO';
import { CoreModelsDTOsMasterDataMainTablesServiceDTO } from './coreModelsDTOsMasterDataMainTablesServiceDTO';
import { CoreModelsDTOsMasterDataMainTablesServicePackageDTO } from './coreModelsDTOsMasterDataMainTablesServicePackageDTO';
import { CoreModelsDTOsMasterDataMainTablesSpecialtyDTO } from './coreModelsDTOsMasterDataMainTablesSpecialtyDTO';

export interface CoreModelsDTOsMasterDataMainTablesPriceTemplateItemDTO { 
    executingUserId?: number;
    priceTemplateItemId?: number;
    specialtyId?: number;
    specialty?: CoreModelsDTOsMasterDataMainTablesSpecialtyDTO;
    serviceId?: number;
    service?: CoreModelsDTOsMasterDataMainTablesServiceDTO;
    servicePackageId?: number;
    servicePackage?: CoreModelsDTOsMasterDataMainTablesServicePackageDTO;
    itemId?: number;
    item?: CoreModelsDTOsMasterDataMainTablesItemDTO;
    price?: number;
    eurPrice?: number;
    priceTemplateId?: number;
    priceTemplate?: CoreModelsDTOsMasterDataMainTablesPriceTemplateDTO;
    discount?: number;
    discountPercentage?: number;
}