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
import { CoreModelsDTOsMasterDataDCTablesDCCompanyTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCCompanyTypeDTO';
import { CoreModelsDTOsMasterDataDCTablesDCPartnerTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCPartnerTypeDTO';

export interface CoreModelsDTOsMasterDataSmallDTOsSmallCompanyDTO { 
    companyId?: number;
    companyName?: string;
    dC_CompanyType?: CoreModelsDTOsMasterDataDCTablesDCCompanyTypeDTO;
    dC_PartnerType?: CoreModelsDTOsMasterDataDCTablesDCPartnerTypeDTO;
    invoiceEmail?: string;
}