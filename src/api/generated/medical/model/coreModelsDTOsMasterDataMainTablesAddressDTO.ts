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
import { CoreModelsDTOsMasterDataDCTablesDCCityDTO } from './coreModelsDTOsMasterDataDCTablesDCCityDTO';
import { CoreModelsDTOsMasterDataDCTablesDCPublicPlaceCategoryDTO } from './coreModelsDTOsMasterDataDCTablesDCPublicPlaceCategoryDTO';

export interface CoreModelsDTOsMasterDataMainTablesAddressDTO { 
    executingUserId?: number;
    addressId?: number;
    dC_CityId?: number;
    dC_City?: CoreModelsDTOsMasterDataDCTablesDCCityDTO;
    streetName?: string;
    dC_PublicPlaceCategoryId?: number;
    dC_PublicPlaceCategory?: CoreModelsDTOsMasterDataDCTablesDCPublicPlaceCategoryDTO;
    buildingNumber?: string;
    building?: string;
    staircase?: string;
    floor?: string;
    door?: string;
    lotNumber?: string;
    additionalAddressDetail?: string;
}