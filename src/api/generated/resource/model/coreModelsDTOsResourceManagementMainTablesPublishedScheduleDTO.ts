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
import { CoreModelsDTOsResourceManagementJunctionTablesPublishedScheduleXDCBookingAreaDTO } from './coreModelsDTOsResourceManagementJunctionTablesPublishedScheduleXDCBookingAreaDTO';
import { CoreModelsDTOsResourceManagementJunctionTablesPublishedScheduleXMedicalEmployeeDTO } from './coreModelsDTOsResourceManagementJunctionTablesPublishedScheduleXMedicalEmployeeDTO';
import { CoreModelsDTOsResourceManagementJunctionTablesPublishedScheduleXPartnerDTO } from './coreModelsDTOsResourceManagementJunctionTablesPublishedScheduleXPartnerDTO';
import { CoreModelsDTOsResourceManagementJunctionTablesPublishedScheduleXSpecialtyDTO } from './coreModelsDTOsResourceManagementJunctionTablesPublishedScheduleXSpecialtyDTO';
import { CoreModelsDTOsResourceManagementMainTablesPlannedScheduleDTO } from './coreModelsDTOsResourceManagementMainTablesPlannedScheduleDTO';
import { CoreModelsDTOsResourceManagementMainTablesPublishedScheduleWarningDTO } from './coreModelsDTOsResourceManagementMainTablesPublishedScheduleWarningDTO';

export interface CoreModelsDTOsResourceManagementMainTablesPublishedScheduleDTO { 
    publishedScheduleId?: number;
    plannedScheduleId?: number;
    plannedSchedule?: CoreModelsDTOsResourceManagementMainTablesPlannedScheduleDTO;
    medicalEmployeeId?: number;
    clinicId?: number;
    clinicRoomId?: number;
    startDate?: string;
    endDate?: string;
    dC_WeekTypeId?: number;
    dC_DayId?: number;
    remarks?: string;
    isEmailDenied?: boolean;
    isClosedSchedule?: boolean;
    dC_ScheduleSpecialTypeId?: number;
    isPending?: boolean;
    publishedScheduleXSpecialty?: Array<CoreModelsDTOsResourceManagementJunctionTablesPublishedScheduleXSpecialtyDTO>;
    publishedScheduleXMedicalEmployee?: Array<CoreModelsDTOsResourceManagementJunctionTablesPublishedScheduleXMedicalEmployeeDTO>;
    publishedScheduleXPartner?: Array<CoreModelsDTOsResourceManagementJunctionTablesPublishedScheduleXPartnerDTO>;
    publishedScheduleWarning?: Array<CoreModelsDTOsResourceManagementMainTablesPublishedScheduleWarningDTO>;
    publishedScheduleXDC_BookingArea?: Array<CoreModelsDTOsResourceManagementJunctionTablesPublishedScheduleXDCBookingAreaDTO>;
}