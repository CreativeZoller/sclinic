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

export interface CoreModelsMedicalManagementNEHIMessageGetNEHIMessageByConditionRequest { 
    executingUserId?: number;
    nehiMessageIdList?: Array<number>;
    nehiId?: string;
    selfId?: number;
    clinicXSpecialtyXServiceId?: number;
    needExtension?: boolean;
    needBody?: boolean;
    needResponse?: boolean;
    needErrorLog?: boolean;
    needMessageBodyDecompress?: boolean;
    needErrorResponseDecompress?: boolean;
}