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
import { CoreModelsDTOsMasterDataDCTablesDCScheduleWarningDTO } from './coreModelsDTOsMasterDataDCTablesDCScheduleWarningDTO';

export interface CoreModelsResourceManagementPublishedScheduleWarningInitPageGetPublishedScheduleWarningInitPageResponse { 
    errorMessage?: string;
    rights?: Array<CoreModelsDTOsAuthenticationMainTablesRightDTO>;
    dC_ScheduleWarningList?: Array<CoreModelsDTOsMasterDataDCTablesDCScheduleWarningDTO>;
}