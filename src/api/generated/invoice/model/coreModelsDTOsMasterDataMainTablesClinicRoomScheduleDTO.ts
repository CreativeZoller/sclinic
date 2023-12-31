/**
 * InvoiceManagementController
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { CoreModelsDTOsMasterDataDCTablesDCDayDTO } from './coreModelsDTOsMasterDataDCTablesDCDayDTO';
import { CoreModelsDTOsMasterDataDCTablesDCScheduleSpecialTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCScheduleSpecialTypeDTO';
import { CoreModelsDTOsMasterDataDCTablesDCWeekTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCWeekTypeDTO';
import { CoreModelsDTOsMasterDataJunctionTablesClinicRoomScheduleXSpecialtyXServiceDTO } from './coreModelsDTOsMasterDataJunctionTablesClinicRoomScheduleXSpecialtyXServiceDTO';

export interface CoreModelsDTOsMasterDataMainTablesClinicRoomScheduleDTO { 
    executingUserId?: number;
    clinicRoomScheduleId?: number;
    clinicRoomId?: number;
    startTime?: string;
    endTime?: string;
    dC_DayId?: number;
    dC_Day?: CoreModelsDTOsMasterDataDCTablesDCDayDTO;
    dC_WeekTypeId?: number;
    dC_WeekType?: CoreModelsDTOsMasterDataDCTablesDCWeekTypeDTO;
    dC_ScheduleSpecialTypeId?: number;
    dC_ScheduleSpecialType?: CoreModelsDTOsMasterDataDCTablesDCScheduleSpecialTypeDTO;
    clinicRoomScheduleXSpecialtyXService?: Array<CoreModelsDTOsMasterDataJunctionTablesClinicRoomScheduleXSpecialtyXServiceDTO>;
}