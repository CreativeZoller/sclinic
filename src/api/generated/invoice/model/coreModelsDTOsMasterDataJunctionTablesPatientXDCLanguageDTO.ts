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
import { CoreModelsDTOsMasterDataDCTablesDCLanguageDTO } from './coreModelsDTOsMasterDataDCTablesDCLanguageDTO';

export interface CoreModelsDTOsMasterDataJunctionTablesPatientXDCLanguageDTO { 
    executingUserId?: number;
    patientXDC_LanguageId?: number;
    patientId?: number;
    dC_LanguageId?: number;
    dC_Language?: CoreModelsDTOsMasterDataDCTablesDCLanguageDTO;
    isDefault?: boolean;
}