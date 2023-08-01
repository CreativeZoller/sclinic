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
import { CoreModelsDTOsMasterDataMainTablesMedicalContractPeriodCommissionDTO } from './coreModelsDTOsMasterDataMainTablesMedicalContractPeriodCommissionDTO';
import { CoreModelsDTOsMasterDataMainTablesMedicalContractPeriodDTO } from './coreModelsDTOsMasterDataMainTablesMedicalContractPeriodDTO';
import { CoreModelsDTOsMasterDataMainTablesMedicalEmployeeDTO } from './coreModelsDTOsMasterDataMainTablesMedicalEmployeeDTO';

export interface CoreModelsDTOsMasterDataMainTablesMedicalContractDTO { 
    executingUserId?: number;
    medicalContractId?: number;
    medicalContractName?: string;
    medicalContractNumber?: string;
    isDuty?: boolean;
    medicalContractPeriod?: Array<CoreModelsDTOsMasterDataMainTablesMedicalContractPeriodDTO>;
    medicalContractPeriodCommission?: Array<CoreModelsDTOsMasterDataMainTablesMedicalContractPeriodCommissionDTO>;
    medicalEmployeeId?: number;
    medicalEmployee?: CoreModelsDTOsMasterDataMainTablesMedicalEmployeeDTO;
}