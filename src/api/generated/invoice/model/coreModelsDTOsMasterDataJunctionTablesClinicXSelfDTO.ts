/**
 * InvoiceManagementController
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { CoreModelsDTOsMasterDataMainTablesSelfDTO } from './coreModelsDTOsMasterDataMainTablesSelfDTO';
import { CoreModelsDTOsMasterDataMainTablesSpecialtyDTO } from './coreModelsDTOsMasterDataMainTablesSpecialtyDTO';

export interface CoreModelsDTOsMasterDataJunctionTablesClinicXSelfDTO { 
    clinicXSelfId?: number;
    clinicId?: number;
    selfId?: number;
    self?: CoreModelsDTOsMasterDataMainTablesSelfDTO;
    specialtyId?: number;
    specialty?: CoreModelsDTOsMasterDataMainTablesSpecialtyDTO;
    clinicOrganizationUniteCode?: string;
}