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
import { CoreModelsDTOsMasterDataDCTablesDCDayDTO } from './coreModelsDTOsMasterDataDCTablesDCDayDTO';
import { CoreModelsDTOsMasterDataDCTablesDCScheduleSpecialTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCScheduleSpecialTypeDTO';
import { CoreModelsDTOsMasterDataDCTablesDCWeekTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCWeekTypeDTO';
import { CoreModelsDTOsMasterDataMainTablesClinicDTO } from './coreModelsDTOsMasterDataMainTablesClinicDTO';
import { CoreModelsDTOsMasterDataMainTablesClinicRoomDTO } from './coreModelsDTOsMasterDataMainTablesClinicRoomDTO';
import { CoreModelsDTOsMasterDataMainTablesMedicalEmployeeDTO } from './coreModelsDTOsMasterDataMainTablesMedicalEmployeeDTO';
import { CoreModelsDTOsResourceManagementJunctionTablesPublishedScheduleXDCBookingAreaDTO } from './coreModelsDTOsResourceManagementJunctionTablesPublishedScheduleXDCBookingAreaDTO';
import { CoreModelsDTOsResourceManagementMainTablesPublishedScheduleWarningDTO } from './coreModelsDTOsResourceManagementMainTablesPublishedScheduleWarningDTO';
import { CoreModelsResourceManagementTransferDataGetPublishedScheduleXMedicalEmployeeDTO } from './coreModelsResourceManagementTransferDataGetPublishedScheduleXMedicalEmployeeDTO';
import { CoreModelsResourceManagementTransferDataGetPublishedScheduleXPartnerDTO } from './coreModelsResourceManagementTransferDataGetPublishedScheduleXPartnerDTO';
import { CoreModelsResourceManagementTransferDataGetPublishedScheduleXSpecialtyDTO } from './coreModelsResourceManagementTransferDataGetPublishedScheduleXSpecialtyDTO';

export interface CoreModelsResourceManagementTransferDataGetPublishedScheduleDTO { 
    publishedScheduleId?: number;
    plannedScheduleId?: number;
    medicalEmployeeId?: number;
    medicalEmployeeData?: CoreModelsDTOsMasterDataMainTablesMedicalEmployeeDTO;
    clinicId?: number;
    clinicData?: CoreModelsDTOsMasterDataMainTablesClinicDTO;
    clinicRoomId?: number;
    clinicRoomData?: CoreModelsDTOsMasterDataMainTablesClinicRoomDTO;
    startDate?: string;
    endDate?: string;
    dC_WeekTypeId?: number;
    dC_WeekType?: CoreModelsDTOsMasterDataDCTablesDCWeekTypeDTO;
    dC_DayId?: number;
    dC_Day?: CoreModelsDTOsMasterDataDCTablesDCDayDTO;
    remarks?: string;
    isEmailDenied?: boolean;
    isClosedSchedule?: boolean;
    dC_ScheduleSpecialTypeId?: number;
    dC_ScheduleSpecialType?: CoreModelsDTOsMasterDataDCTablesDCScheduleSpecialTypeDTO;
    isPending?: boolean;
    publishedScheduleXSpecialty?: Array<CoreModelsResourceManagementTransferDataGetPublishedScheduleXSpecialtyDTO>;
    publishedScheduleXMedicalEmployee?: Array<CoreModelsResourceManagementTransferDataGetPublishedScheduleXMedicalEmployeeDTO>;
    publishedScheduleXPartner?: Array<CoreModelsResourceManagementTransferDataGetPublishedScheduleXPartnerDTO>;
    publishedScheduleWarning?: Array<CoreModelsDTOsResourceManagementMainTablesPublishedScheduleWarningDTO>;
    publishedScheduleXDC_BookingArea?: Array<CoreModelsDTOsResourceManagementJunctionTablesPublishedScheduleXDCBookingAreaDTO>;
}