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
import { CoreModelsDTOsMasterDataJunctionTablesExposureXExposureItemDTO } from './coreModelsDTOsMasterDataJunctionTablesExposureXExposureItemDTO';

export interface CoreModelsDTOsMasterDataMainTablesExposureDTO { 
    executingUserId?: number;
    exposureId?: number;
    description?: string;
    isCompleted?: boolean;
    exposureDate?: string;
    exposureXExposureItem?: Array<CoreModelsDTOsMasterDataJunctionTablesExposureXExposureItemDTO>;
}