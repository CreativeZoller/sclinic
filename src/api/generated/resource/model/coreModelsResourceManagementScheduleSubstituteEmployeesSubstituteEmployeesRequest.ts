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

export interface CoreModelsResourceManagementScheduleSubstituteEmployeesSubstituteEmployeesRequest { 
    executingUserId?: number;
    medicalEmployeeId?: number;
    substituteMedicalEmployeeId?: number;
    appointmentIds?: Array<number>;
    clinicIds?: Array<number>;
    specialtyIds?: Array<number>;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    dC_WeekTypeIds?: Array<number>;
    dC_DayIds?: Array<number>;
    isCheck?: boolean;
}