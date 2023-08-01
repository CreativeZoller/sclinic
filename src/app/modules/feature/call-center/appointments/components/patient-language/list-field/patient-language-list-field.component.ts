import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { filter, map, Observable, shareReplay } from "rxjs";
import { TableHeader } from "src/app/components/table/table/table-header";
import { SkipSettingValueAccessorProviders } from "src/app/modules/app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BaseListFieldComponent } from "src/app/modules/app-common/utility/base-list-field/base-list-field.directive";
import { PatientXDC_Language } from "src/app/modules/feature/master-data/patients/models/patient-x-language.model";


type Full_Model = PatientXDC_Language;

@UntilDestroy()
@Component({
    selector: "app-cc-patient-language-list-field",
    templateUrl: "./patient-language-list-field.component.html",
    styleUrls: ["./patient-language-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class CcPatientLanguageListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "patient.language";
    public tableIdProperty = "patientXDC_LanguageId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("patient.language.list.table.headers.dC_LanguageId"),
            attributeName: "dC_LanguageId",
            formatterFn: (value) => this.initData.dC_LanguageList.find(o => o.value === value)?.name,
        },
        {
            name: this.resourceService.resolve("patient.language.list.table.headers.isDefault"),
            attributeName: "isDefault",
            formatterFn: (value) => `<div class="form-check form-check-custom form-check-solid form-check-sm">
                <input type="checkbox" ${value ? "checked" : ""} disabled class="form-check-input">
            </div>`,
        },
    ];

    public allSelectedLanguageIds$ = this.getValue$().pipe(
        map((value) => value?.map(v => v.dC_LanguageId!) ?? []),
        filter(v => v != null),
        shareReplay(1),
    )


    public canCreate$: Observable<boolean> = this.allSelectedLanguageIds$.pipe(
        map(selectedIds => {
          const sourceListIds = this.initData.dC_LanguageList.map(sourceListId => sourceListId.value);
          return !(
            selectedIds.length === sourceListIds.length &&
            selectedIds.every(id => sourceListIds.includes(id))
          );
        })
    );
}
