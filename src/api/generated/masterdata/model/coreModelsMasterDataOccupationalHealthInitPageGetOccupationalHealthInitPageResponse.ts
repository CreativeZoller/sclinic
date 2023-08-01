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
import { CoreModelsDTOsAuthenticationMainTablesRightDTO } from './coreModelsDTOsAuthenticationMainTablesRightDTO';
import { CoreModelsDTOsMasterDataDCTablesDCExposureFrequencyDTO } from './coreModelsDTOsMasterDataDCTablesDCExposureFrequencyDTO';
import { CoreModelsDTOsMasterDataDCTablesDCOccupationalHealthClassificationDTO } from './coreModelsDTOsMasterDataDCTablesDCOccupationalHealthClassificationDTO';
import { CoreModelsDTOsMasterDataDCTablesDCOccupationalHealthPriceCategoryDTO } from './coreModelsDTOsMasterDataDCTablesDCOccupationalHealthPriceCategoryDTO';
import { CoreModelsDTOsMasterDataDCTablesDCOccupationalHealthTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCOccupationalHealthTypeDTO';
import { CoreModelsDTOsMasterDataDCTablesDCServiceTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCServiceTypeDTO';

export interface CoreModelsMasterDataOccupationalHealthInitPageGetOccupationalHealthInitPageResponse { 
    errorMessage?: string;
    rights?: Array<CoreModelsDTOsAuthenticationMainTablesRightDTO>;
    dC_OccupationalHealthTypeList?: Array<CoreModelsDTOsMasterDataDCTablesDCOccupationalHealthTypeDTO>;
    dC_ExposureFrequencyList?: Array<CoreModelsDTOsMasterDataDCTablesDCExposureFrequencyDTO>;
    dC_ServiceTypeList?: Array<CoreModelsDTOsMasterDataDCTablesDCServiceTypeDTO>;
    dC_OccupationalHealthClassificationList?: Array<CoreModelsDTOsMasterDataDCTablesDCOccupationalHealthClassificationDTO>;
    dC_OccupationalHealthPriceCategoryList?: Array<CoreModelsDTOsMasterDataDCTablesDCOccupationalHealthPriceCategoryDTO>;
}