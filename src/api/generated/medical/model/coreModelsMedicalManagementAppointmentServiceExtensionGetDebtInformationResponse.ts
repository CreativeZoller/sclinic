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
import { CoreModelsDTOsMedicalManagementMainTablesAppointmentServiceExtensionDTO } from './coreModelsDTOsMedicalManagementMainTablesAppointmentServiceExtensionDTO';

export interface CoreModelsMedicalManagementAppointmentServiceExtensionGetDebtInformationResponse { 
    errorMessage?: string;
    appointmentServiceExtensionList?: Array<CoreModelsDTOsMedicalManagementMainTablesAppointmentServiceExtensionDTO>;
    isInDebt?: boolean;
}