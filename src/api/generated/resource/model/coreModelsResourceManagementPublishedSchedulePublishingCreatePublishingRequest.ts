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

export interface CoreModelsResourceManagementPublishedSchedulePublishingCreatePublishingRequest { 
    executingUserId?: number;
    startDate?: string;
    endDate?: string;
    clinicId?: Array<number>;
    medicalEmployeeId?: Array<number>;
    onlyChange?: boolean;
    isSendOnlyEmail?: boolean;
    emailList?: Array<string>;
}