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
import { CoreModelsDTOsMasterDataDCTablesDCBookingAreaDTO } from './coreModelsDTOsMasterDataDCTablesDCBookingAreaDTO';
import { CoreModelsDTOsMasterDataDCTablesDCCityDTO } from './coreModelsDTOsMasterDataDCTablesDCCityDTO';
import { CoreModelsDTOsMasterDataDCTablesDCContactTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCContactTypeDTO';
import { CoreModelsDTOsMasterDataDCTablesDCCountryDTO } from './coreModelsDTOsMasterDataDCTablesDCCountryDTO';
import { CoreModelsDTOsMasterDataDCTablesDCCountyDTO } from './coreModelsDTOsMasterDataDCTablesDCCountyDTO';
import { CoreModelsDTOsMasterDataDCTablesDCDayDTO } from './coreModelsDTOsMasterDataDCTablesDCDayDTO';
import { CoreModelsDTOsMasterDataDCTablesDCLanguageDTO } from './coreModelsDTOsMasterDataDCTablesDCLanguageDTO';
import { CoreModelsDTOsMasterDataDCTablesDCMedicalEmployeeTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCMedicalEmployeeTypeDTO';
import { CoreModelsDTOsMasterDataDCTablesDCPublicPlaceCategoryDTO } from './coreModelsDTOsMasterDataDCTablesDCPublicPlaceCategoryDTO';
import { CoreModelsDTOsMasterDataDCTablesDCScheduleSpecialTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCScheduleSpecialTypeDTO';
import { CoreModelsDTOsMasterDataDCTablesDCTitleTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCTitleTypeDTO';
import { CoreModelsDTOsMasterDataDCTablesDCWeekTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCWeekTypeDTO';

export interface CoreModelsMasterDataMedicalEmployeeInitPageMedicalEmployeeInitPageResponse { 
    errorMessage?: string;
    rights?: Array<CoreModelsDTOsAuthenticationMainTablesRightDTO>;
    dC_TitleTypeDTOList?: Array<CoreModelsDTOsMasterDataDCTablesDCTitleTypeDTO>;
    dC_LanguageDTOList?: Array<CoreModelsDTOsMasterDataDCTablesDCLanguageDTO>;
    dC_CountryDTOList?: Array<CoreModelsDTOsMasterDataDCTablesDCCountryDTO>;
    dC_CountyDTOList?: Array<CoreModelsDTOsMasterDataDCTablesDCCountyDTO>;
    dC_CityDTOList?: Array<CoreModelsDTOsMasterDataDCTablesDCCityDTO>;
    dC_PublicPlaceCategoryList?: Array<CoreModelsDTOsMasterDataDCTablesDCPublicPlaceCategoryDTO>;
    dC_MedicalEmployeeTypeList?: Array<CoreModelsDTOsMasterDataDCTablesDCMedicalEmployeeTypeDTO>;
    dC_ContactTypeList?: Array<CoreModelsDTOsMasterDataDCTablesDCContactTypeDTO>;
    dC_BookingAreaList?: Array<CoreModelsDTOsMasterDataDCTablesDCBookingAreaDTO>;
    dC_WeekTypeList?: Array<CoreModelsDTOsMasterDataDCTablesDCWeekTypeDTO>;
    dC_DayList?: Array<CoreModelsDTOsMasterDataDCTablesDCDayDTO>;
    dC_ScheduleSpecialTypeList?: Array<CoreModelsDTOsMasterDataDCTablesDCScheduleSpecialTypeDTO>;
}