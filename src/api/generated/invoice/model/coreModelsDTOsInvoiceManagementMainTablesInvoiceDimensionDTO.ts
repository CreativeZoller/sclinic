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
import { CoreModelsDTOsInvoiceManagementMainTablesInvoiceDTO } from './coreModelsDTOsInvoiceManagementMainTablesInvoiceDTO';
import { CoreModelsDTOsInvoiceManagementMainTablesInvoiceItemDTO } from './coreModelsDTOsInvoiceManagementMainTablesInvoiceItemDTO';

export interface CoreModelsDTOsInvoiceManagementMainTablesInvoiceDimensionDTO { 
    invoiceDimensionId?: number;
    invoiceItemId?: number;
    invoiceItem?: CoreModelsDTOsInvoiceManagementMainTablesInvoiceItemDTO;
    invoiceId?: number;
    invoice?: CoreModelsDTOsInvoiceManagementMainTablesInvoiceDTO;
    dimensionPropertyName?: string;
    value?: string;
}