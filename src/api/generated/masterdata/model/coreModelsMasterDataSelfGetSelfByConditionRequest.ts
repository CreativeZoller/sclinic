/**
 * MasterDataManagementController
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

export interface CoreModelsMasterDataSelfGetSelfByConditionRequest { 
    executingUserId?: number;
    page?: number;
    pageSize?: number;
    selfIdList?: Array<number>;
    selfName?: string;
    companyName?: string;
    dC_CompanyTypeId?: number;
    dC_PartnerModeId?: number;
    companyContactEmailAddress?: string;
    needClinicXSelf?: boolean;
}