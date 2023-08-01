import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { City } from "../../models/city.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { CoreModelsDTOsMasterDataDCTablesDCCountyDTO } from "../../../../../../../api/models";
import { SelectOptionWithDto } from "../../../../../app-common/utility/models/select-option-with-dto.model";

type Full_Model = City;

@UntilDestroy()
@Component({
    selector: "app-city-form",
    templateUrl: "./city-form.component.html",
    styleUrls: ["./city-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityFormComponent extends BaseFormComponent<Full_Model> implements OnInit{
    public errorResourceKeyPrefix = "city.form.errors";

    filterCountyFn = (countyOption: SelectOptionWithDto<CoreModelsDTOsMasterDataDCTablesDCCountyDTO, NonNullable<CoreModelsDTOsMasterDataDCTablesDCCountyDTO["dC_CountyId"]>>) =>
        this.form.value.dC_CountryId == null || countyOption?.dto?.dC_CountryId === this.form.value.dC_CountryId;

     ngOnInit() {
         this.form.get('dC_CountyId')?.valueChanges.subscribe(value => {
             const selectedCountryId = this.initData.dC_CountyList
                 .find(item => item.value === value)?.dto.dC_CountryId;

             this.form.patchValue({ dC_CountryId: selectedCountryId || undefined });
         });
     }

    public form = new FormGroup({
        // TODO Db részen ez jelenleg null de üresen nincs értelme
        name: new FormControl<Full_Model["name"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        postCode: new FormControl<Full_Model["postCode"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        dC_CountyId: new FormControl<Full_Model["dC_CountyId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        dC_CountryId: new FormControl<any>(0, { nonNullable: true, validators: [] }),
    });
}
