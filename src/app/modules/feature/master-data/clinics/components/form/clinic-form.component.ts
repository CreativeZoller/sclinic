import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { map, of, shareReplay, take } from "rxjs";
import { CoreModelsDTOsMasterDataDCTablesDCCityDTO } from "../../../../../../../api/models";
import { Clinic, Clinic_Address } from "../../models/clinic.model";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { DictionaryProviderWebServiceService } from "../../../../../../../api/services";
import { fullEmailValidator } from "../../../../../core/utility/validators/full-email.validator";


type Full_Model = Clinic;
type Full_Model_Address = Clinic_Address;

@UntilDestroy()
@Component({
    selector: "app-clinic-form",
    templateUrl: "./clinic-form.component.html",
    styleUrls: ["./clinic-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicFormComponent  extends BaseFormComponent<Full_Model> {

    public dictionaryProviderWebServiceService = inject(DictionaryProviderWebServiceService);

    public errorResourceKeyPrefix = "clinic.form.errors";

    public form = new FormGroup({
        // Titulus
        clinicId: new FormControl<Full_Model["clinicId"]>(undefined, { nonNullable: true, validators: [] }),
        clinicName: new FormControl<Full_Model["clinicName"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        phoneNumber: new FormControl<Full_Model["phoneNumber"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        email: new FormControl<Full_Model["email"]>(undefined, { nonNullable: true, validators: [Validators.required, fullEmailValidator,] }),
        dC_ClinicTypeId: new FormControl<Full_Model["dC_ClinicTypeId"]>(1, { nonNullable: true, validators: [Validators.required] }),

        ftKp: new FormControl<Full_Model["ftKp"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        ftOther: new FormControl<Full_Model["ftOther"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        eurKp: new FormControl<Full_Model["eurKp"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        eurOther: new FormControl<Full_Model["eurOther"]>(undefined, { nonNullable: true, validators: [Validators.required] }),

        address: new FormGroup({
            addressId: new FormControl<Full_Model_Address["addressId"]>(0, { nonNullable: true, validators: [] }),
            // Irányítószám / Település
            dC_City: new FormControl<Full_Model_Address["dC_City"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
            // Közterület neve
            streetName: new FormControl<Full_Model_Address["streetName"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
            // Közterület jellege
            dC_PublicPlaceCategoryId: new FormControl<Full_Model_Address["dC_PublicPlaceCategoryId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
            // Házszám
            buildingNumber: new FormControl<Full_Model_Address["buildingNumber"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
            // Épület
            building: new FormControl<Full_Model_Address["building"]>(undefined, { nonNullable: true, validators: [] }),
            // Lépcsőház
            staircase: new FormControl<Full_Model_Address["staircase"]>(undefined, { nonNullable: true, validators: [] }),
            // Emelet
            floor: new FormControl<Full_Model_Address["floor"]>(undefined, { nonNullable: true, validators: [] }),
            // Ajtó
            door: new FormControl<Full_Model_Address["door"]>(undefined, { nonNullable: true, validators: [] }),
            // Helyrajzi szám
            lotNumber: new FormControl<Full_Model_Address["lotNumber"]>(undefined, { nonNullable: true, validators: [] }),
        }),

        clinicXDC_BookingArea: new FormControl<Full_Model["clinicXDC_BookingArea"]>([], { nonNullable: true, validators: [] }),

        clinicOpenHours: new FormControl<Full_Model["clinicOpenHours"]>([], { nonNullable: true, validators: [Validators.required] }),

        clinicRooms: new FormControl<Full_Model["clinicRooms"]>([], { nonNullable: true, validators: [] }),

        // Szakmák és szolgáltatások + OTH kód
        clinicXSpecialtyXService: new FormControl<Full_Model["clinicXSpecialtyXService"]>([], { nonNullable: true, validators: [] }),

        // Ellátóhelyhez hozzárendelt OTH kód (9)
        clinicXSelf: new FormControl<Full_Model["clinicXSelf"]>([], { nonNullable: true, validators: [] }),

        // TODO Naptár + Időszak létrehozás
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

    public formValueToRequestValue(value: Full_Model): Full_Model {
        const { clinicXDC_BookingArea, clinicXSelf, ...restValue} = value;
        const result = {
            ...restValue,
            clinicId: restValue.clinicId ?? 0,
            addressId: restValue.address?.addressId,
            address: {
                ...restValue.address,
                dC_CityId: restValue?.address?.dC_City?.dC_CityId,
            },
            clinicXDC_BookingArea: (clinicXDC_BookingArea ?? []).map((_dcBookingArea) => {
                return {
                    dC_BookingAreaId: _dcBookingArea.dC_BookingAreaId,
                }
            }),
            clinicXSelf: (clinicXSelf ?? []).map((_clinicXSelf) => {
                return {
                    selfId: _clinicXSelf.self?.selfId ?? _clinicXSelf.selfId,
                    specialtyId: _clinicXSelf.specialty?.specialtyId ?? _clinicXSelf.specialtyId,
                    clinicOrganizationUniteCode: _clinicXSelf.clinicOrganizationUniteCode,
                }
            }),
        };

        return result;
    }

    public bookingAreasTableRows$ = of(this.initData.dC_BookingAreaList).pipe(
        map((list) => list.map(v => v.dto)),
        shareReplay(1),
    );

    public setFormValue(data: Full_Model | null | undefined): void {
        this.bookingAreasTableRows$.pipe(
            take(1),
            untilDestroyed(this),
        ).subscribe((rows) => {
            const _data = {
                ...data,
                clinicXDC_BookingArea: rows.filter((row) => {
                    return data?.clinicXDC_BookingArea?.some(v => v?.dC_BookingAreaId === row?.dC_BookingAreaId);
                }),
            }

            super.setFormValue(_data);
        });
    }
}
