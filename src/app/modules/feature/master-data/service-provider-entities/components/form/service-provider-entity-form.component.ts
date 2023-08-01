import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { distinctUntilChanged, map, shareReplay } from "rxjs";
import { InvoiceTypeEnum, PartnerModeEnum, PartnerTypeEnum } from "../../../../../../../api/enums";
import { CoreModelsDTOsMasterDataMainTablesCompanyDTO, CoreModelsDTOsMasterDataDCTablesDCCityDTO } from "../../../../../../../api/models";
import { MasterDataManagementService, DictionaryProviderWebServiceService } from "../../../../../../../api/services";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { fullEmailValidator } from "../../../../../core/utility/validators/full-email.validator";
import { Service_Provider_Entity, Service_Provider_Entity_Partner, Service_Provider_Entity_Partner_Company, Service_Provider_Entity_Partner_Company_Address,  } from "../../models/service-provider-entity.model";
import { cannotContainNumbers } from "../../../../../core/utility/validators/notAllowNumbers.validator";


type Full_Model = Service_Provider_Entity;
type Full_Model_Partner = Service_Provider_Entity_Partner;
type Full_Model_Partner_Company = Service_Provider_Entity_Partner_Company;

@UntilDestroy()
@Component({
    selector: "app-service-provider-entity-form",
    templateUrl: "./service-provider-entity-form.component.html",
    styleUrls: ["./service-provider-entity-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceProviderEntityFormComponent extends BaseFormComponent<Full_Model> {

    private dictionaryProviderWebServiceService = inject(DictionaryProviderWebServiceService);
    private masterDataManagementService = inject(MasterDataManagementService);

    public taxNumberPattern = "^[0-9]{8}-[1-5]{1}-[0-9]{2}|[0-9]{8}$";
    public errorResourceKeyPrefix = "service.provider.entity.form.errors";

    public form = new FormGroup({
        // Azonosító
        selfId: new FormControl<Full_Model["selfId"]>(undefined, { nonNullable: true, validators: [] }),
        selfName: new FormControl<Full_Model["selfName"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        partnerId: new FormControl<Full_Model["partnerId"]>(undefined, { nonNullable: true, validators: [] }),
        partner: new FormGroup({
            // Azonosító
            partnerId: new FormControl<Full_Model_Partner["partnerId"]>(undefined, { nonNullable: true, validators: [] }),
            deepERPIdentifier: new FormControl<Full_Model_Partner["deepERPIdentifier"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
            dC_PartnerModeId: new FormControl<Full_Model_Partner["dC_PartnerModeId"]>(PartnerModeEnum.SUPPLIER,  { nonNullable: true, validators: [Validators.required] }),
            dC_PartnerTypeId: new FormControl<Full_Model_Partner["dC_PartnerTypeId"]>(PartnerTypeEnum.COMPANY,  { nonNullable: true, validators: [Validators.required] }),
            // Azonosító
            companyId: new FormControl<Full_Model_Partner_Company["companyId"]>(undefined, { nonNullable: true, validators: [] }),
            company:  new FormGroup({
                // Azonosító
                companyId: new FormControl<Full_Model_Partner_Company["companyId"]>(undefined, { nonNullable: true, validators: [] }),
                taxNumber: new FormControl<Full_Model_Partner_Company["taxNumber"]>(undefined,  { nonNullable: true, validators: [Validators.pattern(this.taxNumberPattern)], }),
                parentCompany: new FormControl<Full_Model_Partner_Company["parentCompany"]>(undefined, { nonNullable: true, validators: [] }),
                companyRegistrationNumber: new FormControl<Full_Model_Partner_Company["companyRegistrationNumber"]>(undefined,  { nonNullable: true, validators: [] }),
                dC_InvoiceModeId: new FormControl<Full_Model_Partner_Company["dC_InvoiceModeId"]>(undefined,  { nonNullable: true, validators: [Validators.required] }),
                invoiceEmail: new FormControl<Full_Model_Partner_Company["invoiceEmail"]>(undefined,  { nonNullable: true, validators: [fullEmailValidator] }),
                euTaxNumber: new FormControl<Full_Model_Partner_Company["euTaxNumber"]>(undefined,  { nonNullable: true, validators: [] }),
                bankAccountNumber: new FormControl<Full_Model_Partner_Company["bankAccountNumber"]>(undefined,  { nonNullable: true, validators: [] }),
                // Group of companies (Parent)
                parentCompanyId: new FormControl<Full_Model_Partner_Company["parentCompanyId"]>(undefined,  { nonNullable: true, validators: [] }),
                // csoportos adóalanyiság tag
                groupTaxation: new FormControl<Full_Model_Partner_Company["groupTaxation"]>(undefined,  { nonNullable: true, validators: [] }),
                groupTaxNumber: new FormControl<Full_Model_Partner_Company["groupTaxNumber"]>(undefined,  { nonNullable: true, validators: [Validators.pattern(this.taxNumberPattern)] }),
                // közösségi tagállamkód
                communityMemberStateCode: new FormControl<Full_Model_Partner_Company["communityMemberStateCode"]>(undefined,  { nonNullable: true, validators: [] }),

                fullName: new FormControl<Full_Model_Partner_Company["fullName"]>(undefined,  { nonNullable: true, validators: [Validators.required] }),
                shortName: new FormControl<Full_Model_Partner_Company["shortName"]>(undefined,  { nonNullable: true, validators: [] }),
                dC_CompanyTypeId: new FormControl<Full_Model_Partner_Company["dC_CompanyTypeId"]>(undefined,  { nonNullable: true, validators: [Validators.required] }),
                contactPersonName: new FormControl<Full_Model_Partner_Company["contactPersonName"]>(undefined,  { nonNullable: true, validators: [cannotContainNumbers] }),
                contactPhoneNumber: new FormControl<Full_Model_Partner_Company["contactPhoneNumber"]>(undefined,  { nonNullable: true, validators: [] }),
                contactEmailAddress: new FormControl<Full_Model_Partner_Company["contactEmailAddress"]>(undefined,  { nonNullable: true, validators: [fullEmailValidator] }),
                headquartersPhoneNumber: new FormControl<Full_Model_Partner_Company["headquartersPhoneNumber"]>(undefined,  { nonNullable: true, validators: [] }),

                // Címek
                companySite: new FormControl<Full_Model_Partner_Company["companySite"]>(undefined,  { nonNullable: true, validators: [] }),

                headquartersAddress: new FormGroup({
                    addressId: new FormControl<Service_Provider_Entity_Partner_Company_Address["addressId"]>(undefined, { nonNullable: true, validators: [] }),
                    // Irányítószám és Település
                    dC_City: new FormControl<Service_Provider_Entity_Partner_Company_Address["dC_City"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
                    // Közterület neve
                    streetName: new FormControl<Service_Provider_Entity_Partner_Company_Address ["streetName"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
                    // Közterület jellege
                    dC_PublicPlaceCategoryId: new FormControl<Service_Provider_Entity_Partner_Company_Address ["dC_PublicPlaceCategoryId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
                    // Házszám
                    buildingNumber: new FormControl<Service_Provider_Entity_Partner_Company_Address ["buildingNumber"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
                    // Épület
                    building: new FormControl<Service_Provider_Entity_Partner_Company_Address ["building"]>(undefined, { nonNullable: true, validators: [] }),
                    // Lépcsőház
                    staircase: new FormControl<Service_Provider_Entity_Partner_Company_Address ["staircase"]>(undefined, { nonNullable: true, validators: [] }),
                    // Emelet
                    floor: new FormControl<Service_Provider_Entity_Partner_Company_Address ["floor"]>(undefined, { nonNullable: true, validators: [] }),
                    // Ajtó
                    door: new FormControl<Service_Provider_Entity_Partner_Company_Address ["door"]>(undefined, { nonNullable: true, validators: [] }),
                    // Helyrajziszám
                    lotNumber: new FormControl<Service_Provider_Entity_Partner_Company_Address ["lotNumber"]>(undefined, { nonNullable: true, validators: [] }),
                }),

                invoiceAddress: new FormGroup({
                    addressId: new FormControl<Service_Provider_Entity_Partner_Company_Address["addressId"]>(undefined, { nonNullable: true, validators: [] }),
                    // Irányítószám és Település
                    dC_City: new FormControl<Service_Provider_Entity_Partner_Company_Address["dC_City"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
                    // Közterület neve
                    streetName: new FormControl<Service_Provider_Entity_Partner_Company_Address ["streetName"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
                    // Közterület jellege
                    dC_PublicPlaceCategoryId: new FormControl<Service_Provider_Entity_Partner_Company_Address ["dC_PublicPlaceCategoryId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
                    // Házszám
                    buildingNumber: new FormControl<Service_Provider_Entity_Partner_Company_Address ["buildingNumber"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
                    // Épület
                    building: new FormControl<Service_Provider_Entity_Partner_Company_Address ["building"]>(undefined, { nonNullable: true, validators: [] }),
                    // Lépcsőház
                    staircase: new FormControl<Service_Provider_Entity_Partner_Company_Address ["staircase"]>(undefined, { nonNullable: true, validators: [] }),
                    // Emelet
                    floor: new FormControl<Service_Provider_Entity_Partner_Company_Address ["floor"]>(undefined, { nonNullable: true, validators: [] }),
                    // Ajtó
                    door: new FormControl<Service_Provider_Entity_Partner_Company_Address ["door"]>(undefined, { nonNullable: true, validators: [] }),
                    // Helyrajziszám
                    lotNumber: new FormControl<Service_Provider_Entity_Partner_Company_Address ["lotNumber"]>(undefined, { nonNullable: true, validators: [] }),
                }),
            }),
        }),
    });

    citiesAutocomplete = {
        searhcFn$: (propertyToFilter: keyof CoreModelsDTOsMasterDataDCTablesDCCityDTO) => {
            return (term: string) => this.dictionaryProviderWebServiceService.cityGetDCCitiesByConditionPost({
                needCountry: true,
                needCounty: true,
                [propertyToFilter]: term
            }).pipe(
                map((res) => res?.businessObjectList ?? []),
                shareReplay(1),
            )
        },

        getFormattedSelectText: (v: CoreModelsDTOsMasterDataDCTablesDCCityDTO) => `${v?.postCode ?? ""} - ${v?.name ?? ""}`,

        getFormattedPostCodeInputText: (v: CoreModelsDTOsMasterDataDCTablesDCCityDTO) => v?.postCode ?? "",

        getFormattedCityNameInputText: (v: CoreModelsDTOsMasterDataDCTablesDCCityDTO) => v?.name ?? "",
    };

    public getFormValue(raw?: boolean | undefined): Full_Model {
        const value = raw ? this.form.getRawValue() : this.form.value;

        return {
            ...value,
            partner: {
                ...value.partner,
                partnerId: value.partner?.partnerId ?? undefined,
                companyId: value.partner?.companyId ?? value.partner?.company?.companyId ?? undefined,
                company: {
                    ...value.partner?.company,
                    companyId: value.partner?.company?.companyId ?? 0,
                    headquartersAddress: {
                        ...value.partner?.company?.headquartersAddress,
                        addressId:  value.partner?.company?.headquartersAddress?.addressId ?? 0,
                        dC_City: value.partner?.company?.headquartersAddress?.dC_City,
                        dC_CityId: value.partner?.company?.headquartersAddress?.dC_City?.dC_CityId,
                    },
                    invoiceAddress: {
                        ...value.partner?.company?.invoiceAddress,
                        addressId:  value.partner?.company?.invoiceAddress?.addressId ?? 0,
                        dC_City: value.partner?.company?.invoiceAddress?.dC_City,
                        dC_CityId: value.partner?.company?.invoiceAddress?.dC_City?.dC_CityId,
                    }
                }
            }
        };
    }

    companyAutocomplete = {
        searhcFn$: (value: string) => {
            return this.masterDataManagementService.partnerGetPartnerByConditionPost({
                needPartnerData: true,
                needPartnerXAddressDTO: true,
                companyName: value || "",
            }).pipe(
                map((res) => res?.businessObjectList ?? []),
                map((resList) => resList.map((partner) => partner.company!).filter(c => c != null)),
                shareReplay(1),
            )
        },

        getFormattedSelectText: (v: CoreModelsDTOsMasterDataMainTablesCompanyDTO) => v?.fullName ?? "",

        getFormattedInputText: (v: CoreModelsDTOsMasterDataMainTablesCompanyDTO) => {
            this.form.patchValue({
                partner: {
                    company: {
                        groupTaxation: v?.groupTaxation || undefined ,
                        groupTaxNumber: v?.groupTaxNumber || undefined ,
                        parentCompanyId: v?.companyId || undefined ,
                        communityMemberStateCode: v?.communityMemberStateCode || undefined
                    },
                },
            });
            return v?.fullName ?? "";
        },
    };

    constructor() {
        super();
        this.form.controls.partner.controls.company.controls.dC_InvoiceModeId.valueChanges.pipe(
            distinctUntilChanged(), // Emit only when the current value is different from the last
            untilDestroyed(this),
        ).subscribe((dC_InvoiceModeId) => {
                if(dC_InvoiceModeId === InvoiceTypeEnum.ELECTRONIC) {
                    if(!this.form.controls.partner.controls.company.controls.invoiceEmail.hasValidator(Validators.required)) {
                        this.form.controls.partner.controls.company.controls.invoiceEmail.addValidators(Validators.required);
                        this.form.controls.partner.controls.company.controls.invoiceEmail.updateValueAndValidity()
                    }
                } else {
                    if(this.form.controls.partner.controls.company.controls.invoiceEmail.hasValidator(Validators.required)) {
                        this.form.controls.partner.controls.company.controls.invoiceEmail.removeValidators(Validators.required);
                        this.form.controls.partner.controls.company.controls.invoiceEmail.updateValueAndValidity()
                    }
                }
        });

        this.form.controls.partner.controls.dC_PartnerTypeId.valueChanges.pipe(
            distinctUntilChanged(), // Emit only when the current value is different from the last
            untilDestroyed(this),
        ).subscribe((dC_PartnerTypeId) => {
            if(dC_PartnerTypeId === PartnerTypeEnum.COMPANY) {
                this.form.enable();
            } else {
                this.form.disable();
            }
        });
    }
}
