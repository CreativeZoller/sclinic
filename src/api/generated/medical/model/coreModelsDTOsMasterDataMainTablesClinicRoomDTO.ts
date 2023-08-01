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
import { CoreModelsDTOsMasterDataDCTablesDCFloorDTO } from './coreModelsDTOsMasterDataDCTablesDCFloorDTO';
import { CoreModelsDTOsMasterDataJunctionTablesClinicRoomXSpecialtyXServiceDTO } from './coreModelsDTOsMasterDataJunctionTablesClinicRoomXSpecialtyXServiceDTO';
import { CoreModelsDTOsMasterDataMainTablesClinicDTO } from './coreModelsDTOsMasterDataMainTablesClinicDTO';
import { CoreModelsDTOsMasterDataMainTablesClinicRoomReservationDTO } from './coreModelsDTOsMasterDataMainTablesClinicRoomReservationDTO';
import { CoreModelsDTOsMasterDataMainTablesClinicRoomScheduleDTO } from './coreModelsDTOsMasterDataMainTablesClinicRoomScheduleDTO';

export interface CoreModelsDTOsMasterDataMainTablesClinicRoomDTO { 
    executingUserId?: number;
    clinicRoomId?: number;
    clinicId?: number;
    clinic?: CoreModelsDTOsMasterDataMainTablesClinicDTO;
    dC_FloorId?: number;
    dC_Floor?: CoreModelsDTOsMasterDataDCTablesDCFloorDTO;
    roomNumber?: number;
    name?: string;
    clinicRoomReservations?: Array<CoreModelsDTOsMasterDataMainTablesClinicRoomReservationDTO>;
    clinicRoomXSpecialtyXService?: Array<CoreModelsDTOsMasterDataJunctionTablesClinicRoomXSpecialtyXServiceDTO>;
    clinicRoomSchedule?: Array<CoreModelsDTOsMasterDataMainTablesClinicRoomScheduleDTO>;
}