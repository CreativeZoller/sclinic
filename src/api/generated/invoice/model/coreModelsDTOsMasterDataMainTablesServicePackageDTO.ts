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
import { CoreModelsDTOsMasterDataJunctionTablesExposureXExposureItemXServiceDTO } from './coreModelsDTOsMasterDataJunctionTablesExposureXExposureItemXServiceDTO';
import { CoreModelsDTOsMasterDataJunctionTablesJobTitleXServiceDTO } from './coreModelsDTOsMasterDataJunctionTablesJobTitleXServiceDTO';
import { CoreModelsDTOsMasterDataJunctionTablesOccupationalHealthXServiceDTO } from './coreModelsDTOsMasterDataJunctionTablesOccupationalHealthXServiceDTO';
import { CoreModelsDTOsMasterDataJunctionTablesServicePackageXDCBookingAreaDTO } from './coreModelsDTOsMasterDataJunctionTablesServicePackageXDCBookingAreaDTO';
import { CoreModelsDTOsMasterDataJunctionTablesServicePackageXDocumentTemplateDTO } from './coreModelsDTOsMasterDataJunctionTablesServicePackageXDocumentTemplateDTO';
import { CoreModelsDTOsMasterDataJunctionTablesServicePackageXLabServiceDTO } from './coreModelsDTOsMasterDataJunctionTablesServicePackageXLabServiceDTO';
import { CoreModelsDTOsMasterDataJunctionTablesServicePackageXRoleDTO } from './coreModelsDTOsMasterDataJunctionTablesServicePackageXRoleDTO';
import { CoreModelsDTOsMasterDataJunctionTablesServicePackageXServiceDTO } from './coreModelsDTOsMasterDataJunctionTablesServicePackageXServiceDTO';
import { CoreModelsDTOsMasterDataJunctionTablesServicePackageXSpecialtyDTO } from './coreModelsDTOsMasterDataJunctionTablesServicePackageXSpecialtyDTO';
import { CoreModelsDTOsMasterDataJunctionTablesServicePackageXSubServicePackageDTO } from './coreModelsDTOsMasterDataJunctionTablesServicePackageXSubServicePackageDTO';
import { CoreModelsDTOsMasterDataMainTablesDEEPERPItemIdentificationDTO } from './coreModelsDTOsMasterDataMainTablesDEEPERPItemIdentificationDTO';
import { CoreModelsDTOsMasterDataMainTablesPriceTemplateItemDTO } from './coreModelsDTOsMasterDataMainTablesPriceTemplateItemDTO';
import { CoreModelsDTOsMasterDataSmallDTOsSmallPriceDTO } from './coreModelsDTOsMasterDataSmallDTOsSmallPriceDTO';

export interface CoreModelsDTOsMasterDataMainTablesServicePackageDTO { 
    executingUserId?: number;
    servicePackageId?: number;
    servicePackageName?: string;
    servicePackageName_EN?: string;
    servicePackageName_CZ?: string;
    description?: string;
    dC_StatusId?: number;
    dC_ServicePackageTypeId?: number;
    dC_ServicePackageCategoryId?: number;
    minimumNumberOfDaysNextUse?: number;
    isDoctorRecommendationRequired?: boolean;
    maxServiceCount?: number;
    maxLabServiceCount?: number;
    dC_SubServicePackageTypeId?: number;
    dC_SubServicePackageCategoryId?: number;
    isRightTime?: boolean;
    isScreeningTest?: boolean;
    basePrice?: number;
    basePriceEUR?: number;
    deeperpItemIdentificationId?: number;
    deeperpItemIdentification?: CoreModelsDTOsMasterDataMainTablesDEEPERPItemIdentificationDTO;
    deeperpMergedItemNumber?: string;
    deeperpMergedItemName?: string;
    duration?: number;
    servicePackageXDC_BookingArea?: Array<CoreModelsDTOsMasterDataJunctionTablesServicePackageXDCBookingAreaDTO>;
    servicePackageXRole?: Array<CoreModelsDTOsMasterDataJunctionTablesServicePackageXRoleDTO>;
    servicePackageXDocumentTemplate?: Array<CoreModelsDTOsMasterDataJunctionTablesServicePackageXDocumentTemplateDTO>;
    servicePackageXLabService?: Array<CoreModelsDTOsMasterDataJunctionTablesServicePackageXLabServiceDTO>;
    servicePackageXService?: Array<CoreModelsDTOsMasterDataJunctionTablesServicePackageXServiceDTO>;
    servicePackageXSubServicePackage?: Array<CoreModelsDTOsMasterDataJunctionTablesServicePackageXSubServicePackageDTO>;
    priceTemplateItem?: Array<CoreModelsDTOsMasterDataMainTablesPriceTemplateItemDTO>;
    exposureXExposureItemXService?: Array<CoreModelsDTOsMasterDataJunctionTablesExposureXExposureItemXServiceDTO>;
    occupationalHealthXService?: Array<CoreModelsDTOsMasterDataJunctionTablesOccupationalHealthXServiceDTO>;
    jobTitleXService?: Array<CoreModelsDTOsMasterDataJunctionTablesJobTitleXServiceDTO>;
    servicePackageXSpecialty?: Array<CoreModelsDTOsMasterDataJunctionTablesServicePackageXSpecialtyDTO>;
    smallPriceList?: Array<CoreModelsDTOsMasterDataSmallDTOsSmallPriceDTO>;
    servicePackageList?: Array<CoreModelsDTOsMasterDataJunctionTablesServicePackageXSubServicePackageDTO>;
    canAddServicePackageToAllClinicAndClinicRoom?: boolean;
    canAddServicePackageToAllMedicalEmployee?: boolean;
    addServicePackageToSelectedMedicalEmployee?: Array<number>;
}