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
import { CoreModelsDTOsMasterDataDCTablesDCExposureFrequencyDTO } from './coreModelsDTOsMasterDataDCTablesDCExposureFrequencyDTO';
import { CoreModelsDTOsMasterDataDCTablesDCExposureTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCExposureTypeDTO';
import { CoreModelsDTOsMasterDataMainTablesExposureDTO } from './coreModelsDTOsMasterDataMainTablesExposureDTO';
import { CoreModelsDTOsMasterDataMainTablesExposureItemDTO } from './coreModelsDTOsMasterDataMainTablesExposureItemDTO';
import { CoreModelsDTOsMasterDataMainTablesOccupationalHealthDTO } from './coreModelsDTOsMasterDataMainTablesOccupationalHealthDTO';
import { CoreModelsDTOsMasterDataSmallDTOsSmallServiceDTO } from './coreModelsDTOsMasterDataSmallDTOsSmallServiceDTO';
import { CoreModelsDTOsMasterDataSmallDTOsSmallServicePackageDTO } from './coreModelsDTOsMasterDataSmallDTOsSmallServicePackageDTO';
import { CoreModelsDTOsMasterDataSmallDTOsSmallSpecialtyDTO } from './coreModelsDTOsMasterDataSmallDTOsSmallSpecialtyDTO';

export interface CoreModelsDTOsMasterDataJunctionTablesOccupationalHealthXServiceDTO { 
    occupationalHealthXServiceId?: number;
    occupationalHealthId?: number;
    occupationalHealth?: CoreModelsDTOsMasterDataMainTablesOccupationalHealthDTO;
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
    isBEM?: boolean;
    exposureId?: number;
    exposure?: CoreModelsDTOsMasterDataMainTablesExposureDTO;
    exposureItemId?: number;
    exposureItem?: CoreModelsDTOsMasterDataMainTablesExposureItemDTO;
    dC_ExposureTypeId?: number;
    dC_ExposureType?: CoreModelsDTOsMasterDataDCTablesDCExposureTypeDTO;
    remarks?: string;
}