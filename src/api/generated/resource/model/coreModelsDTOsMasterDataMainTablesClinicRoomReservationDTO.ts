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
import { CoreModelsDTOsMasterDataDCTablesDCClinicRoomStateDTO } from './coreModelsDTOsMasterDataDCTablesDCClinicRoomStateDTO';
import { CoreModelsDTOsMasterDataMainTablesClinicRoomDTO } from './coreModelsDTOsMasterDataMainTablesClinicRoomDTO';

export interface CoreModelsDTOsMasterDataMainTablesClinicRoomReservationDTO { 
    executingUserId?: number;
    clinicRoomReservationId?: number;
    clinicRoomId?: number;
    clinicRoom?: CoreModelsDTOsMasterDataMainTablesClinicRoomDTO;
    dC_ClinicRoomStateId?: number;
    dC_ClinicRoomState?: CoreModelsDTOsMasterDataDCTablesDCClinicRoomStateDTO;
    startTime?: number;
    endTime?: number;
}