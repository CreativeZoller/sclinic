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
import { CoreModelsDTOsMasterDataDCTablesDCClinicTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCClinicTypeDTO';
import { CoreModelsDTOsMasterDataDCTablesNEHIProvisionTypeDTO } from './coreModelsDTOsMasterDataDCTablesNEHIProvisionTypeDTO';
import { CoreModelsDTOsMasterDataJunctionTablesClinicXDCBookingAreaDTO } from './coreModelsDTOsMasterDataJunctionTablesClinicXDCBookingAreaDTO';
import { CoreModelsDTOsMasterDataJunctionTablesClinicXPUPHAXClinicCategoryDTO } from './coreModelsDTOsMasterDataJunctionTablesClinicXPUPHAXClinicCategoryDTO';
import { CoreModelsDTOsMasterDataJunctionTablesClinicXSelfDTO } from './coreModelsDTOsMasterDataJunctionTablesClinicXSelfDTO';
import { CoreModelsDTOsMasterDataJunctionTablesClinicXSpecialtyXServiceDTO } from './coreModelsDTOsMasterDataJunctionTablesClinicXSpecialtyXServiceDTO';
import { CoreModelsDTOsMasterDataJunctionTablesMedicalContractPeriodXClinicDTO } from './coreModelsDTOsMasterDataJunctionTablesMedicalContractPeriodXClinicDTO';
import { CoreModelsDTOsMasterDataJunctionTablesMedicalEmployeeXClinicDTO } from './coreModelsDTOsMasterDataJunctionTablesMedicalEmployeeXClinicDTO';
import { CoreModelsDTOsMasterDataMainTablesAddressDTO } from './coreModelsDTOsMasterDataMainTablesAddressDTO';
import { CoreModelsDTOsMasterDataMainTablesClinicInventoryItemDTO } from './coreModelsDTOsMasterDataMainTablesClinicInventoryItemDTO';
import { CoreModelsDTOsMasterDataMainTablesClinicOpenHourDTO } from './coreModelsDTOsMasterDataMainTablesClinicOpenHourDTO';
import { CoreModelsDTOsMasterDataMainTablesClinicRoomDTO } from './coreModelsDTOsMasterDataMainTablesClinicRoomDTO';

export interface CoreModelsDTOsMasterDataMainTablesClinicDTO { 
    executingUserId?: number;
    clinicId?: number;
    clinicName?: string;
    addressId?: number;
    address?: CoreModelsDTOsMasterDataMainTablesAddressDTO;
    dC_ClinicTypeId?: number;
    dC_ClinicType?: CoreModelsDTOsMasterDataDCTablesDCClinicTypeDTO;
    nehI_ProvisionTypeId?: number;
    nehI_ProvisionType?: CoreModelsDTOsMasterDataDCTablesNEHIProvisionTypeDTO;
    clinicOEPCode?: string;
    clinicEESZTCode?: string;
    phoneNumber?: string;
    isExternalSite?: boolean;
    email?: string;
    ftKp?: string;
    ftOther?: string;
    eurKp?: string;
    eurOther?: string;
    isDeleted?: boolean;
    clinicXSpecialtyXService?: Array<CoreModelsDTOsMasterDataJunctionTablesClinicXSpecialtyXServiceDTO>;
    clinicOpenHours?: Array<CoreModelsDTOsMasterDataMainTablesClinicOpenHourDTO>;
    clinicRooms?: Array<CoreModelsDTOsMasterDataMainTablesClinicRoomDTO>;
    medicalContractXClinic?: Array<CoreModelsDTOsMasterDataJunctionTablesMedicalContractPeriodXClinicDTO>;
    swissUserXIdentityXClinic?: Array<CoreModelsDTOsMasterDataJunctionTablesMedicalEmployeeXClinicDTO>;
    clinicInventoryItem?: Array<CoreModelsDTOsMasterDataMainTablesClinicInventoryItemDTO>;
    clinicXDC_BookingArea?: Array<CoreModelsDTOsMasterDataJunctionTablesClinicXDCBookingAreaDTO>;
    clinicXSelf?: Array<CoreModelsDTOsMasterDataJunctionTablesClinicXSelfDTO>;
    clinicXPUPHAX_ClinicCategory?: Array<CoreModelsDTOsMasterDataJunctionTablesClinicXPUPHAXClinicCategoryDTO>;
}