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
import { CoreModelsDTOsResourceManagementJunctionTablesScheduleTemplateItemXDCBookingAreaDTO } from './coreModelsDTOsResourceManagementJunctionTablesScheduleTemplateItemXDCBookingAreaDTO';
import { CoreModelsDTOsResourceManagementJunctionTablesScheduleTemplateItemXMedicalEmployeeDTO } from './coreModelsDTOsResourceManagementJunctionTablesScheduleTemplateItemXMedicalEmployeeDTO';
import { CoreModelsDTOsResourceManagementJunctionTablesScheduleTemplateItemXPartnerDTO } from './coreModelsDTOsResourceManagementJunctionTablesScheduleTemplateItemXPartnerDTO';
import { CoreModelsDTOsResourceManagementJunctionTablesScheduleTemplateItemXSpecialtyDTO } from './coreModelsDTOsResourceManagementJunctionTablesScheduleTemplateItemXSpecialtyDTO';
import { CoreModelsDTOsResourceManagementMainTablesScheduleTemplateDTO } from './coreModelsDTOsResourceManagementMainTablesScheduleTemplateDTO';

export interface CoreModelsDTOsResourceManagementMainTablesScheduleTemplateItemDTO { 
    scheduleTemplateItemId?: number;
    scheduleTemplateId?: number;
    scheduleTemplate?: CoreModelsDTOsResourceManagementMainTablesScheduleTemplateDTO;
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
    scheduleTemplateItemXSpecialty?: Array<CoreModelsDTOsResourceManagementJunctionTablesScheduleTemplateItemXSpecialtyDTO>;
    scheduleTemplateItemXMedicalEmployee?: Array<CoreModelsDTOsResourceManagementJunctionTablesScheduleTemplateItemXMedicalEmployeeDTO>;
    scheduleTemplateItemXPartner?: Array<CoreModelsDTOsResourceManagementJunctionTablesScheduleTemplateItemXPartnerDTO>;
    scheduleTemplateItemXDC_BookingArea?: Array<CoreModelsDTOsResourceManagementJunctionTablesScheduleTemplateItemXDCBookingAreaDTO>;
}