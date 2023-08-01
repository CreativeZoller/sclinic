import { Injectable, inject } from "@angular/core";
import { combineLatest, map, shareReplay } from "rxjs";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { MasterDataManagementService, MedicalManagementService } from "src/api/services";

@Injectable({providedIn: "root"})
export class PatientsInitPageResolver {
    private masterDataManagementService = inject(MasterDataManagementService);
    private medicalManagementService = inject(MedicalManagementService);
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return combineLatest([
            this.masterDataManagementService.initPageGetPatientInitPagePost({}),
            this.medicalManagementService.appointmentGetAppointmentCCInitPagePost({})
        ]).pipe(
            map(([InitPageData, initPageServices]) => {
                return {
                    dC_LanguageList: (InitPageData?.dC_LanguageList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_LanguageId!, name: dto.name! })),

                    dC_TitleTypeList: (InitPageData?.dC_TitleTypeList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_TitleTypeId!, name: dto.name! })),

                    dC_PatientIdTypeList: (InitPageData?.dC_PatientIdTypeList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_PatientIdTypeId!, name: dto.name! })),

                    dC_PatientAddressTypeList: (InitPageData?.dC_PatientAddressTypeList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_PatientAddressTypeId!, name: dto.name! })),

                    dC_VIPList: (InitPageData?.dC_VIPList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_VIPId!, name: dto.name! })),

                    dC_NationalityList: (InitPageData?.dC_NationalityList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_NationalityId!, name: dto.name! })),

                    dC_GenderList: (InitPageData?.dC_GenderList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_GenderId!, name: dto.name! })),

                    dC_PublicPlaceCategoryList: (InitPageData?.dC_PublicPlaceCategoryList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_PublicPlaceCategoryId!, name: dto.name! })),

                    dC_ContactTypeList: (InitPageData?.dC_ContactTypeList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_ContactTypeId!, name: dto.name! })),

                    dC_PatientIdTypeCategoryList: (InitPageData?.dC_PatientIdTypeCategoryList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_PatientIdTypeCategoryId!, name: dto.name! })),

                    dC_StatusList: (InitPageData?.dC_StatusList || [])
                        .map((dto) => ({ dto: dto, value: dto.dC_StatusId!, name: dto.name! })),

                    clinicList: (initPageServices?.clinicList || [])
                        .map((dto) => ({ dto: dto, value: dto.clinicId!, name: dto.clinicName! })),
                    
                    specialtyList: (initPageServices?.specialtyList || [])
                        .map((dto) => ({ dto: dto, value: dto.specialtyId!, name: dto.specialtyName})),

                    serviceList: (initPageServices?.serviceList || [])
                        .map((dto) => ({ dto: dto, value: dto.serviceId!, name: dto.serviceName! })),
                        
                    medicalEmployeeList: (initPageServices?.medicalEmployeeList || [])
                        .map((dto) => ({ dto: dto, value: dto.medicalEmployeeId!, name: dto.fullName! })),

                    rightList: (initPageServices?.rights || [])
                        .map((dto) => ({ dto: dto, value: dto.rightId!, name: dto.name! })),

                    patientAge: (initPageServices?.patientAge || ''),
                }
            }),
            shareReplay(1)
        );
    }
}
