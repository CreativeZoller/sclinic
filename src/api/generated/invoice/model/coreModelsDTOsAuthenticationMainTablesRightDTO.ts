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
import { CoreModelsDTOsAuthenticationJunctionTablesRightXFunctionDTO } from './coreModelsDTOsAuthenticationJunctionTablesRightXFunctionDTO';

export interface CoreModelsDTOsAuthenticationMainTablesRightDTO { 
    executingUserId?: number;
    rightId?: number;
    name?: string;
    delete?: boolean;
    rightXFunction?: Array<CoreModelsDTOsAuthenticationJunctionTablesRightXFunctionDTO>;
}