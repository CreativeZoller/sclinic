import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Partner } from "../../models/partner.model";
import { InvoiceTypeEnum, PartnerTypeEnum } from "../../../../../../../api/enums";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { map, pairwise, shareReplay } from "rxjs";
import { fullEmailValidator } from "../../../../../core/utility/validators/full-email.validator";
import { DictionaryProviderWebServiceService, MasterDataManagementService } from "../../../../../../../api/services";
import { CoreModelsDTOsMasterDataDCTablesDCCityDTO, CoreModelsDTOsMasterDataMainTablesCompanyDTO } from "../../../../../../../api/models";
import { cannotContainNumbers } from "../../../../../core/utility/validators/notAllowNumbers.validator";


type Full_Model = Partner;
type Patient_Full_Model = NonNullable<Partner["patient"]>;
type Company_Full_Model = NonNullable<Partner["company"]>;
type Company_Address_Full_Model = NonNullable<Company_Full_Model["headquartersAddress"]>;

@UntilDestroy()
@Component({
    selector: "app-partner-form",
    templateUrl: "./partner-form.component.html",
    styleUrls: ["./partner-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnerFormComponent extends BaseFormComponent<Full_Model> {

    private dictionaryProviderWebServiceService = inject(DictionaryProviderWebServiceService);
    private masterDataManagementService = inject(MasterDataManagementService);

    public errorResourceKeyPrefix = "partner.form.errors";

    PartnerTypeEnum = PartnerTypeEnum;

    public taxNumberPattern = "^[0-9]{8}-[1-5]{1}-[0-9]{2}|[0-9]{8}$";
    public form = new FormGroup({
        // Azonosító
        partnerId: new FormControl<Full_Model["partnerId"]>(undefined, { nonNullable: true, validators: [] }),
        // Partner típusa (magánszemély vagy cég)
        dC_PartnerTypeId: new FormControl<Full_Model["dC_PartnerTypeId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Partner mód (vevő vagy szállító vagy mindkettő)
        dC_PartnerModeId: new FormControl<Full_Model["dC_PartnerModeId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Deep.ERP azonosító
        deepERPIdentifier: new FormControl<Full_Model["deepERPIdentifier"]>(undefined, { nonNullable: true, validators: [Validators.required] }),

        patientId: new FormControl<Full_Model["patientId"]>(undefined, { nonNullable: true, validators: [] }),
        patient: new FormGroup({
            // Titulus
            dC_TitleTypeId: new FormControl<Patient_Full_Model["dC_TitleTypeId"]>(undefined, { nonNullable: true, validators: [] }),
            // Vezetéknév
            surname: new FormControl<Patient_Full_Model["surname"]>(undefined, { nonNullable: true, validators: [Validators.required, cannotContainNumbers] }),
            // Keresztnév
            firstname: new FormControl<Patient_Full_Model["firstname"]>(undefined, { nonNullable: true, validators: [Validators.required, cannotContainNumbers] }),
            // Címek
            patientXAddress: new FormControl<Patient_Full_Model["patientXAddress"]>([], { nonNullable: true, validators: [] }),
            // Számla típusa
            dC_InvoiceModeId: new FormControl<Patient_Full_Model["dC_InvoiceModeId"]>(undefined, { nonNullable: true, validators: [] }),
            // Számla e-mail cím
            invoiceEmail: new FormControl<Patient_Full_Model["invoiceEmail"]>(undefined, { nonNullable: true, validators: [fullEmailValidator] }),
        }),

        companyId: new FormControl<Full_Model["companyId"]>(undefined, { nonNullable: true, validators: [] }),
        company: new FormGroup({
            // Azonosító
            companyId: new FormControl<Company_Full_Model["companyId"]>(undefined, { nonNullable: true, validators: [] }),
            // Teljes cégnév
            fullName: new FormControl<Company_Full_Model["fullName"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
            // Rövid cégnév
            shortName: new FormControl<Company_Full_Model["shortName"]>(undefined, { nonNullable: true, validators: [] }),
            // Cégforma típus
            dC_CompanyTypeId: new FormControl<Company_Full_Model["dC_CompanyTypeId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
            // Kapcsolattartó neve
            contactPersonName: new FormControl<Company_Full_Model["contactPersonName"]>(undefined, { nonNullable: true, validators: [Validators.required, cannotContainNumbers] }),
            // Kapcsolattartó telefonszáma
            contactPhoneNumber: new FormControl<Company_Full_Model["contactPhoneNumber"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
            // Kapcsolattartó e-mail címe
            contactEmailAddress: new FormControl<Company_Full_Model["contactEmailAddress"]>(undefined, { nonNullable: true, validators: [Validators.required, fullEmailValidator] }),

            // Adószám
            taxNumber: new FormControl<Company_Full_Model["taxNumber"]>(undefined, { nonNullable: true, validators: [Validators.required, Validators.pattern(this.taxNumberPattern)] }),
            // Cégjegyzékszám
            companyRegistrationNumber: new FormControl<Company_Full_Model["companyRegistrationNumber"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
            // Számla típusa
            dC_InvoiceModeId: new FormControl<Company_Full_Model["dC_InvoiceModeId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
            // Számla e-mail cím
            invoiceEmail: new FormControl<Company_Full_Model["invoiceEmail"]>(undefined, { nonNullable: true, validators: [Validators.required, fullEmailValidator] }),
            // EU adószám
            euTaxNumber: new FormControl<Company_Full_Model["euTaxNumber"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
            // Bankszámlaszám
            bankAccountNumber: new FormControl<Company_Full_Model["bankAccountNumber"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
            // Cégcsoport
            parentCompany: new FormControl<Company_Full_Model["parentCompany"]>(undefined, { nonNullable: true, validators: [] }),
            // Csoportos adóalanyiság tag
            groupTaxation: new FormControl<Company_Full_Model["groupTaxation"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
            // Csoportos adószám
            groupTaxNumber: new FormControl<Company_Full_Model["groupTaxNumber"]>(undefined, { nonNullable: true, validators: [Validators.required, Validators.pattern(this.taxNumberPattern)] }),
            // Közösségi tagállamkód
            communityMemberStateCode: new FormControl<Company_Full_Model["communityMemberStateCode"]>(undefined, { nonNullable: true, validators: [Validators.required] }),

            // Székhely adatok
            headquartersAddress: new FormGroup({
                // Irányítószám / Település
                dC_City: new FormControl<Company_Address_Full_Model["dC_City"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
                // Közterület neve
                streetName: new FormControl<Company_Address_Full_Model["streetName"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
                // Közterület jellege
                dC_PublicPlaceCategoryId: new FormControl<Company_Address_Full_Model["dC_PublicPlaceCategoryId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
                // Házszám
                buildingNumber: new FormControl<Company_Address_Full_Model["buildingNumber"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
                // Épület
                building: new FormControl<Company_Address_Full_Model["building"]>(undefined, { nonNullable: true, validators: [] }),
                // Lépcsőház
                staircase: new FormControl<Company_Address_Full_Model["staircase"]>(undefined, { nonNullable: true, validators: [] }),
                // Emelet
                floor: new FormControl<Company_Address_Full_Model["floor"]>(undefined, { nonNullable: true, validators: [] }),
                // Ajtó
                door: new FormControl<Company_Address_Full_Model["door"]>(undefined, { nonNullable: true, validators: [] }),
            }),
            // Telefonszám
            headquartersPhoneNumber: new FormControl<Company_Full_Model["headquartersPhoneNumber"]>(undefined, { nonNullable: true, validators: [Validators.required] }),

            // Számlázási cím adatok
            invoiceAddress: new FormGroup({
                // Irányítószám és Település
                dC_City: new FormControl<Company_Address_Full_Model["dC_City"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
                // Közterület neve
                streetName: new FormControl<Company_Address_Full_Model ["streetName"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
                // Közterület jellege
                dC_PublicPlaceCategoryId: new FormControl<Company_Address_Full_Model ["dC_PublicPlaceCategoryId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
                // Házszám
                buildingNumber: new FormControl<Company_Address_Full_Model ["buildingNumber"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
                // Épület
                building: new FormControl<Company_Address_Full_Model ["building"]>(undefined, { nonNullable: true, validators: [] }),
                // Lépcsőház
                staircase: new FormControl<Company_Address_Full_Model ["staircase"]>(undefined, { nonNullable: true, validators: [] }),
                // Emelet
                floor: new FormControl<Company_Address_Full_Model ["floor"]>(undefined, { nonNullable: true, validators: [] }),
                // Ajtó
                door: new FormControl<Company_Address_Full_Model ["door"]>(undefined, { nonNullable: true, validators: [] }),
                // Helyrajziszám
                lotNumber: new FormControl<Company_Address_Full_Model ["lotNumber"]>(undefined, { nonNullable: true, validators: [] }),
            }),

            // Telephelyek (címek)
            companySite: new FormControl<Company_Full_Model["companySite"]>([], { nonNullable: true, validators: [] }),
        }),
    });

    constructor() {
        super();

        this.form.valueChanges.pipe(
            untilDestroyed(this),
            pairwise()
        ).subscribe(([prev, curr]) => {
            if(curr.dC_PartnerTypeId === PartnerTypeEnum.PATIENT) {
                if(!this.form.controls.patient.enabled) {
                    if (!this.skipResetingFields) this.form.controls.patient.reset(undefined, { emitEvent: false });
                    this.form.controls.patient.enable();
                } else {
                    if(this.form.controls.patient.controls.dC_InvoiceModeId.value === InvoiceTypeEnum.ELECTRONIC) {
                        if(!this.form.controls.patient.controls.invoiceEmail.hasValidator(Validators.required)) {
                            this.form.controls.patient.controls.invoiceEmail.addValidators(Validators.required);
                            this.form.controls.patient.controls.invoiceEmail.updateValueAndValidity()
                        }
                    } else {
                        if(this.form.controls.patient.controls.invoiceEmail.hasValidator(Validators.required)) {
                            this.form.controls.patient.controls.invoiceEmail.removeValidators(Validators.required);
                            this.form.controls.patient.controls.invoiceEmail.updateValueAndValidity()
                        }
                    }
                }
            } else {
                if(!this.form.controls.patient.disabled) {
                    if (!this.skipResetingFields) this.form.controls.patient.reset(undefined, { emitEvent: false });
                    this.form.controls.patient.disable();
                }
            }

            if(curr.dC_PartnerTypeId === PartnerTypeEnum.COMPANY) {
                if(!this.form.controls.company.enabled) {
                    if (!this.skipResetingFields) this.form.controls.company.reset(undefined, { emitEvent: false });
                    this.form.controls.company.enable();
                } else {
                    if(this.form.controls.company.controls.dC_InvoiceModeId.value === InvoiceTypeEnum.ELECTRONIC) {
                        if(!this.form.controls.company.controls.invoiceEmail.hasValidator(Validators.required)) {
                            this.form.controls.company.controls.invoiceEmail.addValidators(Validators.required);
                            this.form.controls.company.controls.invoiceEmail.updateValueAndValidity()
                        }
                    } else {
                        if(this.form.controls.company.controls.invoiceEmail.hasValidator(Validators.required)) {
                            this.form.controls.company.controls.invoiceEmail.removeValidators(Validators.required);
                            this.form.controls.company.controls.invoiceEmail.updateValueAndValidity()
                        }
                    }
                }
            } else {
                if(!this.form.controls.company.disabled) {
                    if (!this.skipResetingFields) this.form.controls.company.reset(undefined, { emitEvent: false });
                    this.form.controls.company.disable();
                }
            }
        });
    }

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

    parentCompanyAutocomplete = {
        searhcFn$: (value: string) => {
            return this.masterDataManagementService.partnerGetPartnerByConditionPost({
                needPartnerData: true,// TODO review
                needPartnerXAddressDTO: true,// TODO review
                needPartnerXContact: true,// TODO review
                needPatientXPatientIdType: true,// TODO review
                companyName: value || "",
                needBisnode: true,
            }).pipe(
                map((res) => res?.businessObjectList ?? []),
                map((partnerList) => partnerList.map((partner) => partner.company!).filter(c => c != null)),
                shareReplay(1),
            )
        },

        getFormattedSelectText: (v: CoreModelsDTOsMasterDataMainTablesCompanyDTO) => v?.fullName ?? "",

        getFormattedInputText: (v: CoreModelsDTOsMasterDataMainTablesCompanyDTO) => v?.fullName ?? "",
    };

    public setFormValue(data: Full_Model | undefined | null) {
        super.setFormValue({ ...data });
    };

    public formValueToRequestValue(value: Full_Model): Full_Model {
        return {
            ...value,
            partnerId: value.partnerId ?? undefined,
            patientId: value.patientId ?? value.patient?.patientId ?? undefined,
            patient: (value.dC_PartnerTypeId === PartnerTypeEnum.PATIENT)
                ? {
                    ...value.patient,
                }
                : undefined,
            companyId: value.companyId ?? value.company?.companyId ?? undefined,
            company: (value.dC_PartnerTypeId === PartnerTypeEnum.COMPANY)
                ? {
                    ...value.company,
                    companyId: value?.company?.companyId ?? undefined,
                    parentCompanyId: value.company?.parentCompany?.companyId,
                    parentCompany: undefined,
                    headquartersAddress: {
                        ...value.company?.headquartersAddress,
                        dC_CityId: value.company?.headquartersAddress?.dC_City?.dC_CityId,
                        dC_City: undefined,
                    },
                    invoiceAddress: {
                        ...value.company?.invoiceAddress,
                        dC_CityId: value.company?.invoiceAddress?.dC_City?.dC_CityId,
                        dC_City: undefined,
                    },
                }
                : undefined,
        };
    }
}

