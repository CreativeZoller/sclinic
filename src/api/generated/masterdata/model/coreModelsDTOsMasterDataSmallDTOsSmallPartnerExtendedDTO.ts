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
import { CoreModelsDTOsMasterDataDCTablesDCPartnerModeDTO } from './coreModelsDTOsMasterDataDCTablesDCPartnerModeDTO';
import { CoreModelsDTOsMasterDataDCTablesDCPartnerTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCPartnerTypeDTO';
import { CoreModelsDTOsMasterDataSmallDTOsSmallCompanyDTO } from './coreModelsDTOsMasterDataSmallDTOsSmallCompanyDTO';
import { CoreModelsDTOsMasterDataSmallDTOsSmallPatientDTO } from './coreModelsDTOsMasterDataSmallDTOsSmallPatientDTO';

export interface CoreModelsDTOsMasterDataSmallDTOsSmallPartnerExtendedDTO { 
    partnerId?: number;
    partnerName?: string;
    patientId?: number;
    companyId?: number;
    dC_PartnerTypeId?: number;
    dC_PartnerType?: CoreModelsDTOsMasterDataDCTablesDCPartnerTypeDTO;
    dC_PartnerModeId?: number;
    dC_PartnerMode?: CoreModelsDTOsMasterDataDCTablesDCPartnerModeDTO;
    patient?: CoreModelsDTOsMasterDataSmallDTOsSmallPatientDTO;
    company?: CoreModelsDTOsMasterDataSmallDTOsSmallCompanyDTO;
}