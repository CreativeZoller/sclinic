import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { PatientXDC_Language } from "../../../models/patient-x-language.model";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { filter, map, Observable, shareReplay } from "rxjs";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";


type Full_Model = PatientXDC_Language;

@UntilDestroy()
@Component({
    selector: "app-patient-language-list-field",
    templateUrl: "./patient-language-list-field.component.html",
    styleUrls: ["./patient-language-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class PatientLanguageListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "patient.language";
    public tableIdProperty = "patientXDC_LanguageId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            id: 1,
            name: this.resourceService.resolve("patient.language.list.table.headers.dC_LanguageId"),
            attributeName: "dC_LanguageId",
            formatterFn: (value) => this.initData.dC_LanguageList.find(o => o.value === value)?.name,
        },
        {
            id: 2,
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
