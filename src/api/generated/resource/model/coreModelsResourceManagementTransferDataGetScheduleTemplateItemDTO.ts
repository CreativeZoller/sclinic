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
import { CoreModelsDTOsResourceManagementJunctionTablesScheduleTemplateItemXDCBookingAreaDTO } from './coreModelsDTOsResourceManagementJunctionTablesScheduleTemplateItemXDCBookingAreaDTO';
import { CoreModelsResourceManagementTransferDataGetScheduleTemplateItemXMedicalEmployeeDTO } from './coreModelsResourceManagementTransferDataGetScheduleTemplateItemXMedicalEmployeeDTO';
import { CoreModelsResourceManagementTransferDataGetScheduleTemplateItemXPartnerDTO } from './coreModelsResourceManagementTransferDataGetScheduleTemplateItemXPartnerDTO';
import { CoreModelsResourceManagementTransferDataGetScheduleTemplateItemXSpecialtyDTO } from './coreModelsResourceManagementTransferDataGetScheduleTemplateItemXSpecialtyDTO';

export interface CoreModelsResourceManagementTransferDataGetScheduleTemplateItemDTO { 
    scheduleTemplateItemId?: number;
    scheduleTemplateId?: number;
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
    scheduleTemplateItemXSpecialty?: Array<CoreModelsResourceManagementTransferDataGetScheduleTemplateItemXSpecialtyDTO>;
    scheduleTemplateItemXMedicalEmployee?: Array<CoreModelsResourceManagementTransferDataGetScheduleTemplateItemXMedicalEmployeeDTO>;
    scheduleTemplateItemXPartner?: Array<CoreModelsResourceManagementTransferDataGetScheduleTemplateItemXPartnerDTO>;
    scheduleTemplateItemXDC_BookingArea?: Array<CoreModelsDTOsResourceManagementJunctionTablesScheduleTemplateItemXDCBookingAreaDTO>;
}