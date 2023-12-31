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
import { CoreModelsDTOsMasterDataMainTablesMedicalEmployeeDTO } from './coreModelsDTOsMasterDataMainTablesMedicalEmployeeDTO';
import { CoreModelsDTOsMasterDataMainTablesSpecialtyDTO } from './coreModelsDTOsMasterDataMainTablesSpecialtyDTO';
import { CoreModelsResourceManagementTransferDataScheduleTemplateSummaryClinicDTO } from './coreModelsResourceManagementTransferDataScheduleTemplateSummaryClinicDTO';

export interface CoreModelsResourceManagementScheduleTemplateGetScheduleTemplateSummaryResponse { 
    errorMessage?: string;
    clinicDataList?: Array<CoreModelsResourceManagementTransferDataScheduleTemplateSummaryClinicDTO>;
    employeeDataList?: Array<CoreModelsDTOsMasterDataMainTablesMedicalEmployeeDTO>;
    specialtyList?: Array<CoreModelsDTOsMasterDataMainTablesSpecialtyDTO>;
    dC_BookingAreaIdList?: Array<number>;
}