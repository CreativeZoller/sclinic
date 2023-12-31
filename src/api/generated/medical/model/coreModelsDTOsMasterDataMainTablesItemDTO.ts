/**
 * MedicalManagementController
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { CoreModelsDTOsMasterDataDCTablesDCItemCategoryDTO } from './coreModelsDTOsMasterDataDCTablesDCItemCategoryDTO';
import { CoreModelsDTOsMasterDataDCTablesDCItemStatusDTO } from './coreModelsDTOsMasterDataDCTablesDCItemStatusDTO';
import { CoreModelsDTOsMasterDataDCTablesDCItemTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCItemTypeDTO';
import { CoreModelsDTOsMasterDataJunctionTablesServiceXItemDTO } from './coreModelsDTOsMasterDataJunctionTablesServiceXItemDTO';
import { CoreModelsDTOsMasterDataMainTablesClinicInventoryItemDTO } from './coreModelsDTOsMasterDataMainTablesClinicInventoryItemDTO';
import { CoreModelsDTOsMasterDataMainTablesDEEPERPItemIdentificationDTO } from './coreModelsDTOsMasterDataMainTablesDEEPERPItemIdentificationDTO';
import { CoreModelsDTOsMasterDataMainTablesPartnerDTO } from './coreModelsDTOsMasterDataMainTablesPartnerDTO';
import { CoreModelsDTOsMasterDataMainTablesPriceTemplateItemDTO } from './coreModelsDTOsMasterDataMainTablesPriceTemplateItemDTO';
import { CoreModelsDTOsMasterDataSmallDTOsSmallPriceDTO } from './coreModelsDTOsMasterDataSmallDTOsSmallPriceDTO';

export interface CoreModelsDTOsMasterDataMainTablesItemDTO { 
    itemId?: number;
    parentItemId?: number;
    parentItem?: CoreModelsDTOsMasterDataMainTablesItemDTO;
    itemName?: string;
    itemNumber?: number;
    subItemName?: string;
    subItemNumber?: string;
    dC_ItemCategoryId?: number;
    dC_ItemCategory?: CoreModelsDTOsMasterDataDCTablesDCItemCategoryDTO;
    dC_ItemTypeId?: number;
    dC_ItemType?: CoreModelsDTOsMasterDataDCTablesDCItemTypeDTO;
    manufacturingNumber?: string;
    dC_ItemStatusId?: number;
    dC_ItemStatus?: CoreModelsDTOsMasterDataDCTablesDCItemStatusDTO;
    isActive?: number;
    clinicInventoryItem?: Array<CoreModelsDTOsMasterDataMainTablesClinicInventoryItemDTO>;
    serviceXItem?: Array<CoreModelsDTOsMasterDataJunctionTablesServiceXItemDTO>;
    quantity?: number;
    criticalQuantity?: number;
    purchasePrice?: number;
    sellingPrice?: number;
    validityDate?: string;
    expirationDate?: string;
    partnerId?: number;
    partner?: CoreModelsDTOsMasterDataMainTablesPartnerDTO;
    deeperpItemIdentificationId?: number;
    deeperpItemIdentification?: CoreModelsDTOsMasterDataMainTablesDEEPERPItemIdentificationDTO;
    isSelectableItemWhenBooking?: boolean;
    smallPriceList?: Array<CoreModelsDTOsMasterDataSmallDTOsSmallPriceDTO>;
    priceTemplateItem?: Array<CoreModelsDTOsMasterDataMainTablesPriceTemplateItemDTO>;
    subItems?: Array<CoreModelsDTOsMasterDataMainTablesItemDTO>;
}