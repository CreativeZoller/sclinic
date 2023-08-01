import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { combineLatest, distinctUntilChanged, map, Observable, of, shareReplay } from "rxjs";
import { CoreModelsDTOsMasterDataDCTablesDCCityDTO } from "../../../../../../../../api/models";
import { DictionaryProviderWebServiceService } from "../../../../../../../../api/services";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { SelectOption } from "../../../../../../core/utility/types/select-option";
import { PatientXAddress } from "../../../models/patient-x-address.model";


type Full_Model = PatientXAddress;

@UntilDestroy()
@Component({
    selector: "app-patient-address-form",
    templateUrl: "./patient-address-form.component.html",
    styleUrls: ["./patient-address-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientAddressFormComponent extends BaseFormComponent<Full_Model> implements OnInit {

    private dictionaryProviderWebServiceService = inject(DictionaryProviderWebServiceService);

    public errorResourceKeyPrefix = "patient.address.form.errors";

    @Input() public allSelectedPatientAddressTypeIds$: Observable<NonNullable<Full_Model["dC_PatientAddressTypeId"]>[]> = of([]);

    public patientAddressTypeOptions$: Observable<SelectOption<NonNullable<Full_Model["dC_PatientAddressTypeId"]>>[]> = of([]);

    public ngOnInit(): void {
        this.patientAddressTypeOptions$ = combineLatest([
            (this.allSelectedPatientAddressTypeIds$ ?? of([])),
            this.initialEditorData$,
        ]).pipe(
            map(([allSelectedPatientAddressTypeIds, initialEditorData]) => {
                return this.initData.dC_PatientAddressTypeList.filter((opt) => {
                    return !allSelectedPatientAddressTypeIds.includes(opt.value)
                        || initialEditorData?.dC_PatientAddressTypeId === opt.value
                })
            }),
            distinctUntilChanged(),
            shareReplay(1),
        )
    }

    public form = new FormGroup({
        // Külföldi?
        foreignAddress: new FormControl<Full_Model["foreignAddress"]>(false, { nonNullable: true, validators: [] }),
        // Cím típus
        dC_PatientAddressTypeId: new FormControl<Full_Model["dC_PatientAddressTypeId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
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
            // Helyrajzi szám
            lotNumber: new FormControl<NonNullable<Full_Model["address"]>["lotNumber"]>(undefined, { nonNullable: true, validators: [] }),
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


    public formValueToRequestValue(value: Full_Model): Full_Model {
        return {
            ...value,
            address: {
                ...value.address,
                dC_City: undefined,
                dC_CityId: value?.address?.dC_City?.dC_CityId,
            },
        };
    }
}
