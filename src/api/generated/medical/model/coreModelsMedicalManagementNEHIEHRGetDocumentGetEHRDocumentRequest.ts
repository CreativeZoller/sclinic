/**
 * MedicalManagementController
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

export interface CoreModelsMedicalManagementNEHIEHRGetDocumentGetEHRDocumentRequest { 
    executingUserId?: number;
    medicalEmployeeId?: number;
    clinicId?: number;
    specialtyId?: number;
    samlAssertionBASE64?: string;
    nehiId?: string;
    version?: number;
    isBreakGlass?: boolean;
    breakGlassReason?: string;
    isSpecificAuthorization?: boolean;
}