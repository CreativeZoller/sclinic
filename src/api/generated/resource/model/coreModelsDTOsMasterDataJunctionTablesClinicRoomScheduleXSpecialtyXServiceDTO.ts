/**
 * ResourceManagementController
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { CoreModelsDTOsMasterDataMainTablesClinicRoomScheduleDTO } from './coreModelsDTOsMasterDataMainTablesClinicRoomScheduleDTO';
import { CoreModelsDTOsMasterDataMainTablesServiceDTO } from './coreModelsDTOsMasterDataMainTablesServiceDTO';
import { CoreModelsDTOsMasterDataMainTablesSpecialtyDTO } from './coreModelsDTOsMasterDataMainTablesSpecialtyDTO';
import { CoreModelsDTOsMasterDataSmallDTOsSmallServicePackageDTO } from './coreModelsDTOsMasterDataSmallDTOsSmallServicePackageDTO';

export interface CoreModelsDTOsMasterDataJunctionTablesClinicRoomScheduleXSpecialtyXServiceDTO { 
    clinicRoomScheduleXSpecialtyXServiceId?: number;
    clinicRoomScheduleId?: number;
    clinicRoomSchedule?: CoreModelsDTOsMasterDataMainTablesClinicRoomScheduleDTO;
    specialtyId?: number;
    specialty?: CoreModelsDTOsMasterDataMainTablesSpecialtyDTO;
    serviceId?: number;
    service?: CoreModelsDTOsMasterDataMainTablesServiceDTO;
    servicePackageId?: number;
    servicePackage?: CoreModelsDTOsMasterDataSmallDTOsSmallServicePackageDTO;
    standardTime?: number;
}