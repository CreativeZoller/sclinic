import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { MedicalEmployee } from "../../models/medical-employee.model";
import { MedicalEmployeeTypeEnum } from "../../../../../../../api/enums";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { map, shareReplay } from "rxjs";
import { MasterDataManagementService, DictionaryProviderWebServiceService } from "../../../../../../../api/services";
import { CoreModelsDTOsMasterDataMainTablesMedicalEmployeeDTO, CoreModelsDTOsMasterDataDCTablesDCCityDTO } from "../../../../../../../api/models";
import { notNullish } from "../../../../../core/utility/validators/not-nullish.validator";


type Full_Model = MedicalEmployee;

@UntilDestroy()
@Component({
    selector: "app-medical-employee-form",
    templateUrl: "./medical-employee-form.component.html",
    styleUrls: ["./medical-employee-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalEmployeeFormComponent extends BaseFormComponent<Full_Model> implements OnInit {

    private masterDataManagementService = inject(MasterDataManagementService);
    private dictionaryProviderWebServiceService = inject(DictionaryProviderWebServiceService);

    public errorResourceKeyPrefix = "medical.employee.form.errors";

    defaultMedicalEmployeeXDC_Language: Full_Model["medicalEmployeeXDC_Language"] = [{ dC_LanguageId: this.initData.dC_LanguageList.find(x => x.dto.isDefault)?.value ?? undefined,}];

    public form = new FormGroup({
        // Azonosító
        medicalEmployeeId: new FormControl<Full_Model["medicalEmployeeId"]>(undefined, { nonNullable: true, validators: [] }),

        // Titulus
        dC_TitleTypeId: new FormControl<Full_Model["dC_TitleTypeId"]>(undefined, { nonNullable: true, validators: [] }),
        // Vezetéknév
        lastName: new FormControl<Full_Model["lastName"]>(undefined, { nonNullable: true, validators: [ Validators.required ] }),
        // Keresztnév
        firstName: new FormControl<Full_Model["firstName"]>(undefined, { nonNullable: true, validators: [ Validators.required ] }),

        // Pecsétszám
        stampNumber: new FormControl<Full_Model["stampNumber"]>(undefined, { nonNullable: true, validators: [ Validators.required, Validators.minLength(4), Validators.maxLength(6) ] }),
        // Működési engedély száma
        licenseNumber: new FormControl<Full_Model["licenseNumber"]>(undefined, { nonNullable: true, validators: [ Validators.required ] }),

        // EESZT azonosító
        nehiIdentifier: new FormControl<Full_Model["nehiIdentifier"]>({ value: undefined, disabled: true }, { nonNullable: true, validators: [] }),

        // Éves szabadság
        numberOfDaysOff: new FormControl<Full_Model["numberOfDaysOff"]>(undefined, { nonNullable: true, validators: [ Validators.required, Validators.min(0), Validators.max(30) ] }),
        // Kezelőorvos
        isAttendingPhysician: new FormControl<Full_Model["isAttendingPhysician"]>(false, { nonNullable: true, validators: [] }),

        // Foglalási felület
        medicalEmployeeXDC_BookingArea: new FormControl<Full_Model["medicalEmployeeXDC_BookingArea"]>([], { nonNullable: true, validators: [] }),

        // Helyettese
        substituteMedicalEmployee: new FormControl<Full_Model["substituteMedicalEmployee"]>(undefined, { nonNullable: true, validators: [] }),
        // Asszisztense
        assistant: new FormControl<Full_Model["assistant"]>(undefined, { nonNullable: true, validators: [] }),

        // Elérhetőségek
        medicalEmployeeXContact: new FormControl<Full_Model["medicalEmployeeXContact"]>([], { nonNullable: true, validators: [] }),

        // Cím
        address: new FormGroup({
            // Irányítószám / Település
            dC_City: new FormControl<NonNullable<Full_Model["address"]>["dC_City"]>(undefined, { nonNullable: true, validators: [Validators.required] }),

            // Közterület neve
            streetName: new FormControl<NonNullable<Full_Model["address"]>["streetName"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
            // Közterület jellege
            dC_PublicPlaceCategoryId: new FormControl<NonNullable<Full_Model["address"]>["dC_PublicPlaceCategoryId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
            // Házszám
            buildingNumber: new FormControl<NonNullable<Full_Model["address"]>["buildingNumber"]>(undefined, { nonNullable: true, validators: [Validators.required] }),

            // Épület
            building: new FormControl<NonNullable<Full_Model["address"]>["building"]>(undefined, { nonNullable: true, validators: [] }),
            // Lépcsőház
            staircase: new FormControl<NonNullable<Full_Model["address"]>["staircase"]>(undefined, { nonNullable: true, validators: [] }),
            // Emelet
            floor: new FormControl<NonNullable<Full_Model["address"]>["floor"]>(undefined, { nonNullable: true, validators: [] }),
            // Ajtó
            door: new FormControl<NonNullable<Full_Model["address"]>["door"]>(undefined, { nonNullable: true, validators: [] }),
        }),

        // Szakvizsgák
        medicalEmployeeXPUPHAX_ProfessionalExamCode: new FormControl<Full_Model["medicalEmployeeXPUPHAX_ProfessionalExamCode"]>([], { nonNullable: true, validators: [] }),

        // Szakma hozzárendelés
        medicalEmployeeXService: new FormControl<Full_Model["medicalEmployeeXService"]>([], { nonNullable: true, validators: [notNullish()] }),

        // Beszélt nyelvek
        medicalEmployeeXDC_Language: new FormControl<Full_Model["medicalEmployeeXDC_Language"]>(this.defaultMedicalEmployeeXDC_Language, { nonNullable: true, validators: [] }),

        // Orvos fotó
        profilePicture: new FormControl<Full_Model["profilePicture"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Pecsét fotó
        stampPicture: new FormControl<Full_Model["stampPicture"]>(undefined, { nonNullable: true, validators: [Validators.required] }),

        // Szerződések
        medicalContract: new FormControl<Full_Model["medicalContract"]>([], { nonNullable: true, validators: [] }),
    });

    public readonly constants = {
        MedicalEmployeeTypeEnum: MedicalEmployeeTypeEnum,
    }

    _medicalEmployeeType: MedicalEmployeeTypeEnum;
    @Input() set medicalEmployeeType(type: MedicalEmployeeTypeEnum) {
        this._medicalEmployeeType = type;

        if (type === MedicalEmployeeTypeEnum.DOCTOR) {
            if (!this.form.controls.profilePicture.enabled)
                this.form.controls.profilePicture.enable();

            if (!this.form.controls.stampPicture.enabled)
                this.form.controls.stampPicture.enable();

            if (!this.form.controls.medicalEmployeeXPUPHAX_ProfessionalExamCode.enabled)
                this.form.controls.medicalEmployeeXPUPHAX_ProfessionalExamCode.enable();

            if (!this.form.controls.isAttendingPhysician.enabled)
                this.form.controls.isAttendingPhysician.enable();

            if (!this.form.controls.stampNumber.enabled)
                this.form.controls.stampNumber.enable();

            if (!this.form.controls.licenseNumber.disabled)
                this.form.controls.licenseNumber.disable();
        } else {
            if (!this.form.controls.profilePicture.disabled)
                this.form.controls.profilePicture.disable();

            if (!this.form.controls.stampPicture.disabled)
                this.form.controls.stampPicture.disable();

            if (!this.form.controls.medicalEmployeeXPUPHAX_ProfessionalExamCode.disabled)
                this.form.controls.medicalEmployeeXPUPHAX_ProfessionalExamCode.disable();

            if (!this.form.controls.isAttendingPhysician.disabled)
                this.form.controls.isAttendingPhysician.disable();

            if (!this.form.controls.stampNumber.disabled)
                this.form.controls.stampNumber.disable();

            if (!this.form.controls.licenseNumber.enabled)
                this.form.controls.licenseNumber.enable();
        }
    }

    public ngOnInit() {
        if (this._medicalEmployeeType === null) throw new Error("Missing input parameter: medicalEmployeeType");
    }

    medicalEmployeeAutocomplete = {
        searhcFn$Factory: (employeeType: MedicalEmployeeTypeEnum) => {
            return (value: string) => this.masterDataManagementService.medicalEmployeeGetMedicalEmployeeByConditionPost({
                fullName: value,
                dC_MedicalEmployeeTypeId: employeeType,
            }).pipe(
                map(res => res?.businessObjectList ?? []),
                shareReplay(1),
            )
        },

        getFormattedSelectText: (v: CoreModelsDTOsMasterDataMainTablesMedicalEmployeeDTO) => [v?.lastName, v?.firstName].filter(v => v != null).join(" "),

        getFormattedInputText: (v: CoreModelsDTOsMasterDataMainTablesMedicalEmployeeDTO) => [v?.lastName, v?.firstName].filter(v => v != null).join(" "),
    };

    cityAutocomplete = {
        searhcFn$Factory: (propertyToFilter: keyof CoreModelsDTOsMasterDataDCTablesDCCityDTO) => {
            return (value: string) => this.dictionaryProviderWebServiceService.cityGetDCCitiesByConditionPost({
                [propertyToFilter]: value,
            }).pipe(
                map((res) => res?.businessObjectList ?? []),
                shareReplay(1),
            )
        },

        getFormattedSelectText: (v: CoreModelsDTOsMasterDataDCTablesDCCityDTO) => `${v?.postCode ?? ""} - ${v?.name ?? ""}`,

        getFormattedInputTextFactory: (property: keyof CoreModelsDTOsMasterDataDCTablesDCCityDTO) => {
            return (v: CoreModelsDTOsMasterDataDCTablesDCCityDTO) => v?.[property]?.toString?.() ?? "";
        },
    }

    public getFormValue(raw?: boolean): Full_Model {
        const { ...restValue} = raw ? this.form.getRawValue() : this.form.value;

        return {
            ...restValue,
            dC_MedicalEmployeeTypeId: this._medicalEmployeeType,
            medicalEmployeeId: restValue.medicalEmployeeId ?? undefined,
            substituteMedicalEmployeeId: restValue.substituteMedicalEmployee?.medicalEmployeeId ?? null as any,
            substituteMedicalEmployee: undefined,
            assistantId: restValue.assistant?.medicalEmployeeId ?? null as any,
            assistant: undefined,
            address: {
                ...restValue.address,
                dC_City: undefined,
                dC_CityId: restValue?.address?.dC_City?.dC_CityId,
            }
        }
    }
}
