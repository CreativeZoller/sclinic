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
import { CoreModelsDTOsMasterDataMainTablesServiceDTO } from './coreModelsDTOsMasterDataMainTablesServiceDTO';
import { CoreModelsDTOsMasterDataMainTablesServicePackageDTO } from './coreModelsDTOsMasterDataMainTablesServicePackageDTO';
import { CoreModelsDTOsMedicalManagementMainTablesOfferDTO } from './coreModelsDTOsMedicalManagementMainTablesOfferDTO';

export interface CoreModelsDTOsMedicalManagementMainTablesOfferedServiceDTO { 
    offeredServiceId?: number;
    offerId?: number;
    offer?: CoreModelsDTOsMedicalManagementMainTablesOfferDTO;
    serviceId?: number;
    service?: CoreModelsDTOsMasterDataMainTablesServiceDTO;
    servicePackageId?: number;
    servicePackage?: CoreModelsDTOsMasterDataMainTablesServicePackageDTO;
    subServicePackageId?: number;
    subServicePackage?: CoreModelsDTOsMasterDataMainTablesServicePackageDTO;
    servicePrice?: number;
    paidAmount?: number;
}