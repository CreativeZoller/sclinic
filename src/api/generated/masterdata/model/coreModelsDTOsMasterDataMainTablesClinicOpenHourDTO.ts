/**
 * MasterDataManagementController
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

export interface CoreModelsDTOsMasterDataMainTablesClinicOpenHourDTO { 
    executingUserId?: number;
    clinicOpenHourId?: number;
    clinicId?: number;
    dC_DayId?: number;
    dC_Day?: CoreModelsDTOsMasterDataDCTablesDCDayDTO;
    startTime?: string;
    endTime?: string;
}