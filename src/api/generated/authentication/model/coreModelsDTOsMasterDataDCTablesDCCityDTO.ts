/**
 * AuthenticationWebService
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { CoreModelsDTOsMasterDataDCTablesDCCountyDTO } from './coreModelsDTOsMasterDataDCTablesDCCountyDTO';

export interface CoreModelsDTOsMasterDataDCTablesDCCityDTO { 
    executingUserId?: number;
    name?: string;
    isDefault?: boolean;
    isActive?: boolean;
    dC_CityId?: number;
    dC_CountyId?: number;
    dC_County?: CoreModelsDTOsMasterDataDCTablesDCCountyDTO;
    postCode?: string;
}