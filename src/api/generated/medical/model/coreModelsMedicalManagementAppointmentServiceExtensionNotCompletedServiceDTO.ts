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

export interface CoreModelsMedicalManagementAppointmentServiceExtensionNotCompletedServiceDTO { 
    appointmentServiceExtensionId?: number;
    appointmentId?: number;
    patientId?: number;
    patientName?: string;
    birthDate?: string;
    serviceId?: number;
    serviceName?: string;
    servicePrice?: number;
    specialtyId?: number;
    specialtyName?: string;
    appointmentDate?: string;
    accountBalanceId?: number;
    expirationDate?: string;
    medicalEmployeeId?: number;
    medicalEmployeeName?: string;
    dC_AppointmentCancellationId?: number;
    dC_AppointmentCancellationName?: string;
    dC_CancellationStatusId?: number;
    dC_CancellationStatusName?: string;
    subContractNumberId?: number;
    subContractNumberName?: string;
}