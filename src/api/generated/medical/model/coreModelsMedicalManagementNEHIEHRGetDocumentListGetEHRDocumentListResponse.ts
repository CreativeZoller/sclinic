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
import { CoreModelsMedicalManagementNEHIEHRGetDocumentEHRDocument } from './coreModelsMedicalManagementNEHIEHRGetDocumentEHRDocument';
import { CoreModelsNEHICommonNEHIErrorMessageDTO } from './coreModelsNEHICommonNEHIErrorMessageDTO';

export interface CoreModelsMedicalManagementNEHIEHRGetDocumentListGetEHRDocumentListResponse { 
    errorMessage?: string;
    errorMessages?: Array<CoreModelsNEHICommonNEHIErrorMessageDTO>;
    faultMessages?: Array<CoreModelsNEHICommonNEHIErrorMessageDTO>;
    status?: string;
    ehrDocumentList?: Array<CoreModelsMedicalManagementNEHIEHRGetDocumentEHRDocument>;
}