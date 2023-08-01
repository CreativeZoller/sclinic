import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { map, shareReplay } from "rxjs";
import { CoreModelsDTOsMasterDataDCTablesDCCityDTO } from "../../../../../../../../api/models";
import { DictionaryProviderWebServiceService } from "../../../../../../../../api/services";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { CompanySite } from "../../../models/company-site.model";


type Full_Model = CompanySite;

@UntilDestroy()
@Component({
    selector: "app-company-site-form",
    templateUrl: "./company-site-form.component.html",
    styleUrls: ["./company-site-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanySiteFormComponent extends BaseFormComponent<Full_Model> {

    private dictionaryProviderWebServiceService = inject(DictionaryProviderWebServiceService);

    public errorResourceKeyPrefix = "company.site.form.errors";

    @Input() companyFullName: string = "";

    public form = new FormGroup({
        // Telephely neve
        companySiteId: new FormControl<Full_Model["companySiteId"]>(0, { nonNullable: true, validators: [] }),
        siteName: new FormControl<Full_Model["siteName"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Cím adatok
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
        // Telefonszám
        phoneNumber: new FormControl<Full_Model["phoneNumber"]>(undefined, { nonNullable: true, validators: [] }),
    });

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
