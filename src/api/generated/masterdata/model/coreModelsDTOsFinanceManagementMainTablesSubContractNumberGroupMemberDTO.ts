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
import { CoreModelsDTOsFinanceManagementMainTablesSubContractNumberGroupDTO } from './coreModelsDTOsFinanceManagementMainTablesSubContractNumberGroupDTO';

export interface CoreModelsDTOsFinanceManagementMainTablesSubContractNumberGroupMemberDTO { 
    subContractNumberGroupMemberId?: number;
    subContractNumberGroupId?: number;
    subContractNumberGroup?: CoreModelsDTOsFinanceManagementMainTablesSubContractNumberGroupDTO;
    patientId?: number;
    jobTitleId?: number;
    companySiteId?: number;
    companyWorkspaceId?: number;
}