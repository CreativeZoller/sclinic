/**
 * MasterDataManagementController
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { CoreModelsDTOsMasterDataMainTablesClinicDTO } from './coreModelsDTOsMasterDataMainTablesClinicDTO';
import { CoreModelsDTOsMasterDataMainTablesMedicalEmployeeDTO } from './coreModelsDTOsMasterDataMainTablesMedicalEmployeeDTO';

export interface CoreModelsDTOsMasterDataJunctionTablesMedicalEmployeeXClinicDTO { 
    executingUserId?: number;
    medicalEmployeeXClinicId?: number;
    medicalEmployeeId?: number;
    medicalEmployee?: CoreModelsDTOsMasterDataMainTablesMedicalEmployeeDTO;
    clinicId?: number;
    clinic?: CoreModelsDTOsMasterDataMainTablesClinicDTO;
}