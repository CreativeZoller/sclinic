import {
    CoreModelsDTOsAuthenticationDCTablesDCFunctionTypeDTO,
	CoreModelsDTOsAuthenticationMainTablesRoleDTO,
	CoreModelsDTOsMasterDataDCTablesDCContactTypeDTO,
	CoreModelsDTOsMasterDataDCTablesDCDocumentTemplateCategoryDTO,
	CoreModelsDTOsMasterDataDCTablesDCOccupationalHealthClassificationDTO,
	CoreModelsDTOsMasterDataDCTablesDCPatientIdTypeCategoryDTO,
	CoreModelsDTOsMasterDataDCTablesDCTitleTypeDTO,
	CoreModelsDTOsMasterDataDCTablesDCTwoFactorAuthenticationTypeDTO,
	CoreModelsDTOsMasterDataDCTablesDCUserStatusDTO,
	CoreModelsDTOsMasterDataDCTablesDCUserTypeDTO,
	CoreModelsDTOsMasterDataDCTablesDCCountryDTO,
	CoreModelsDTOsMasterDataDCTablesDCCountyDTO,
	CoreModelsDTOsMasterDataDCTablesDCEmailTemplateCategoryDTO,
	CoreModelsDTOsMasterDataDCTablesDCGenderDTO,
	CoreModelsDTOsMasterDataDCTablesDCLanguageDTO,
	CoreModelsDTOsMasterDataDCTablesDCMarkerDTO,
	CoreModelsDTOsMasterDataDCTablesDCNationalityDTO,
	CoreModelsDTOsMasterDataDCTablesDCPatientAddressTypeDTO,
	CoreModelsDTOsMasterDataDCTablesDCPatientIdTypeDTO,
	CoreModelsDTOsMasterDataDCTablesDCPublicPlaceCategoryDTO,
	CoreModelsDTOsMasterDataDCTablesDCStatusDTO,
	CoreModelsDTOsMasterDataDCTablesDCSamplingItemDTO,
	CoreModelsDTOsMasterDataDCTablesDCVIPDTO,
	CoreModelsDTOsMasterDataDCTablesDCClinicRoomStateDTO,
    CoreModelsDTOsMasterDataDCTablesDCFloorDTO,
    CoreModelsDTOsMasterDataDCTablesDCClinicTypeDTO,
    CoreModelsDTOsMasterDataDCTablesDCDayDTO,
    CoreModelsDTOsMasterDataDCTablesDCItemStatusDTO,
    CoreModelsDTOsMasterDataDCTablesDCLabRepeatPeriodDTO,
    CoreModelsDTOsMasterDataDCTablesDCLabSamplingTypeDTO,
    CoreModelsDTOsMasterDataDCTablesDCPartnerModeDTO,
    CoreModelsDTOsMasterDataDCTablesDCPartnerTypeDTO,
    CoreModelsDTOsMasterDataDCTablesDCScheduleSpecialTypeDTO,
    CoreModelsDTOsMasterDataDCTablesDCWeekTypeDTO,
    CoreModelsDTOsMasterDataMainTablesClinicRoomDTO,
	CoreModelsDTOsMasterDataDCTablesDCBookingAreaDTO,
    CoreModelsDTOsMasterDataDCTablesDCCompanyTypeDTO,
    CoreModelsDTOsMasterDataDCTablesDCInvoiceModeDTO,
    CoreModelsDTOsMasterDataDCTablesDCItemCategoryDTO,
    CoreModelsDTOsMasterDataDCTablesDCItemProcurationalCategoryDTO,
    CoreModelsDTOsMasterDataDCTablesDCItemTypeDTO,
    CoreModelsDTOsMasterDataDCTablesDCServiceCategoryDTO,
    CoreModelsDTOsMasterDataDCTablesDCServiceTypeDTO,
    CoreModelsDTOsMasterDataDCTablesDCItemConsumerTypeDTO,
    CoreModelsDTOsMasterDataDCTablesDCLabProviderDTO,
    CoreModelsDTOsMasterDataDCTablesDCServicePackageTypeDTO,
    CoreModelsDTOsMasterDataDCTablesDCServicePackageCategoryDTO,
    CoreModelsDTOsMasterDataDCTablesDCSubServicePackageCategoryDTO,
    CoreModelsDTOsMasterDataDCTablesDCSubServicePackageTypeDTO,
    CoreModelsDTOsMasterDataDCTablesDCPriceTableStatusDTO,
    CoreModelsDTOsMasterDataDCTablesDCExposureTypeDTO,
    CoreModelsDTOsMasterDataDCTablesDCExamTypeDTO,
    CoreModelsDTOsMasterDataDCTablesDCExposureFrequencyDTO,
    CoreModelsDTOsMasterDataDCTablesDCOccupationalHealthTypeDTO,
    CoreModelsDTOsMasterDataDCTablesDCOccupationalHealthPriceCategoryDTO,
    CoreModelsDTOsMasterDataDCTablesDCAppointmentStatusDTO,
    CoreModelsDTOsMasterDataDCTablesDCAppointmentCancellationDTO,
    CoreModelsDTOsMasterDataMainTablesPatientDTO,
    CoreModelsDTOsAuthenticationMainTablesRightDTO,
    CoreModelsDTOsMasterDataDCTablesDCMedicalEmployeeScheduleTypeDTO,
} from "../../../../../api/models";
import { SelectOptionWithDto } from "../../utility/models/select-option-with-dto.model";


export interface InitPageData {

    overuser: SelectOptionWithDto<
        CoreModelsDTOsMasterDataMainTablesPatientDTO,
        NonNullable<CoreModelsDTOsMasterDataMainTablesPatientDTO["overuser"]>
    >[];

    isInDebt: SelectOptionWithDto<
        CoreModelsDTOsMasterDataMainTablesPatientDTO,
        NonNullable<CoreModelsDTOsMasterDataMainTablesPatientDTO["isInDebt"]>
    >[];

    isBanned: SelectOptionWithDto<
        CoreModelsDTOsMasterDataMainTablesPatientDTO,
        NonNullable<CoreModelsDTOsMasterDataMainTablesPatientDTO["isBanned"]>
    >[];

    rightList: SelectOptionWithDto<
        CoreModelsDTOsAuthenticationMainTablesRightDTO,
        NonNullable<CoreModelsDTOsAuthenticationMainTablesRightDTO["rightId"]>
    >[];

    dC_LanguageList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCLanguageDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCLanguageDTO["dC_LanguageId"]>
    >[];

    dC_FunctionTypeList: SelectOptionWithDto<
        CoreModelsDTOsAuthenticationDCTablesDCFunctionTypeDTO,
        NonNullable<CoreModelsDTOsAuthenticationDCTablesDCFunctionTypeDTO["dC_FunctionTypeId"]>
    >[];

    dC_TitleTypeList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCTitleTypeDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCTitleTypeDTO["dC_TitleTypeId"]>
    >[];

    dC_PatientIdTypeList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCPatientIdTypeDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCPatientIdTypeDTO["dC_PatientIdTypeId"]>
    >[];

    dC_PatientAddressTypeList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCPatientAddressTypeDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCPatientAddressTypeDTO["dC_PatientAddressTypeId"]>
    >[];

    dC_VIPList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCVIPDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCVIPDTO["dC_VIPId"]>
    >[];

    dC_NationalityList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCNationalityDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCNationalityDTO["dC_NationalityId"]>
    >[];

    dC_GenderList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCGenderDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCGenderDTO["dC_GenderId"]>
    >[];

    dC_PublicPlaceCategoryList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCPublicPlaceCategoryDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCPublicPlaceCategoryDTO["dC_PublicPlaceCategoryId"]>
    >[];

    dC_TwoFactorAuthenticationTypeList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCTwoFactorAuthenticationTypeDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCTwoFactorAuthenticationTypeDTO["dC_TwoFactorAuthenticationTypeId"]>
    >[];

    dC_UserStatusList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCUserStatusDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCUserStatusDTO["dC_UserStatusId"]>
    >[];

    dC_UserTypeList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCUserTypeDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCUserTypeDTO["dC_UserTypeId"]>
    >[];

    dC_CountyList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCCountyDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCCountyDTO["dC_CountyId"]>
    >[];

    dC_MarkerList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCMarkerDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCMarkerDTO["dC_MarkerId"]>
    >[];

    dC_SamplingItemList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCSamplingItemDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCSamplingItemDTO["dC_SamplingItemId"]>
    >[];

    dC_CountryList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCCountryDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCCountryDTO["dC_CountryId"]>
    >[];

    roles: SelectOptionWithDto<
        CoreModelsDTOsAuthenticationMainTablesRoleDTO,
        NonNullable<CoreModelsDTOsAuthenticationMainTablesRoleDTO["roleId"]>
    >[]

    divisionNumberXFieldOptions: SelectOptionWithDto<
        DivisionNumberXFieldOption,
        DivisionNumberXFieldOption
    >[];

    dC_DocumentTemplateCategoryList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCDocumentTemplateCategoryDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCDocumentTemplateCategoryDTO["dC_DocumentTemplateCategoryId"]>
    >[];

    dC_EmailTemplateCategoryList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCEmailTemplateCategoryDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCEmailTemplateCategoryDTO["dC_EmailTemplateCategoryId"]>
    >[];

    dC_ContactTypeList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCContactTypeDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCContactTypeDTO["dC_ContactTypeId"]>
    >[];

    dC_PatientIdTypeCategoryList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCPatientIdTypeCategoryDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCPatientIdTypeCategoryDTO["dC_PatientIdTypeCategoryId"]>
    >[];

    dC_StatusList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCStatusDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCStatusDTO["dC_StatusId"]>
    >[];

    dC_OccupationalHealthClassificationList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCOccupationalHealthClassificationDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCOccupationalHealthClassificationDTO["dC_OccupationalHealthClassificationId"]>
    >[];

    dC_CompanyTypeList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCCompanyTypeDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCCompanyTypeDTO["dC_CompanyTypeId"]>
    >[];

    dC_PartnerTypeList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCPartnerTypeDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCPartnerTypeDTO["dC_PartnerTypeId"]>
    >[];

    dC_PartnerModeList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCPartnerModeDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCPartnerModeDTO["dC_PartnerModeId"]>
    >[];

    dC_InvoiceModeList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCInvoiceModeDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCInvoiceModeDTO["dC_InvoiceModeId"]>
    >[];

    dC_LabRepeatPeriodList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCLabRepeatPeriodDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCLabRepeatPeriodDTO["dC_LabRepeatPeriodId"]>
    >[];

    dC_LabSamplingTypeList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCLabSamplingTypeDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCLabSamplingTypeDTO["dC_LabSamplingTypeId"]>
    >[];

    dC_ClinicRoomStateList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCClinicRoomStateDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCClinicRoomStateDTO["dC_ClinicRoomStateId"]>
    >[];

    dC_FloorList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCFloorDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCFloorDTO["dC_FloorId"]>
    >[];

    dC_ClinicTypeList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCClinicTypeDTO,
        NonNullable<CoreModelsDTOsMasterDataMainTablesClinicRoomDTO["clinicRoomId"]>
    >[];

    dC_DayList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCDayDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCDayDTO["dC_DayId"]>
    >[];

    dC_WeekTypeList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCWeekTypeDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCWeekTypeDTO["dC_WeekTypeId"]>
    >[];

    dC_BookingAreaList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCBookingAreaDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCBookingAreaDTO["dC_BookingAreaId"]>
    >[];

    dC_ScheduleSpecialTypeList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCScheduleSpecialTypeDTO,
        CoreModelsDTOsMasterDataDCTablesDCScheduleSpecialTypeDTO["dC_ScheduleSpecialTypeId"]
    >[],

    dC_ItemStatusList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCItemStatusDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCItemStatusDTO["dC_ItemStatusId"]>
    >[];

    dC_ItemCategoryList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCItemCategoryDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCItemCategoryDTO["dC_ItemCategoryId"]>
    >[];

    dC_ItemTypeList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCItemTypeDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCItemTypeDTO["dC_ItemTypeId"]>
    >[];

    dC_ItemProcurationalCategoryList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCItemProcurationalCategoryDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCItemProcurationalCategoryDTO["dC_ItemProcurationalCategoryId"]>
    >[];

    dC_ServiceCategoryList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCServiceCategoryDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCServiceCategoryDTO["dC_ServiceCategoryId"]>
    >[];

    dC_ServiceTypeList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCServiceTypeDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCServiceTypeDTO["dC_ServiceTypeId"]>
    >[];

    dC_ItemConsumerTypeList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCItemConsumerTypeDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCItemConsumerTypeDTO["dC_ItemConsumerTypeId"]>
    >[];

    dC_LabProviderList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCLabProviderDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCLabProviderDTO["dC_LabProviderId"]>
    >[];

    dC_ServicePackageCategoryList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCServicePackageCategoryDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCServicePackageCategoryDTO["dC_ServicePackageCategoryId"]>
    >[];

    dC_ServicePackageTypeList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCServicePackageTypeDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCServicePackageTypeDTO["dC_ServicePackageTypeId"]>
    >[];

    dC_SubServicePackageCategoryList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCSubServicePackageCategoryDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCSubServicePackageCategoryDTO["dC_SubServicePackageCategoryId"]>
    >[];

    dC_SubServicePackageTypeList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCSubServicePackageTypeDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCSubServicePackageTypeDTO["dC_SubServicePackageTypeId"]>
    >[];

    dC_PriceTableStatusList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCPriceTableStatusDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCPriceTableStatusDTO["dC_PriceTableStatusId"]>
    >[];

    dC_ExposureTypeList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCExposureTypeDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCExposureTypeDTO["dC_ExposureTypeId"]>
    >[];

    dC_ExposureFrequencyList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCExposureFrequencyDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCExposureFrequencyDTO["dC_ExposureFrequencyId"]>
    >[];

    dC_ExamTypeList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCExamTypeDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCExamTypeDTO["dC_ExamTypeId"]>
    >[];

    dC_OccupationalHealthTypeList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCOccupationalHealthTypeDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCOccupationalHealthTypeDTO["dC_OccupationalHealthTypeId"]>
    >[];

    dC_OccupationalHealthPriceCategoryList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCOccupationalHealthPriceCategoryDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCOccupationalHealthPriceCategoryDTO["dC_OccupationalHealthPriceCategoryId"]>
    >[];

    dC_AppointmentStatusList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCAppointmentStatusDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCAppointmentStatusDTO["dC_AppointmentStatusId"]>
    >[];

    dC_AppointmentCancellationList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCAppointmentCancellationDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCAppointmentCancellationDTO["dC_AppointmentCancellationId"]>
    >[];

    dC_MedicalEmployeeScheduleTypeList: SelectOptionWithDto<
        CoreModelsDTOsMasterDataDCTablesDCMedicalEmployeeScheduleTypeDTO,
        NonNullable<CoreModelsDTOsMasterDataDCTablesDCMedicalEmployeeScheduleTypeDTO["dC_MedicalEmployeeScheduleTypeId"]>
    >[];
}

export type DivisionNumberXFieldOption = {
    path: string,
    type: string,
    nullable: boolean,
}
