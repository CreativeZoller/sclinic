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
import { CoreModelsDTOsMasterDataDCTablesDCItemConsumerTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCItemConsumerTypeDTO';
import { CoreModelsDTOsMasterDataDCTablesDCItemProcurationalCategoryDTO } from './coreModelsDTOsMasterDataDCTablesDCItemProcurationalCategoryDTO';
import { CoreModelsDTOsMasterDataDCTablesDCItemTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCItemTypeDTO';
import { CoreModelsDTOsMasterDataDCTablesDCLabProviderDTO } from './coreModelsDTOsMasterDataDCTablesDCLabProviderDTO';
import { CoreModelsDTOsMasterDataDCTablesDCLabRepeatPeriodDTO } from './coreModelsDTOsMasterDataDCTablesDCLabRepeatPeriodDTO';
import { CoreModelsDTOsMasterDataDCTablesDCLabSamplingTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCLabSamplingTypeDTO';
import { CoreModelsDTOsMasterDataDCTablesDCMarkerDTO } from './coreModelsDTOsMasterDataDCTablesDCMarkerDTO';
import { CoreModelsDTOsMasterDataDCTablesDCSamplingItemDTO } from './coreModelsDTOsMasterDataDCTablesDCSamplingItemDTO';
import { CoreModelsDTOsMasterDataDCTablesDCServiceCategoryDTO } from './coreModelsDTOsMasterDataDCTablesDCServiceCategoryDTO';
import { CoreModelsDTOsMasterDataDCTablesDCServicePackageCategoryDTO } from './coreModelsDTOsMasterDataDCTablesDCServicePackageCategoryDTO';
import { CoreModelsDTOsMasterDataDCTablesDCServicePackageTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCServicePackageTypeDTO';
import { CoreModelsDTOsMasterDataDCTablesDCServiceTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCServiceTypeDTO';
import { CoreModelsDTOsMasterDataDCTablesDCStatusDTO } from './coreModelsDTOsMasterDataDCTablesDCStatusDTO';
import { CoreModelsDTOsMasterDataDCTablesNEHIAmbulantProvisionTypeDTO } from './coreModelsDTOsMasterDataDCTablesNEHIAmbulantProvisionTypeDTO';

export interface CoreModelsMasterDataServiceInitPageGetServiceInitPageResponse { 
    errorMessage?: string;
    rights?: Array<CoreModelsDTOsAuthenticationMainTablesRightDTO>;
    dC_ServiceCategoryList?: Array<CoreModelsDTOsMasterDataDCTablesDCServiceCategoryDTO>;
    dC_StatusList?: Array<CoreModelsDTOsMasterDataDCTablesDCStatusDTO>;
    dC_ServiceTypeList?: Array<CoreModelsDTOsMasterDataDCTablesDCServiceTypeDTO>;
    dC_ItemProcurationalCategoryList?: Array<CoreModelsDTOsMasterDataDCTablesDCItemProcurationalCategoryDTO>;
    dC_ItemConsumerTypeList?: Array<CoreModelsDTOsMasterDataDCTablesDCItemConsumerTypeDTO>;
    dC_BookingAreaList?: Array<CoreModelsDTOsMasterDataDCTablesDCBookingAreaDTO>;
    dC_MarkerList?: Array<CoreModelsDTOsMasterDataDCTablesDCMarkerDTO>;
    dC_SamplingItemList?: Array<CoreModelsDTOsMasterDataDCTablesDCSamplingItemDTO>;
    roleList?: Array<CoreModelsDTOsAuthenticationMainTablesRoleDTO>;
    dC_LabSamplingTypeList?: Array<CoreModelsDTOsMasterDataDCTablesDCLabSamplingTypeDTO>;
    dC_LabRepeatPeriodList?: Array<CoreModelsDTOsMasterDataDCTablesDCLabRepeatPeriodDTO>;
    dC_LabProviderList?: Array<CoreModelsDTOsMasterDataDCTablesDCLabProviderDTO>;
    dC_ItemTypeList?: Array<CoreModelsDTOsMasterDataDCTablesDCItemTypeDTO>;
    dC_ServicePackageCategoryList?: Array<CoreModelsDTOsMasterDataDCTablesDCServicePackageCategoryDTO>;
    dC_ServicePackageTypeList?: Array<CoreModelsDTOsMasterDataDCTablesDCServicePackageTypeDTO>;
    nehI_AmbulantProvisionTypeList?: Array<CoreModelsDTOsMasterDataDCTablesNEHIAmbulantProvisionTypeDTO>;
}