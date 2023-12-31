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
import { CoreModelsDTOsMasterDataDCTablesDCExposureFrequencyDTO } from './coreModelsDTOsMasterDataDCTablesDCExposureFrequencyDTO';
import { CoreModelsDTOsMasterDataJunctionTablesExposureXExposureItemDTO } from './coreModelsDTOsMasterDataJunctionTablesExposureXExposureItemDTO';
import { CoreModelsDTOsMasterDataSmallDTOsSmallServiceDTO } from './coreModelsDTOsMasterDataSmallDTOsSmallServiceDTO';
import { CoreModelsDTOsMasterDataSmallDTOsSmallServicePackageDTO } from './coreModelsDTOsMasterDataSmallDTOsSmallServicePackageDTO';
import { CoreModelsDTOsMasterDataSmallDTOsSmallSpecialtyDTO } from './coreModelsDTOsMasterDataSmallDTOsSmallSpecialtyDTO';

export interface CoreModelsDTOsMasterDataJunctionTablesExposureXExposureItemXServiceDTO { 
    exposureXExposureItemXServiceId?: number;
    exposureXExposureItemId?: number;
    exposureXExposureItem?: CoreModelsDTOsMasterDataJunctionTablesExposureXExposureItemDTO;
    specialtyId?: number;
    specialty?: CoreModelsDTOsMasterDataSmallDTOsSmallSpecialtyDTO;
    serviceId?: number;
    service?: CoreModelsDTOsMasterDataSmallDTOsSmallServiceDTO;
    servicePackageId?: number;
    servicePackage?: CoreModelsDTOsMasterDataSmallDTOsSmallServicePackageDTO;
    dC_ExposureFrequencyId?: number;
    dC_ExposureFrequency?: CoreModelsDTOsMasterDataDCTablesDCExposureFrequencyDTO;
    isMandatory?: boolean;
    isPreviousResultAccepted?: boolean;
    remarks?: string;
}