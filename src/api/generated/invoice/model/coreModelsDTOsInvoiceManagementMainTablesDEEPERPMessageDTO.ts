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
import { CoreModelsDTOsInvoiceManagementMainTablesDEEPERPMessageBodyDTO } from './coreModelsDTOsInvoiceManagementMainTablesDEEPERPMessageBodyDTO';
import { CoreModelsDTOsInvoiceManagementMainTablesDEEPERPMessageTypeDTO } from './coreModelsDTOsInvoiceManagementMainTablesDEEPERPMessageTypeDTO';
import { CoreModelsDTOsInvoiceManagementMainTablesDEEPERPResponseDTO } from './coreModelsDTOsInvoiceManagementMainTablesDEEPERPResponseDTO';

export interface CoreModelsDTOsInvoiceManagementMainTablesDEEPERPMessageDTO { 
    executingUserId?: number;
    deeperpMessageId?: number;
    deeperpMessageTypeId?: number;
    deeperpMessageType?: CoreModelsDTOsInvoiceManagementMainTablesDEEPERPMessageTypeDTO;
    invoideId?: number;
    deeperpMessageBody?: Array<CoreModelsDTOsInvoiceManagementMainTablesDEEPERPMessageBodyDTO>;
    deeperpResponse?: Array<CoreModelsDTOsInvoiceManagementMainTablesDEEPERPResponseDTO>;
}