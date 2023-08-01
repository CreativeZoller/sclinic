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
import { CoreModelsDTOsAuthenticationMainTablesRightDTO } from './coreModelsDTOsAuthenticationMainTablesRightDTO';
import { CoreModelsDTOsMasterDataDCTablesDCBookingAreaDTO } from './coreModelsDTOsMasterDataDCTablesDCBookingAreaDTO';
import { CoreModelsDTOsMasterDataDCTablesDCDayDTO } from './coreModelsDTOsMasterDataDCTablesDCDayDTO';
import { CoreModelsDTOsMasterDataDCTablesDCMedicalEmployeeScheduleTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCMedicalEmployeeScheduleTypeDTO';
import { CoreModelsDTOsMasterDataDCTablesDCScheduleSpecialTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCScheduleSpecialTypeDTO';
import { CoreModelsDTOsMasterDataDCTablesDCScheduleWarningDTO } from './coreModelsDTOsMasterDataDCTablesDCScheduleWarningDTO';
import { CoreModelsDTOsMasterDataDCTablesDCWeekTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCWeekTypeDTO';

export interface CoreModelsResourceManagementPlannedScheduleInitPageGetPlannedScheduleInitPageResponse { 
    errorMessage?: string;
    rights?: Array<CoreModelsDTOsAuthenticationMainTablesRightDTO>;
    dC_ScheduleWarningList?: Array<CoreModelsDTOsMasterDataDCTablesDCScheduleWarningDTO>;
    dC_WeekTypeList?: Array<CoreModelsDTOsMasterDataDCTablesDCWeekTypeDTO>;
    dC_DayList?: Array<CoreModelsDTOsMasterDataDCTablesDCDayDTO>;
    dC_ScheduleSpecialTypeList?: Array<CoreModelsDTOsMasterDataDCTablesDCScheduleSpecialTypeDTO>;
    dC_MedicalEmployeeScheduleTypeList?: Array<CoreModelsDTOsMasterDataDCTablesDCMedicalEmployeeScheduleTypeDTO>;
    dC_BookingAreaList?: Array<CoreModelsDTOsMasterDataDCTablesDCBookingAreaDTO>;
}