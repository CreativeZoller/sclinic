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

export interface CoreModelsResourceManagementPlannedScheduleWarningGetPlannedScheduleWarningByConditionRequest { 
    executingUserId?: number;
    page?: number;
    pageSize?: number;
    plannedScheduleWarningIdList?: Array<number>;
    plannedScheduleIdList?: Array<number>;
    needPlannedSchedule?: boolean;
    needDCValue?: boolean;
}