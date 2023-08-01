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
import { CoreModelsDTOsMasterDataDCTablesDCItemProcurationalCategoryDTO } from './coreModelsDTOsMasterDataDCTablesDCItemProcurationalCategoryDTO';

export interface CoreModelsDTOsMasterDataMainTablesDEEPERPItemIdentificationDTO { 
    deeperpItemIdentificationId?: number;
    deeperpItemNumber?: string;
    invoiceItemName?: string;
    vatCategory?: string;
    dC_ItemProcurationalCategoryId?: number;
    dC_ItemProcurationalCategory?: CoreModelsDTOsMasterDataDCTablesDCItemProcurationalCategoryDTO;
    cpaNumber?: string;
    defaultQuantity?: number;
    defaultSaleQuantity?: number;
    defaultPurchaseQuantity?: number;
    isDEEPERPActive?: boolean;
    environmentProductTax?: number;
    mrpCalculationAllowed?: string;
    excise?: string;
    productionTaxStamp?: string;
    discountAllowed?: string;
    outOfProduction?: string;
    hazardousProduct?: string;
    hazardousProductLimitQuantity?: string;
}