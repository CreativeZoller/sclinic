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

export interface CoreModelsMedicalManagementAppointmentServiceExtensionGetAppointmentServiceExtensionsByConditionRequest { 
    executingUserId?: number;
    page?: number;
    pageSize?: number;
    appointmentServiceExtensionIds?: Array<number>;
    specialtyIds?: Array<number>;
    subContractNumberIds?: Array<number>;
    medicalEmployeeIds?: Array<number>;
    isPaid?: boolean;
    isCompleted?: boolean;
    appointmentId?: number;
    patientId?: number;
    needStatus?: boolean;
    needService?: boolean;
    needServicePackage?: boolean;
    needSubContractNumber?: boolean;
    needAppointment?: boolean;
    needConsultation?: boolean;
}