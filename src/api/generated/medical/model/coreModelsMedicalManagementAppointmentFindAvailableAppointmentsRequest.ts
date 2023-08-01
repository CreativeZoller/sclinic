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
import { CoreModelsMedicalManagementAppointmentServiceDetails } from './coreModelsMedicalManagementAppointmentServiceDetails';

export interface CoreModelsMedicalManagementAppointmentFindAvailableAppointmentsRequest { 
    executingUserId?: number;
    clinicId?: number;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    patientAge?: number;
    patientId?: number;
    dC_LanguageId?: number;
    isMonday?: boolean;
    isTuesday?: boolean;
    isWednesday?: boolean;
    isThursday?: boolean;
    isFriday?: boolean;
    isSaturday?: boolean;
    isSunday?: boolean;
    serviceDetails?: Array<CoreModelsMedicalManagementAppointmentServiceDetails>;
    dC_BookingAreaId?: number;
    variationCount?: number;
}