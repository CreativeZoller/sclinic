/**
 * MedicalManagementController
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { CoreModelsDTOsMedicalManagementMainTablesNEHIMessageBodyDTO } from './coreModelsDTOsMedicalManagementMainTablesNEHIMessageBodyDTO';
import { CoreModelsDTOsMedicalManagementMainTablesNEHIMessageExtensionDTO } from './coreModelsDTOsMedicalManagementMainTablesNEHIMessageExtensionDTO';
import { CoreModelsDTOsMedicalManagementMainTablesNEHIMessageTypeDTO } from './coreModelsDTOsMedicalManagementMainTablesNEHIMessageTypeDTO';
import { CoreModelsDTOsMedicalManagementMainTablesNEHIResponseDTO } from './coreModelsDTOsMedicalManagementMainTablesNEHIResponseDTO';

export interface CoreModelsDTOsMedicalManagementMainTablesNEHIMessageDTO { 
    executingUserId?: number;
    nehiMessageId?: number;
    nehiMessageTypeId?: number;
    nehiMessageType?: CoreModelsDTOsMedicalManagementMainTablesNEHIMessageTypeDTO;
    nehiMessageExtension?: Array<CoreModelsDTOsMedicalManagementMainTablesNEHIMessageExtensionDTO>;
    nehiMessageBody?: Array<CoreModelsDTOsMedicalManagementMainTablesNEHIMessageBodyDTO>;
    nehiResponse?: Array<CoreModelsDTOsMedicalManagementMainTablesNEHIResponseDTO>;
}