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
import { CoreModelsDTOsMasterDataMainTablesExposureDTO } from './coreModelsDTOsMasterDataMainTablesExposureDTO';
import { CoreModelsMasterDataOccupationalHealthTransferModelGroupExposureItemData } from './coreModelsMasterDataOccupationalHealthTransferModelGroupExposureItemData';

export interface CoreModelsMasterDataOccupationalHealthTransferModelGroupExposureData { 
    exposureId?: number;
    exposure?: CoreModelsDTOsMasterDataMainTablesExposureDTO;
    exposureItemList?: Array<CoreModelsMasterDataOccupationalHealthTransferModelGroupExposureItemData>;
}