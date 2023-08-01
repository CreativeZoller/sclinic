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
import { CoreModelsDTOsAuthenticationMainTablesRightDTO } from './coreModelsDTOsAuthenticationMainTablesRightDTO';
import { CoreModelsDTOsAuthenticationMainTablesRoleDTO } from './coreModelsDTOsAuthenticationMainTablesRoleDTO';
import { CoreModelsDTOsMasterDataDCTablesDCBookingAreaDTO } from './coreModelsDTOsMasterDataDCTablesDCBookingAreaDTO';
import { CoreModelsDTOsMasterDataDCTablesDCItemProcurationalCategoryDTO } from './coreModelsDTOsMasterDataDCTablesDCItemProcurationalCategoryDTO';
import { CoreModelsDTOsMasterDataDCTablesDCLabProviderDTO } from './coreModelsDTOsMasterDataDCTablesDCLabProviderDTO';
import { CoreModelsDTOsMasterDataDCTablesDCLabRepeatPeriodDTO } from './coreModelsDTOsMasterDataDCTablesDCLabRepeatPeriodDTO';
import { CoreModelsDTOsMasterDataDCTablesDCLabSamplingTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCLabSamplingTypeDTO';
import { CoreModelsDTOsMasterDataDCTablesDCServicePackageCategoryDTO } from './coreModelsDTOsMasterDataDCTablesDCServicePackageCategoryDTO';
import { CoreModelsDTOsMasterDataDCTablesDCServicePackageTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCServicePackageTypeDTO';
import { CoreModelsDTOsMasterDataDCTablesDCStatusDTO } from './coreModelsDTOsMasterDataDCTablesDCStatusDTO';
import { CoreModelsDTOsMasterDataDCTablesDCSubServicePackageCategoryDTO } from './coreModelsDTOsMasterDataDCTablesDCSubServicePackageCategoryDTO';
import { CoreModelsDTOsMasterDataDCTablesDCSubServicePackageTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCSubServicePackageTypeDTO';

export interface CoreModelsMasterDataServicePackageInitPageGetServicePackageInitPageResponse { 
    errorMessage?: string;
    rights?: Array<CoreModelsDTOsAuthenticationMainTablesRightDTO>;
    dC_SubServicePackageTypeList?: Array<CoreModelsDTOsMasterDataDCTablesDCSubServicePackageTypeDTO>;
    dC_ServicePackageCategoryList?: Array<CoreModelsDTOsMasterDataDCTablesDCServicePackageCategoryDTO>;
    dC_BookingAreaList?: Array<CoreModelsDTOsMasterDataDCTablesDCBookingAreaDTO>;
    dC_StatusList?: Array<CoreModelsDTOsMasterDataDCTablesDCStatusDTO>;
    dC_ServicePackageTypeList?: Array<CoreModelsDTOsMasterDataDCTablesDCServicePackageTypeDTO>;
    dC_SubServicePackageCategoryList?: Array<CoreModelsDTOsMasterDataDCTablesDCSubServicePackageCategoryDTO>;
    roleList?: Array<CoreModelsDTOsAuthenticationMainTablesRoleDTO>;
    dC_ItemProcurationalCategoryList?: Array<CoreModelsDTOsMasterDataDCTablesDCItemProcurationalCategoryDTO>;
    dC_LabSamplingTypeList?: Array<CoreModelsDTOsMasterDataDCTablesDCLabSamplingTypeDTO>;
    dC_LabRepeatPeriodList?: Array<CoreModelsDTOsMasterDataDCTablesDCLabRepeatPeriodDTO>;
    dC_LabProviderList?: Array<CoreModelsDTOsMasterDataDCTablesDCLabProviderDTO>;
}