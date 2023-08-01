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
import { CoreModelsDTOsMasterDataDCTablesDCLabProviderDTO } from './coreModelsDTOsMasterDataDCTablesDCLabProviderDTO';
import { CoreModelsDTOsMasterDataDCTablesDCLabRepeatPeriodDTO } from './coreModelsDTOsMasterDataDCTablesDCLabRepeatPeriodDTO';
import { CoreModelsDTOsMasterDataDCTablesDCLabSamplingTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCLabSamplingTypeDTO';
import { CoreModelsDTOsMasterDataDCTablesDCMarkerDTO } from './coreModelsDTOsMasterDataDCTablesDCMarkerDTO';
import { CoreModelsDTOsMasterDataDCTablesDCSamplingItemDTO } from './coreModelsDTOsMasterDataDCTablesDCSamplingItemDTO';

export interface CoreModelsDTOsMasterDataMainTablesLabDTO { 
    executingUserId?: number;
    labId?: number;
    dC_MarkerId?: number;
    dC_Marker?: CoreModelsDTOsMasterDataDCTablesDCMarkerDTO;
    dC_LabProviderId?: number;
    dC_LabProvider?: CoreModelsDTOsMasterDataDCTablesDCLabProviderDTO;
    providerIdentificationNumber?: string;
    dC_LabSamplingTypeId?: number;
    dC_LabSamplingType?: CoreModelsDTOsMasterDataDCTablesDCLabSamplingTypeDTO;
    dC_LabRepeatPeriodId?: number;
    dC_LabRepeatPeriod?: CoreModelsDTOsMasterDataDCTablesDCLabRepeatPeriodDTO;
    dC_SamplingItemId?: number;
    dC_SamplingItem?: CoreModelsDTOsMasterDataDCTablesDCSamplingItemDTO;
    price?: number;
}